
from django.db import models


class JobDescription(models.Model):
    job_title = models.CharField(
        max_length=255,
        blank=True
    )

    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title or f"Job Description #{self.id}"
