import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-auracentre:VO5jtaPh4LMfTFYO@auracentre.k37o2xv.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "adminuser";
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
    // Initialize with the provided MongoDB document structure
    const initial = {
      users: [
        {
          id: 'u1',
          name: 'Sarah Jenkins',
          username: 'sarah_j',
          password: 'user123',
          status: 'Active',
          createdAt: '2025-01-15'
        },
        {
          id: 'u2',
          name: 'Marcus Vance',
          username: 'marcus_v',
          password: 'user123',
          status: 'Active',
          createdAt: '2025-02-01'
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
          notes: 'Optimal metabolic balance achieved. Synchronized with MongoDB Atlas auracentre.adminuser.adminuserdata.',
          createdAt: '2025-02-20T10:30:00Z'
        },
        {
          id: 'r2',
          fullName: 'Hari Sujan',
          dateOfBirth: '1984-09-10',
          age: 41,
          date: '2025-02-21',
          place: 'Downtown Branch',
          gender: 'Male',
          height: 182,
          weight: 84,
          bmi: 25.3,
          bodyFatPercentage: 17.8,
      metabolicAge: 38,
          visceralFat: 7,
          bmr: 1850,
          wellnessScore: 89,
          notes: 'Visceral fat metrics logged directly to cloud cluster auracentre.',
          createdAt: '2025-02-21T14:15:00Z'
        }
      ]
    };
    await collection.insertOne(initial);
    doc = await collection.findOne({});
  }
  return { db, collection, doc };
}
