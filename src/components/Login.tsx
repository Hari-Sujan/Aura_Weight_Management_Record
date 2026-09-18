import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Admin, Role } from '../types';
import { Lock, Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: Role, details: { name: string; username: string }) => void;
  users: User[];
  admins: Admin[];
  addToast: (text: string, type: 'success' | 'error') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, users, admins, addToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if admin first
      const foundAdmin = admins.find(
        (a) => a.username === username && a.password === password && a.status === 'Active'
      );

      if (foundAdmin) {
        addToast(`Welcome back, ${foundAdmin.name}`, 'success');
        onLoginSuccess('admin', { name: foundAdmin.name, username: foundAdmin.username });
        return;
      }

      // Check if regular user
      const foundUser = users.find(
        (u) => u.username === username && u.password === password && u.status === 'Active'
      );

      if (foundUser) {
        addToast(`Welcome back, ${foundUser.name}`, 'success');
        onLoginSuccess('user', { name: foundUser.name, username: foundUser.username });
        return;
      }

      addToast('Invalid credentials or account inactive', 'error');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#1C1D21]/90 backdrop-blur-2xl border border-[#2F323A] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#9E7FFF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#38bdf8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] text-white shadow-lg mb-4 ring-4 ring-[#9E7FFF]/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AURA WELLNESS</h1>
          <p className="text-xs text-[#A3A3A3] mt-1 uppercase tracking-widest font-medium">Precision Metabolic Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group text-sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
