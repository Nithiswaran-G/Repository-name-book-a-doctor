import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { MapPin, Building2, Award, Calendar, Heart, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DoctorCard({ doctor, initialIsFavorite = false, onFavoriteToggle = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') return;

    try {
      setFavLoading(true);
      const res = await favoriteService.toggleFavorite(doctor.doctor_id);
      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);
        if (onFavoriteToggle) onFavoriteToggle(doctor.doctor_id, res.data.isFavorite);
      }
    } catch (err) {
      console.error('Favorite error:', err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group border border-slate-200/80 dark:border-white/10"
    >
      {/* Top Subtle Emerald Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 group-hover:h-1.5 transition-all duration-300"></div>

      <div>
        {/* Doctor Header & Avatar */}
        <div className="flex items-start justify-between space-x-4 mb-5 pt-1">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={doctor.profile_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
                alt={doctor.doctor_name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
                }}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 ring-2 ring-white dark:ring-slate-900" title="Verified Specialist">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                {doctor.doctor_name}
              </h3>

              <span className="inline-flex items-center gap-1 px-3 py-1 mt-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                {doctor.specialization_name}
              </span>
            </div>
          </div>

          {/* Favorite Toggle Button */}
          {user?.role === 'patient' && (
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`p-2.5 rounded-2xl border transition-all ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/50 dark:border-rose-800/60 shadow-sm'
                  : 'bg-slate-100/60 border-slate-200 text-slate-400 hover:text-rose-500 dark:bg-slate-800/60 dark:border-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save doctor'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Info Grid Pills */}
        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 my-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-200">
              <Award className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{doctor.qualifications || 'MBBS, MD'}</span>
            </div>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full text-[11px]">
              {doctor.experience} Yrs Exp.
            </span>
          </div>

          <div className="flex items-center space-x-1.5 font-medium text-slate-600 dark:text-slate-400 truncate">
            <Building2 className="w-4 h-4 text-teal-500 shrink-0" />
            <span className="truncate">{doctor.hospital || 'Specialty Hospital'}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/60">
            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 truncate max-w-[60%]">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{doctor.location}, {doctor.state || 'TN'}</span>
            </div>

            <div className="flex items-baseline font-bold text-slate-900 dark:text-white">
              <span className="text-emerald-600 dark:text-emerald-400 text-base">₹{doctor.consultation_fee}</span>
              <span className="text-[10px] font-medium text-slate-400 ml-1">/ visit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Rating & Action Button */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={doctor.rating || 4.8} size="sm" />
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Slots Available
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to={`/doctors/${doctor.doctor_id}`}
            className="w-full py-2.5 text-center rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Profile Details
          </Link>

          <Link
            to={`/doctors/${doctor.doctor_id}`}
            className="w-full py-2.5 text-center rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 shadow-md transition-all flex items-center justify-center space-x-1.5 group/btn"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </Link>
        </div>
      </div>

    </motion.div>
  );
}
