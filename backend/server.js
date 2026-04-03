import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import documentRoutes from "./routes/document.js";
import summarizeRoutes from "./routes/summarize.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api", summarizeRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));