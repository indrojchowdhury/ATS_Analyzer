
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, FileSearch, UserRoundPlus } from "lucide-react";
import { useAuth } from "../context/useAuth";

function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
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
          Create your account
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Sign up to get started with ATS Analyzer.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="register-username" className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              maxLength={150}
              value={form.username}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label htmlFor="register-password-confirm" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              id="register-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              value={form.passwordConfirm}
              onChange={updateField}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Enter your password again"
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
            <UserRoundPlus size={18} />
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-700 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
