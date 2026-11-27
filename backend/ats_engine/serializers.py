
from rest_framework import serializers

from .models import AnalysisReport


class ResumeAnalysisSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(min_value=1)
    job_description_id = serializers.IntegerField(min_value=1)
    include_ai = serializers.BooleanField(default=False)


class AnalysisReportDetailSerializer(serializers.ModelSerializer):
    resume_filename = serializers.CharField(
        source="resume.original_filename",
        read_only=True,
    )

    job_title = serializers.CharField(
        source="job_description.job_title",
        read_only=True,
    )

    resume_id = serializers.IntegerField(read_only=True)

    job_compatibility = serializers.SerializerMethodField()

    resume_quality = serializers.SerializerMethodField()

    ai_analysis = serializers.SerializerMethodField()

    class Meta:
        model = AnalysisReport
        fields = [
            "id",
            "resume_id",
            "resume_filename",
            "job_title",
            "job_compatibility",
            "resume_quality",
            "ai_analysis",
            "created_at",
        ]

    def get_job_compatibility(self, obj):
        matched = obj.matched_keywords or []
        missing = obj.missing_keywords or []

        return {
            "compatibility_score": obj.compatibility_score,
            "matched_keywords": matched,
            "missing_keywords": missing,
            "total_keywords": obj.total_keywords,
            "matched_count": len(matched),
            "missing_count": len(missing),
        }

    def get_resume_quality(self, obj):
        section_analysis = obj.section_analysis or {}

        return {
            "resume_quality_score": obj.resume_quality_score,
            "sections_found": sum(
                1 for found in section_analysis.values() if found
            ),
            "total_sections": len(section_analysis),
            "section_analysis": section_analysis,
        }

    def get_ai_analysis(self, obj):
        return obj.ai_analysis or {}
