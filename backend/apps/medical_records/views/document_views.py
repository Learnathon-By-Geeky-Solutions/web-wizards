from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Document, LabResult, CBCTestResult, URETestResult
from ..serializers import (
    DocumentSerializer, 
    CBCTestResultSerializer,
    URETestResultSerializer
)
from ..utils.ocr_processing import process_medical_document, create_test_result
import logging

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
    def process_ocr(self, request):
        """
        Process a document with OCR to extract text and structured data.
        """
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file_obj = request.FILES['file']
        filename = file_obj.name
        
        try:
            # Process document with OCR
            ocr_result = process_medical_document(file_obj, filename)
            
            # Map OCR data to medical record structure
            medical_record_data = map_ocr_data_to_medical_record(ocr_result)
            
            return Response({
                'success': True,
                'ocr_result': ocr_result,
                'medical_record_data': medical_record_data
            })
            
        except Exception as e:
            logger.error(f"Error processing document with OCR: {str(e)}")
            return Response(
                {'error': f"Failed to process document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
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
            # Process document with OCR
            ocr_result = process_medical_document(file_obj, file_obj.name)
            
            # Create document instance
            document = Document(
                user=request.user,
                title=title,
                description=description,
                document_type=document_type,
                health_issue_id=health_issue_id,
                document_date=document_date,
                file=file_obj
            )
            
            # Add OCR extracted data as metadata
            if not document.metadata:
                document.metadata = {}
            
            document.metadata['ocr_data'] = ocr_result.get('structured_data', {})
            document.metadata['extracted_text'] = ocr_result.get('raw_text', '')
            
            # Save document
            document.save()
            
            # Return serialized document
            serializer = self.get_serializer(document)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error uploading and processing document: {str(e)}")
            return Response(
                {'error': f"Failed to upload and process document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def process_test_result(self, request):
        """
        Process a medical test result document with OCR and extract test data.
        """
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file_obj = request.FILES['file']
        health_issue_id = request.data.get('health_issue')
        
        try:
            # Process document with OCR and extract test data
            ocr_result = process_medical_document(file_obj, file_obj.name)
            
            if not ocr_result.get('test_data'):
                return Response({
                    'error': 'No test results found in document'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create test result record
            lab_result = create_test_result(
                user=request.user,
                ocr_result=ocr_result,
                health_issue_id=health_issue_id
            )
            
            # Return appropriate serializer based on test type
            if ocr_result['test_type'] == 'CBC':
                serializer = CBCTestResultSerializer(lab_result.cbc_details)
            elif ocr_result['test_type'] == 'URE':
                serializer = URETestResultSerializer(lab_result.ure_details)
            else:
                return Response({
                    'error': 'Unsupported test type'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'success': True,
                'test_type': ocr_result['test_type'],
                'test_data': serializer.data,
                'raw_text': ocr_result.get('raw_text', '')
            })
            
        except Exception as e:
            logger.error(f"Error processing test result document: {str(e)}")
            return Response(
                {'error': f"Failed to process document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def test_results(self, request):
        """
        Get all test results for the current user.
        """
        test_type = request.query_params.get('type')
        health_issue_id = request.query_params.get('health_issue')
        
        # Get base lab results query
        lab_results = LabResult.objects.filter(user=request.user)
        
        # Apply filters
        if health_issue_id:
            lab_results = lab_results.filter(health_issue_id=health_issue_id)
        
        if test_type:
            lab_results = lab_results.filter(test_name=test_type)
        
        # Get specific test results
        results = []
        for lab_result in lab_results:
            if hasattr(lab_result, 'cbc_details'):
                serializer = CBCTestResultSerializer(lab_result.cbc_details)
                results.append({
                    'type': 'CBC',
                    'date': lab_result.test_date,
                    'data': serializer.data
                })
            elif hasattr(lab_result, 'ure_details'):
                serializer = URETestResultSerializer(lab_result.ure_details)
                results.append({
                    'type': 'URE',
                    'date': lab_result.test_date,
                    'data': serializer.data
                })
        
        return Response(results)

    @action(detail=False, methods=['get'])
    def test_history(self, request):
        """
        Get historical data for a specific test parameter.
        """
        test_type = request.query_params.get('type')
        parameter = request.query_params.get('parameter')
        
        if not test_type or not parameter:
            return Response({
                'error': 'Test type and parameter are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get lab results of specified type
        lab_results = LabResult.objects.filter(
            user=request.user,
            test_name=test_type
        ).order_by('test_date')
        
        # Extract parameter values over time
        history = []
        for lab_result in lab_results:
            if test_type == 'CBC' and hasattr(lab_result, 'cbc_details'):
                value = getattr(lab_result.cbc_details, parameter, None)
                if value is not None:
                    history.append({
                        'date': lab_result.test_date,
                        'value': value
                    })
            elif test_type == 'URE' and hasattr(lab_result, 'ure_details'):
                value = getattr(lab_result.ure_details, parameter, None)
                if value is not None:
                    history.append({
                        'date': lab_result.test_date,
                        'value': value
                    })
        
        return Response(history)