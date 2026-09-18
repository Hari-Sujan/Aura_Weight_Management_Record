import React, { useRef, useState } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Database, ShieldCheck } from 'lucide-react';
import { exportDatabaseJSON, importDatabaseJSON } from '../utils/db';
import { AuraDatabase } from '../types';

interface ImportExportProps {
  onDatabaseImported: (db: AuraDatabase) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ onDatabaseImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExport = () => {
    try {
      exportDatabaseJSON();
      setSuccessMessage('Database exported successfully as JSON.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage('Failed to export database.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const db = await importDatabaseJSON(file);
      onDatabaseImported(db);
      setSuccessMessage('Database imported and synchronized successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to import database file.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-[#9E7FFF]" />
          Data Backup & System Migration
        </h2>
        <p className="text-xs text-[#A3A3A3]">
          Securely export your complete clinical database or restore from a previous JSON backup.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl p-8 shadow-xl flex flex-col justify-between group hover:border-[#9E7FFF]/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9E7FFF]/20 to-[#38bdf8]/20 border border-[#9E7FFF]/30 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Download className="w-6 h-6 text-[#9E7FFF]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Export Database</h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
              Download a full encrypted snapshot of all clients, staff credentials, and historical health records in standard JSON format.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full bg-[#9E7FFF] hover:bg-[#8d6aee] text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Backup JSON
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl p-8 shadow-xl flex flex-col justify-between group hover:border-[#38bdf8]/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#38bdf8]/20 to-[#9E7FFF]/20 border border-[#38bdf8]/30 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Restore Database</h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed mb-6">
              Upload a previously exported JSON file to restore or synchronize records across your wellness centers instantly.
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#262626] hover:bg-[#323232] text-white border border-[#2F323A] py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#38bdf8]" />
            Select Backup File
          </button>
        </div>
      </div>

      <div className="bg-[#141518] border border-[#2F323A] rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#9E7FFF] shrink-0" />
        <p className="text-[11px] text-[#A3A3A3]">
          All database exports and imports are processed locally in your browser session for maximum clinical privacy and data security.
        </p>
      </div>
    </div>
  );
};
