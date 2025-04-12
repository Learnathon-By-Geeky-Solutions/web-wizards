from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models.admin_profile import AdminProfile
from ..models.doctor_profile import DoctorProfile
from ..models.patient_profile import PatientProfile
from rest_framework.test import APIClient

User = get_user_model()

class UserProfileViewTestCase(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(username="adminuser", password="password", user_type="Admin")
        self.doctor_user = User.objects.create_user(username="doctoruser", password="password", user_type="Doctor")
        self.patient_user = User.objects.create_user(username="patientuser", password="password", user_type="Patient")

        self.admin_profile = AdminProfile.objects.create(user=self.admin_user, phone="1234567890")
        self.doctor_profile = DoctorProfile.objects.create(user=self.doctor_user, phone="1234567890", specialization="Cardiology")
        self.patient_profile = PatientProfile.objects.create(user=self.patient_user, phone="1234567890", blood_group="O+")

        self.client = APIClient()

    def test_retrieve_admin_profile(self):
        self.client.login(username="adminuser", password="password")
        response = self.client.get("/api/user-profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone"], "1234567890")

    def test_retrieve_doctor_profile(self):
        self.client.login(username="doctoruser", password="password")
        response = self.client.get("/api/user-profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["specialization"], "Cardiology")

    def test_retrieve_patient_profile(self):
        self.client.login(username="patientuser", password="password")
        response = self.client.get("/api/user-profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["blood_group"], "O+")