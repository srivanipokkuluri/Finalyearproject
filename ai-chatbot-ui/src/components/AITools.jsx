import React, { useState } from "react";
import { autoEnhance, generateCaption, removeBackground } from "../services/api";

export default function AITools({ templateName, onCaption, onStatus }) {
  const [loadingKey, setLoadingKey] = useState("");

  const run = async (key, fn) => {
    setLoadingKey(key);
    try {
      const res = await fn();
      if (res?.message) onStatus(res.message);
      return res;
    } catch (err) {
      onStatus("AI action failed (mock). Please try again.");
      return null;
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() =>
          run("removeBg", () =>
            removeBackground({
              templateName,
            })
          )
        }
        disabled={Boolean(loadingKey)}
        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingKey === "removeBg" ? "Removing…" : "Remove Background"}
      </button>

      <button
        type="button"
        onClick={() =>
          run("enhance", () =>
            autoEnhance({
              templateName,
            })
          )
        }
        disabled={Boolean(loadingKey)}
        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingKey === "enhance" ? "Enhancing…" : "Auto Enhance"}
      </button>

      <button
        type="button"
        onClick={async () => {
          const res = await run("caption", () => generateCaption({ templateName }));
          if (res?.caption) {
            onCaption(res.caption);
            onStatus("Caption generated and added as a layer.");
          }
        }}
        disabled={Boolean(loadingKey)}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingKey === "caption" ? "Generating…" : "Generate Caption"}
      </button>

      <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        AI actions are mocked via an Axios adapter. You can later swap the baseURL to a real backend.
      </div>
    </div>
  );
}
