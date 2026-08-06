import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheck, Users, Calendar, Stethoscope, Clock, CheckCircle2, Award, Plus, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingDoctors()
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (pendingRes.data.success) setPendingDoctors(pendingRes.data.pendingDoctors);
    } catch (err) {
      console.error('Admin dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerification = async (doctorId, status) => {
    await adminService.updateDoctorVerification(doctorId, status);
    fetchAdminData();
  };

  if (loading) return <LoadingSpinner message="Loading MediNova admin control center..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3 py-1 rounded-full">
            Admin Console
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-2 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <span>Administrator Control Center</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Platform overview, doctor verification requests, and user statistics
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/approvals"
            className="px-4 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-lg hover:bg-amber-400 transition-colors flex items-center space-x-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Pending Approvals ({pendingDoctors.length})</span>
          </Link>
          <Link
            to="/admin/specializations"
            className="px-4 py-3 bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Specializations</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Patients</p>
          <p className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{stats?.totalPatients || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Registered Patient Accounts</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved Doctors</p>
          <p className="font-heading text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats?.approvedDoctors || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Publicly Listed Doctors</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Verification</p>
          <p className="font-heading text-3xl font-extrabold text-amber-500 mt-1">{stats?.pendingDoctors || 0}</p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">Awaiting Approval</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Appointments</p>
          <p className="font-heading text-3xl font-extrabold text-indigo-500 mt-1">{stats?.totalAppointments || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Platform Consultations</p>
        </motion.div>

      </div>

      {/* Main Grid: Pending Doctor Registrations & Quick Admin Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Doctor Approval Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Doctor Verification Queue</span>
            </h2>
            <Link to="/admin/approvals" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All Queue
            </Link>
          </div>

          {pendingDoctors.length > 0 ? (
            <div className="space-y-4">
              {pendingDoctors.map((doc) => (
                <div key={doc.doctor_id} className="glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img src={doc.profile_image} alt={doc.doctor_name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20" />
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">{doc.doctor_name}</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{doc.specialization_name} • {doc.experience} Yrs Exp.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{doc.qualifications} | {doc.hospital}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerification(doc.doctor_id, 'approved')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerification(doc.doctor_id, 'rejected')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-10 text-center border border-slate-200/80 dark:border-white/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Verification Queue Clear</h3>
              <p className="text-xs text-slate-400 font-medium">No doctor verification applications pending right now.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Navigation Tools */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Admin Quick Console</h3>
            <div className="space-y-2">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-colors group"
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500">User Directory (Patients & Doctors)</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </Link>

              <Link
                to="/admin/appointments"
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-colors group"
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500">Platform Consultations Master List</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </Link>

              <Link
                to="/admin/specializations"
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-colors group"
              >
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-500">Manage Specializations (CRUD)</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
