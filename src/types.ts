export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  username: string;
  password: string;
  accessLevel: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  date: string;
  place: string;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  bodyFatPercentage?: number;
  metabolicAge?: number;
  visceralFat?: number;
  bmr?: number;
  wellnessScore: number;
  notes: string;
  createdAt: string;
}

export interface AuraDatabase {
  users: User[];
  admins: Admin[];
  records: HealthRecord[];
}
