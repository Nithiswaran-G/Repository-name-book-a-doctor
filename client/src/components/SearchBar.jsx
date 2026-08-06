import React from 'react';
import { Search, MapPin, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  specialization,
  setSpecialization,
  location,
  setLocation,
  specializations = [],
  onSearch
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl p-3 shadow-2xl border border-slate-200/80 dark:border-white/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
    >
      {/* Doctor Name Search */}
      <div className="md:col-span-4 relative flex items-center">
        <Search className="w-5 h-5 text-emerald-500 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctor name or hospital..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Specialization Dropdown */}
      <div className="md:col-span-4 relative flex items-center">
        <Stethoscope className="w-5 h-5 text-teal-500 absolute left-4 pointer-events-none" />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none appearance-none transition-all cursor-pointer shadow-inner"
        >
          <option value="all">All Specialties ({specializations.length})</option>
          {specializations.map((spec) => (
            <option key={spec.specialization_id} value={spec.specialization_name}>
              {spec.specialization_name} ({spec.doctor_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Location Input */}
      <div className="md:col-span-3 relative flex items-center">
        <MapPin className="w-5 h-5 text-rose-500 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="District / City (e.g. Chennai)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-1">
        <button
          type="submit"
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-2xl font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all group"
          title="Search Specialists"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
}
