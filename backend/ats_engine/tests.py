import json
from io import BytesIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITestCase

from jobs.models import JobDescription
from resumes.models import ResumeDocument

from .models import AnalysisReport
from .services import AIAnalysisError, analyze_resume_with_ai


AI_ANALYSIS = {
    "semantic_match_score": 82,
    "semantic_match_summary": "The resume shows relevant backend experience.",
    "strengths": ["Python backend experience"],
    "recommendations": ["Add measurable outcomes to project bullets."],
    "rewrite_suggestions": [
        {
            "section": "experience",
            "original": "Built APIs",
            "suggested": "Built REST APIs for internal services.",
            "rationale": "Clarifies the type of work without adding metrics.",
        }
    ],
}


class AIAnalysisServiceTests(APITestCase):
    def test_gemini_json_response_is_parsed_and_validated(self):
        provider_response = {
            "candidates": [
                {"content": {"parts": [{"text": json.dumps(AI_ANALYSIS)}]}}
            ]
        }

        with (
            override_settings(GEMINI_API_KEY="test-gemini-key"),
            patch(
                "ats_engine.services.urlopen",
                return_value=BytesIO(json.dumps(provider_response).encode()),
            ) as mocked_urlopen,
        ):
            result = analyze_resume_with_ai(
                "Python and Django experience",
                "Looking for Python and Django",
            )

        self.assertEqual(result, AI_ANALYSIS)
        request = mocked_urlopen.call_args.args[0]
        self.assertEqual(request.get_header("X-goog-api-key"), "test-gemini-key")
        self.assertIn("generateContent", request.full_url)

    def test_ai_analysis_requires_a_configured_api_key(self):
        with override_settings(GEMINI_API_KEY=""):
            with self.assertRaisesRegex(AIAnalysisError, "GEMINI_API_KEY"):
                analyze_resume_with_ai("resume", "job")


class ResumeAnalysisAPITests(APITestCase):
    analyze_url = "/api/ats/analyze/"

    def setUp(self):
        self.resume = ResumeDocument.objects.create(
            file="resumes/test.pdf",
            original_filename="test.pdf",
            extracted_text=(
                "Python Django PostgreSQL REST APIs work experience skills education"
            ),
        )
        self.job_description = JobDescription.objects.create(
            job_title="Python Developer",
            description=(
                "Python Django PostgreSQL REST APIs backend development experience"
            ),
        )

    def test_ai_insights_are_saved_and_returned_in_report(self):
        with patch(
            "ats_engine.views.analyze_resume_with_ai",
            return_value=AI_ANALYSIS,
        ) as mocked_ai:
            response = self.client.post(
                self.analyze_url,
                {
                    "resume_id": self.resume.id,
                    "job_description_id": self.job_description.id,
                    "include_ai": True,
                },
                format="json",
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["ai_analysis"], AI_ANALYSIS)
        mocked_ai.assert_called_once()

        report_id = response.data["data"]["report_id"]
        report = AnalysisReport.objects.get(pk=report_id)
        self.assertEqual(report.ai_analysis, AI_ANALYSIS)

        detail = self.client.get(f"/api/ats/reports/{report_id}/")
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(detail.data["data"]["ai_analysis"], AI_ANALYSIS)

    def test_keyword_only_analysis_does_not_call_gemini(self):
        with patch("ats_engine.views.analyze_resume_with_ai") as mocked_ai:
            response = self.client.post(
                self.analyze_url,
                {
                    "resume_id": self.resume.id,
                    "job_description_id": self.job_description.id,
                },
                format="json",
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["ai_analysis"], {})
        mocked_ai.assert_not_called()
        self.assertEqual(
            AnalysisReport.objects.get(pk=response.data["data"]["report_id"]).ai_analysis,
            {},
        )

    def test_missing_gemini_configuration_returns_clear_error(self):
        with override_settings(GEMINI_API_KEY=""):
            response = self.client.post(
                self.analyze_url,
                {
                    "resume_id": self.resume.id,
                    "job_description_id": self.job_description.id,
                    "include_ai": True,
                },
                format="json",
            )

        self.assertEqual(response.status_code, 503)
        self.assertIn("GEMINI_API_KEY", response.data["message"])
        self.assertEqual(AnalysisReport.objects.count(), 0)


class DashboardAPITests(APITestCase):
    dashboard_url = "/api/ats/dashboard/"

    def setUp(self):
        user_model = get_user_model()
        self.owner = user_model.objects.create_user(
            username="resume-owner",
            password="test-password-123",
        )
        self.other_user = user_model.objects.create_user(
            username="another-owner",
            password="test-password-123",
        )
        self.resume = ResumeDocument.objects.create(
            user=self.owner,
            file="resumes/owned.pdf",
            original_filename="owned.pdf",
            extracted_text="Python experience",
        )
        self.other_resume = ResumeDocument.objects.create(
            user=self.other_user,
            file="resumes/private.pdf",
            original_filename="private.pdf",
            extracted_text="Private resume",
        )
        self.job_description = JobDescription.objects.create(
            job_title="Python Developer",
            description="Python developer with relevant experience",
        )
        self.report = self.create_report(self.owner, self.resume)
        self.other_report = self.create_report(
            self.other_user,
            self.other_resume,
        )

    def create_report(self, user, resume):
        return AnalysisReport.objects.create(
            user=user,
            resume=resume,
            job_description=self.job_description,
            compatibility_score=75,
            resume_quality_score=80,
            matched_keywords=["Python"],
            missing_keywords=[],
            section_analysis={"skills": True},
            total_keywords=1,
        )

    def test_dashboard_requires_authentication(self):
        response = self.client.get(self.dashboard_url)

        self.assertIn(response.status_code, (401, 403))

    def test_dashboard_only_returns_signed_in_users_reports(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.dashboard_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["summary"]["resume_count"], 1)
        self.assertEqual(response.data["data"]["summary"]["report_count"], 1)
        self.assertEqual(
            [report["id"] for report in response.data["data"]["reports"]],
            [self.report.id],
        )
        self.assertEqual(
            response.data["data"]["reports"][0]["resume_id"],
            self.resume.id,
        )

    def test_dashboard_includes_owned_resumes_without_analysis(self):
        unanalyzed_resume = ResumeDocument.objects.create(
            user=self.owner,
            file="resumes/not-analyzed.pdf",
            original_filename="not-analyzed.pdf",
            extracted_text="Resume awaiting analysis",
        )
        self.client.force_authenticate(user=self.owner)

        response = self.client.get(self.dashboard_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["summary"]["resume_count"], 2)
        self.assertIn(
            unanalyzed_resume.id,
            [resume["id"] for resume in response.data["data"]["resumes"]],
        )

    def test_report_detail_is_only_visible_to_its_owner_or_guest_owner(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.get(
            f"/api/ats/reports/{self.report.id}/"
        )

        self.assertEqual(response.status_code, 404)

        self.client.force_authenticate(user=self.owner)
        response = self.client.get(
            f"/api/ats/reports/{self.report.id}/"
        )
        self.assertEqual(response.status_code, 200)

    def test_authenticated_user_cannot_analyze_another_users_resume(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            "/api/ats/analyze/",
            {
                "resume_id": self.other_resume.id,
                "job_description_id": self.job_description.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 404)
