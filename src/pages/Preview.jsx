import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const navigate = useNavigate();
  const location = useLocation();

  const dataUrl = location.state?.dataUrl || "";
  const templateName = location.state?.templateName || "Preview";

  const downloadName = useMemo(() => {
    const safe = templateName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `${safe || "poster"}.png`;
  }, [templateName]);

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-sm font-semibold text-slate-900">Preview</div>
            <div className="mt-1 text-xs text-slate-500">{templateName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <Link
              to="/templates"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Templates
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {dataUrl ? (
              <img alt="Final output" src={dataUrl} className="w-full rounded-xl border border-slate-200" />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                Nothing to preview yet. Go back to the editor and click Preview.
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-900">Export</div>
            <div className="mt-1 text-xs text-slate-500">Mock download (uses canvas data URL)</div>

            <div className="mt-4 grid gap-2">
              <a
                href={dataUrl || undefined}
                download={downloadName}
                className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white ${
                  dataUrl ? "bg-slate-900 hover:bg-slate-800" : "cursor-not-allowed bg-slate-400"
                }`}
                onClick={(e) => {
                  if (!dataUrl) e.preventDefault();
                }}
              >
                Download PNG
              </a>
              <div className="text-xs text-slate-500">File: {downloadName}</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
