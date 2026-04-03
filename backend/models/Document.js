import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: String,
  fileUrl: String
});

export default mongoose.model("Document", documentSchema);