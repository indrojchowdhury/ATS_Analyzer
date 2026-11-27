
import { Link, NavLink } from "react-router-dom";
import { FileSearch, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    setAuthError("");
    try {
      await logout();
      setMenuOpen(false);
    } catch (error) {
      setAuthError(error.message);
    }
  }

  const navLinkClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-primary-600 font-semibold"
        : "text-gray-600 hover:text-primary-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileSearch size={20} className="text-white" />
            </div>

            <span className="text-base font-bold text-gray-900 sm:text-lg">
              ATS <span className="text-primary-600">Analyzer</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <a href="/#features" className="text-gray-600 hover:text-primary-600">
              Features
            </a>

            <a href="/#how-it-works" className="text-gray-600 hover:text-primary-600">
              How It Works
            </a>

            <NavLink to="/scanner" className={navLinkClass}>
              Resume Scanner
            </NavLink>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-700 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-gray-700 font-medium hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600">
                  Hi, {user.username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 font-medium text-gray-700 hover:text-primary-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-gray-700 font-medium hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-gray-700 font-medium hover:text-primary-600"
                >
                  Register
                </Link>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 dark:text-gray-200"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
        <div className="lg:hidden py-4 border-t border-gray-100 space-y-4">

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700"
            >
              Home
            </NavLink>

            <a
              href="/#features"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700"
            >
              Features
            </a>

            <a
              href="/#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700"
            >
              How It Works
            </a>

            <NavLink
              to="/scanner"
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700"
            >
              Resume Scanner
            </NavLink>

            <div className="flex flex-col gap-3 pt-2">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-700"
                  >
                    Dashboard
                  </NavLink>
                  <span className="text-sm text-gray-600">
                    Signed in as {user.username}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-left text-gray-700"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>

          </div>
        )}
        {authError && (
          <p className="border-t border-red-100 py-2 text-sm text-red-600" role="alert">
            {authError}
          </p>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
