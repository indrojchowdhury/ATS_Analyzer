
# 🤖 AI ATS Analyzer

An AI-powered ATS Resume Analyzer built with Django and React. Upload your resume, provide a job description, and analyze how well your resume matches the job requirements. Get an ATS compatibility score, keyword analysis, AI-powered insights, and actionable suggestions to improve your resume.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

## 🌐 Live Demo

🔗 **Live Website:** [ATS Analyzer](https://ats-analyzer-alpha.vercel.app/)

## ✨ Features

### 📄 Resume Analysis
- Upload resumes in PDF format
- Extract and analyze resume content
- Compare resumes against specific job descriptions
- Generate ATS compatibility scores
- Analyze resume quality and relevant sections

### 🎯 Keyword Analysis
- Identify matched keywords
- Detect missing keywords
- Analyze relevant skills and job requirements
- Calculate keyword-based compatibility scores

### 🤖 AI-Powered Insights
- Google Gemini API integration
- Semantic resume and job description matching
- AI-generated compatibility score and explanation
- Identify resume strengths
- Generate actionable improvement suggestions
- Provide resume rewriting suggestions while preserving original information

### 📊 Analysis Reports
- View detailed analysis results
- Display ATS compatibility scores
- Explore matched and missing keywords
- Review AI-generated insights
- Save analysis reports in the database

### ⚡ Flexible Analysis Modes
- Keyword-only analysis without AI
- AI-powered analysis using Google Gemini
- Option to enable or disable AI insights

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, Tailwind CSS |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| AI Integration | Google Gemini API |
| Resume Processing | PDF Parsing |
| API Communication | REST API |
| Deployment | Vercel, Render |

## 🚀 Getting Started

Follow these steps to run the project locally.

### 📋 Prerequisites

- Python 3.10+
- Node.js and npm
- PostgreSQL
- Google Gemini API Key (for AI-powered analysis)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/indrojchowdhury/ATS_Analyzer.git

cd ATS_Analyzer
```

### 2️⃣ Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure backend environment variables in a `.env` file.

Run database migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver
```

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend

npm install
```

Configure frontend environment variables in a `.env` file.

Start the frontend development server:

```bash
npm run dev
```

## 🔐 Environment Variables

### Backend (`.env`)

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=your_database_url

GEMINI_API_KEY=your_gemini_api_key

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`.env`)

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

⚠️ Never commit actual secret keys, API keys, or database credentials to GitHub.

## 🔌 API Modules

The backend provides RESTful APIs for:

- Resume Upload and Processing
- Job Description Management
- ATS Resume Analysis
- Keyword Matching
- AI-Powered Resume Insights
- Analysis Report Management

## 🔮 Future Improvements

- Resume version management
- Advanced resume optimization
- Detailed analytics and reporting
- Additional document format support

---

<p align="center">
  💻 Built with ❤️ using Django, React, PostgreSQL, and Google Gemini
</p>
