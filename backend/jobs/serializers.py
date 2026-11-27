
from rest_framework import serializers

from .models import JobDescription


class JobDescriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobDescription
        fields = [
            "id",
            "job_title",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_description(self, value):
        value = value.strip()

        if len(value) < 30:
            raise serializers.ValidationError(
                "Job description must contain at least 30 characters."
            )

        return value
