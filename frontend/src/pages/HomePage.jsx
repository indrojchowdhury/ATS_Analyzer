
import {
  ArrowRight,
  FileSearch,
  Target,
  Sparkles,
  CheckCircle2,
  UploadCloud,
  BarChart3,
  FileText,
  SearchCheck,
  Zap,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  const features = [
    {
      icon: Target,
      title: "ATS Score Analysis",
      description:
        "Understand how well your resume matches a specific job description with a detailed compatibility score.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: SearchCheck,
      title: "Keyword Matching",
      description:
        "Discover matched and missing keywords to understand what employers are looking for.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: BrainCircuit,
      title: "AI Resume Feedback",
      description:
        "Get intelligent feedback and practical recommendations to improve your resume.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: BarChart3,
      title: "Skills Analysis",
      description:
        "Compare your existing skills with the technical requirements of your target job.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: FileText,
      title: "Resume Analysis",
      description:
        "Review resume sections and identify areas that need improvement.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: Zap,
      title: "Actionable Suggestions",
      description:
        "Get practical suggestions to make your resume more relevant and effective.",
      color: "bg-green-100 text-green-700",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: UploadCloud,
      title: "Upload Your Resume",
      description:
        "Upload your resume in PDF or DOCX format to start the analysis.",
    },
    {
      number: "02",
      icon: FileSearch,
      title: "Add Job Description",
      description:
        "Paste the job description to compare your resume with the target role.",
    },
    {
      number: "03",
      icon: BarChart3,
      title: "Get Your ATS Report",
      description:
        "Review your ATS score, matched keywords, missing skills and improvement suggestions.",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">

            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-semibold mb-4">
                <Sparkles size={16} />
                Smart Resume Analysis Platform
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight">
                Make Your Resume
                <span className="block text-primary-600 mt-1">
                  Job-Ready
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-6 max-w-xl">
                Analyze your resume against job descriptions, discover
                missing keywords, and get actionable feedback to improve
                your chances of getting noticed.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-5">

                <Link
                  to="/scanner"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md shadow-green-200"
                >
                  Analyze Your Resume
                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-600 transition-all dark:bg-gray-900"
                >
                  Explore Features
                </a>

              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  No account required
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-green-600" />
                  Easy to use
                </div>
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="relative">

              <div className="absolute -top-10 -right-8 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-40"></div>

              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-4">

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Resume Analysis
                    </h3>
                    <p className="text-xs text-gray-500">
                      Sample report preview
                    </p>
                  </div>

                  <div className="w-9 h-9 bg-green-100 text-primary-700 rounded-lg flex items-center justify-center">
                    <FileSearch size={19} />
                  </div>
                </div>

                {/* Score */}
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-medium text-gray-500">
                    ATS Compatibility Score
                  </p>

                  <div className="w-20 h-20 mx-auto mt-2 rounded-full border-[7px] border-green-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-green-500 border-r-green-500 rotate-45"></div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        85
                      </h2>
                      <p className="text-[10px] text-gray-500">out of 100</p>
                    </div>
                  </div>

                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Sample Score
                  </span>
                </div>

                {/* Keyword Analysis */}
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Keyword Analysis
                  </h4>

                  <div className="space-y-2">

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Matched Keywords</span>
                        <span className="font-semibold text-green-600">8</span>
                      </div>

                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Missing Keywords</span>
                        <span className="font-semibold text-red-500">2</span>
                      </div>

                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-1/5 h-full bg-red-400 rounded-full"></div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Feedback */}
                <div className="mt-3 p-2.5 bg-green-50 rounded-xl flex gap-2">
                  <Sparkles className="text-primary-600 shrink-0" size={17} />

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Improvement Opportunity
                    </p>

                    <p className="text-[11px] text-gray-600 mt-0.5 leading-4">
                      Review missing keywords and improve your resume
                      based on the job requirements.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Powerful Features
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
              Everything You Need to Improve Your Resume
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-6">
              Get useful insights into your resume and understand
              how it aligns with your target job requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group rounded-xl border border-gray-200 p-3 transition-all duration-300 hover:border-green-200 hover:shadow-md sm:p-3.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${feature.color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold leading-5 text-gray-900 sm:text-base">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-5">
                    {feature.description}
                  </p>

                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-8 sm:py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Simple Process
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
              How It Works
            </h2>

            <p className="text-gray-600 mt-3 leading-6">
              Analyze your resume in three simple steps and
              discover opportunities for improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-lg transition-shadow ${
                    index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <span className="absolute top-4 right-5 text-3xl font-bold text-green-50">
                    {step.number}
                  </span>

                  <div className="relative w-12 h-12 mx-auto rounded-xl bg-green-100 text-primary-700 flex items-center justify-center">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6">
                    {step.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 bg-primary-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="w-12 h-12 mx-auto rounded-xl bg-white/15 flex items-center justify-center mb-4">
            <ShieldCheck size={27} className="text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Improve Your Resume?
          </h2>

          <p className="text-sm sm:text-base text-green-100 mt-2 max-w-2xl mx-auto leading-6">
            Understand your resume's strengths, identify missing
            keywords, and get helpful recommendations for your
            next career opportunity.
          </p>

          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3 bg-white text-primary-700 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight size={19} />
          </Link>

          <p className="text-sm text-green-100 mt-3">
            No registration required to explore the scanner.
          </p>

        </div>
      </section>
    </main>
  );
}

export default HomePage;
