import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

router.get("/messages", async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .populate("sender", "name avatar")
      .lean();

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch messages" });
  }
});

export default router;
