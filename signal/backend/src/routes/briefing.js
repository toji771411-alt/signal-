import express from "express";
import { getTasks, getFeed } from "../services/dbService.js";
import OpenAI from "openai";

const router = express.Router();
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function mockBriefing(tasks, feed) {
  const urgent = feed.filter((m) => m.classification === "urgent");
  const pending = feed.filter((m) => m.classification === "pending");
  const highTasks = tasks.filter((t) => t.priority === "high" && !t.done);
  const medTasks = tasks.filter((t) => t.priority === "medium" && !t.done);

  const lines = [];

  lines.push(`Good morning! Here's your SIGNAL briefing for today.`);
  lines.push("");

  if (highTasks.length > 0) {
    lines.push(`🔴 **${highTasks.length} urgent task${highTasks.length > 1 ? "s" : ""} need your attention:**`);
    highTasks.slice(0, 3).forEach((t) => {
      lines.push(`   • ${t.task}${t.deadline !== "No deadline" ? ` — due ${t.deadline}` : ""}`);
    });
    lines.push("");
  }

  if (urgent.length > 0) {
    lines.push(`📬 **${urgent.length} urgent message${urgent.length > 1 ? "s" : ""} in your inbox:**`);
    urgent.slice(0, 2).forEach((m) => {
      lines.push(`   • ${m.senderName}: ${m.summary}`);
    });
    lines.push("");
  }

  if (pending.length > 0) {
    lines.push(`🟡 **${pending.length} message${pending.length > 1 ? "s" : ""} waiting for your reply.**`);
    lines.push("");
  }

  if (medTasks.length > 0) {
    lines.push(`📋 You also have ${medTasks.length} medium-priority task${medTasks.length > 1 ? "s" : ""} this week.`);
    lines.push("");
  }

  if (highTasks.length === 0 && urgent.length === 0) {
    lines.push("✅ **Nothing critical today.** Focus on pending reviews and follow-ups.");
    lines.push("");
  }

  const mostUrgent = urgent[0] || (highTasks.length > 0 ? null : null);
  if (urgent[0]) {
    lines.push(`💡 **Top priority:** ${urgent[0].senderName} needs your immediate attention.`);
  } else if (highTasks[0]) {
    lines.push(`💡 **Start with:** "${highTasks[0].task}"`);
  }

  return lines.join("\n");
}

// POST /briefing
router.post("/", async (req, res) => {
  try {
    const userId = req.body.userId || "anonymous";
    const [tasks, feed] = await Promise.all([getTasks(userId), getFeed(userId)]);

    if (openai) {
      try {
        const urgentItems = feed.filter((m) => m.classification === "urgent").slice(0, 5);
        const topTasks = tasks.filter((t) => !t.done).slice(0, 5);

        const prompt = `You are SIGNAL, an AI communication assistant. Generate a concise, motivating morning briefing (max 150 words) based on this data:

Urgent Messages: ${JSON.stringify(urgentItems.map((m) => ({ sender: m.senderName, summary: m.summary })))}
Top Tasks: ${JSON.stringify(topTasks.map((t) => ({ task: t.task, priority: t.priority, deadline: t.deadline })))}

Be specific, actionable, and use a professional but human tone. Use bullet points for tasks.`;

        const result = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 250,
          temperature: 0.7,
        });

        return res.json({ briefing: result.choices[0].message.content, generatedAt: new Date().toISOString() });
      } catch (e) {
        console.warn("OpenAI failed, using mock briefing:", e.message);
      }
    }

    const briefing = mockBriefing(tasks, feed);
    res.json({ briefing, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Briefing error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
