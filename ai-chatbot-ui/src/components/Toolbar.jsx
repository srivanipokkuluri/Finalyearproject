import React, { useEffect, useMemo, useState } from "react";

export default function Toolbar({ selectedLayer, onUpdate }) {
  const isTextLayer = selectedLayer?.type === "text";

  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fill, setFill] = useState("#111827");

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

  const canEdit = useMemo(() => Boolean(isTextLayer && selectedLayer), [isTextLayer, selectedLayer]);

  if (!canEdit) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        Select a text layer to edit.
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
