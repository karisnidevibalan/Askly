import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import UploadPanel from "./components/UploadPanel";
import PreferencesPanel from "./components/PreferencesPanel";
import AvatarSelector from "./components/AvatarSelector";

export default function App() {
  const [mode, setMode] = useState("quick"); // quick | medium | deep
  const [language, setLanguage] = useState("English");
  const [style, setStyle] = useState("Classic"); // Vijay | Shinchan | Pokemon | Classic
  const [tts, setTts] = useState(true);
  const [summary, setSummary] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-pink-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
        {style === "Vijay" ? "⚡" : style === "Shinchan" ? "😜" : style === "Pokemon" ? "🧢" : "👩‍🎓"}{" "}
        StudyBuddy
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2">
          <ChatWindow
            mode={mode}
            language={language}
            style={style}
            tts={tts}
            injectedSummary={summary}
            onClearInjected={() => setSummary("")}
          />
        </div>

        {/* Side */}
        <div className="space-y-6">
          <UploadPanel
            mode={mode}
            onUpload={async (file, m) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("mode", m);

              const resp = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
              });
              const data = await resp.json();
              setSummary(data.summary || "No summary.");
            }}
          />

          <PreferencesPanel
            mode={mode}
            setMode={setMode}
            language={language}
            setLanguage={setLanguage}
            tts={tts}
            setTts={setTts}
          />

          <AvatarSelector style={style} setStyle={setStyle} />
        </div>
      </div>
    </div>
  );
}
