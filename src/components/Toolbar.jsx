import React, { useEffect, useMemo, useRef, useState } from "react";

export default function Toolbar({ selectedLayer, onUpdate }) {
  const isTextLayer = selectedLayer?.type === "text";
  const isMediaLayer = selectedLayer?.type === "image" || selectedLayer?.type === "video";
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fill, setFill] = useState("#111827");
  const [mediaUrl, setMediaUrl] = useState("");

  useEffect(() => {
    if (!isTextLayer) return;
    setText(selectedLayer.text || "");
    setFontSize(selectedLayer.fontSize || 32);
    setFill(selectedLayer.fill || "#111827");
  }, [
    isTextLayer,
    selectedLayer?.id,
    selectedLayer?.text,
    selectedLayer?.fontSize,
    selectedLayer?.fill,
  ]);

  useEffect(() => {
    if (!isMediaLayer) return;
    setMediaUrl(selectedLayer?.src || "");
  }, [isMediaLayer, selectedLayer?.id, selectedLayer?.src]);

  const canEdit = useMemo(() => Boolean(selectedLayer && (isTextLayer || isMediaLayer)), [isMediaLayer, isTextLayer, selectedLayer]);

  if (!canEdit) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        Select a layer to edit.
      </div>
    );
  }

  if (isMediaLayer) {
    const accept = selectedLayer?.type === "video" ? "video/*" : "image/*";
    const canApplyUrl = Boolean(mediaUrl.trim());

    return (
      <div className="grid gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            setMediaUrl(url);
            onUpdate({ src: url });
            e.target.value = "";
          }}
        />

        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Upload {selectedLayer?.type === "video" ? "Video" : "Image"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMediaUrl("");
              onUpdate({ src: "" });
            }}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Clear Media
          </button>
        </div>

        <label className="grid gap-2">
          <span className="text-xs font-semibold text-slate-700">Media URL</span>
          <input
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={selectedLayer?.type === "video" ? "Paste a video URL…" : "Paste an image URL…"}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </label>

        <button
          type="button"
          disabled={!canApplyUrl}
          onClick={() => onUpdate({ src: mediaUrl.trim() })}
          className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white ${
            canApplyUrl ? "bg-slate-900 hover:bg-slate-800" : "cursor-not-allowed bg-slate-400"
          }`}
        >
          Apply URL
        </button>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Tip: Drag to reposition. Use handles on the canvas to resize.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs font-semibold text-slate-700">Text</span>
        <textarea
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            setText(v);
            onUpdate({ text: v });
          }}
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-semibold text-slate-700">Font size</span>
          <input
            value={fontSize}
            onChange={(e) => {
              const next = Number(e.target.value);
              setFontSize(next);
              onUpdate({ fontSize: next });
            }}
            type="number"
            min={8}
            max={200}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-semibold text-slate-700">Color</span>
          <input
            value={fill}
            onChange={(e) => {
              const next = e.target.value;
              setFill(next);
              onUpdate({ fill: next });
            }}
            type="color"
            className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-2"
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        Tip: Drag the selected layer on the canvas to reposition it.
      </div>
    </div>
  );
}
