
from io import BytesIO

import fitz
from docx import Document


def extract_text_from_pdf(file_bytes):
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as pdf:
            extracted_text = []

            for page in pdf:
                extracted_text.append(page.get_text())

            return "\n".join(extracted_text).strip()

    except Exception as exc:
        raise ValueError("Unable to read this PDF file.") from exc


def extract_text_from_docx(file_bytes):
    try:
        document = Document(BytesIO(file_bytes))

        paragraphs = [
            paragraph.text.strip()
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        table_text = []

        for table in document.tables:
            for row in table.rows:
                cells = [
                    cell.text.strip()
                    for cell in row.cells
                    if cell.text.strip()
                ]

                if cells:
                    table_text.append(" | ".join(cells))

        return "\n".join(paragraphs + table_text).strip()

    except Exception as exc:
        raise ValueError("Unable to read this DOCX file.") from exc


def extract_resume_text(file_bytes, filename):
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "pdf":
        return extract_text_from_pdf(file_bytes)

    if extension == "docx":
        return extract_text_from_docx(file_bytes)

    raise ValueError("Only PDF and DOCX files are supported.")
