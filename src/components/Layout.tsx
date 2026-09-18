import React, { useRef } from 'react';
import { Role } from '../types';
import { Users, Shield, PlusCircle, Search, LogOut, Download, Upload, Sparkles, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  role: Role;
  userDetails: { name: string; username: string } | null;
  onLogout: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  role,
  userDetails,
  onLogout,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-white relative z-10">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#1C1D21]/80 backdrop-blur-xl border-b border-[#2F323A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">AURA</span>
              <span className="text-[10px] font-semibold bg-[#9E7FFF]/20 text-[#9E7FFF] px-2 py-0.5 rounded-full border border-[#9E7FFF]/30 uppercase tracking-widest">
                {role === 'admin' ? 'Admin Portal' : 'Client Suite'}
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3]">Welcome, <span className="text-white font-medium">{userDetails?.name}</span></p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#141518] p-1.5 rounded-2xl border border-[#2F323A]">
          {role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 1
                    ? 'bg-[#9E7FFF] text-white shadow-md'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Clients
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 2
                    ? 'bg-[#9E7FFF] text-white shadow-md'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admins
              </button>
              <button
                onClick={() => setActiveTab(3)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 3
                    ? 'bg-[#9E7FFF] text-white shadow-md'
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                New Entry
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab(4)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 4
                ? 'bg-[#9E7FFF] text-white shadow-md'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            {role === 'admin' ? 'Search & Records' : 'My Health Records'}
          </button>
        </nav>

        {/* Actions (Export, Import, Logout) */}
        <div className="flex items-center gap-2.5">
          {role === 'admin' && (
            <>
              <button
                onClick={onExport}
                title="Export Database JSON"
                className="p-2.5 bg-[#262626] hover:bg-[#323232] border border-[#2F323A] rounded-xl text-[#A3A3A3] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <Download className="w-4 h-4 text-[#38bdf8]" />
                <span className="hidden lg:inline">Export</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import Database JSON"
                className="p-2.5 bg-[#262626] hover:bg-[#323232] border border-[#2F323A] rounded-xl text-[#A3A3A3] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <Upload className="w-4 h-4 text-[#9E7FFF]" />
                <span className="hidden lg:inline">Import</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
            </>
          )}
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#1C1D21] border-b border-[#2F323A] p-2">
        {role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold ${activeTab === 1 ? 'text-[#9E7FFF]' : 'text-[#A3A3A3]'}`}
            >
              <Users className="w-5 h-5" />
              Clients
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold ${activeTab === 2 ? 'text-[#9E7FFF]' : 'text-[#A3A3A3]'}`}
            >
              <Shield className="w-5 h-5" />
              Admins
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold ${activeTab === 3 ? 'text-[#9E7FFF]' : 'text-[#A3A3A3]'}`}
            >
              <PlusCircle className="w-5 h-5" />
              Entry
            </button>
          </>
        )}
        <button
          onClick={() => setActiveTab(4)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold ${activeTab === 4 ? 'text-[#9E7FFF]' : 'text-[#A3A3A3]'}`}
        >
          <Search className="w-5 h-5" />
          Records
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
};
