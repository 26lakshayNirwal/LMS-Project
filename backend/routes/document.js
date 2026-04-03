import express from "express";
import multer from "multer";
import Document from "../models/Document.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  const doc = await Document.create({
    title: req.body.title,
    fileUrl: req.file.path
  });

  res.json(doc);
});

// Get all documents
router.get("/", async (req, res) => {
  const docs = await Document.find();
  res.json(docs);
});

export default router;