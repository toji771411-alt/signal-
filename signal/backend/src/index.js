import "./env.js";
import express from "express";
import cors from "cors";
import messagesRouter from "./routes/messages.js";
import tasksRouter from "./routes/tasks.js";
import briefingRouter from "./routes/briefing.js";
import assistantRouter from "./routes/assistant.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SIGNAL API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/messages", messagesRouter);
app.use("/tasks", tasksRouter);
app.use("/briefing", briefingRouter);
app.use("/assistant", assistantRouter);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log('🚀 unibox API running on http://localhost:3001');
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   AI Mode: ${process.env.OPENAI_API_KEY ? "OpenAI" : "Mock"}\n`);
});

export default app;
