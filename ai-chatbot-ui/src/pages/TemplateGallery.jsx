import React from "react";
import { Link, useNavigate } from "react-router-dom";
import posterTemplates from "../templates/posterTemplates.json";

export default function TemplateGallery() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-sm font-semibold text-slate-900">Templates</div>
            <div className="mt-1 text-xs text-slate-500">Select a poster template to start editing</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posterTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate("/editor", { state: { template: t } })}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-slate-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  alt={t.name}
                  src={t.thumbnail}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Canvas: {t.canvas.width} × {t.canvas.height}
                </div>
                <div className="mt-3 inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                  Edit Template
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
