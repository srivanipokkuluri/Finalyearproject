import React, { useState, useRef, useEffect } from "react";

const ChatbotAI = () => {
  // Message structure: { id, type: 'user'|'bot', content, contentType: 'text'|'image'|'video'|'link'|'loading' }
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle media file selection and preview generation
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileType = file.type;
    if (
      fileType === "image/jpeg" ||
      fileType === "image/png" ||
      fileType === "video/mp4"
    ) {
      setMediaFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      // Add user message with media preview
      addMessage({
        type: "user",
        content: previewUrl,
        contentType: fileType.startsWith("image") ? "image" : "video",
      });
      setInputText("");
      e.target.value = null; // Reset input
    }
  };

  // Add a message to chat
  const addMessage = ({ type, content, contentType }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        content,
        contentType,
      },
    ]);
  };

  // Handle link or prompt input submission
  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // Simple URL detection (basic)
    const urlPattern = /^(https?:\/\/[^\s]+)/i;
    if (urlPattern.test(trimmed)) {
      addMessage({ type: "user", content: trimmed, contentType: "link" });
    } else {
      addMessage({ type: "user", content: trimmed, contentType: "text" });
    }
    setInputText("");
  };

  // Handle Generate button click
  const handleGenerate = () => {
    if (messages.length === 0) return;
    // Add bot loading message
    addMessage({ type: "bot", content: "Generating output...", contentType: "loading" });

    // Simulate AI processing with timeout
    setTimeout(() => {
      // Remove loading message
      setMessages((prev) => prev.filter((m) => m.contentType !== "loading"));

      // Add bot response with placeholder generated media (image or video)
      // For demo, we just echo last user media or text with a placeholder image
      const lastUserMsg = [...messages].reverse().find((m) => m.type === "user");
      if (!lastUserMsg) return;

      if (lastUserMsg.contentType === "image" || lastUserMsg.contentType === "video") {
        addMessage({
          type: "bot",
          content: lastUserMsg.content,
          contentType: lastUserMsg.contentType,
          isGenerated: true,
        });
      } else {
        // Text response placeholder
        addMessage({
          type: "bot",
          content: "Here is your generated output based on your prompt/link.",
          contentType: "text",
          isGenerated: true,
        });
      }
    }, 2500);
  };

  // Render chat bubble based on message type and contentType
  const renderMessage = (msg) => {
    const baseClasses =
      "max-w-xs md:max-w-md px-4 py-2 rounded-lg break-words whitespace-pre-wrap";
    if (msg.type === "user") {
      return (
        <div
          key={msg.id}
          className="self-end bg-blue-600 text-white rounded-br-none"
          style={{ maxWidth: "70%" }}
        >
          {renderContent(msg)}
        </div>
      );
    } else {
      return (
        <div
          key={msg.id}
          className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
          style={{ maxWidth: "70%" }}
        >
          {renderContent(msg)}
          {msg.isGenerated && msg.contentType !== "text" && (
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => downloadMedia(msg.content)}
              aria-label="Download generated media"
            >
              Download
            </button>
          )}
        </div>
      );
    }
  };

  // Render content inside chat bubble
  const renderContent = (msg) => {
    switch (msg.contentType) {
      case "image":
        return (
          <img
            src={msg.content}
            alt="uploaded"
            className="rounded max-h-48 w-auto"
            draggable={false}
          />
        );
      case "video":
        return (
          <video
            src={msg.content}
            controls
            className="rounded max-h-48 w-auto"
            draggable={false}
          />
        );
      case "link":
        return (
          <a
            href={msg.content}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-blue-400 break-all"
          >
            {msg.content}
          </a>
        );
      case "loading":
        return (
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>{msg.content}</span>
          </div>
        );
      default:
        return <span>{msg.content}</span>;
    }
  };

  // Download media helper
  const downloadMedia = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_media";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-grow flex flex-col justify-end max-w-3xl mx-auto p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            Start by uploading media, entering a link, or typing a prompt.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            {renderMessage(msg)}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar fixed at bottom */}
      <div className="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 fixed bottom-0 left-0 right-0 max-w-3xl mx-auto flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {/* Media upload button */}
          <label
            htmlFor="media-upload"
            className="cursor-pointer p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Upload image or video"
          >
            +
          </label>
          <input
            id="media-upload"
            type="file"
            accept="image/jpeg,image/png,video/mp4"
            className="hidden"
            onChange={handleMediaChange}
          />

          {/* Text input for link or prompt */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter link or prompt"
            className="flex-grow rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            aria-label="Input link or prompt"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Send input"
          >
            Send
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          aria-label="Generate output"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default ChatbotAI;

