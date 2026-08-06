import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { appointmentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AppointmentCard from '../../components/AppointmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { Calendar, Clock, CheckCircle2, AlertCircle, Settings, Users, Star, ShieldCheck, Sparkles } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getAppointments();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Doctor appts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const pendingRequests = appointments.filter(a => a.status === 'Pending');
  const confirmedAppts = appointments.filter(a => a.status === 'Confirmed');
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  const handleUpdateStatus = async (id, status) => {
    await appointmentService.updateStatus(id, status);
    fetchDoctorAppointments();
  };

  if (loading) return <LoadingSpinner message="Loading doctor dashboard & schedule..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Verification Notice if Pending Admin Approval */}
      {user?.verification_status === 'pending' && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-3xl flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-sm text-amber-900 dark:text-amber-200">Registration Pending Admin Verification</h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
              Your doctor application has been submitted and is currently being reviewed by the platform administrator. Once verified, your clinic schedule will be publicly listed.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3 py-1 rounded-full">
              Doctor Console
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              user?.verification_status === 'approved'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            }`}>
              {user?.verification_status || 'Approved Specialist'}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-2">
            Physician Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Manage consultation requests, patient schedules, and weekly slot availability
          </p>
        </div>

        <Link
          to="/doctor/availability"
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center space-x-2 transition-all w-fit"
        >
          <Settings className="w-4 h-4" />
          <span>Manage Working Schedule</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</p>
            <p className="font-heading text-3xl font-extrabold text-amber-500 mt-1">{pendingRequests.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirmed Visits</p>
            <p className="font-heading text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{confirmedAppts.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Visits</p>
            <p className="font-heading text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">{completedAppts.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Doctor Rating</p>
            <p className="font-heading text-3xl font-extrabold text-amber-500 mt-1">{user?.rating ? user.rating.toFixed(1) : '4.9'} ★</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-current" />
          </div>
        </motion.div>

      </div>

      {/* Appointment Requests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Patient Appointments & Requests</h2>
          <span className="text-xs font-semibold text-slate-500">Total: {appointments.length} Consultations</span>
        </div>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.appointment_id}
                appointment={appt}
                role="doctor"
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10">
            <Calendar className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">No Patient Requests Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">When patients book consultations on your profile, requests will appear here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
