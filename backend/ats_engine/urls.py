
from django.urls import path

from .views import (
    ResumeAnalysisAPIView,
    AnalysisReportDetailAPIView,
    DashboardAPIView,
)


urlpatterns = [
    path(
        "dashboard/",
        DashboardAPIView.as_view(),
        name="analysis-dashboard",
    ),
    path(
        "analyze/",
        ResumeAnalysisAPIView.as_view(),
        name="resume-analysis",
    ),

    path(
        "reports/<int:report_id>/",
        AnalysisReportDetailAPIView.as_view(),
        name="report-detail",
    ),
]
