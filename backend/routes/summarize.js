import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { GoogleGenAI } from "@google/genai";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const buffer = req.file.buffer;

    // Extract text (for large PDFs)
    let text = "";
    if (buffer.length > 5 * 1024 * 1024) {
      const data = await pdfParse(buffer);
      text = data.text.slice(0, 100000);
    }

    let contents;

    if (text) {
      contents = [
        {
          text: `Summarize this document in 5 short bullet points:\n${text}`,
        },
      ];
    } else {
      contents = [
        { text: "Summarize this document in 5 short bullet points." },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: buffer.toString("base64"),
          },
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });

    res.json({ summary: response.text });

  } catch (error) {
    console.error(error);


    if (error.status === 429) {
      return res.json({
        summary: "AI quota exceeded. Please try again later.",
      });
    }

    res.status(500).json({ error: "Failed to summarize" });
  }
});

export default router;