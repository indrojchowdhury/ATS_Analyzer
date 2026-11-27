import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="flex flex-col items-center text-center">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileSearch size={22} className="text-white" />
              </div>

              <span className="text-lg font-bold text-white sm:text-xl">
                ATS <span className="text-primary-500">Analyzer</span>
              </span>
            </Link>

            <p className="mt-2 max-w-md text-sm leading-5 text-gray-400">
              Analyze your resume, discover improvement opportunities,
              and prepare for your next career opportunity.
            </p>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ATS Analyzer. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;