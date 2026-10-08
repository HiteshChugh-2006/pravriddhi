import React, { useState } from 'react';
import { User, GraduationCap, Calendar, ArrowRight, ArrowLeft, Building2, MapPin, Globe2, Laptop } from 'lucide-react';

export interface ProfileStepProps {
  name: string;
  setName: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  educationLevel: string;
  setEducationLevel: (v: string) => void;
  degreeField: string;
  setDegreeField: (v: string) => void;
  schoolName: string;
  setSchoolName: (v: string) => void;
  currentYear: string;
  setCurrentYear: (v: string) => void;
  experienceLevel: string;
  setExperienceLevel: (v: string) => void;
  preferredLocation: string;
  setPreferredLocation: (v: string) => void;
  workPreference: 'Remote' | 'Hybrid' | 'On-site';
  setWorkPreference: (v: 'Remote' | 'Hybrid' | 'On-site') => void;
  onNext: () => void;
  onBack: () => void;
}

export const GLOBAL_REGIONS = [
  { id: 'India', name: 'India', currency: 'INR (₹)', exampleCity: 'Bengaluru, India' },
  { id: 'United Kingdom', name: 'United Kingdom', currency: 'GBP (£)', exampleCity: 'London, UK' },
  { id: 'Germany', name: 'Germany / European Union', currency: 'EUR (€)', exampleCity: 'Berlin, Germany' },
  { id: 'Canada', name: 'Canada', currency: 'CAD (C$)', exampleCity: 'Toronto, Canada' },
  { id: 'Australia', name: 'Australia', currency: 'AUD (A$)', exampleCity: 'Sydney, Australia' },
  { id: 'Singapore', name: 'Singapore', currency: 'SGD (S$)', exampleCity: 'Singapore' },
  { id: 'United States', name: 'United States', currency: 'USD ($)', exampleCity: 'San Francisco, CA' },
  { id: 'United Arab Emirates', name: 'United Arab Emirates', currency: 'AED', exampleCity: 'Dubai, UAE' },
  { id: 'Japan', name: 'Japan', currency: 'JPY (¥)', exampleCity: 'Tokyo, Japan' },
  { id: 'Brazil', name: 'Brazil / Latin America', currency: 'BRL (R$)', exampleCity: 'São Paulo, Brazil' },
  { id: 'Global Remote', name: 'Worldwide / Anywhere', currency: 'USD ($)', exampleCity: 'Remote Global' }
];

export const ProfileStep: React.FC<ProfileStepProps> = ({
  name,
  setName,
  country,
  setCountry,
  educationLevel,
  setEducationLevel,
  degreeField,
  setDegreeField,
  schoolName,
  setSchoolName,
  currentYear,
  setCurrentYear,
  experienceLevel,
  setExperienceLevel,
  preferredLocation,
  setPreferredLocation,
  workPreference,
  setWorkPreference,
  onNext,
  onBack
}) => {
  const [error, setError] = useState<string | null>(null);

  const educationOptions = [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate / PhD",
    "Diploma / Associate",
    "Bootcamp Graduate",
    "Self-Taught"
  ];

  const degreeFields = [
    "Computer Science & Engineering",
    "Data Science & Analytics",
    "Software Engineering",
    "Information Technology",
    "Electrical & Electronics",
    "Mathematics & Statistics",
    "Business Analytics & Management",
    "Self-Directed Learning",
    "Other Field"
  ];

  const currentYearOptions = [
    "1st Year Student",
    "2nd Year Student",
    "3rd Year Student",
    "Final Year Student",
    "Recent Graduate (2024 - 2025)",
    "Working Professional"
  ];

  const experienceOptions = [
    { id: 'Student / Intern', label: 'Student / Intern', sub: 'Looking for initial industry projects and internships' },
    { id: 'Early Career (0–2 yrs)', label: 'Early Career (0–2 yrs)', sub: 'Building practical foundations and first full-time role' },
    { id: 'Mid-Level (3–5 yrs)', label: 'Mid-Level (3–5 yrs)', sub: 'Delivering end-to-end features and driving technical decisions' },
    { id: 'Senior (5+ yrs)', label: 'Senior (5+ yrs)', sub: 'Mentoring teams, architecting solutions and cross-team impact' }
  ];

  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);
    const reg = GLOBAL_REGIONS.find((r) => r.id === selectedCountryName);
    if (reg && (!preferredLocation || preferredLocation.includes(','))) {
      setPreferredLocation(reg.exampleCity);
    }
  };

  const handleContinue = () => {
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!country) {
      setError('Please select your country or region.');
      return;
    }
    if (!degreeField) {
      setError('Please specify your degree or primary field of study.');
      return;
    }
    setError(null);
    onNext();
  };

  const getInitials = (n: string) => {
    if (!n.trim()) return 'P';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <User className="w-3.5 h-3.5" />
          <span>Step 2 of 8 · Tell Us About You</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Where you are today
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          We adapt job insights, currencies, and recommendations to your actual region and background.
        </p>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Two Column Layout: Progressive Form (Left) & Real-time Profile Identity Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-white/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Full Name <span className="text-indigo-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Maya Chen or Aarav Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Country / Region & Preferred Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Country / Region <span className="text-indigo-600">*</span>
              </label>
              <div className="relative">
                <Globe2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your region</option>
                  {GLOBAL_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preferred Work City / Base
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, London, Remote"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Education Level & Degree Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Education Level
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {educationOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Degree / Primary Field <span className="text-indigo-600">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={degreeField}
                  onChange={(e) => setDegreeField(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {degreeFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* University/School & Current Year/Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                University, College, or Platform
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. IIT Bombay, Imperial College, Coursera"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Year or Status
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {currentYearOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Experience Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {experienceOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExperienceLevel(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    experienceLevel === opt.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className={`text-xs font-bold block ${
                    experienceLevel === opt.id ? 'text-indigo-900' : 'text-slate-800'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Work Style Preference */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Work Style Preference
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Remote', 'Hybrid', 'On-site'] as const).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => setWorkPreference(pref)}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    workPreference === pref
                      ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-medium'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="text-xs">{pref}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Live Identity Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                  Profile Snapshot
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[10px] font-semibold">
                  {workPreference}
                </span>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white/10">
                  {getInitials(name)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white truncate max-w-[200px]">
                    {name.trim() || 'Your Name'}
                  </h3>
                  <p className="text-xs text-indigo-200 truncate max-w-[200px]">
                    {degreeField || 'Field of Study'}
                  </p>
                  <p className="text-[11px] text-indigo-300/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{preferredLocation || country || 'Global'}</span>
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                <div className="flex justify-between items-center text-indigo-200">
                  <span className="text-indigo-300/70">Stage</span>
                  <span className="font-semibold text-white">{currentYear || 'Student'}</span>
                </div>
                <div className="flex justify-between items-center text-indigo-200">
                  <span className="text-indigo-300/70">Education</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">
                    {schoolName || educationLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center text-indigo-200">
                  <span className="text-indigo-300/70">Experience</span>
                  <span className="font-semibold text-white">{experienceLevel}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-indigo-200 leading-relaxed">
                Next: We'll identify your skills with supporting evidence from your projects and background.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
