import express from "express";
import { runAssistant } from "../services/aiService.js";
import { getTasks, getFeed } from "../services/firebaseService.js";

const router = express.Router();

// POST /assistant — handle user commands
router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const uid = userId || "anonymous";
    const [tasks, feed] = await Promise.all([getTasks(uid), getFeed(uid)]);

    const result = await runAssistant(message, { tasks, feed, userId: uid });
    res.json(result);
  } catch (err) {
    console.error("Assistant error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
