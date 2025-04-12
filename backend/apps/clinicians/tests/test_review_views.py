from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models.review import Review
from ..models.diagnostic_center import DiagnosticCenter
from ..models.clinician import Clinician
from rest_framework.test import APIClient

User = get_user_model()

class ReviewViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.clinician = Clinician.objects.create(name="Test Clinician", city="Test City")
        self.diagnostic_center = DiagnosticCenter.objects.create(name="Test Center", city="Test City")

        self.review = Review.objects.create(
            user=self.user,
            clinician=self.clinician,
            diagnostic_center=self.diagnostic_center,
            rating=5,
            comment="Great service!",
            is_verified=True
        )

    def test_list_reviews(self):
        response = self.client.get("/api/reviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_reviews_by_clinician(self):
        response = self.client.get(f"/api/reviews/?clinician_id={self.clinician.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filter_reviews_by_diagnostic_center(self):
        response = self.client.get(f"/api/reviews/?diagnostic_center_id={self.diagnostic_center.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_review(self):
        data = {
            "clinician": self.clinician.id,
            "diagnostic_center": self.diagnostic_center.id,
            "rating": 4,
            "comment": "Good service!",
            "is_verified": True
        }
        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 2)