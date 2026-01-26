import React, { useEffect, useMemo, useRef, useState } from "react";

function isProbablyUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"]; 
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function buildId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function downloadFromUrl(url, filename = "generated_output") {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function Bubble({ side, children }) {
  const base =
    "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm";
  const user =
    "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-br-md";
  const bot =
    "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-md border border-zinc-200/70 dark:border-zinc-700/70";

  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div className={`${base} ${side === "right" ? user : bot}`}>{children}</div>
    </div>
  );
}

function IconButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

export default function ChatbotAI() {
  // Message types: text | link | media | status | output
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("ai-ui-theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("ai-ui-theme", theme);
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const canGenerate = useMemo(() => messages.some((m) => m.role === "user"), [messages]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { id: buildId(), createdAt: Date.now(), ...message }]);
  };

  const onPickFile = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isVideo = file.type === "video/mp4";

    if (!isImage && !isVideo) {
      addMessage({
        role: "bot",
        type: "status",
        text: "Only JPG, PNG, and MP4 are supported.",
      });
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);

    addMessage({
      role: "user",
      type: "media",
      media: {
        url,
        kind: isImage ? "image" : "video",
        name: file.name,
        sizeLabel: formatBytes(file.size),
      },
    });

    // Reset input so the same file can be selected again later.
    e.target.value = "";
  };

  const onSend = () => {
    const value = input.trim();
    if (!value) return;

    if (isProbablyUrl(value)) {
      addMessage({ role: "user", type: "link", url: value });
    } else {
      addMessage({ role: "user", type: "text", text: value });
    }

    setInput("");
  };

  const onGenerate = () => {
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    addMessage({ role: "bot", type: "status", text: "Generating output…" });

    // Placeholder AI processing.
    window.setTimeout(() => {
      setIsGenerating(false);

      const lastMedia = [...messages].reverse().find((m) => m.type === "media");

      if (lastMedia?.media) {
        addMessage({
          role: "bot",
          type: "output",
          output: {
            kind: lastMedia.media.kind,
            url: lastMedia.media.url,
            filename: `generated-${lastMedia.media.kind === "image" ? "image" : "video"}`,
          },
        });
        return;
      }

      addMessage({
        role: "bot",
        type: "output",
        output: {
          kind: "text",
          text: "(Placeholder) Generated output will appear here.",
        },
      });
    }, 1800);
  };

  return (
    <div className="h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200/70 bg-zinc-50/80 px-4 py-3 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">AI Media Generator</div>
            <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              Minimal chatbot UI (upload, link, prompt, generate)
            </div>
          </div>

          <IconButton
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            label="Toggle theme"
          >
            <span className="text-sm">{theme === "dark" ? "Light" : "Dark"}</span>
          </IconButton>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="mt-24 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Upload media, paste a link, or type a prompt to start.
              </div>
            ) : null}

            {messages.map((m) => {
              const side = m.role === "user" ? "right" : "left";

              if (m.type === "text") {
                return (
                  <Bubble key={m.id} side={side}>
                    {m.text}
                  </Bubble>
                );
              }

              if (m.type === "link") {
                return (
                  <Bubble key={m.id} side={side}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all underline underline-offset-2"
                    >
                      {m.url}
                    </a>
                  </Bubble>
                );
              }

              if (m.type === "status") {
                return (
                  <Bubble key={m.id} side={side}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">{m.text}</div>
                      {isGenerating ? <LoadingDots /> : null}
                    </div>
                  </Bubble>
                );
              }

              if (m.type === "media" && m.media) {
                return (
                  <Bubble key={m.id} side={side}>
                    <div className="space-y-2">
                      <div className="text-xs opacity-80">
                        {m.media.name}
                        {m.media.sizeLabel ? ` • ${m.media.sizeLabel}` : ""}
                      </div>
                      {m.media.kind === "image" ? (
                        <img
                          src={m.media.url}
                          alt={m.media.name}
                          className="max-h-64 w-auto rounded-xl"
                          draggable={false}
                        />
                      ) : (
                        <video
                          src={m.media.url}
                          controls
                          className="max-h-64 w-auto rounded-xl"
                        />
                      )}
                    </div>
                  </Bubble>
                );
              }

              if (m.type === "output" && m.output) {
                return (
                  <Bubble key={m.id} side={side}>
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Output
                      </div>

                      {m.output.kind === "image" ? (
                        <img
                          src={m.output.url}
                          alt="Generated"
                          className="max-h-64 w-auto rounded-xl"
                          draggable={false}
                        />
                      ) : null}

                      {m.output.kind === "video" ? (
                        <video src={m.output.url} controls className="max-h-64 w-auto rounded-xl" />
                      ) : null}

                      {m.output.kind === "text" ? (
                        <div className="text-sm">{m.output.text}</div>
                      ) : null}

                      {m.output.kind !== "text" ? (
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 active:bg-zinc-900/90 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                          onClick={() => downloadFromUrl(m.output.url, m.output.filename)}
                        >
                          Download
                        </button>
                      ) : null}
                    </div>
                  </Bubble>
                );
              }

              return null;
            })}

            <div ref={endRef} />
          </div>
        </div>

        {/* Input */}
        <div className="sticky bottom-0 border-t border-zinc-200/70 bg-zinc-50/80 px-4 py-3 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/70">
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,video/mp4"
                className="hidden"
                onChange={onFileChange}
              />

              <IconButton onClick={onPickFile} label="Upload image/video">
                <span className="text-lg leading-none">+</span>
              </IconButton>

              <div className="flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder="Paste a link or type a prompt…"
                  className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600"
                />
              </div>

              <button
                type="button"
                onClick={onSend}
                className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 active:bg-zinc-900/90 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Send
              </button>
            </div>

            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate || isGenerating}
              className="h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
