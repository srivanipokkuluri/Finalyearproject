import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !submitting;
  }, [email, password, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      localStorage.setItem("mock_auth", "true");
      localStorage.setItem("mock_user_email", email.trim());
      navigate("/templates");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-sm font-semibold tracking-tight text-slate-900">
          AI Template Editor
        </Link>
        <Link to="/templates" className="text-sm font-medium text-slate-700 hover:underline">
          Go to Templates
        </Link>
      </header>

      <main className="mx-auto w-full max-w-md px-6 pb-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Mock Login</h1>
          <p className="mt-1 text-sm text-slate-600">No backend auth. This is just for navigation flow.</p>

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                placeholder="name@college.edu"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold text-slate-700">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-0 focus:border-slate-400"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Login"}
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Tip: You can skip login and directly open the template gallery.
          </div>
        </div>
      </main>
    </div>
  );
}
