import { Task, FeedItem, User } from '../models/index.js';
import connectDB from '../lib/db.js';

// Initialize connection
connectDB();

export async function saveTasks(tasks) {
  try {
    const operations = tasks.map(task => ({
      updateOne: {
        filter: { id: task.id },
        update: { $set: task },
        upsert: true
      }
    }));
    await Task.bulkWrite(operations);
    return tasks;
  } catch (error) {
    console.error('Error saving tasks to MongoDB:', error);
    throw error;
  }
}

export async function getTasks(userId) {
  try {
    return await Task.find({ userId: userId || 'anonymous' }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting tasks from MongoDB:', error);
    return [];
  }
}

export async function updateTask(taskId, updates) {
  try {
    await Task.updateOne({ id: taskId }, { $set: updates });
  } catch (error) {
    console.error('Error updating task in MongoDB:', error);
  }
}

export async function saveFeedItem(item) {
  try {
    await FeedItem.updateOne(
      { id: item.id },
      { $set: item },
      upsert: true
    );
    return item;
  } catch (error) {
    console.error('Error saving feed item to MongoDB:', error);
    throw error;
  }
}

export async function getFeed(userId) {
  try {
    return await FeedItem.find({ userId: userId || 'anonymous' }).sort({ priorityScore: -1 });
  } catch (error) {
    console.error('Error getting feed from MongoDB:', error);
    return [];
  }
}

export async function saveUser(userData) {
  try {
    await User.updateOne(
      { uid: userData.uid },
      { $set: { ...userData, lastLogin: new Date() } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
  }
}
