import React, { useState } from 'react';
import { User } from '../types';
import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setUsername(user.username);
    setPassword(user.password);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onEditUser({
        ...editingUser,
        name,
        username,
        password,
        status: 'Active',
      });
    } else {
      onAddUser({
        name,
        username,
        password,
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
            <Users className="w-6 h-6 text-[#9E7FFF]" />
            Client Management
          </h2>
          <p className="text-xs text-[#A3A3A3]">Manage client profiles and portal access credentials.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#9E7FFF] hover:bg-[#8d6aee] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1C1D21] border border-[#2F323A] p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-[#A3A3A3]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name or username..."
          className="w-full bg-transparent text-sm text-white placeholder-[#52525b] focus:outline-none"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-[#1C1D21] border border-[#2F323A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2F323A] bg-[#141518]/50 text-[11px] font-semibold text-[#A3A3A3] uppercase tracking-wider">
                <th className="py-4 px-6">Client Name</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Created</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F323A] text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#A3A3A3] text-xs">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#222328] transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{user.name}</td>
                    <td className="py-4 px-6 text-[#A3A3A3] font-mono text-xs">{user.username}</td>
                    <td className="py-4 px-6 text-[#A3A3A3] text-xs">{user.createdAt}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        title="Edit Client"
                        className="p-2 bg-[#262626] hover:bg-[#323232] rounded-lg text-[#A3A3A3] hover:text-white transition-colors inline-flex"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        title="Delete Client"
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

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingUser ? 'Edit Client Profile' : 'Create New Client'}
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
                  placeholder="e.g. Sarah Jenkins"
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
                  placeholder="e.g. sarah_j"
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
                  placeholder="e.g. user123"
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
                  {editingUser ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
