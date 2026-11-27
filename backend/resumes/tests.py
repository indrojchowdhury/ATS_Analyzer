from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from unittest.mock import patch

from .models import ResumeDocument


class ResumeUploadOwnershipTests(APITestCase):
    upload_url = "/api/resumes/upload/"

    @patch("resumes.views.extract_resume_text", return_value="Python developer")
    def test_authenticated_upload_is_owned_by_the_user(self, _extract_text):
        user = get_user_model().objects.create_user(
            username="upload-owner",
            password="test-password-123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            self.upload_url,
            {
                "file": SimpleUploadedFile(
                    "resume.pdf",
                    b"%PDF-1.4 test content",
                    content_type="application/pdf",
                )
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        resume = ResumeDocument.objects.get(pk=response.data["data"]["resume_id"])
        self.assertEqual(resume.user, user)

    @patch("resumes.views.extract_resume_text", return_value="Python developer")
    def test_guest_upload_remains_unowned(self, _extract_text):
        response = self.client.post(
            self.upload_url,
            {
                "file": SimpleUploadedFile(
                    "resume.pdf",
                    b"%PDF-1.4 test content",
                    content_type="application/pdf",
                )
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 201)
        resume = ResumeDocument.objects.get(pk=response.data["data"]["resume_id"])
        self.assertIsNone(resume.user)
