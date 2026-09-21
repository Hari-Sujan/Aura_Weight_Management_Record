import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: 'Active' },
  createdAt: { type: String, required: true }
});

const adminSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  accessLevel: { type: String, default: 'Wellness Coach' },
  status: { type: String, default: 'Active' },
  createdAt: { type: String, required: true }
});

const recordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  age: { type: Number, required: true },
  date: { type: String, required: true },
  place: { type: String, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
  bodyFatPercentage: { type: Number },
  metabolicAge: { type: Number },
  visceralFat: { type: Number },
  bmr: { type: Number },
  wellnessScore: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
});

const masterSchema = new mongoose.Schema({
  users: [userSchema],
  admins: [adminSchema],
  records: [recordSchema]
}, { timestamps: true });

export const MasterData = mongoose.models.MasterData || mongoose.model('MasterData', masterSchema, 'adminuserdata');
