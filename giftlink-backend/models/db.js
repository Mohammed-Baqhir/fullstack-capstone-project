const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;
let client;

async function connectToDatabase() {
  if (database) {
    return database;
  }

  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
  const dbName = process.env.MONGO_DB || 'giftdb';

  client = new MongoClient(mongoUrl);
  await client.connect();
  database = client.db(dbName);

  console.log(`Connected to MongoDB database: ${dbName}`);
  return database;
}

async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    database = null;
    client = null;
  }
}

module.exports = { connectToDatabase, closeDatabaseConnection };
