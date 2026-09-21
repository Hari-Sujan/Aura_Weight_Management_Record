import { AuraDatabase } from '../types';

export const getDatabaseFromAPI = async (): Promise<AuraDatabase> => {
  try {
    const res = await fetch('http://localhost:5000/api/data');
    if (!res.ok) throw new Error('Failed to fetch from server');
    const data = await res.json();
    return {
      users: data.users || [],
      admins: data.admins || [],
      records: data.records || []
    };
  } catch (err) {
    console.error('API Error (getDatabase):', err);
    throw err;
  }
};

export const saveDatabaseToAPI = async (db: AuraDatabase): Promise<void> => {
  try {
    const res = await fetch('http://localhost:5000/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db)
    });
    if (!res.ok) throw new Error('Failed to save to server');
  } catch (err) {
    console.error('API Error (saveDatabase):', err);
    throw err;
  }
};

export const exportDatabaseJSON = (db: AuraDatabase): void => {
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
          await saveDatabaseToAPI(parsed);
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
