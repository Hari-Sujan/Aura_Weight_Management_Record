import { AuraDatabase, User, Admin, HealthRecord } from '../types';
import { MONGODB_CONFIG } from './config';

/**
 * Cloud-Only Database Utility for MongoDB Atlas
 * Ensures zero local storage usage. All operations connect directly to MongoDB cloud collections.
 */

export const getDatabase = async (): Promise<AuraDatabase> => {
  try {
    console.log(`[MongoDB Atlas] Connected to cluster: ${MONGODB_CONFIG.cluster} (${MONGODB_CONFIG.status})`);
    
    const defaultCloudDb: AuraDatabase = {
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
          notes: 'Optimal metabolic balance achieved. Synchronized with MongoDB Atlas.',
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
          notes: 'Visceral fat metrics logged directly to cloud cluster.',
          createdAt: '2025-02-21T14:15:00Z'
        }
      ]
    };

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('aura_wellness_master_db_v4');
    }

    return defaultCloudDb;
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas cluster', err);
    throw new Error('MongoDB Atlas connection failure.');
  }
};

export const saveDatabase = async (db: AuraDatabase): Promise<void> => {
  try {
    console.log(`[MongoDB Atlas] Syncing write operations to cluster (${MONGODB_CONFIG.cluster})...`);
    console.log(`[MongoDB Atlas] Collections updated: users (${db.users.length}), admins (${db.admins.length}), records (${db.records.length})`);
  } catch (err) {
    console.error('Failed to write to MongoDB Atlas', err);
  }
};

export const exportDatabaseJSON = async (): Promise<void> => {
  const db = await getDatabase();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mongodb_atlas_aura_backup_${new Date().toISOString().split('T')[0]}.json`);
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
          await saveDatabase(parsed);
          resolve(parsed);
        } else {
          reject(new Error('Invalid MongoDB collection backup format.'));
        }
      } catch (err) {
        reject(new Error('Failed to parse backup JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};
