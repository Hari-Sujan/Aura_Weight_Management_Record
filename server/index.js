import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { MasterData } from './models/MasterData.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Initial seed data if collection is empty
const seedDefaultData = async () => {
  try {
    const count = await MasterData.countDocuments();
    if (count === 0) {
      await MasterData.create({
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
            notes: 'Optimal metabolic balance achieved. Connected to MongoDB Atlas auracentre cluster.',
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
            notes: 'Visceral fat metrics logged directly to MongoDB.',
            createdAt: '2025-02-21T14:15:00Z'
          }
        ]
      });
      console.log('Default MERN data seeded successfully in MongoDB');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

// Seed on startup
setTimeout(seedDefaultData, 2000);

// API Routes
app.get('/api/database', async (req, res) => {
  try {
    let doc = await MasterData.findOne();
    if (!doc) {
      await seedDefaultData();
      doc = await MasterData.findOne();
    }
    res.status(200).json({
      users: doc?.users || [],
      admins: doc?.admins || [],
      records: doc?.records || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/database', async (req, res) => {
  try {
    const { users, admins, records } = req.body;
    let doc = await MasterData.findOne();
    
    if (!doc) {
      doc = new MasterData({ users, admins, records });
    } else {
      if (users) doc.users = users;
      if (admins) doc.admins = admins;
      if (records) doc.records = records;
    }
    
    await doc.save();
    res.status(200).json({
      success: true,
      users: doc.users,
      admins: doc.admins,
      records: doc.records
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For local testing & Vercel serverless export
const PORT = process.env.PORT || 8888;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} yes`);
  });
}

export default app;
