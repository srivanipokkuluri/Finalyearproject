import React from "react";

export default function LayersPanel({ layers, selectedLayerId, onSelectLayer }) {
  if (!layers?.length) {
    return <div className="text-sm text-slate-600">No layers found.</div>;
  }

  return (
    <div className="grid gap-2">
      {layers.map((layer) => {
        const isSelected = layer.id === selectedLayerId;

        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onSelectLayer(layer.id)}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
              isSelected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            <div className="min-w-0">
              <div className="truncate font-semibold">{layer.name || layer.id}</div>
              <div className={`mt-0.5 truncate text-xs ${isSelected ? "text-slate-200" : "text-slate-500"}`}>
                {layer.type}
              </div>
            </div>
            <div className={`rounded-lg px-2 py-1 text-xs ${isSelected ? "bg-white/10" : "bg-slate-100"}`}>
              {layer.type === "text" ? "T" : "IMG"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
