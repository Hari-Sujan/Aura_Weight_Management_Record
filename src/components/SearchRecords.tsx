import React, { useState } from 'react';
import { HealthRecord, Role } from '../types';
import { Search, FileText, Printer, Trash2, Calendar, MapPin, Activity, Edit3, X, User as UserIcon, Shield } from 'lucide-react';

interface SearchRecordsProps {
  records: HealthRecord[];
  role: Role;
  userDetails?: { name: string; username: string } | null;
  onEditRecord: (record: HealthRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const SearchRecords: React.FC<SearchRecordsProps> = ({
  records,
  role,
  userDetails,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);

  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPlace, setEditPlace] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editBmi, setEditBmi] = useState('');
  const [editBodyFat, setEditBodyFat] = useState('');
  const [editMetabolicAge, setEditMetabolicAge] = useState('');
  const [editVisceralFat, setEditVisceralFat] = useState('');
  const [editBmr, setEditBmr] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Filter records based on role
  const accessibleRecords = role === 'admin' 
    ? records 
    : records.filter(r => {
        if (!userDetails) return false;
        const clientNameLower = userDetails.name.toLowerCase().trim();
        const clientUsernameLower = userDetails.username.toLowerCase().trim();
        const recordNameLower = r.fullName.toLowerCase().trim();
        
        return (
          recordNameLower.includes(clientNameLower) ||
          clientNameLower.includes(recordNameLower) ||
          recordNameLower.includes(clientUsernameLower)
        );
      });

  const recordsToDisplay = role === 'admin' ? records : (accessibleRecords.length > 0 ? accessibleRecords : records);

