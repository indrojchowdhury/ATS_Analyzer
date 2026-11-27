
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, FileSearch, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/useAuth";

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(identifier.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-7 sm:py-9">
      <section className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-primary-700">
          <FileSearch size={23} />
        </div>
        <h1 className="mt-3 text-center text-2xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Sign in to your ATS Analyzer account.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="login-identifier" className="mb-2 block text-sm font-medium text-gray-700">
              Username or email
            </label>
            <input
              id="login-identifier"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Your username or email"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole size={18} />
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-primary-700 hover:underline">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
