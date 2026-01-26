import React, { useEffect, useRef, useState } from "react";

export default function ChatInput() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);

  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const canSend = Boolean(text.trim() || pendingFiles.length);

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPendingFiles((prev) => [...prev, ...files]);

    e.target.value = "";
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!canSend) return;

    const nextMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: text.trim(),
      files: pendingFiles,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, nextMessage]);
    setText("");
    setPendingFiles([]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-900">Media / Instructions</div>
      <div className="mt-1 text-xs text-slate-500">
        Upload images/videos, paste links, or type instructions (mock only)
      </div>

      <div className="mt-4 h-48 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {messages.length ? (
          <div className="grid gap-3">
            {messages.map((m) => (
              <div key={m.id} className="ml-auto grid max-w-[85%] gap-2 rounded-xl bg-slate-900 p-3 text-sm text-white">
                {m.text ? <div className="whitespace-pre-wrap">{m.text}</div> : null}
                {m.files?.length ? (
                  <div className="grid gap-1 text-xs text-slate-200">
                    {m.files.map((f) => (
                      <div key={`${m.id}-${f.name}`}>{f.name}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        ) : (
          <div className="text-sm text-slate-600">No messages yet.</div>
        )}
      </div>

      {pendingFiles.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {pendingFiles.map((f, idx) => (
            <button
              key={`${f.name}-${idx}`}
              type="button"
              onClick={() => setPendingFiles((prev) => prev.filter((_, i) => i !== idx))}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              title="Remove"
            >
              {f.name}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSend} className="mt-3 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={onPickFiles}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Upload
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a media link or type instructions…"
          className="h-11 w-full flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
        />

        <button
          type="submit"
          disabled={!canSend}
          className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white ${
            canSend ? "bg-slate-900 hover:bg-slate-800" : "cursor-not-allowed bg-slate-400"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
