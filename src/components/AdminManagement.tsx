import React, { useState } from 'react';
import { Admin } from '../types';
import { Shield, Plus, Edit2, Trash2 } from 'lucide-react';

interface AdminManagementProps {
  admins: Admin[];
  onAddAdmin: (admin: Omit<Admin, 'id' | 'createdAt'>) => void;
  onEditAdmin: (admin: Admin) => void;
  onDeleteAdmin: (id: string) => void;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({
  admins,
  onAddAdmin,
  onEditAdmin,
  onDeleteAdmin,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setName('');
    setUsername('');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setUsername(admin.username);
    setPassword(admin.password);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAdmin) {
      onEditAdmin({
        ...editingAdmin,
        name,
        username,
        password,
        accessLevel: 'Coach',
        status: 'Active',
      });
    } else {
      onAddAdmin({
        name,
        username,
        password,
        accessLevel: 'Coach',
        status: 'Active',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#9E7FFF]" />
            Staff & Coach Management
          </h2>
          <p className="text-xs text-[#A3A3A3]">Manage clinic staff access credentials.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#9E7FFF] hover:bg-[#8d6aee] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-[#1C1D21] border border-[#2F323A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2F323A] bg-[#141518]/50 text-[11px] font-semibold text-[#A3A3A3] uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Created</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F323A] text-sm">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#A3A3A3] text-xs">
                    No additional staff members found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#222328] transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{admin.name}</td>
                    <td className="py-4 px-6 text-[#A3A3A3] font-mono text-xs">{admin.username}</td>
                    <td className="py-4 px-6 text-[#A3A3A3] text-xs">{admin.createdAt}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(admin)}
                        title="Edit Admin"
                        className="p-2 bg-[#262626] hover:bg-[#323232] rounded-lg text-[#A3A3A3] hover:text-white transition-colors inline-flex"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteAdmin(admin.id)}
                        title="Delete Admin"
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingAdmin ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. jane_doe"
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. coach123"
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2F323A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#262626] hover:bg-[#323232] text-xs font-semibold text-[#A3A3A3] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#9E7FFF] hover:bg-[#8d6aee] text-xs font-semibold text-white shadow-lg transition-all"
                >
                  {editingAdmin ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
