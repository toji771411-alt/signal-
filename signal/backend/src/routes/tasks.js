import express from "express";
import { extractTasks } from "../services/aiService.js";
import { saveTasks, getTasks, updateTask } from "../services/firebaseService.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET /tasks — get all tasks for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || "anonymous";
    const tasks = await getTasks(userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks — create a task manually
router.post("/", async (req, res) => {
  try {
    const { task, deadline, priority, sourceMessage, userId } = req.body;
    const newTask = {
      id: uuidv4(),
      task,
      deadline: deadline || "No deadline",
      priority: priority || "medium",
      sourceMessage: sourceMessage || null,
      done: false,
      userId: userId || "anonymous",
      createdAt: new Date().toISOString(),
    };
    await saveTasks([newTask]);
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tasks/:id — update task (e.g., mark done)
router.patch("/:id", async (req, res) => {
  try {
    await updateTask(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks/extract — extract tasks from a message
router.post("/extract", async (req, res) => {
  try {
    const message = req.body;
    if (!message || !message.body) {
      return res.status(400).json({ error: "Message body is required" });
    }

    const extracted = await extractTasks(message);
    const userId = message.userId || "anonymous";

    const tasks = extracted.map((t) => ({
      id: uuidv4(),
      task: t.task,
      deadline: t.deadline || "No deadline",
      priority: t.priority || "medium",
      sourceMessage: {
        id: message.id,
        senderName: message.senderName,
        platform: message.platform,
        subject: message.subject,
      },
      done: false,
      userId,
      createdAt: new Date().toISOString(),
    }));

    if (tasks.length > 0) {
      await saveTasks(tasks);
    }

    res.json(tasks);
  } catch (err) {
    console.error("Error extracting tasks:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
