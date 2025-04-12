from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import LabResult
from rest_framework.test import APIClient

User = get_user_model()

class LabResultViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.lab_result = LabResult.objects.create(
            user=self.user,
            test_name="Blood Test",
            test_date="2025-04-01",
            result="Normal",
            lab_name="City Lab",
            notes="Routine checkup"
        )

    def test_list_lab_results(self):
        response = self.client.get("/api/lab-results/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_lab_result(self):
        data = {
            "test_name": "Urine Test",
            "test_date": "2025-04-02",
            "result": "Normal",
            "lab_name": "City Lab",
            "notes": "Routine checkup"
        }
        response = self.client.post("/api/lab-results/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LabResult.objects.count(), 2)

    def test_filter_lab_results_by_lab_name(self):
        response = self.client.get("/api/lab-results/?lab_name=City Lab")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)