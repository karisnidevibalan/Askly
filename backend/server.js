// server.js
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";

import { uploadMiddleware, processFile } from "./ingest.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PROVIDER = process.env.PROVIDER || "groq";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Chat route
// Chat route
app.post("/chat", async (req, res) => {
  const { message, mode, language } = req.body;

  try {
    let reply = "";

    // Build system prompt based on mode + language
    let systemPrompt = `You are StudyBuddy, a helpful tutor. Reply in ${language || "English"}.
Mode: ${mode || "detailed"} explanation.`;

    if (mode === "quick") {
      systemPrompt += " Give only important keywords or bullet points.";
    } else if (mode === "medium") {
      systemPrompt += " Give a medium-length explanation with examples or simple diagrams (text).";
    } else {
      systemPrompt += " Give a detailed explanation with clear step-by-step reasoning.";
    }

    if (PROVIDER === "openai") {
      const { OpenAI } = await import("openai");
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      reply = response.choices[0].message.content;
    } else if (PROVIDER === "groq") {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
          }),
        }
      );

      const data = await response.json();
      reply = data.choices[0].message.content;
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// Upload route
app.post("/upload", uploadMiddleware, processFile);

app.listen(5000, () => {
  console.log(`🚀 Backend running on http://localhost:5000`);
});
