
from django.db import models
from django.conf import settings


class ResumeDocument(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
        null=True,
        blank=True,
    )
    file = models.FileField(upload_to="resumes/")
    original_filename = models.CharField(max_length=255)
    extracted_text = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.original_filename
