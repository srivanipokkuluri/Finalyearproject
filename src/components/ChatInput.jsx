import React, { useEffect, useRef, useState } from "react";
import { OPENAI_API_KEY, OPENAI_CONFIG } from "../config/openai";

export default function ChatInput() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      text: "Hi! I'm your AI design assistant. I can help you with template ideas, color suggestions, layout tips, and creative inspiration. What would you like to create today?",
      createdAt: Date.now(),
      isUser: false,
    }
  ]);
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const callGPT = async (userMessage) => {
    try {
      // Generate unique session and request identifiers
      const sessionId = Math.random().toString(36).substring(2, 15);
      const requestId = Math.random().toString(36).substring(2, 15);
      const timestamp = new Date().toISOString();
      
      // Create dynamic context to prevent repetition
      const dynamicContext = `
Session: ${sessionId}
Request: ${requestId}
Time: ${timestamp}
User message count: ${messages.length + 1}
Previous topics: ${messages.slice(-3).map(m => m.text.substring(0, 30)).join(', ')}
      `.trim();

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: `${OPENAI_CONFIG.systemPrompt}\n\n${dynamicContext}\n\nCRITICAL: This is request #${messages.length + 1}. Your response must be completely different from any previous response. Use different vocabulary, structure, and examples.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: OPENAI_CONFIG.maxTokens,
          temperature: 1.0,
          top_p: 1.0,
          frequency_penalty: 1.0,
          presence_penalty: 1.0,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Log for debugging
      console.log('Request ID:', requestId, 'Response length:', aiResponse.length);
      
      return aiResponse;
    } catch (error) {
      console.error('GPT API Error:', error);
      
      // Dynamic fallback responses
      const fallbackResponses = [
        "Let me help you create something amazing! What specific aspect of template design interests you most?",
        "I'd love to suggest some creative ideas! Are you thinking about colors, layouts, or something else?",
        "Design inspiration is my specialty! What kind of template are you working on?",
        "Let's brainstorm some design possibilities! What's your vision for this template?",
      ];
      
      const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return "Hi... " + randomFallback;
      } else if (error.message.includes('invalid')) {
        return "API configuration issue detected. " + randomFallback;
      } else {
        return randomFallback;
      }
    }
  };

  const onSend = async (e) => {
    e.preventDefault();
    if (!canSend || isLoading) return;

    const userMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: text.trim(),
      files: pendingFiles,
      createdAt: Date.now(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setPendingFiles([]);
    setIsLoading(true);

    // Add loading indicator
    const loadingId = `loading-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: loadingId,
      text: "Thinking...",
      createdAt: Date.now(),
      isUser: false,
      isLoading: true,
    }]);

    try {
      const response = await callGPT(userMessage.text);
      
      // Remove loading message and add AI response
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [...filtered, {
          id: `ai-${Date.now()}`,
          text: response,
          createdAt: Date.now(),
          isUser: false,
        }];
      });
    } catch (error) {
      // Remove loading message and add error response
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingId);
        return [...filtered, {
          id: `error-${Date.now()}`,
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          createdAt: Date.now(),
          isUser: false,
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold text-slate-900">AI Assistant</div>
      <div className="mt-1 text-xs text-slate-500">
        Ask me about templates, design ideas, or how to use the editor
      </div>

      <div className="mt-4 h-48 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {messages.length ? (
          <div className="grid gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`grid max-w-[85%] gap-2 rounded-xl p-3 text-sm ${
                  m.isUser
                    ? "ml-auto bg-slate-900 text-white"
                    : m.isLoading
                    ? "mr-auto bg-slate-200 text-slate-600 animate-pulse"
                    : "mr-auto bg-white border border-slate-200 text-slate-900"
                }`}
              >
                {m.text ? <div className="whitespace-pre-wrap">{m.text}</div> : null}
                {m.files?.length ? (
                  <div className={`grid gap-1 text-xs ${
                    m.isUser ? "text-slate-200" : "text-slate-600"
                  }`}>
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
          <div className="text-sm text-slate-600">Start a conversation about template design!</div>
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
          placeholder="Ask me about templates, design tips, or editor features…"
          className="h-11 w-full flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
        />

        <button
          type="submit"
          disabled={!canSend || isLoading}
          className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white ${
            canSend && !isLoading
              ? "bg-slate-900 hover:bg-slate-800"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Sending...
            </div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
