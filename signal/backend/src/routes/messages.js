import express from "express";
import { classifyMessage, extractTasks, generateDrafts } from "../services/aiService.js";
import { saveFeedItem, getFeed } from "../services/firebaseService.js";
import { mockMessages } from "../data/mockMessages.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// POST /messages/drafts — generate reply drafts for a message
router.post("/drafts", async (req, res) => {
  try {
    const message = req.body;
    if (!message || !message.body) {
      return res.status(400).json({ error: "Message body is required" });
    }
    const drafts = await generateDrafts(message);
    res.json(drafts);
  } catch (err) {
    console.error("Error generating drafts:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /messages/analyze — analyze a single message
router.post("/analyze", async (req, res) => {
  try {
    const message = req.body;
    if (!message || !message.body) {
      return res.status(400).json({ error: "Message body is required" });
    }

    const result = await classifyMessage(message);
    const tasks = await extractTasks(message);

    const feedItem = {
      id: message.id || uuidv4(),
      ...message,
      ...result,
      tasks,
      userId: req.body.userId || "anonymous",
      analyzedAt: new Date().toISOString(),
    };

    await saveFeedItem(feedItem);
    res.json(feedItem);
  } catch (err) {
    console.error("Error analyzing message:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /messages/analyze-all — analyze all mock messages and return feed
router.post("/analyze-all", async (req, res) => {
  try {
    const userId = req.body.userId || "anonymous";
    const results = [];

    for (const msg of mockMessages) {
      const result = await classifyMessage(msg);
      const tasks = await extractTasks(msg);
      const feedItem = {
        ...msg,
        ...result,
        tasks,
        userId,
        analyzedAt: new Date().toISOString(),
      };
      await saveFeedItem(feedItem);
      results.push(feedItem);
    }

    // Sort by priorityScore descending
    results.sort((a, b) => b.priorityScore - a.priorityScore);
    res.json(results);
  } catch (err) {
    console.error("Error analyzing all messages:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /messages/feed — get existing feed
router.get("/feed", async (req, res) => {
  try {
    const userId = req.query.userId || "anonymous";
    const feed = await getFeed(userId);
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /messages/mock — raw mock messages (no AI)
router.get("/mock", (req, res) => {
  res.json(mockMessages);
});

export default router;
