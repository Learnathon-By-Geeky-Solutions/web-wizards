from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import HealthIssue
from rest_framework.test import APIClient

User = get_user_model()

class HealthIssueViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.health_issue = HealthIssue.objects.create(
            user=self.user,
            title="Flu",
            description="Seasonal flu",
            start_date="2025-03-30",
            start_time="09:00:00",
            status="active"
        )

    def test_list_health_issues(self):
        response = self.client.get("/api/health-issues/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_health_issue(self):
        data = {
            "title": "Cold",
            "description": "Common cold",
            "start_date": "2025-04-01",
            "start_time": "10:00:00",
            "status": "active"
        }
        response = self.client.post("/api/health-issues/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(HealthIssue.objects.count(), 2)

    def test_filter_active_health_issues(self):
        response = self.client.get("/api/health-issues/active/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_filter_resolved_health_issues(self):
        self.health_issue.status = "resolved"
        self.health_issue.save()
        response = self.client.get("/api/health-issues/resolved/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)