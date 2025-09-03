import React from "react";

export default function PreferencesPanel({ mode, setMode, language, setLanguage, tts, setTts }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Preferences</h2>

      <label className="block text-sm font-medium text-gray-700">Mode</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      >
        <option value="quick">Quick (keywords)</option>
        <option value="medium">Medium (bullets + ASCII)</option>
        <option value="deep">Deep (explain + example)</option>
      </select>

      <label className="block text-sm font-medium text-gray-700">Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded p-2 w-full mb-3"
      >
        <option>English</option>
        <option>Tamil</option>
        <option>Hindi</option>
        <option>Telugu</option>
        <option>Malayalam</option>
      </select>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={tts}
          onChange={(e) => setTts(e.target.checked)}
        />
        <span>🔊 Read answers aloud</span>
      </label>
    </div>
  );
}
