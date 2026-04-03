import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { GoogleGenAI } from "@google/genai";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

// Hold uploaded PDF in memory (max ~10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";
const MAX_TEXT_CHARS = 100_000;

function isRealQuotaError(error) {
  const status = error?.status ?? error?.code;
  const msg = String(
    error?.message || error?.error?.message || ""
  ).toLowerCase();

  // Only treat HTTP 429 *and* explicit quota wording as quota;
  // other 429s (e.g. invalid config) will be surfaced as normal errors.
  return (
    status === 429 &&
    (msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("exceeded your current quota") ||
      msg.includes("resource_exhausted"))
  );
}

async function localExtractiveSummary(buffer) {
  try {
    const data = await pdfParse(buffer);
    const raw = String(data.text || "").replace(/\s+/g, " ").trim();
    if (raw.length < 40) return null;

    const sentences = raw
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25);

    const chunks =
      sentences.length >= 3
        ? sentences
        : raw.split(/\n+/).map((s) => s.trim()).filter((s) => s.length > 25);

    if (chunks.length === 0) return null;

    const bullets = chunks.slice(0, 5).map((s) => {
      const line = s.length > 140 ? `${s.slice(0, 137)}…` : s;
      return `• ${line}`;
    });
    return bullets.join("\n");
  } catch {
    return null;
  }
}

async function generateWithOptionalRetry(ai, contents) {
  try {
    return await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });
  } catch (first) {
    if (!isRealQuotaError(first)) throw first;
    await new Promise((r) => setTimeout(r, 4000));
    return ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });
  }
}

router.post("/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "PDF file required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const buffer = req.file.buffer;

    let contents;

    // For large PDFs, extract text to keep tokens low.
    if (buffer.length > 5 * 1024 * 1024) {
      const data = await pdfParse(buffer);
      const raw = String(data.text || "").replace(/\s+/g, " ").trim();

      if (raw) {
        contents = [
          {
            text: `Summarize this document in 5 short bullet points:\n\n${raw.slice(
              0,
              MAX_TEXT_CHARS
            )}`,
          },
        ];
      } else {
        // No text (likely scanned) – fall back to PDF upload
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

    const response = await generateWithOptionalRetry(ai, contents);

    res.json({ summary: response.text });
  } catch (error) {
    console.error("Gemini summarize error:", {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });

    if (isRealQuotaError(error)) {
      const fallback = await localExtractiveSummary(req.file?.buffer);
      if (fallback) {
        return res.json({
          summary: fallback,
          fallback: true,
          notice:
            "Free-tier Gemini quota/rate limit reached — this summary is generated locally from the PDF text (no AI rewrite).",
        });
      }

      return res.status(429).json({
        error: "Gemini free-tier quota or rate limit reached.",
      });
    }

    // Surface real non-quota problems to help debugging new keys/accounts
    return res.status(500).json({
      error: "Failed to summarize with Gemini",
      status: error?.status ?? error?.code,
      message: error?.message || "Unknown Gemini error",
    });
  }
});

export default router;