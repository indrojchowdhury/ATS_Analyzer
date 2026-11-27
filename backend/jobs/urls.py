
from django.urls import path

from .views import JobDescriptionCreateAPIView


urlpatterns = [
    path(
        "create/",
        JobDescriptionCreateAPIView.as_view(),
        name="job-description-create",
    ),
]
