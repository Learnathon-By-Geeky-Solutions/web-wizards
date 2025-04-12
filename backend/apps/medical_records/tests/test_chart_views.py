from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Chart
from rest_framework.test import APIClient

User = get_user_model()

class ChartViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.chart = Chart.objects.create(
            user=self.user,
            chart_type="Blood Pressure",
            title="Morning Reading",
            measurement_date="2025-04-01",
            measurement_time="08:00:00",
            value=120,
            unit="mmHg",
            notes="Normal reading"
        )

    def test_list_charts(self):
        response = self.client.get("/api/charts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_chart(self):
        data = {
            "chart_type": "Heart Rate",
            "title": "Evening Reading",
            "measurement_date": "2025-04-01",
            "measurement_time": "18:00:00",
            "value": 75,
            "unit": "bpm",
            "notes": "Normal reading"
        }
        response = self.client.post("/api/charts/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chart.objects.count(), 2)

    def test_filter_charts_by_type(self):
        response = self.client.get("/api/charts/?chart_type=Blood Pressure")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)