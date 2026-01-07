import React from "react";
import { Link, useNavigate } from "react-router-dom";
import posterTemplates from "../templates/posterTemplates.json";
import vnTemplates from "../templates/vnTemplates.json";

export default function TemplateGallery() {
  const navigate = useNavigate();

  const getPreviewAspectClass = (canvas) => {
    const w = canvas?.width;
    const h = canvas?.height;
    if (!w || !h) return "aspect-[4/3]";
    if (w === 1080 && h === 1920) return "aspect-[9/16]";
    if (w === 1080 && h === 1080) return "aspect-square";
    if ((w === 800 && h === 1100) || (w === 900 && h === 1200)) return "aspect-[3/4]";
    if (h > w) return "aspect-[3/4]";
    if (h === w) return "aspect-square";
    return "aspect-[4/3]";
  };

  const templates = React.useMemo(() => {
    const posters = posterTemplates.map((t) => ({ ...t, category: t.category || "Posters" }));
    return [...vnTemplates, ...posters];
  }, []);

  const categories = React.useMemo(() => {
    const ordered = ["Recap", "Creative Picks", "Happy Birthday", "Instagram Reels", "Posters"];
    const existing = new Set(templates.map((t) => t.category || "Templates"));
    const extras = Array.from(existing).filter((c) => !ordered.includes(c));
    return [...ordered.filter((c) => existing.has(c)), ...extras];
  }, [templates]);

  const grouped = React.useMemo(() => {
    return templates.reduce((acc, t) => {
      const key = t.category || "Templates";
      acc[key] = acc[key] || [];
      acc[key].push(t);
      return acc;
    }, {});
  }, [templates]);

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
        <div className="grid gap-8">
          {categories.map((category) => (
            <section key={category}>
              <div className="text-sm font-semibold text-slate-900">{category}</div>
              <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
                {(grouped[category] || []).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => navigate("/editor", { state: { template: t } })}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-slate-300"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <div className="absolute left-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {t.category || category}
                      </div>
                      <div className={`mx-auto h-full ${getPreviewAspectClass(t.canvas)}`}>
                        <img
                          alt={t.name}
                          src={t.thumbnail}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
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
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
