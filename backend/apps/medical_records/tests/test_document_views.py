from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Document
from rest_framework.test import APIClient

User = get_user_model()

class DocumentViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.document = Document.objects.create(
            user=self.user,
            title="Medical Report",
            document_type="Report",
            document_date="2025-04-01",
            description="Annual health checkup report"
        )

    def test_list_documents(self):
        response = self.client.get("/api/documents/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_document(self):
        data = {
            "title": "Prescription",
            "document_type": "Prescription",
            "document_date": "2025-04-02",
            "description": "Doctor's prescription for flu"
        }
        response = self.client.post("/api/documents/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 2)

    def test_filter_documents_by_type(self):
        response = self.client.get("/api/documents/?document_type=Report")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)