import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb+srv://Vercel-Admin-auracentre:VO5jtaPh4LMfTFYO@auracentre.k37o2xv.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "adminuser";
const COLLECTION_NAME = "adminuserdata";

let dbClient = null;
let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;
  try {
    dbClient = new MongoClient(MONGODB_URI);
    await dbClient.connect();
    dbInstance = dbClient.db(DB_NAME);
    console.log("Successfully connected to MongoDB Atlas!");
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error);
    throw error;
  }
}

// GET /api/data - Fetch master document containing users, admins, and records
app.get('/api/data', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION_NAME);
    const doc = await collection.findOne({});
    
    if (!doc) {
      // Initialize with default structure if empty
      const initialDoc = {
        users: [],
        admins: [],
        records: []
      };
      await collection.insertOne(initialDoc);
      return res.json(initialDoc);
    }
    
    res.json(doc);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/data - Replace/Update master document (Sync entire state)
app.put('/api/data', async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(COLLECTION_NAME);
    const updatedData = req.body;

    // Remove _id from payload if present to avoid Mongo immutable field error
    delete updatedData._id;

    const result = await collection.findOneAndUpdate(
      {},
      { $set: updatedData },
      { returnDocument: 'after', upsert: true }
    );

    res.json(result.value || updatedData);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Backend server running on http://localhost:${PORT}`);
});
