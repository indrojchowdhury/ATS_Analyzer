
from rest_framework import generics, status
from rest_framework.response import Response

from .models import JobDescription
from .serializers import JobDescriptionSerializer


class JobDescriptionCreateAPIView(generics.GenericAPIView):
    serializer_class = JobDescriptionSerializer

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

        job_description = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Job description saved successfully.",
                "data": JobDescriptionSerializer(
                    job_description
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )
