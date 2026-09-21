import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-auracentre:VO5jtaPh4LMfTFYO@auracentre.k37o2xv.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "auracentre";
const COLLECTION_NAME = "adminuserdata";

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient.db(DB_NAME);
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client.db(DB_NAME);
}

export async function getMasterDocument() {
  const db = await connectToDatabase();
  const collection = db.collection(COLLECTION_NAME);
  
  let doc = await collection.findOne({});
  if (!doc) {
    // Initialize if empty
    const initial = {
      users: [
        {
          id: 'u1',
          name: 'Sarah Jenkins',
          username: 'sarah_j',
          password: 'user123',
          status: 'Active',
          createdAt: '2025-01-15'
        }
      ],
      admins: [
        {
          id: 'a1',
          name: 'System Administrator',
          username: 'admin123',
          password: '7339260108S',
          accessLevel: 'Super Administrator',
          status: 'Active',
          createdAt: '2025-01-01'
        }
      ],
      records: [
        {
          id: 'r1',
          fullName: 'Sarah Jenkins',
          dateOfBirth: '1993-04-15',
          age: 32,
          date: '2025-02-20',
          place: 'Centre',
          gender: 'Female',
          height: 168,
          weight: 62.5,
          bmi: 22.1,
          bodyFatPercentage: 19.4,
          metabolicAge: 26,
          visceralFat: 3,
          bmr: 1420,
          wellnessScore: 94,
          notes: 'Optimal metabolic balance achieved. Excellent conditioning.',
          createdAt: '2025-02-20T10:30:00Z'
        }
      ]
    };
    await collection.insertOne(initial);
    doc = await collection.findOne({});
  }
  return { db, collection, doc };
}
