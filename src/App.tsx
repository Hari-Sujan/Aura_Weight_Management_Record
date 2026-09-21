import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatabase, saveDatabase, exportDatabaseJSON, importDatabaseJSON } from './utils/db';
import { AuraDatabase, Role, User, Admin, HealthRecord } from './types';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { UserManagement } from './components/UserManagement';
import { AdminManagement } from './components/AdminManagement';
import { RecordEntry } from './components/RecordEntry';
import { SearchRecords } from './components/SearchRecords';
import { ThreeDBackground } from './components/ThreeDBackground';
import { Cloud, CheckCircle2, RefreshCw } from 'lucide-react';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'error';
}

export default function App() {
  const [db, setDb] = useState<AuraDatabase | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>('user');
  const [userDetails, setUserDetails] = useState<{ name: string; username: string } | null>(null);
  const [activeTab, setActiveTab] = useState<number>(4); // Default to Search & Manage
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const loadedDb = await getDatabase();
      setDb(loadedDb);
    } catch (err) {
      addToast('Failed to connect to MongoDB Atlas', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const addToast = (text: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLoginSuccess = (userRole: Role, details: { name: string; username: string }) => {
    setRole(userRole);
    setUserDetails(details);
    setIsAuthenticated(true);
    setActiveTab(userRole === 'admin' ? 3 : 4);
    addToast(`Welcome back, ${details.name}! Connected to MongoDB`, 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserDetails(null);
    addToast('Signed out successfully', 'success');
  };

  const syncDb = async (updatedDb: AuraDatabase) => {
    setIsSyncing(true);
    try {
      const saved = await saveDatabase(updatedDb);
      setDb(saved);
    } catch (err) {
      addToast('Error syncing with MongoDB Atlas', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddUser = async (newUser: Omit<User, 'id' | 'createdAt'>) => {
    if (!db) return;
    const user: User = {
      ...newUser,
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = { ...db, users: [user, ...db.users] };
    await syncDb(updated);
    addToast(`Client "${user.name}" created in MongoDB`, 'success');
  };

  const handleEditUser = async (updatedUser: User) => {
    if (!db) return;
    const updated = {
      ...db,
      users: db.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    };
    await syncDb(updated);
    addToast(`Client "${updatedUser.name}" updated in MongoDB`, 'success');
  };

  const handleDeleteUser = async (id: string) => {
    if (!db) return;
    const userToDelete = db.users.find(u => u.id === id);
    const updated = {
      ...db,
      users: db.users.filter((u) => u.id !== id)
    };
    await syncDb(updated);
    addToast(`Client "${userToDelete?.name || 'Account'}" deleted from MongoDB`, 'error');
  };

  const handleAddAdmin = async (newAdmin: Omit<Admin, 'id' | 'createdAt'>) => {
    if (!db) return;
    const admin: Admin = {
      ...newAdmin,
      id: 'a_' + Math.random().toString(36).substring(2, 9),
      accessLevel: 'Wellness Coach',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = { ...db, admins: [admin, ...db.admins] };
    await syncDb(updated);
    addToast(`Admin "${admin.name}" created in MongoDB`, 'success');
  };

  const handleEditAdmin = async (updatedAdmin: Admin) => {
    if (!db) return;
    const updated = {
      ...db,
      admins: db.admins.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
    };
    await syncDb(updated);
    addToast(`Admin "${updatedAdmin.name}" updated in MongoDB`, 'success');
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!db) return;
    const adminToDelete = db.admins.find(a => a.id === id);
    const updated = {
      ...db,
      admins: db.admins.filter((a) => a.id !== id)
    };
    await syncDb(updated);
    addToast(`Admin "${adminToDelete?.name || 'Account'}" deleted from MongoDB`, 'error');
  };

  const handleSaveRecord = async (newRecord: Omit<HealthRecord, 'id' | 'createdAt'>) => {
    if (!db) return;
    const record: HealthRecord = {
      ...newRecord,
      id: 'r_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = { ...db, records: [record, ...db.records] };
    await syncDb(updated);
  };

  const handleEditRecord = async (updatedRecord: HealthRecord) => {
    if (!db) return;
    const updated = {
      ...db,
      records: db.records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    };
    await syncDb(updated);
    addToast(`Health record for "${updatedRecord.fullName}" updated in MongoDB`, 'success');
  };

  const handleDeleteRecord = async (id: string) => {
    if (!db) return;
    const recordToDelete = db.records.find(r => r.id === id);
    const updated = {
      ...db,
      records: db.records.filter((r) => r.id !== id)
    };
    await syncDb(updated);
    addToast(`Health record for "${recordToDelete?.fullName || 'Client'}" deleted from MongoDB`, 'error');
  };

  const handleExport = async () => {
    await exportDatabaseJSON();
    addToast('Database exported successfully', 'success');
  };

  const handleImport = async (file: File) => {
    try {
      const importedDb = await importDatabaseJSON(file);
      setDb(importedDb);
      addToast('Database imported & synchronized with MongoDB', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to import database', 'error');
    }
  };

  if (!db) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#9E7FFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#A3A3A3] uppercase tracking-widest flex items-center gap-2">
          <Cloud className="w-4 h-4 text-[#38bdf8]" /> Connecting to MongoDB Atlas...
        </p>
      </div>
    );
  }

  return (
    <>
      <ThreeDBackground />

      {/* MongoDB Status Pill */}
      <div className="fixed bottom-6 left-6 z-40 bg-[#1C1D21]/90 border border-[#2F323A] backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
        </span>
        <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>MongoDB Atlas: <strong className="text-[#10b981]">Connected</strong></span>
        </div>
        {isSyncing && (
          <RefreshCw className="w-3 h-3 text-[#9E7FFF] animate-spin ml-2" />
        )}
      </div>

      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className={`px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981] backdrop-blur-md'
                  : 'bg-red-500/10 border-red-500/30 text-red-400 backdrop-blur-md'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-[#10b981]' : 'bg-red-400'}`} />
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isAuthenticated ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          users={db.users}
          admins={db.admins}
          addToast={addToast}
        />
      ) : (
        <Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role={role}
          userDetails={userDetails}
          onLogout={handleLogout}
          onExport={handleExport}
          onImport={handleImport}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="h-full"
            >
              {activeTab === 1 && role === 'admin' && (
                <UserManagement
                  users={db.users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}
              {activeTab === 2 && role === 'admin' && (
                <AdminManagement
                  admins={db.admins.filter((a) => a.id !== 'a1')}
                  onAddAdmin={handleAddAdmin}
                  onEditAdmin={handleEditAdmin}
                  onDeleteAdmin={handleDeleteAdmin}
                />
              )}
              {activeTab === 3 && role === 'admin' && (
                <RecordEntry
                  onSaveRecord={handleSaveRecord}
                  addToast={addToast}
                />
              )}
              {activeTab === 4 && (
                <SearchRecords
                  records={db.records}
                  role={role}
                  userDetails={userDetails}
                  onEditRecord={handleEditRecord}
                  onDeleteRecord={handleDeleteRecord}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Layout>
      )}
    </>
  );
}
