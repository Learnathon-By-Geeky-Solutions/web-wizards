from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Symptom
from rest_framework.test import APIClient

User = get_user_model()

class SymptomViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.symptom = Symptom.objects.create(
            user=self.user,
            name="Headache",
            description="Severe headache",
            severity="High",
            recorded_date="2025-04-01",
            recorded_time="10:00:00"
        )

    def test_list_symptoms(self):
        response = self.client.get("/api/symptoms/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_symptom(self):
        data = {
            "name": "Fever",
            "description": "High fever",
            "severity": "Medium",
            "recorded_date": "2025-04-01",
            "recorded_time": "12:00:00"
        }
        response = self.client.post("/api/symptoms/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Symptom.objects.count(), 2)

    def test_filter_symptoms_by_severity(self):
        response = self.client.get("/api/symptoms/?severity=High")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)