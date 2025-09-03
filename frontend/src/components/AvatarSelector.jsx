import React from "react";

const styles = [
  { key: "Classic", icon: "👩‍🎓", desc: "Neutral academic vibe" },
  { key: "Vijay", icon: "⚡", desc: "Motivational, confident tone" },
  { key: "Shinchan", icon: "😜", desc: "Playful but respectful" },
  { key: "Pokemon", icon: "🧢", desc: "Adventurous trainer vibe" },
];

export default function AvatarSelector({ style, setStyle }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Visual Persona</h2>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((s) => (
          <button
            key={s.key}
            onClick={() => setStyle(s.key)}
            className={`border rounded p-2 text-left hover:bg-gray-50 ${
              style === s.key ? "border-purple-500" : "border-gray-200"
            }`}
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="font-semibold">{s.key}</div>
            <div className="text-xs text-gray-500">{s.desc}</div>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-gray-500 mt-2">
        Uses only tone & emoji—no copyrighted images.
      </p>
    </div>
  );
}
