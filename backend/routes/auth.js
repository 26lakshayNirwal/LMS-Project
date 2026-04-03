import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email, and password are required",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.status(201).json({ msg: "User registered" });

  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Register failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;