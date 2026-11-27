import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  FileCheck2,
  FileText,
  LoaderCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

async function fetchDashboard(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/ats/dashboard/`, {
      headers: { Authorization: `Token ${token}` },
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend. Make sure the Django server is running."
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response received from the server.");
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Could not load your dashboard (${response.status}).`
    );
  }

  return result.data;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString();
}

function SummaryCard({ label, value, icon: Icon, detail }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{detail}</p>
        </div>
        <div className="rounded-lg bg-green-100 p-2 text-primary-700">
          <Icon size={20} />
        </div>
      </div>
    </section>
  );
}

function DashboardPage() {
  const { user, token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchDashboard(token)
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const resumes = useMemo(() => {
    const groups = new Map();
    for (const resume of dashboard?.resumes ?? []) {
      groups.set(resume.id, {
        id: resume.id,
        filename: resume.filename,
        uploadedAt: resume.uploaded_at,
        reports: [],
      });
    }
    for (const report of dashboard?.reports ?? []) {
      if (!groups.has(report.resume_id)) {
        groups.set(report.resume_id, {
          id: report.resume_id,
          filename: report.resume_filename,
          uploadedAt: null,
          reports: [],
        });
      }
      groups.get(report.resume_id).reports.push(report);
    }
    return Array.from(groups.values());
  }, [dashboard]);

  if (!user || !token) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-gray-600" role="status">
          <LoaderCircle className="animate-spin text-primary-600" size={22} />
          Loading your dashboard...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      </main>
    );
  }

  const summary = dashboard?.summary ?? {};

  return (
    <main className="min-h-screen bg-slate-50 py-6 dark:bg-gray-950 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-700">
              ATS ANALYZER
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Welcome, {user.username}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Your resume scores, analytics and AI reports in one place.
            </p>
          </div>
          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <FileText size={17} />
            Analyze a resume
          </Link>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Resumes"
            value={summary.resume_count ?? 0}
            icon={FileText}
            detail="Separate resume reports"
          />
          <SummaryCard
            label="Total analyses"
            value={summary.report_count ?? 0}
            icon={BarChart3}
            detail="Across all your resumes"
          />
          <SummaryCard
            label="Average ATS score"
            value={`${summary.average_compatibility_score ?? 0}%`}
            icon={Target}
            detail="Keyword compatibility"
          />
          <SummaryCard
            label="Average resume quality"
            value={`${summary.average_resume_quality_score ?? 0}%`}
            icon={FileCheck2}
            detail="Section completeness"
          />
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Your resumes
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Each resume has its own score and analysis history.
              </p>
            </div>
          </div>

          {resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-primary-700">
                <FileText size={23} />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
                No resumes yet
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-600 dark:text-gray-400">
                Upload a resume and compare it with a job description. Its scores
                and reports will appear here.
              </p>
              <Link
                to="/scanner"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Start your first analysis
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => {
                const latest = resume.reports[0] ?? null;
                return (
                  <article
                    key={resume.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-4 dark:border-gray-800 sm:p-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-primary-700">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                            {resume.filename || `Resume #${resume.id}`}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resume.reports.length
                              ? `${resume.reports.length} ${
                                  resume.reports.length === 1
                                    ? "analysis"
                                    : "analyses"
                                }`
                              : `Uploaded ${formatDate(resume.uploadedAt)}`}
                          </p>
                        </div>
                      </div>
                      {latest && <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Latest ATS score</p>
                          <p className="text-xl font-bold text-primary-700">
                            {latest.job_compatibility.compatibility_score}%
                          </p>
                        </div>
                        {latest.ai_analysis?.semantic_match_score !== undefined && (
                          <div className="text-right">
                            <p className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Sparkles size={12} />
                              AI match
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {latest.ai_analysis.semantic_match_score}%
                            </p>
                          </div>
                        )}
                      </div>}
                    </div>

                    {resume.reports.length ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {resume.reports.map((report) => (
                        <Link
                          key={report.id}
                          to={`/results/${report.id}`}
                          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-green-50 dark:hover:bg-gray-800 sm:px-5"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                              {report.job_title || "Resume analysis"}
                            </span>
                            <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(report.created_at)}
                              {report.ai_analysis?.semantic_match_score !== undefined && (
                                <span className="ml-2 inline-flex items-center gap-1 text-primary-700">
                                  <Sparkles size={12} />
                                  AI report
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-3 text-sm">
                            <span className="font-semibold text-primary-700">
                              ATS {report.job_compatibility.compatibility_score}%
                            </span>
                            <span className="text-gray-500">
                              Quality {report.resume_quality.resume_quality_score}%
                            </span>
                            <ArrowRight className="text-gray-400" size={16} />
                          </span>
                        </Link>
                      ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No analysis yet for this resume.
                        </p>
                        <Link
                          to="/scanner"
                          className="text-sm font-semibold text-primary-700 hover:underline"
                        >
                          Analyze it
                          <ArrowRight className="ml-1 inline" size={15} />
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
