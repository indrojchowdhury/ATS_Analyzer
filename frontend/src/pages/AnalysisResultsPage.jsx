import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileSearch,
  LoaderCircle,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const SECTION_LABELS = {
  contact_information: "Contact information",
  professional_summary: "Professional summary",
  work_experience: "Work experience",
  education: "Education",
  skills: "Skills",
  projects_or_portfolio: "Projects or portfolio",
};

async function fetchReport(reportId, token) {
  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/ats/reports/${reportId}/`,
      {
        headers: token ? { Authorization: `Token ${token}` } : {},
      }
    );
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
      result.message || `Could not load this report (${response.status}).`
    );
  }

  return result.data;
}

function getScoreLabel(score) {
  if (score >= 80) return "Strong match";
  if (score >= 60) return "Good starting point";
  if (score >= 40) return "Needs improvement";
  return "Low match";
}

function ScoreCard({ title, score, caption, icon: Icon, color }) {
  const safeScore = Number.isFinite(score)
    ? Math.min(100, Math.max(0, score))
    : 0;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{caption}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div
          aria-label={`${safeScore} out of 100`}
          className="score-ring flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
          style={{
            "--score-progress": `${safeScore * 3.6}deg`,
          }}
        >
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-gray-900">{safeScore}%</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{getScoreLabel(safeScore)}</p>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {title === "Job compatibility"
              ? "Based on keywords found in the job description and your resume."
              : "Based on the presence of common resume sections."}
          </p>
        </div>
      </div>
    </section>
  );
}

function KeywordList({ title, keywords, tone, emptyMessage }) {
  const styles =
    tone === "matched"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-amber-50 text-amber-800 ring-amber-200";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
          {keywords.length}
        </span>
      </div>
      {keywords.length ? (
        <ul className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <li
              key={`${keyword}-${index}`}
              className={`rounded-full px-3 py-1.5 text-sm ring-1 ring-inset ${styles}`}
            >
              {keyword}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      )}
    </section>
  );
}

function AnalysisResultsPage() {
  const { token } = useAuth();
  const { reportId: routeReportId } = useParams();
  const location = useLocation();
  const analysisFromNavigation = location.state?.analysis;
  const reportId =
    routeReportId ??
    location.state?.reportId ??
    analysisFromNavigation?.report_id;
  const [reportState, setReportState] = useState(() => ({
    reportId,
    report: analysisFromNavigation ?? null,
    error: "",
  }));

  useEffect(() => {
    let active = true;

    if (!reportId) {
      return () => {
        active = false;
      };
    }

    fetchReport(reportId, token)
      .then((data) => {
        if (active) setReportState({ reportId, report: data, error: "" });
      })
      .catch((requestError) => {
        if (active) {
          setReportState((previous) => ({
            reportId,
            report: previous.reportId === reportId ? previous.report : null,
            error: requestError.message,
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [reportId, token]);

  const hasCurrentReportState = reportState.reportId === reportId;
  const report = hasCurrentReportState ? reportState.report : null;
  const error = hasCurrentReportState ? reportState.error : "";
  const loading = Boolean(reportId && !report && !error);
  const displayError =
    error ||
    (!reportId
      ? "No report was selected. Analyze a resume to view its results."
      : "");

  if (loading && !report) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-gray-600" role="status">
          <LoaderCircle className="animate-spin text-primary-600" size={22} />
          Loading your analysis report...
        </div>
      </main>
    );
  }

  if (displayError && !report) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <section className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <CircleAlert className="mx-auto text-red-500" size={36} />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Report unavailable
          </h1>
          <p className="mt-2 text-gray-600">{displayError}</p>
          <Link
            to="/scanner"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white hover:bg-primary-700"
          >
            <FileSearch size={18} />
            Analyze a resume
          </Link>
        </section>
      </main>
    );
  }

  const compatibility = report?.job_compatibility ?? {};
  const quality = report?.resume_quality ?? {};
  const aiAnalysis = report?.ai_analysis ?? {};
  const matchedKeywords = compatibility.matched_keywords ?? [];
  const missingKeywords = compatibility.missing_keywords ?? [];
  const sections = quality.section_analysis ?? {};
  const date = report?.created_at ? new Date(report.created_at) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleString()
      : "Date unavailable";

  return (
    <main className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
        >
          <ArrowLeft size={17} />
          Analyze another resume
        </Link>

        <header className="mb-5 mt-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-primary-700">
            <Sparkles size={16} />
            Resume analysis report
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Your results
          </h1>
          <p className="mt-2 break-words text-gray-600">
            {report?.resume_filename
              ? `Resume: ${report.resume_filename}`
              : "Review your resume against the submitted job description."}
            {report?.job_title ? ` · ${report.job_title}` : ""}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Report #{report?.id ?? report?.report_id ?? reportId} · {formattedDate}
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            We could not refresh the saved report. Showing the analysis from this session.
            {" "}{error}
          </div>
        )}

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <ScoreCard
            title="Job compatibility"
            score={compatibility.compatibility_score}
            caption="Resume-to-job match"
            icon={Target}
            color="bg-green-100 text-primary-700"
          />
          <ScoreCard
            title="Resume quality"
            score={quality.resume_quality_score}
            caption={`${quality.sections_found ?? 0} of ${quality.total_sections ?? 0} sections found`}
            icon={FileCheck2}
            color="bg-green-100 text-green-700"
          />
        </div>

        {aiAnalysis.semantic_match_score !== undefined && (
          <section className="mt-3 rounded-2xl border border-green-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Sparkles className="text-primary-600" size={18} />
                  AI-powered insights
                </h2>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  {aiAnalysis.semantic_match_summary}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 px-3 py-2 text-center">
                <p className="text-xl font-bold text-primary-700">
                  {aiAnalysis.semantic_match_score}%
                </p>
                <p className="text-[11px] text-gray-500">Semantic match</p>
              </div>
            </div>

            {aiAnalysis.strengths?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">Relevant strengths</h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {aiAnalysis.strengths.map((strength, index) => (
                    <li key={`${strength}-${index}`} className="flex gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={16} />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.recommendations?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">Recommended improvements</h3>
                <ul className="mt-2 space-y-2">
                  {aiAnalysis.recommendations.map((recommendation, index) => (
                    <li key={`${recommendation}-${index}`} className="flex gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-primary-700">{index + 1}.</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.rewrite_suggestions?.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Rewrite suggestions</h3>
                {aiAnalysis.rewrite_suggestions.map((rewrite, index) => (
                  <article
                    key={`${rewrite.section}-${index}`}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                      {rewrite.section}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      <span className="font-semibold">Original: </span>
                      {rewrite.original}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-gray-800">
                      <span className="font-semibold">Suggested: </span>
                      {rewrite.suggested}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {rewrite.rationale}
                    </p>
                  </article>
                ))}
              </div>
            )}

            <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-5 text-gray-500">
              AI suggestions may be inaccurate. Review them and never include
              experience or achievements that are not true.
            </p>
          </section>
        )}

        <section className="mt-3 grid gap-3 sm:gap-4 md:grid-cols-2">
          <KeywordList
            title="Matched keywords"
            keywords={matchedKeywords}
            tone="matched"
            emptyMessage="No job-description keywords matched the resume."
          />
          <KeywordList
            title="Missing keywords"
            keywords={missingKeywords}
            tone="missing"
            emptyMessage="No missing keywords were found."
          />
        </section>

        <section className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-3">
            <h2 className="font-semibold text-gray-900">Resume sections</h2>
            <p className="mt-1 text-sm text-gray-500">
              Sections detected in the resume text.
            </p>
          </div>
          {Object.keys(sections).length ? (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(sections).map(([key, found]) => (
                <li
                  key={key}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-gray-700"
                >
                  {found ? (
                    <CheckCircle2 className="shrink-0 text-green-600" size={18} />
                  ) : (
                    <XCircle className="shrink-0 text-gray-400" size={18} />
                  )}
                  {SECTION_LABELS[key] ?? key.replaceAll("_", " ")}
                  <span className="ml-auto text-xs text-gray-400">
                    {found ? "Found" : "Not found"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Resume section details are unavailable for this report.
            </p>
          )}
        </section>

        <p className="mt-4 text-center text-xs leading-5 text-gray-400">
          Scores are based on keyword overlap and detected resume sections; they are
          guidance, not a guarantee of application outcomes.
        </p>
      </div>
    </main>
  );
}

export default AnalysisResultsPage;
