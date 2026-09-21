import { AuraDatabase } from '../types';

const LOCAL_STORAGE_KEY = 'aura_wellness_local_db';

const defaultDatabase: AuraDatabase = {
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
      notes: 'Optimal metabolic balance achieved. Connected to MongoDB Atlas.',
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
      notes: 'Visceral fat metrics logged.',
      createdAt: '2025-02-21T14:15:00Z'
    }
  ]
};

export const getDatabase = async (): Promise<AuraDatabase> => {
  try {
    const res = await fetch('/api/database');
    if (!res.ok) {
      throw new Error('API server unreachable');
    }
    const data = await res.json();
    if (data && data.users && data.records) {
      return data;
    }
    throw new Error('Invalid data format from API');
  } catch (err) {
    console.warn('MongoDB Atlas connection unavailable in browser preview or serverless function failed. Falling back to robust LocalStorage mode.', err);
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // invalid JSON
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
};

export const saveDatabase = async (db: AuraDatabase): Promise<AuraDatabase> => {
  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
    if (!res.ok) {
      throw new Error('Failed to save to MongoDB API');
    }
    const data = await res.json();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    return data;
  } catch (err) {
    console.warn('Network save failed. Saving to LocalStorage fallback.');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    return db;
  }
};

export const exportDatabaseJSON = async (): Promise<void> => {
  const db = await getDatabase();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aura_wellness_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDatabaseJSON = async (file: File): Promise<AuraDatabase> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.records)) {
          const saved = await saveDatabase(parsed);
          resolve(saved);
        } else {
          reject(new Error('Invalid database format.'));
        }
      } catch (err) {
        reject(new Error('Failed to parse JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};
