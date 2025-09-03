import React, { useEffect, useRef, useState } from "react";

export default function ChatWindow({ mode, language, style, tts, injectedSummary, onClearInjected }) {
  const [messages, setMessages] = useState([
    { role: "bot", content: "👋 Hi! Ask me anything about your studies." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Inject upload summary into chat
  useEffect(() => {
    if (injectedSummary) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `📄 Summary:\n${injectedSummary}` },
      ]);
      onClearInjected && onClearInjected();
    }
  }, [injectedSummary, onClearInjected]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔊 Centralized TTS function
  const speak = (text) => {
    try {
      if (!tts) return;

      const utter = new SpeechSynthesisUtterance(text);

      // Map language -> voice
      const langMap = {
        English: "en-US",
        Tamil: "ta-IN",
        Hindi: "hi-IN",
        Telugu: "te-IN",
        Malayalam: "ml-IN",
      };

      utter.lang = langMap[language] || "en-US";
      utter.rate = 1;   // speaking speed
      utter.pitch = 1;  // normal pitch

      speechSynthesis.cancel(); // stop any ongoing speech
      speechSynthesis.speak(utter);
    } catch (err) {
      console.warn("TTS not supported:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, language, style, mode }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const botMsg = data.reply || "❌ No reply received.";

      setMessages((prev) => [...prev, { role: "bot", content: botMsg }]);
      speak(botMsg);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Persona bubble accent
  const accent =
    style === "Vijay"
      ? "border-purple-400"
      : style === "Shinchan"
      ? "border-pink-400"
      : style === "Pokemon"
      ? "border-yellow-400"
      : "border-blue-300";

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 h-[600px] flex flex-col border ${accent}`}
    >
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] whitespace-pre-wrap break-words p-2 rounded ${
              msg.role === "user"
                ? "bg-purple-200 text-purple-900 ml-auto"
                : "bg-gray-100 text-gray-900 mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking…</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          className="flex-1 border rounded p-2 resize-none"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question… (Enter to send)"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
