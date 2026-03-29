console.log('Test script started');
console.log('Node version:', process.version);
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    console.log('Connecting to MongoDB via native driver...');
    await client.connect();
    console.log('Connected successfully to server');
  } catch (e) {
    console.log('Connection error:', e.message);
  } finally {
    await client.close();
  }
}

run().then(() => console.log('Test script ended'));
