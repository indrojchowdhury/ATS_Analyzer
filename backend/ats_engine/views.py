
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from resumes.models import ResumeDocument
from jobs.models import JobDescription

from .models import AnalysisReport
from .serializers import (
    ResumeAnalysisSerializer,
    AnalysisReportDetailSerializer,
)
from .services import (
    AIAnalysisError,
    analyze_resume,
    analyze_resume_quality,
    analyze_resume_with_ai,
)


class ResumeAnalysisAPIView(generics.GenericAPIView):
    serializer_class = ResumeAnalysisSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume_id = serializer.validated_data["resume_id"]
        job_id = serializer.validated_data["job_description_id"]
        include_ai = serializer.validated_data["include_ai"]

        resume_query = ResumeDocument.objects.filter(id=resume_id)
        if request.user.is_authenticated:
            resume_query = resume_query.filter(user=request.user)
        else:
            resume_query = resume_query.filter(user__isnull=True)

        try:
            resume = resume_query.get()
        except ResumeDocument.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Resume not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            job_description = JobDescription.objects.get(id=job_id)
        except JobDescription.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Job description not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        compatibility = analyze_resume(
            resume.extracted_text,
            job_description,
        )

        quality = analyze_resume_quality(
            resume.extracted_text
        )

        if compatibility["total_keywords"] == 0:
            return Response(
                {
                    "success": False,
                    "message": (
                        "No relevant keywords found in the job description."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        ai_analysis = {}
        if include_ai:
            try:
                ai_analysis = analyze_resume_with_ai(
                    resume.extracted_text,
                    " ".join(
                        filter(
                            None,
                            [
                                job_description.job_title,
                                job_description.description,
                            ],
                        )
                    ),
                )
            except AIAnalysisError as exc:
                return Response(
                    {
                        "success": False,
                        "message": exc.message,
                    },
                    status=exc.status_code,
                )

        report = AnalysisReport.objects.create(
            user=request.user if request.user.is_authenticated else None,
            resume=resume,
            job_description=job_description,
            compatibility_score=compatibility["compatibility_score"],
            resume_quality_score=quality["resume_quality_score"],
            matched_keywords=compatibility["matched_keywords"],
            missing_keywords=compatibility["missing_keywords"],
            section_analysis=quality["section_analysis"],
            ai_analysis=ai_analysis,
            total_keywords=compatibility["total_keywords"],
        )

        return Response(
            {
                "success": True,
                "message": "Resume analysis completed successfully.",
                "data": {
                    "report_id": report.id,
                    "resume_id": resume.id,
                    "job_description_id": job_description.id,
                    "job_compatibility": compatibility,
                    "resume_quality": quality,
                    "ai_analysis": ai_analysis,
                    "created_at": report.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class AnalysisReportDetailAPIView(generics.RetrieveAPIView):
    queryset = AnalysisReport.objects.select_related(
        "resume",
        "job_description",
    ).all()

    serializer_class = AnalysisReportDetailSerializer
    lookup_url_kwarg = "report_id"

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        return queryset.filter(user__isnull=True)

    def retrieve(self, request, *args, **kwargs):
        report = self.get_object()
        serializer = self.get_serializer(report)

        return Response(
            {
                "success": True,
                "message": "Analysis report retrieved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class DashboardAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AnalysisReportDetailSerializer

    def get(self, request):
        resumes = list(
            ResumeDocument.objects.filter(user=request.user)
            .order_by("-uploaded_at")
        )
        reports = list(
            AnalysisReport.objects.filter(user=request.user)
            .select_related("resume", "job_description")
            .order_by("-created_at")
        )
        report_data = self.get_serializer(reports, many=True).data
        resume_data = [
            {
                "id": resume.id,
                "filename": resume.original_filename,
                "uploaded_at": resume.uploaded_at,
            }
            for resume in resumes
        ]
        return Response(
            {
                "success": True,
                "data": {
                    "summary": {
                        "resume_count": len(resumes),
                        "report_count": len(reports),
                        "average_compatibility_score": self._average(
                            report.compatibility_score for report in reports
                        ),
                        "average_resume_quality_score": self._average(
                            report.resume_quality_score for report in reports
                        ),
                    },
                    "resumes": resume_data,
                    "reports": report_data,
                },
            },
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def _average(scores):
        scores = list(scores)
        return round(sum(scores) / len(scores)) if scores else 0
