import * as firebaseService from './firebaseService.js';
import * as mongodbService from './mongodbService.js';

const useMongo = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>');

const db = useMongo ? mongodbService : firebaseService;

console.log(`🔌 Database Engine: ${useMongo ? 'MongoDB' : 'Firebase/In-Memory'}`);

export const saveTasks = db.saveTasks;
export const getTasks = db.getTasks;
export const updateTask = db.updateTask;
export const saveFeedItem = db.saveFeedItem;
export const getFeed = db.getFeed;

// User special case (only in Mongo for now)
export const saveUser = db.saveUser || (() => {});
