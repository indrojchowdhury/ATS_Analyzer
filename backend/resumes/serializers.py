
from rest_framework import serializers


class ResumeUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, uploaded_file):
        allowed_extensions = [".pdf", ".docx"]
        filename = uploaded_file.name.lower()

        if not any(filename.endswith(ext) for ext in allowed_extensions):
            raise serializers.ValidationError(
                "Only PDF and DOCX files are supported."
            )

        max_size = 5 * 1024 * 1024

        if uploaded_file.size > max_size:
            raise serializers.ValidationError(
                "File size cannot exceed 5 MB."
            )

        if uploaded_file.size == 0:
            raise serializers.ValidationError(
                "Uploaded file is empty."
            )

        return uploaded_file
