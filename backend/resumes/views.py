
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import ResumeDocument
from .serializers import ResumeUploadSerializer
from .services import extract_resume_text


class ResumeUploadAPIView(generics.GenericAPIView):
    serializer_class = ResumeUploadSerializer
    parser_classes = [MultiPartParser, FormParser]

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

        uploaded_file = serializer.validated_data["file"]

        try:
            file_bytes = uploaded_file.read()

            extracted_text = extract_resume_text(
                file_bytes,
                uploaded_file.name,
            )

            if not extracted_text:
                return Response(
                    {
                        "success": False,
                        "message": (
                            "No readable text found in this resume. "
                            "Scanned PDFs may require OCR."
                        ),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            uploaded_file.seek(0)

            resume = ResumeDocument.objects.create(
                user=request.user if request.user.is_authenticated else None,
                file=uploaded_file,
                original_filename=uploaded_file.name,
                extracted_text=extracted_text,
            )

            return Response(
                {
                    "success": True,
                    "message": "Resume uploaded and parsed successfully.",
                    "data": {
                        "resume_id": resume.id,
                        "filename": resume.original_filename,
                        "file_type": uploaded_file.name.rsplit(".", 1)[-1].lower(),
                        "character_count": len(extracted_text),
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except ValueError as exc:
            return Response(
                {
                    "success": False,
                    "message": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
