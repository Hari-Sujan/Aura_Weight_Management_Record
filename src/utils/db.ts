import { AuraDatabase } from '../types';

const EMPTY_DB: AuraDatabase = {
  users: [],
  admins: [],
  records: []
};

export async function getDatabase(): Promise<AuraDatabase> {
  try {
    const res = await fetch('/api/database');
    if (!res.ok) {
      throw new Error('Failed to fetch from MongoDB backend');
    }
    const data = await res.json();
    if (!data || typeof data !== 'object') {
      return EMPTY_DB;
    }
    return {
      users: Array.isArray(data.users) ? data.users : [],
      admins: Array.isArray(data.admins) ? data.admins : [],
      records: Array.isArray(data.records) ? data.records : []
    };
  } catch (err) {
    console.error('Failed to load from MongoDB backend:', err);
    return EMPTY_DB;
  }
}

export async function saveDatabase(db: AuraDatabase): Promise<void> {
  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(db),
    });
    if (!res.ok) {
      throw new Error('Failed to save to MongoDB backend');
    }
  } catch (err) {
    console.error('Failed to sync database to MongoDB:', err);
    throw err;
  }
}

export async function exportDatabaseJSON(): Promise<void> {
  const db = await getDatabase();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aura_wellness_mongodb_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function importDatabaseJSON(file: File): Promise<AuraDatabase> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON file format');
        }
        const newDb: AuraDatabase = {
          users: Array.isArray(parsed.users) ? parsed.users : [],
          admins: Array.isArray(parsed.admins) ? parsed.admins : [],
          records: Array.isArray(parsed.records) ? parsed.records : []
        };
        await saveDatabase(newDb);
        resolve(newDb);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
