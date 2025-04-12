from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

class RegisterViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_admin_user(self):
        data = {
            "fullName": "Admin User",
            "email": "admin@example.com",
            "password": "password123",
            "confirmPassword": "password123",
            "user_type": "Admin",
            "phone": "1234567890"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().email, "admin@example.com")

    def test_register_doctor_user(self):
        data = {
            "fullName": "Doctor User",
            "email": "doctor@example.com",
            "password": "password123",
            "confirmPassword": "password123",
            "user_type": "Doctor",
            "phone": "1234567890",
            "specialization": "Cardiology",
            "hospital": "City Hospital"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().email, "doctor@example.com")

    def test_register_patient_user(self):
        data = {
            "fullName": "Patient User",
            "email": "patient@example.com",
            "password": "password123",
            "confirmPassword": "password123",
            "user_type": "Patient",
            "phone": "1234567890",
            "blood_group": "O+",
            "height": 170,
            "weight": 70
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().email, "patient@example.com")

    def test_register_with_mismatched_passwords(self):
        data = {
            "fullName": "Test User",
            "email": "test@example.com",
            "password": "password123",
            "confirmPassword": "password456",
            "user_type": "Patient"
        }
        response = self.client.post("/api/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)