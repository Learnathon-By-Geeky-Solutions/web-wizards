from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Document, LabResult
from ..serializers import DocumentSerializer
from ..serializers.test_serializers import TestResultSerializer
from ..services.ocr_service_client import OCRServiceClient
import logging
import cloudinary
import cloudinary.uploader
import os
from django.conf import settings

logger = logging.getLogger(__name__)

class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing medical documents.
    """
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['health_issue', 'document_type']
    search_fields = ['title', 'description']
    ordering_fields = ['document_date', 'title', 'document_type']
    ordering = ['-document_date']
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        """
        This view should return a list of all documents
        for the currently authenticated user.
        """
        user = self.request.user
        return Document.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Set the user as the current user when creating a document.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_health_issue(self, request):
        """
        Return documents for a specific health issue.
        """
        health_issue_id = request.query_params.get('health_issue_id', None)
        if health_issue_id:
            documents = self.get_queryset().filter(health_issue_id=health_issue_id)
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """
        Return documents of a specific type.
        """
        document_type = request.query_params.get('type', None)
        if document_type:
            documents = self.get_queryset().filter(document_type=document_type)
            serializer = self.get_serializer(documents, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['post'])
    def upload_and_process(self, request):
        """
        Upload a document, process it with OCR, and save it as a Document.
        """
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get form data
        file_obj = request.FILES['file']
        title = request.data.get('title', file_obj.name)
        description = request.data.get('description', '')
        document_type = request.data.get('document_type', 'OTHER')
        health_issue_id = request.data.get('health_issue', None)
        document_date = request.data.get('document_date', None)
        
        try:
            # Create document instance without file first
            document = Document(
                user=request.user,
                title=title,
                description=description,
                document_type=document_type,
                health_issue_id=health_issue_id,
                document_date=document_date
            )
            document.save()
            
            # Get Cloudinary credentials directly from settings
            cloud_name = settings.CLOUDINARY_STORAGE['CLOUD_NAME']
            api_key = settings.CLOUDINARY_STORAGE['API_KEY']
            api_secret = settings.CLOUDINARY_STORAGE['API_SECRET']
            
            # Configure Cloudinary with these credentials before upload
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            
            # Upload to Cloudinary with document-specific public_id
            public_id = f"document_{document.id}"
            upload_result = cloudinary.uploader.upload(
                file_obj,
                folder="medical_documents", 
                public_id=public_id,
                overwrite=True,
                resource_type="auto"  # Explicitly set resource_type to auto for handling different file types
            )
            
            # Update the document with the new file URL
            document.file = upload_result['secure_url']
            document.save()
            
            # For lab reports, process with OCR service
            if document_type == 'LAB_REPORT':
                print("Processing Lab report to extract the test result")
                # Process the document with OCR service
                ocr_response = OCRServiceClient.process_document(document)
                
                if ocr_response:
                    # Create test results from OCR response
                    lab_result = None
                    try:
                        lab_result = OCRServiceClient.create_test_result_from_ocr(
                            document=document,
                            ocr_response=ocr_response,
                            user=request.user,
                            health_issue=document.health_issue
                        )
                    except Exception as lab_error:
                        logger.error(f"Error creating lab result: {str(lab_error)}")
                    
                    # Return serialized document with test results
                    document_data = self.get_serializer(document).data
                    
                    if lab_result:
                        try:
                            # Get all test results for this lab result
                            test_results = lab_result.test_results.all().select_related('test_type')
                            test_results_data = []
                            
                            for test_result in test_results:
                                serializer = TestResultSerializer(test_result)
                                test_results_data.append(serializer.data)
                            
                            document_data['test_results'] = test_results_data
                            document_data['ocr_success'] = True
                        except Exception as test_error:
                            logger.error(f"Error processing test results: {str(test_error)}")
                            document_data['ocr_success'] = False
                            document_data['error'] = f"Error processing test results: {str(test_error)}"
                    else:
                        document_data['ocr_success'] = False
                        document_data['error'] = "Failed to extract test results from document"
                        
                    return Response(document_data, status=status.HTTP_201_CREATED)
            
            # Return serialized document
            serializer = self.get_serializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error uploading and processing document: {str(e)}")
            return Response(
                {'error': f"Failed to upload and process document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def reprocess_with_ocr(self, request, pk=None):
        """
        Reprocess an existing document with OCR
        """
        document = self.get_object()
        
        if not document.file:
            return Response({'error': 'No file attached to document'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Process the document with OCR service
            ocr_response = OCRServiceClient.process_document(document)
            
            if not ocr_response:
                return Response({'error': 'OCR processing failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Create test results from OCR response - no metadata updates since field doesn't exist
            lab_result = None
            try:
                lab_result = OCRServiceClient.create_test_result_from_ocr(
                    document=document,
                    ocr_response=ocr_response,
                    user=request.user,
                    health_issue=document.health_issue
                )
            except Exception as lab_error:
                logger.error(f"Error creating lab result: {str(lab_error)}")
            
            # Return serialized document with test results
            document_data = self.get_serializer(document).data
            
            if lab_result:
                try:
                    # Get all test results for this lab result
                    test_results = lab_result.test_results.all().select_related('test_type')
                    test_results_data = []
                    
                    for test_result in test_results:
                        serializer = TestResultSerializer(test_result)
                        test_results_data.append(serializer.data)
                    
                    document_data['test_results'] = test_results_data
                    document_data['ocr_success'] = True
                except Exception as test_error:
                    logger.error(f"Error processing test results: {str(test_error)}")
                    document_data['ocr_success'] = False
                    document_data['error'] = f"Error processing test results: {str(test_error)}"
            else:
                document_data['ocr_success'] = False
                document_data['error'] = "Failed to extract test results from document"
                
            return Response(document_data)
            
        except Exception as e:
            logger.error(f"Error reprocessing document with OCR: {str(e)}")
            return Response(
                {'error': f"Failed to reprocess document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )