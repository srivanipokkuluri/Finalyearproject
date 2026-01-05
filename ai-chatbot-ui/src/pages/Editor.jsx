import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import LayersPanel from "../components/LayersPanel";
import AITools from "../components/AITools";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);

  const template = location.state?.template;

  const [layers, setLayers] = useState(() => (template?.layers ? deepClone(template.layers) : []));
  const [selectedLayerId, setSelectedLayerId] = useState(() => {
    const firstText = template?.layers?.find((l) => l.type === "text");
    return firstText?.id || null;
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!template) {
      navigate("/templates", { replace: true });
    }
  }, [template, navigate]);

  useEffect(() => {
    if (!template) return;
    setLayers(deepClone(template.layers));
    const firstText = template.layers.find((l) => l.type === "text");
    setSelectedLayerId(firstText?.id || null);
    setStatusMessage("");
  }, [template]);

  const selectedLayer = useMemo(() => {
    return layers.find((l) => l.id === selectedLayerId) || null;
  }, [layers, selectedLayerId]);

  const updateLayer = (layerId, patch) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== layerId) return l;
        return { ...l, ...patch };
      })
    );
  };

  const upsertCaptionLayer = (caption) => {
    setLayers((prev) => {
      const existing = prev.find((l) => l.id === "caption" && l.type === "text");
      if (existing) {
        return prev.map((l) => (l.id === "caption" ? { ...l, text: caption } : l));
      }

      const width = template?.canvas?.width || 800;
      const height = template?.canvas?.height || 1100;

      const nextLayer = {
        id: "caption",
        type: "text",
        name: "Caption",
        text: caption,
        x: Math.round(width * 0.08),
        y: Math.round(height * 0.86),
        fontSize: 26,
        fontFamily: "Inter",
        fill: "#111827",
        draggable: true,
      };

      return [...prev, nextLayer];
    });
    setSelectedLayerId("caption");
  };

  const onPreview = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.exportAsDataUrl();
    navigate("/preview", {
      state: {
        dataUrl,
        templateName: template?.name || "Untitled",
      },
    });
  };

  if (!template) {
    return (
      <div className="min-h-full bg-slate-50">
        <div className="mx-auto w-full max-w-3xl px-6 py-14">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            <div className="text-base font-semibold text-slate-900">No template loaded</div>
            <div className="mt-2 text-sm text-slate-600">
              Please select a template from the gallery. If you refreshed the page, editor state in router memory was
              cleared.
            </div>
            <div className="mt-5">
              <Link
                to="/templates"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Go to Templates
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="text-sm font-semibold text-slate-900">Editor</div>
            <div className="mt-1 text-xs text-slate-500">{template.name}</div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/templates"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Templates
            </Link>
            <button
              type="button"
              onClick={onPreview}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Preview
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1400px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[280px_1fr_280px]">
        <aside className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-900">Toolbar</div>
            <div className="mt-1 text-xs text-slate-500">Edit selected text layer</div>
            <div className="mt-4">
              <Toolbar selectedLayer={selectedLayer} onUpdate={(patch) => updateLayer(selectedLayerId, patch)} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-900">AI Tools</div>
            <div className="mt-1 text-xs text-slate-500">Mock backend actions</div>
            <div className="mt-4">
              <AITools
                templateName={template.name}
                onStatus={(msg) => setStatusMessage(msg)}
                onCaption={(caption) => upsertCaptionLayer(caption)}
              />
            </div>
          </div>

          {statusMessage ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
              {statusMessage}
            </div>
          ) : null}
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">Canvas</div>
              <div className="mt-1 text-xs text-slate-500">Drag layers. Click to select.</div>
            </div>
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
              {template.canvas.width} × {template.canvas.height}
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <Canvas
              ref={canvasRef}
              canvasWidth={template.canvas.width}
              canvasHeight={template.canvas.height}
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
              onUpdateLayer={updateLayer}
            />
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-900">Layers</div>
          <div className="mt-1 text-xs text-slate-500">Select a layer to edit</div>
          <div className="mt-4">
            <LayersPanel
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
