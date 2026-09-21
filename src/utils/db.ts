import { AuraDatabase } from '../types';

export const getDatabase = async (): Promise<AuraDatabase> => {
  try {
    const res = await fetch('/api/database');
    if (!res.ok) throw new Error('Failed to fetch database from server');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch from MongoDB API, falling back to empty state', err);
    return { users: [], admins: [], records: [] };
  }
};

export const saveDatabase = async (db: AuraDatabase): Promise<AuraDatabase> => {
  try {
    const res = await fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    });
    if (!res.ok) throw new Error('Failed to save database to server');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to save to MongoDB API', err);
    throw err;
  }
};

export const exportDatabaseJSON = async (): Promise<void> => {
  const db = await getDatabase();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `aura_wellness_mongodb_backup_${new Date().toISOString().split('T')[0]}.json`);
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
        reject(new Error('Failed to parse JSON file or sync with MongoDB.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};
