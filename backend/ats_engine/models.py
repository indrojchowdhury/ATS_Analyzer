
from django.db import models
from django.conf import settings

from resumes.models import ResumeDocument
from jobs.models import JobDescription


class AnalysisReport(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="analysis_reports",
        null=True,
        blank=True,
    )
    resume = models.ForeignKey(
        ResumeDocument,
        on_delete=models.CASCADE,
        related_name="analysis_reports",
    )

    job_description = models.ForeignKey(
        JobDescription,
        on_delete=models.CASCADE,
        related_name="analysis_reports",
    )

    compatibility_score = models.PositiveSmallIntegerField()

    resume_quality_score = models.PositiveSmallIntegerField(default=0)

    matched_keywords = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)

    section_analysis = models.JSONField(default=dict)

    ai_analysis = models.JSONField(default=dict, blank=True)

    total_keywords = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"Analysis Report #{self.id} "
            f"- Compatibility: {self.compatibility_score}%"
        )