  const filteredRecords = recordsToDisplay.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.place.toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search)
  );

  const handlePrint = () => {
    window.print();
  };

  const handleOpenEdit = (record: HealthRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecord(record);
    setEditFullName(record.fullName);
    setEditDate(record.date);
    setEditPlace(record.place);
    setEditWeight(record.weight.toString());
    setEditHeight(record.height.toString());
    setEditBmi(record.bmi.toString());
    setEditBodyFat(record.bodyFatPercentage?.toString() || '');
    setEditMetabolicAge(record.metabolicAge?.toString() || '');
    setEditVisceralFat(record.visceralFat?.toString() || '');
    setEditBmr(record.bmr?.toString() || '');
    setEditNotes(record.notes);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const updatedRecord: HealthRecord = {
      ...editingRecord,
      fullName: editFullName,
      date: editDate,
      place: editPlace,
      weight: parseFloat(editWeight) || 0,
      height: parseFloat(editHeight) || 0,
      bmi: parseFloat(editBmi) || 0,
      bodyFatPercentage: editBodyFat ? parseFloat(editBodyFat) : undefined,
      metabolicAge: editMetabolicAge ? parseInt(editMetabolicAge) : undefined,
      visceralFat: editVisceralFat ? parseFloat(editVisceralFat) : undefined,
      bmr: editBmr ? parseFloat(editBmr) : undefined,
      notes: editNotes,
    };

    onEditRecord(updatedRecord);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#9E7FFF]" />
            {role === 'admin' ? 'Health Records & Biometric Database' : `${userDetails?.name || 'Client'} — Dashboard`}
          </h2>
          <p className="text-xs text-[#A3A3A3]">
            {role === 'admin' 
              ? 'Search, view detailed clinical printouts, and manage client health records.' 
              : 'Reviewing your complete biometric profile and assessment history in read-only mode.'}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#1C1D21] border border-[#2F323A] p-4 rounded-2xl flex items-center gap-3">
        <Search className="w-4 h-4 text-[#A3A3A3]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={role === 'admin' ? "Search records by client name, center, or date..." : "Search your assessment history by date or center..."}
          className="w-full bg-transparent text-sm text-white placeholder-[#52525b] focus:outline-none"
        />
      </div>

      {/* Records Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#A3A3A3] text-sm bg-[#1C1D21] border border-[#2F323A] rounded-3xl space-y-2">
            <p className="font-semibold text-white">No health records found.</p>
            {role === 'user' && (
              <p className="text-xs text-[#A3A3A3]">
                Logged in as <span className="text-[#9E7FFF] font-medium">{userDetails?.name}</span> ({userDetails?.username}).
              </p>
            )}
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl p-6 shadow-xl hover:border-[#9E7FFF]/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top badge indicator for Client View */}
              {role === 'user' && (
                <div className="absolute top-0 right-0 bg-[#38bdf8]/10 text-[#38bdf8] text-[9px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-[#38bdf8]/20">
                  Read-Only Profile View
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span className="text-xs text-[#A3A3A3] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {record.date}
                  </span>
                  
                  {role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(record, e)}
                        title="Edit Record"
                        className="p-1.5 bg-[#262626] hover:bg-[#323232] text-[#9E7FFF] rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        title="Delete Record"
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#9E7FFF] transition-colors flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#9E7FFF]" />
                  {record.fullName}
                </h3>
                <p className="text-xs text-[#A3A3A3] flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                  {record.place}
                </p>

                {/* Complete Biometric Details Preview Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#2F323A] my-4 text-center">
                  <div className="bg-[#141518] p-2 rounded-xl">
                    <span className="block text-[10px] text-[#A3A3A3] uppercase">Weight</span>
                    <span className="text-sm font-bold text-white">{record.weight} kg</span>
                  </div>
                  <div className="bg-[#141518] p-2 rounded-xl">
                    <span className="block text-[10px] text-[#A3A3A3] uppercase">BMI</span>
                    <span className="text-sm font-bold text-[#38bdf8]">{record.bmi}</span>
                  </div>
                  <div className="bg-[#141518] p-2 rounded-xl">
                    <span className="block text-[10px] text-[#A3A3A3] uppercase">Body Fat</span>
                    <span className="text-sm font-bold text-[#9E7FFF]">{record.bodyFatPercentage}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                  <div className="bg-[#141518]/50 p-1.5 rounded-lg border border-[#2F323A]/50">
                    <span className="block text-[9px] text-[#A3A3A3]">Metabolic Age</span>
                    <span className="font-semibold text-white">{record.metabolicAge || '-'} yrs</span>
                  </div>
                  <div className="bg-[#141518]/50 p-1.5 rounded-lg border border-[#2F323A]/50">
                    <span className="block text-[9px] text-[#A3A3A3]">Visceral Fat</span>
                    <span className="font-semibold text-white">{record.visceralFat || '-'}%</span>
                  </div>
                  <div className="bg-[#141518]/50 p-1.5 rounded-lg border border-[#2F323A]/50">
                    <span className="block text-[9px] text-[#A3A3A3]">BMR</span>
                    <span className="font-semibold text-white">{record.bmr || '-'} kcal</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedRecord(record)}
                  className="w-full bg-[#262626] hover:bg-[#323232] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#9E7FFF]" />
                  View Full Clinical Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Clinical Modal / Report */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl w-full max-w-2xl p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-[#2F323A] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AURA CLINICAL REPORT</h3>
                  <p className="text-xs text-[#A3A3A3]">Precision Body Composition Analysis</p>
                </div>
              </div>
              <button
                onClick={handlePrint}
                className="bg-[#262626] hover:bg-[#323232] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#38bdf8]" />
                Print Report
              </button>
            </div>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#141518] p-4 rounded-2xl border border-[#2F323A]">
                <div>
                  <span className="text-xs text-[#A3A3A3] block">Client Name</span>
                  <span className="font-bold text-white text-base">{selectedRecord.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-[#A3A3A3] block">Assessment Date</span>
                  <span className="font-semibold text-white">{selectedRecord.date}</span>
                </div>
                <div>
                  <span className="text-xs text-[#A3A3A3] block">Age / Gender</span>
                  <span className="font-semibold text-white">{selectedRecord.age} years / {selectedRecord.gender}</span>
                </div>
                <div>
                  <span className="text-xs text-[#A3A3A3] block">Assessment Centre</span>
                  <span className="font-semibold text-white">{selectedRecord.place}</span>
                </div>
              </div>

              {/* Biometrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">Weight</span>
                  <span className="text-base font-bold text-white">{selectedRecord.weight} kg</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">Height</span>
                  <span className="text-base font-bold text-white">{selectedRecord.height} cm</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">BMI</span>
                  <span className="text-base font-bold text-[#38bdf8]">{selectedRecord.bmi}</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">Body Fat</span>
                  <span className="text-base font-bold text-[#9E7FFF]">{selectedRecord.bodyFatPercentage}%</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">Metabolic Age</span>
                  <span className="text-base font-bold text-white">{selectedRecord.metabolicAge} yrs</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">Visceral Fat (%)</span>
                  <span className="text-base font-bold text-white">{selectedRecord.visceralFat}%</span>
                </div>
                <div className="bg-[#141518] p-3.5 rounded-xl border border-[#2F323A] text-center col-span-full sm:col-span-3">
                  <span className="text-[10px] text-[#A3A3A3] uppercase block">BMR</span>
                  <span className="text-base font-bold text-white">{selectedRecord.bmr} kcal</span>
                </div>
              </div>

              <div className="bg-[#141518] p-4 rounded-2xl border border-[#2F323A]">
                <span className="text-xs text-[#9E7FFF] font-bold uppercase block mb-1">Clinical Notes & Observations</span>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{selectedRecord.notes}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2F323A] flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2.5 rounded-xl bg-[#9E7FFF] hover:bg-[#8d6aee] text-xs font-semibold text-white shadow-lg transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal (Admin Only) */}
      {role === 'admin' && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl w-full max-w-xl p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-[#2F323A] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E7FFF] to-[#38bdf8] flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Health Record</h3>
                  <p className="text-xs text-[#A3A3A3]">Update biometric assessment details</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-2 bg-[#262626] hover:bg-[#323232] rounded-xl text-[#A3A3A3] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">Assessment Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">Assessment Place / Centre</label>
                <input
                  type="text"
                  required
                  value={editPlace}
                  onChange={(e) => setEditPlace(e.target.value)}
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">BMI (Manual)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editBmi}
                    onChange={(e) => setEditBmi(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editBodyFat}
                    onChange={(e) => setEditBodyFat(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">Metabolic Age</label>
                  <input
                    type="number"
                    value={editMetabolicAge}
                    onChange={(e) => setEditMetabolicAge(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#A3A3A3] mb-1 uppercase">Visceral Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editVisceralFat}
                    onChange={(e) => setVisceralFat(e.target.value)}
                    className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">BMR (kcal)</label>
                <input
                  type="number"
                  value={editBmr}
                  onChange={(e) => setEditBmr(e.target.value)}
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A3A3A3] mb-1 uppercase tracking-wider">Clinical Notes & Observations</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#9E7FFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2F323A]">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#262626] hover:bg-[#323232] text-xs font-semibold text-[#A3A3A3] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#9E7FFF] hover:bg-[#8d6aee] text-xs font-semibold text-white shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
