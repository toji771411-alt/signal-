import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

let db = null;
let firebaseInitialized = false;

// In-memory store used as fallback when Firebase is not configured
const inMemoryStore = {
  tasks: [],
  feed: [],
};

function initFirebase() {
  if (firebaseInitialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey && privateKey.length > 10) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
      }
      db = admin.firestore();
      firebaseInitialized = true;
      console.log("✅ Firebase initialized");
    } catch (e) {
      console.warn("⚠️  Firebase init failed, using in-memory store:", e.message);
    }
  } else {
    console.log("ℹ️  No Firebase credentials — using in-memory store");
  }
}

initFirebase();

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function saveTasks(tasks) {
  if (!db) {
    inMemoryStore.tasks.push(...tasks);
    return tasks;
  }
  const batch = db.batch();
  tasks.forEach((task) => {
    const ref = db.collection("tasks").doc(task.id);
    batch.set(ref, task);
  });
  await batch.commit();
  return tasks;
}

export async function getTasks(userId) {
  if (!db) {
    return inMemoryStore.tasks;
  }
  const snap = await db
    .collection("tasks")
    .where("userId", "==", userId || "anonymous")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateTask(taskId, updates) {
  if (!db) {
    const idx = inMemoryStore.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) inMemoryStore.tasks[idx] = { ...inMemoryStore.tasks[idx], ...updates };
    return;
  }
  await db.collection("tasks").doc(taskId).update(updates);
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export async function saveFeedItem(item) {
  if (!db) {
    const existing = inMemoryStore.feed.findIndex((f) => f.id === item.id);
    if (existing === -1) inMemoryStore.feed.push(item);
    else inMemoryStore.feed[existing] = item;
    return item;
  }
  await db.collection("feed").doc(item.id).set(item, { merge: true });
  return item;
}

export async function getFeed(userId) {
  if (!db) {
    return inMemoryStore.feed;
  }
  const snap = await db
    .collection("feed")
    .where("userId", "==", userId || "anonymous")
    .orderBy("priorityScore", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function clearInMemoryStore() {
  inMemoryStore.tasks = [];
  inMemoryStore.feed = [];
}
