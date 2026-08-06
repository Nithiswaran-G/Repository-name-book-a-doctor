import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import DoctorCard from '../../components/DoctorCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorService, favoriteService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Frown, Sparkles, Filter, RotateCcw } from 'lucide-react';

export default function FindDoctor() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  // Filter States
  const [maxFee, setMaxFee] = useState(1000);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [minExperience, setMinExperience] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [availableDay, setAvailableDay] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch Specializations & Favorites on mount
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const specRes = await doctorService.getSpecializations();
        if (specRes.data.success) setSpecializations(specRes.data.specializations);

        if (user && user.role === 'patient') {
          const favRes = await favoriteService.getFavorites();
          if (favRes.data.success) {
            setFavoriteIds(new Set(favRes.data.favorites.map(f => f.doctor_id)));
          }
        }
      } catch (err) {
        console.error('Fetch specs/favs error:', err);
      }
    };
    fetchInit();
  }, [user]);

  // Fetch Doctors with API Search & Filter parameters
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        specialization: specialization,
        location: selectedDistrict !== 'all' ? selectedDistrict : location,
        state: selectedState !== 'all' ? selectedState : undefined,
        maxFee: maxFee < 1000 ? maxFee : undefined,
        minExperience: minExperience > 0 ? minExperience : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        day: availableDay || undefined,
        sortBy: sortBy
      };

      const res = await doctorService.getDoctors(params);
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error('Fetch doctors error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, selectedState, selectedDistrict, maxFee, minExperience, minRating, availableDay, sortBy]);

  const handleSearchSubmit = () => {
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSpecialization('all');
    setLocation('');
    setSelectedState('all');
    setSelectedDistrict('all');
    setMaxFee(1000);
    setMinExperience(0);
    setMinRating(0);
    setAvailableDay('');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-left space-y-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          MediNova Doctor Directory
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find & Book Verified Specialists
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl font-medium">
          Browse verified doctors across all 38 Tamil Nadu districts. Filter by specialty, consultation fee, experience, or instant slot availability.
        </p>
      </div>

      {/* Main Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        specialization={specialization}
        setSpecialization={setSpecialization}
        location={location}
        setLocation={setLocation}
        specializations={specializations}
        onSearch={handleSearchSubmit}
      />

      {/* Content Layout: Filter Sidebar + Doctor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filter Panel Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-28">
          <FilterPanel
            maxFee={maxFee}
            setMaxFee={setMaxFee}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            minExperience={minExperience}
            setMinExperience={setMinExperience}
            minRating={minRating}
            setMinRating={setMinRating}
            availableDay={availableDay}
            setAvailableDay={setAvailableDay}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        {/* Doctor Results List */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Results Status Header */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Showing <span className="text-emerald-600 dark:text-emerald-400 text-sm">{doctors.length}</span> Verified Specialists
            </span>
            <span className="text-xs font-semibold text-slate-500">Sorted by {sortBy.replace('_', ' ')}</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Querying MediNova Doctor Database..." />
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {doctors.map((doc, idx) => (
                <motion.div
                  key={doc.doctor_id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <DoctorCard
                    doctor={doc}
                    initialIsFavorite={favoriteIds.has(doc.doctor_id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-14 text-center border border-slate-200/80 dark:border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Frown className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">No Specialists Match Your Criteria</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                No doctors matched your exact district, fee cap, or rating criteria. Try resetting your search filters to see all 89 doctors.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
