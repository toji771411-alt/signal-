import OpenAI from "openai";

const XAI_API_KEY = process.env.XAI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const isRealKey = (key) => key && key.trim() !== "" && !key.includes("-your-key") && !key.includes("-openai-key");

console.log(`🤖 AI Service logic start: GROQ_KEY length: ${GROQ_API_KEY?.length || 0}`);

// Initialize client based on available keys (Groq preferred for speed)
const aiClient = isRealKey(GROQ_API_KEY)
  ? new OpenAI({ apiKey: GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" })
  : isRealKey(XAI_API_KEY)
    ? new OpenAI({ apiKey: XAI_API_KEY, baseURL: "https://api.x.ai/v1" })
    : isRealKey(OPENAI_API_KEY)
      ? new OpenAI({ apiKey: OPENAI_API_KEY })
      : null;

const AI_MODEL = isRealKey(GROQ_API_KEY) 
  ? "llama-3.3-70b-versatile" 
  : isRealKey(XAI_API_KEY) 
    ? "grok-beta" 
    : "gpt-3.5-turbo";

console.log(`🤖 AI Service initialized using ${aiClient ? (isRealKey(GROQ_API_KEY) ? 'Groq (Llama3)' : 'Other') : 'Mock Mode'}`);

// ─── Keyword-based Mock AI Triage ───────────────────────────────────────────

const URGENT_KEYWORDS = [
  "urgent", "asap", "immediately", "critical", "deadline", "today", "emergency",
  "right now", "action required", "by eod", "end of day", "board", "investor",
  "signature", "sign", "production", "outage", "failed", "downtime", "CEO"
];

const PENDING_KEYWORDS = [
  "review", "feedback", "follow up", "let me know", "please respond",
  "when you get a chance", "this week", "by friday", "by monday", "schedule",
  "meeting", "availability", "proposal", "wireframes", "mockups"
];

const NOISE_KEYWORDS = [
  "newsletter", "unsubscribe", "promotional", "offer", "sale", "jobs",
  "linkedin", "new features", "announcement", "marketing", "digest"
];

const RELATIONSHIP_WEIGHTS = {
  "Vikram Nair (CEO)": { base: 40, frequency: "high", speed: "instant", workHoursOnly: false },
  "Rahul Sharma": { base: 30, frequency: "high", speed: "fast", workHoursOnly: true },
  "Amit (Family)": { base: 35, frequency: "medium", speed: "fast", workHoursOnly: false },
  "Priya Mehta": { base: 20, frequency: "medium", speed: "medium", workHoursOnly: true },
  "GitHub Bot": { base: -20, frequency: "high", speed: "n/a", workHoursOnly: false },
};

function getRelationshipBonus(message) {
  const rel = RELATIONSHIP_WEIGHTS[message.senderName] || { base: 0, frequency: "low", speed: "slow", workHoursOnly: true };
  let bonus = rel.base;

  // factor 1: Time of Day (Work hours vs Late night)
  const hour = new Date(message.timestamp).getHours();
  const isWorkHour = hour >= 9 && hour <= 18;
  
  if (!isWorkHour && !rel.workHoursOnly) {
    bonus += 15; // Extra weight for close personal contacts messaging late
  } else if (!isWorkHour && rel.workHoursOnly) {
    bonus -= 10; // Lower priority for work stuff late at night unless critical
  }

  // factor 2: Channel used (Assuming group channels have '#' in subject)
  const isDM = !message.subject || !message.subject.includes("#");
  if (isDM) bonus += 10;

  return bonus;
}

function mockClassify(message) {
  const text = `${message.subject || ""} ${message.body} ${message.senderName}`.toLowerCase();

  const urgentScore = URGENT_KEYWORDS.filter((k) => text.includes(k)).length;
  const pendingScore = PENDING_KEYWORDS.filter((k) => text.includes(k)).length;
  const noiseScore = NOISE_KEYWORDS.filter((k) => text.includes(k)).length;

  let classification = "low_priority";
  let priorityScore = 30;

  // Add Relationship Intelligence Bonus
  priorityScore += getRelationshipBonus(message);

  if (noiseScore >= 2) {
    classification = "low_priority";
    priorityScore = Math.min(priorityScore, 20); 
  } else if (urgentScore >= 2 || priorityScore > 85) {
    classification = "urgent";
    priorityScore = Math.max(priorityScore, 90);
  } else if (pendingScore >= 1 || priorityScore > 50) {
    classification = "needs_attention";
    priorityScore = Math.max(priorityScore, 65);
  }

  const summary = mockSummarize(message, classification);

  return { classification, summary, priorityScore: Math.min(priorityScore, 100) };
}

function mockSummarize(message, classification) {
  const body = message.body.slice(0, 200);
  const sender = message.senderName;

  if (classification === "urgent") {
    return `${sender} needs immediate attention — ${body.split(".")[0].toLowerCase()}.`;
  } else if (classification === "needs_attention") {
    return `${sender} is waiting on your response about ${(message.subject || body.split(".")[0]).toLowerCase()}.`;
  } else if (classification === "low_priority") {
    return `Update from ${sender}: ${body.split(".")[0].toLowerCase()}.`;
  }
  return `${sender} shared an update.`;
}

// ─── Task Extraction (Mock) ──────────────────────────────────────────────────

const TASK_PATTERNS = [
  { pattern: /(?:send|email|mail) (?:me |us )?(?:the )?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Send" },
  { pattern: /(?:review|check|look at)\s+(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Review" },
  { pattern: /(?:respond|reply|get back)\s+(?:to )?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Respond" },
  { pattern: /(?:schedule|book|setup)\s+(?:a\s+)?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Schedule" },
  { pattern: /(?:sign|approve|e-sign)\s+(?:the\s+)?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Sign" },
  { pattern: /(?:fix|debug|resolve)\s+(?:the\s+)?(.+?)(?:\s+before\s+(.+?))?$/i, verb: "Fix" },
  { pattern: /(?:update|change|modify)\s+(?:your\s+)?(.+?)(?:\s+before\s+(.+?))?$/i, verb: "Update" },
  { pattern: /(?:submit|turn in|finish)\s+(?:the\s+)?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Submit" },
  { pattern: /(?:pay|transfer|remit)\s+(?:the\s+)?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Pay" },
  { pattern: /(?:call|phone|ring)\s+(?:up\s+)?(.+?)(?:\s+by\s+(.+?))?$/i, verb: "Call" },
];

const DEADLINE_PATTERNS = [
  /by\s+(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
  /by\s+(end of day|eod|3 pm|5 pm|morning|noon)/i,
  /before\s+(the meeting|3 pm|5 pm|tomorrow)/i,
  /(today|tomorrow|this friday|next monday|friday|monday)/i,
];

function extractDeadline(text) {
  for (const pattern of DEADLINE_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function mockExtractTasks(message) {
  const tasks = [];
  const body = message.body;
  const sentences = body.split(/[.!?]/);

  for (const sentence of sentences) {
    for (const { pattern, verb } of TASK_PATTERNS) {
      const match = sentence.match(pattern);
      if (match) {
        const taskTitle = `${verb} ${(match[1] || "").trim()}`.slice(0, 80);
        const deadline = match[2] || extractDeadline(sentence) || extractDeadline(body);
        const priority = ["urgent", "critical", "asap", "today", "deadline"].some((k) =>
          sentence.toLowerCase().includes(k)
        )
          ? "high"
          : "medium";

        if (taskTitle.length > 5) {
          tasks.push({
            task: taskTitle,
            deadline: deadline || "No deadline",
            priority,
            sourceMessage: {
              senderName: message.senderName,
              platform: message.platform
            }
          });
        }
        break;
      }
    }
  }

  return tasks;
}

// ─── OpenAI Wrappers ─────────────────────────────────────────────────────────

async function openaiClassify(message) {
  const prompt = `You are an AI assistant that classifies messages for a communication OS.

Analyze this message and return a JSON object with:
- classification: "urgent" | "needs_attention" | "low_priority"
- summary: one-line summary (max 100 chars)
- priorityScore: number 0-100

Message:
Sender: ${message.senderName}
Subject: ${message.subject || "N/A"}
Body: ${message.body}

Return ONLY valid JSON, no markdown.`;

  if (!aiClient) return mockClassify(message);

  const res = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.3,
  });

  return JSON.parse(res.choices[0].message.content);
}

async function openaiExtractTasks(message) {
  const prompt = `Extract actionable tasks from this message. Return a JSON array of tasks.
Each task: { task: string, deadline: string|null, priority: "high"|"medium"|"low" }

Message:
Sender: ${message.senderName}
Body: ${message.body}

Return ONLY valid JSON array.`;

  if (!aiClient) return [];

  const res = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.2,
  });

  return JSON.parse(res.choices[0].message.content);
}

async function openaiAssistant(userMessage, context) {
  const prompt = `You are unibox, an AI communication assistant. You have full rights to modify the user's workspace.
Based on the User Message and the Context, return a JSON object with:
1. response: A helpful, concise text response.
2. actions: An array of action objects to execute.

Available Action Types:
- { type: "COMPLETE_TASK", taskId: string } — Mark a task as finished.
- { type: "LOW_PRIORITY", messageId: string } — Move a message to Low Priority.
- { type: "MARK_ATTENTION", messageId: string } — Move a message to Needs Attention.
- { type: "GENERATE_DRAFTS", messageId: string } — Open drafts for a specific message.

Context: ${JSON.stringify(context)}
User Message: "${userMessage}"

Return ONLY valid JSON. No markdown.`;

  if (!aiClient) return { response: "I am running in mock mode.", actions: [] };

  const res = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "system", content: "You are a powerful AI agent that helps users manage tasks and messages. You return JSON only." }, { role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.2, // Lower temperature for more reliable JSON and action detection
  });

  try {
    const raw = res.choices[0].message.content;
    // Strip markdown if AI added it
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error("Failed to parse assistant JSON:", e, res.choices[0].message.content);
    return { response: res.choices[0].message.content, actions: [] };
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function classifyMessage(message) {
  if (aiClient) {
    try {
      return await openaiClassify(message);
    } catch (e) {
      console.warn("AI Client failed, using mock:", e.message);
    }
  }
  return mockClassify(message);
}

export async function extractTasks(message) {
  if (aiClient) {
    try {
      return await openaiExtractTasks(message);
    } catch (e) {
      console.warn("AI Client failed, using mock:", e.message);
    }
  }
  return mockExtractTasks(message);
}

export function mockAssistantResponse(userMessage, tasks = [], feed = []) {
  const msg = userMessage.toLowerCase();

  // Agentic Actions Detection (Mock Mode)
  if (msg.includes("move") || msg.includes("set") || msg.includes("change") || msg.includes("classification") || msg.includes("ove")) {
    const isLow = msg.includes("low") || msg.includes("noise") || msg.includes("ignore");
    const isAttention = msg.includes("attention") || msg.includes("needs") || msg.includes("important");
    
    // Find a candidate message (e.g. from Gmail as the user requested)
    const platform = msg.includes("gmail") ? "Gmail" : msg.includes("slack") ? "Slack" : null;
    const candidate = feed.find(m => (!platform || m.platform === platform) && 
      (isLow ? m.classification !== "low_priority" : isAttention ? m.classification !== "needs_attention" : true));

    if (candidate) {
      const target = isLow ? "low_priority" : "needs_attention";
      return {
        response: `Of course. I've moved the message from **${candidate.senderName}** (${candidate.platform}) to **${target.replace('_', ' ')}** as requested.`,
        actions: [{ type: isLow ? "LOW_PRIORITY" : "MARK_ATTENTION", messageId: candidate.id }]
      };
    }
  }

  if (msg.includes("complete") || msg.includes("finish") || msg.includes("done") || msg.includes("check off")) {
    const candidateTask = tasks.find(t => !t.done);
    if (candidateTask) {
      return {
        response: `Certainly. I've marked the task **"${candidateTask.task}"** as complete.`,
        actions: [{ type: "COMPLETE_TASK", taskId: candidateTask.id }]
      };
    }
  }

  const urgentTasks = tasks.filter((t) => t.priority === "high");
  const urgentMessages = feed.filter((m) => m.classification === "urgent");

  if (msg.includes("today") || msg.includes("should i do") || msg.includes("what to do")) {
    if (urgentTasks.length > 0) {
      return {
        response: `You have **${urgentTasks.length} high-priority task${urgentTasks.length > 1 ? "s" : ""}** today:\n\n${urgentTasks
          .slice(0, 3)
          .map((t) => `• **${t.task}** — ${t.deadline}`)
          .join("\n")}\n\nFocus on these before anything else.`,
        actions: [],
      };
    }
    return {
      response: "Your day looks manageable! No urgent tasks right now. Check your pending items and follow up on any open reviews.",
      actions: [],
    };
  }

  if (msg.includes("urgent") || msg.includes("critical") || msg.includes("important")) {
    if (urgentMessages.length > 0) {
      return {
        response: `You have **${urgentMessages.length} urgent message${urgentMessages.length > 1 ? "s" : ""}**:\n\n${urgentMessages
          .slice(0, 3)
          .map((m) => `• **${m.senderName}**: ${m.summary}`)
          .join("\n")}`,
        actions: [{ label: "Go to Feed", href: "/feed" }],
      };
    }
    return { response: "No urgent messages right now. You're all caught up! 🎉", actions: [] };
  }

  if (msg.includes("task") || msg.includes("todo") || msg.includes("to-do")) {
    if (tasks.length > 0) {
      return {
        response: `You have **${tasks.length} tasks** in your list:\n\n${tasks
          .slice(0, 4)
          .map((t) => `• ${t.task} (${t.priority})`)
          .join("\n")}`,
        actions: [{ label: "View All Tasks", href: "/tasks" }],
      };
    }
    return { response: "No tasks extracted yet. Go to your feed and let unibox analyze your messages.", actions: [{ label: "Go to Feed", href: "/feed" }] };
  }

  if (msg.includes("clean") || msg.includes("inbox") || msg.includes("noise")) {
    const noiseCount = feed.filter((m) => m.classification === "noise").length;
    return {
      response: `I found **${noiseCount} noise messages** that you can safely ignore. These are newsletters, promotional emails, and automated notifications. Your feed has been filtered to show what matters.`,
      actions: [],
    };
  }

  if (msg.includes("briefing") || msg.includes("summary") || msg.includes("overview")) {
    return {
      response: "Head to your dashboard for the Morning Briefing. Click 'Generate Briefing' for an AI-powered summary of your day.",
      actions: [{ label: "Generate Briefing", href: "/feed" }],
    };
  }

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return {
      response: "Hey! I'm unibox, your communication assistant. Ask me things like:\n\n• \"What should I do today?\"\n• \"Show urgent messages\"\n• \"How many tasks do I have?\"\n• \"Clean my inbox\"",
      actions: [],
    };
  }

  return {
    response: `I understand you're asking about "${userMessage}". Try asking me about your tasks, urgent messages, or today's priorities. I'm here to help you focus on what matters.`,
    actions: [],
  };
}

async function openaiGenerateDrafts(message) {
  const prompt = `You are an executive assistant. Generate 3 professional, polite, and context-aware reply drafts for this message.
Draft 1: Brief & Direct
Draft 2: Detailed & Professional
Draft 3: Casual but Polished

Message from: ${message.senderName} (${message.platform})
Subject: ${message.subject || "No subject"}
Body: ${message.body}

Return ONLY a JSON array of 3 strings. No other text.`;

  const res = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });

  try {
    return JSON.parse(res.choices[0].message.content);
  } catch (e) {
    return [
      `Hi ${message.senderName}, thanks for reaching out. I've received your message and will look into it.`,
      `Hello ${message.senderName}, thank you for the update regarding ${message.subject}. I will get back to you shortly with a detailed response.`,
      `Hey ${message.senderName}, got your message. I'm on it and will send an update by EOD.`
    ];
  }
}

export async function generateDrafts(message) {
  if (aiClient) {
    try {
      return await openaiGenerateDrafts(message);
    } catch (e) {
      console.warn("AI Draft generation failed:", e.message);
    }
  }
  
  // High-quality fallback if AI is down
  return [
    `Hi ${message.senderName}, thank you for your message. I am currently reviewing the details and will get back to you shortly.`,
    `Hello ${message.senderName}, I've received your request regarding ${message.subject || 'this update'}. I'll make sure to prioritize this and provide a response by the end of the day.`,
    `Hi ${message.senderName}, thanks for keeping me in the loop! I've noted this down and will follow up if I have any questions.`
  ];
}

export async function runAssistant(userMessage, context) {
  if (aiClient) {
    try {
      console.log(`📡 Assistant calling ${AI_MODEL}...`);
      const result = await openaiAssistant(userMessage, context);
      console.log(`✅ Assistant logic successful:`, !!result.actions?.length ? `${result.actions.length} actions found` : 'No actions');
      return result;
    } catch (e) {
      console.error("❌ Real Assistant logic failed:", e.message);
    }
  } else {
    console.log("🛠️ aiClient is NULL, falling back to Mock Assistant");
  }
  return mockAssistantResponse(userMessage, context.tasks || [], context.feed || []);
}
