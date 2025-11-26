const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let db;

const initDB = async (callback) => {
  if (db) {
    console.log('Database is already initialized!');
    return callback(null, db);
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(); // 🔥 Usa el nombre directamente desde la URI
    console.log('Connected to MongoDB');
    callback(null, db);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    callback(err);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database is not initialized');
  }
  return db;
};

module.exports = { initDB, getDB };
