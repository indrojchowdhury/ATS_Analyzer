
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  UploadCloud,
  FileText,
  FileSearch,
  X,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}, token) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend. Make sure Django server is running."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response received from the server.");
  }

  if (!response.ok || result.success === false) {
    const errors = result.errors;

    let errorMessage = result.message;

    if (!errorMessage && errors) {
      errorMessage = Object.values(errors)
        .flat()
        .join(" ");
    }

    throw new Error(
      errorMessage || `Request failed with status ${response.status}.`
    );
  }

  return result;
}

function UploadResumePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [includeAi, setIncludeAi] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    setError("");
    setMessage("");

    if (!file) return;

    const filename = file.name.toLowerCase();

    const isValidFile =
      filename.endsWith(".pdf") ||
      filename.endsWith(".docx");

    if (!isValidFile) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    if (file.size === 0) {
      setError("Uploaded file is empty.");
      return;
    }

    setResume(file);
  };

  const handleRemoveFile = () => {
    if (loading) return;

    setResume(null);
    setError("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      setError("Job description must contain at least 30 characters.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload Resume
      setMessage("Uploading your resume...");

      const formData = new FormData();
      formData.append("file", resume);

      const resumeResponse = await apiRequest(
        "/api/resumes/upload/",
        {
          method: "POST",
          body: formData,
        },
        token
      );

      const resumeId = resumeResponse.data.resume_id;

      // Step 2: Save Job Description
      setMessage("Saving job description...");

      const jobResponse = await apiRequest(
        "/api/jobs/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_title: "",
            description: jobDescription.trim(),
          }),
        }
      );

      const jobDescriptionId = jobResponse.data.id;

      // Step 3: Analyze Resume
      setMessage("Analyzing your resume...");

      const analysisResponse = await apiRequest(
        "/api/ats/analyze/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_id: resumeId,
            job_description_id: jobDescriptionId,
            include_ai: includeAi,
          }),
        },
        token
      );

      // Step 4: Navigate to Results Page
      const reportId = analysisResponse.data.report_id;

      navigate("/results", {
        state: {
          reportId,
          analysis: analysisResponse.data,
        },
      });

    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );

      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <main className="min-h-screen bg-slate-50 py-2 sm:py-3 lg:py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold mb-2">
            <Sparkles size={16} />
            AI Powered Resume Analysis
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Analyze Your Resume
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-5">
            Upload your resume and add a job description to discover
            how well your qualifications match the job requirements.
          </p>
        </div>

        {/* Scanner Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

          {/* Resume Upload */}
          <section className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-green-100 text-primary-700 flex items-center justify-center">
                <FileText size={19} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Upload Your Resume
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Upload your latest resume for analysis.
                </p>
              </div>
            </div>

            {!resume ? (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 sm:p-4 lg:p-5 text-center transition-all ${
                  dragActive
                    ? "border-primary-600 bg-green-50"
                    : "border-gray-300 hover:border-primary-500 hover:bg-green-50/50"
                } ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <div className="w-10 h-10 bg-green-100 text-primary-700 rounded-lg flex items-center justify-center mx-auto">
                  <UploadCloud size={22} />
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mt-2">
                  Drag and drop your resume here
                </h3>

                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  or click anywhere in this box to browse
                </p>

                <span className="inline-block mt-2 px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold">
                  Browse Resume
                </span>

                <p className="text-[11px] text-gray-400 mt-2">
                  Supported formats: PDF, DOCX · Maximum size: 5 MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  disabled={loading}
                  className="hidden"
                  onChange={(event) =>
                    handleFile(event.target.files?.[0])
                  }
                />
              </div>
            ) : (
              <div className="border border-green-200 bg-green-50 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shrink-0">
                    <FileCheck2 size={25} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {resume.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {formatFileSize(resume.size)} · Ready to upload
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={loading}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors shrink-0 disabled:opacity-50"
                  aria-label="Remove resume"
                >
                  <X size={21} />
                </button>
              </div>
            )}
          </section>

          {/* Job Description */}
          <section className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Job Description
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Paste the job description you want to target.
                </p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              disabled={loading}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setError("");
                setMessage("");
              }}
              placeholder={`Paste the complete job description here...

Example:

Job Title: Python Developer

Requirements:
- Strong knowledge of Python
- Experience with Django
- Understanding of REST APIs
- Knowledge of PostgreSQL
- Problem-solving skills

Responsibilities:
- Develop backend applications
- Build and maintain REST APIs
- Work with databases`}
              rows={6}
              className="w-full border border-gray-300 bg-white rounded-xl p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y transition-all disabled:bg-gray-100"
            />

            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>Minimum 30 characters required</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Loading / Status Message */}
          {message && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3">
              {loading && (
                <span className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {message}
            </div>
          )}

          <label className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeAi}
              disabled={loading}
              onChange={(event) => setIncludeAi(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-green-700"
            />
            <span>
              <span className="block font-semibold text-gray-900">
                Include AI insights
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-gray-600">
                If selected, resume text and the job description will be sent to
                Google Gemini to generate semantic matching, recommendations and
                rewrite suggestions. Leave unchecked for keyword-only analysis.
              </span>
            </span>
          </label>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileSearch size={20} />

              {loading
                ? includeAi
                  ? "Analyzing with AI..."
                  : "Analyzing Resume..."
                : "Analyze My Resume"}

              {!loading && <ArrowRight size={19} />}
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-green-600" />
              Your resume is uploaded to the backend for parsing and analysis.
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}

export default UploadResumePage;
