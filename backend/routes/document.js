import express from "express";
import multer from "multer";
import Document from "../models/Document.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const doc = await Document.create({
      title: req.body.title || req.file.originalname || "Untitled",
      fileUrl: req.file.path,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Document upload failed:", err);
    res.status(500).json({ error: "Failed to save document" });
  }
});

// Get all documents
router.get("/", async (req, res) => {
  const docs = await Document.find();
  res.json(docs);
});

export default router;