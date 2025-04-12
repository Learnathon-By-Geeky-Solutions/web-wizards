from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import LogbookEntry
from rest_framework.test import APIClient

User = get_user_model()

class LogbookEntryViewSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = APIClient()
        self.client.login(username="testuser", password="password")

        self.logbook_entry = LogbookEntry.objects.create(
            user=self.user,
            title="Daily Log",
            notes="Feeling good today",
            entry_date="2025-04-01",
            entry_time="10:00:00"
        )

    def test_list_logbook_entries(self):
        response = self.client.get("/api/logbook-entries/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_logbook_entry(self):
        data = {
            "title": "Evening Log",
            "notes": "Had a great evening walk",
            "entry_date": "2025-04-01",
            "entry_time": "18:00:00"
        }
        response = self.client.post("/api/logbook-entries/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LogbookEntry.objects.count(), 2)

    def test_filter_logbook_entries_by_date(self):
        response = self.client.get("/api/logbook-entries/?entry_date=2025-04-01")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)