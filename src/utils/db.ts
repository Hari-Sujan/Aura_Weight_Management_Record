import { AuraDatabase } from '../types';

const INITIAL_DB: AuraDatabase = {
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
      notes: 'Optimal metabolic balance achieved. Excellent conditioning.',
      createdAt: '2025-02-20T10:30:00Z'
    },
    {
      id: 'r2',
      fullName: 'Marcus Vance',
      dateOfBirth: '1984-09-10',
      age: 41,
      date: '2025-02-21',
      place: 'Downtown Branch',
      gender: 'Male',
      height: 182,
      weight: 84.0,
      bmi: 25.3,
      bodyFatPercentage: 17.8,
      metabolicAge: 38,
      visceralFat: 7,
      bmr: 1850,
      wellnessScore: 89,
      notes: 'Slight visceral fat reduction recommended through targeted cardiovascular intervals.',
      createdAt: '2025-02-21T14:15:00Z'
    }
  ]
};

const STORAGE_KEY = 'aura_wellness_master_db_v4';

export const getDatabase = (): AuraDatabase => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DB));
      return INITIAL_DB;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse database from localStorage', err);
    return INITIAL_DB;
  }
};

export const saveDatabase = (db: AuraDatabase): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save database to localStorage', err);
  }
};

export const exportDatabaseJSON = (): void => {
  const db = getDatabase();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aura_wellness_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importDatabaseJSON = (file: File): Promise<AuraDatabase> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.records)) {
          saveDatabase(parsed);
          resolve(parsed);
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
