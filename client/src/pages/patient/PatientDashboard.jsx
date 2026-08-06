import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { appointmentService, favoriteService, notificationService } from '../../services/api';
import AppointmentCard from '../../components/AppointmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Clock, Heart, Bell, UserCheck, Search, Sparkles, ArrowRight, Activity } from 'lucide-react';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [apptsRes, favsRes, notifsRes] = await Promise.all([
        appointmentService.getAppointments(),
        favoriteService.getFavorites(),
        notificationService.getNotifications()
      ]);

      if (apptsRes.data.success) setAppointments(apptsRes.data.appointments);
      if (favsRes.data.success) setFavorites(favsRes.data.favorites);
      if (notifsRes.data.success) setNotifications(notifsRes.data.notifications);
    } catch (err) {
      console.error('Patient dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const upcomingAppts = appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed');
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  const handleUpdateStatus = async (id, newStatus) => {
    await appointmentService.updateStatus(id, newStatus);
    fetchDashboardData();
  };

  if (loading) return <LoadingSpinner message="Loading patient portal..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3 py-1 rounded-full">
            Patient Portal
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-2">
            My Medical Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Manage your doctor appointments, health history, and saved medical specialists
          </p>
        </div>

        <Link
          to="/find-doctors"
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs shadow-xl flex items-center justify-center space-x-2 transition-all w-fit"
        >
          <Search className="w-4 h-4" />
          <span>Find & Book Specialist</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming Visits</p>
            <p className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{upcomingAppts.length}</p>
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
            <UserCheck className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Saved Doctors</p>
            <p className="font-heading text-3xl font-extrabold text-rose-500 mt-1">{favorites.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">System Alerts</p>
            <p className="font-heading text-3xl font-extrabold text-indigo-500 mt-1">{notifications.length}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Upcoming Appointments vs Quick Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upcoming Appointments */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">Upcoming Appointments</h2>
            <Link to="/patient/my-appointments" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View History ({appointments.length})
            </Link>
          </div>

          {upcomingAppts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcomingAppts.map((appt) => (
                <AppointmentCard
                  key={appt.appointment_id}
                  appointment={appt}
                  role="patient"
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-10 text-center border border-slate-200/80 dark:border-white/10 space-y-4">
              <Calendar className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">No Upcoming Visits</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                You have no pending or confirmed doctor consultations scheduled.
              </p>
              <Link
                to="/find-doctors"
                className="inline-block px-5 py-2.5 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs rounded-2xl shadow"
              >
                Find & Book Specialist
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Favorites & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Favorite Doctors Quick Widget */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Saved Specialists</span>
              </h3>
              <Link to="/patient/favorites" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View All
              </Link>
            </div>

            {favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites.slice(0, 3).map((fav) => (
                  <div key={fav.favorite_id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <img src={fav.profile_image} alt={fav.doctor_name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{fav.doctor_name}</h4>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{fav.specialization_name}</p>
                      </div>
                    </div>
                    <Link
                      to={`/doctors/${fav.doctor_id}`}
                      className="px-3 py-1.5 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-[11px] rounded-xl shadow"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 font-medium">No saved doctors yet. Click heart on doctor cards to save!</p>
            )}
          </div>

          {/* Notifications Quick Widget */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Bell className="w-4 h-4 text-indigo-500" />
                <span>Recent Alerts</span>
              </h3>
              <Link to="/patient/notifications" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Notifications
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n.notification_id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 font-medium">No recent notifications.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
