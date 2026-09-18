import React, { useState, useEffect } from 'react';
import { HealthRecord } from '../types';
import { PlusCircle, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecordEntryProps {
  onSaveRecord: (record: Omit<HealthRecord, 'id' | 'createdAt'>) => void;
  addToast: (text: string, type: 'success' | 'error') => void;
}

export const RecordEntry: React.FC<RecordEntryProps> = ({ onSaveRecord, addToast }) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  const [age, setAge] = useState(35);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [place, setPlace] = useState('Aura Wellness Flagship Centre');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [bmi, setBmi] = useState(22.5);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(20);
  const [metabolicAge, setMetabolicAge] = useState(30);
  const [visceralFat, setVisceralFat] = useState(4.5);
  const [bmr, setBmr] = useState(1500);
  const [notes, setNotes] = useState('Client exhibits exceptional vitality and optimal body composition.');

  useEffect(() => {
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge > 0) {
        setAge(calculatedAge);
      }
    }
  }, [dateOfBirth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast('Please enter a valid full name', 'error');
      return;
    }

    onSaveRecord({
      fullName,
      dateOfBirth,
      age,
      date,
      place,
      gender,
      height,
      weight,
      bmi,
      bodyFatPercentage,
      metabolicAge,
      visceralFat,
      bmr,
      wellnessScore: 100, // Default value since field is removed
      notes,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    addToast(`Health record for "${fullName}" saved successfully!`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-[#9E7FFF]" />
          New Biometric Health & Weight Record
        </h2>
        <p className="text-xs text-[#A3A3A3]">Record precision body composition analysis, BMI, visceral fat percentages, and clinical notes.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1C1D21] border border-[#2F323A] rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Personal Details Section */}
        <div>
          <h3 className="text-sm font-bold text-[#9E7FFF] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Client Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Assessment Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Assessment Centre / Branch
              </label>
              <input
                type="text"
                required
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Age
              </label>
              <input
                type="number"
                disabled
                value={age}
                className="w-full bg-[#141518]/50 border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-[#A3A3A3] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Biometrics Section */}
        <div className="pt-4 border-t border-[#2F323A]">
          <h3 className="text-sm font-bold text-[#38bdf8] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Biometric Measurements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                BMI
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={bmi}
                onChange={(e) => setBmi(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Body Fat Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Metabolic Age (Years)
              </label>
              <input
                type="number"
                value={metabolicAge}
                onChange={(e) => setMetabolicAge(parseInt(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                Visceral Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={visceralFat}
                onChange={(e) => setVisceralFat(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
                BMR (kcal)
              </label>
              <input
                type="number"
                value={bmr}
                onChange={(e) => setBmr(parseInt(e.target.value) || 0)}
                className="w-full bg-[#141518] border border-[#2F323A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#9E7FFF]"
              />
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="pt-4 border-t border-[#2F323A]">
          <label className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase tracking-wider">
            Clinical Notes & Recommendations
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#141518] border border-[#2F323A] rounded-xl p-4 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#9E7FFF]"
            placeholder="Enter clinical observations, dietary recommendations, or fitness goals..."
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#9E7FFF] to-[#38bdf8] text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center gap-2 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save & Generate Health Record
          </button>
        </div>
      </form>
    </div>
  );
};
