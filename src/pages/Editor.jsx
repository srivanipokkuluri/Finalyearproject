import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import LayersPanel from "../components/LayersPanel";
import AITools from "../components/AITools";
import MusicPanel from "../components/MusicPanel";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);

  const template = location.state?.template;
  const uploadedMedia = location.state?.uploadedMedia;

  const [layers, setLayers] = useState(() => {
    if (uploadedMedia) {
      // Create a new project with uploaded media
      return [
        {
          id: "background",
          type: "image",
          name: "Background",
          src: uploadedMedia.url,
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          draggable: false,
        },
        {
          id: "title-text",
          type: "text",
          name: "Title",
          text: "Your Title Here",
          x: 50,
          y: 50,
          fontSize: 48,
          fontFamily: "Inter",
          fill: "#ffffff",
          draggable: true,
        },
        {
          id: "subtitle-text",
          type: "text",
          name: "Subtitle",
          text: "Add your subtitle",
          x: 50,
          y: 120,
          fontSize: 24,
          fontFamily: "Inter",
          fill: "#ffffff",
          draggable: true,
        }
      ];
    }
    return template?.layers ? deepClone(template.layers) : [];
  });

  const [selectedLayerId, setSelectedLayerId] = useState(() => {
    if (uploadedMedia) {
      return "title-text"; // Select title text by default for new projects
    }
    const firstText = template?.layers?.find((l) => l.type === "text");
    return firstText?.id || null;
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [videoFrames, setVideoFrames] = useState([]);

  useEffect(() => {
    if (!template && !uploadedMedia) {
      navigate("/templates", { replace: true });
    }
  }, [template, uploadedMedia, navigate]);

  useEffect(() => {
    if (uploadedMedia) {
      // Set status for new project with uploaded media
      setStatusMessage(`New project created with ${uploadedMedia.name}`);
    } else if (template) {
      setLayers(deepClone(template.layers));
      const firstText = template.layers.find((l) => l.type === "text");
      setSelectedLayerId(firstText?.id || null);
      setStatusMessage("");
    }
  }, [template, uploadedMedia]);

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

      const width = template?.canvas?.width || (uploadedMedia ? 800 : 800);
      const height = template?.canvas?.height || (uploadedMedia ? 600 : 1100);

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
        selectedMusic,
        layers,
      },
    });
  };

  const handleMusicSelect = (music) => {
    setSelectedMusic(music);
    if (music) {
      setStatusMessage(`Music applied: ${music.name}`);
    } else {
      setStatusMessage("Music removed");
    }
  };

  useEffect(() => {
    const mockFrames = Array.from({ length: 10 }, (_, i) => ({
      index: i,
      timestamp: i * 2, // Every 2 seconds
      brightness: Math.random() * 0.8 + 0.2,
      dominantColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
      motionLevel: Math.random(),
      hasFaces: Math.random() > 0.7
    }));
    setVideoFrames(mockFrames);
  }, []);

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
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="text-sm font-semibold text-slate-900">Editor</div>
            <div className="mt-1 text-xs text-slate-500">
              {template ? template.name : uploadedMedia ? `New Project - ${uploadedMedia.name}` : 'Untitled Project'}
            </div>
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

      <main className="mx-auto grid w-full max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[280px_1fr_280px]">
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
              {template ? `${template.canvas.width} × ${template.canvas.height}` : uploadedMedia ? '800 × 600' : '800 × 1100'}
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <Canvas
              ref={canvasRef}
              canvasWidth={template?.canvas?.width || (uploadedMedia ? 800 : 800)}
              canvasHeight={template?.canvas?.height || (uploadedMedia ? 600 : 1100)}
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
              onUpdateLayer={updateLayer}
            />
          </div>
        </section>

        <aside className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-900">Layers</div>
            <div className="mt-1 text-xs text-slate-500">Select a layer to edit</div>
            <div className="mt-4">
              <LayersPanel
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={(id) => setSelectedLayerId(id)}
              />
            </div>
          </div>

          <MusicPanel
            onMusicSelect={handleMusicSelect}
            videoDuration={template?.duration || 30}
            videoFrames={videoFrames}
          />
        </aside>
      </main>
    </div>
  );
}
