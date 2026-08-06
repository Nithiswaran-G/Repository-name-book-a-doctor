import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doctorService, appointmentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Award,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  Heart
} from 'lucide-react';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slotsInfo, setSlotsInfo] = useState({ available: false, slots: [], message: '' });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getDoctorById(id);
        if (res.data.success) {
          setDoctor(res.data.doctor);
        }
      } catch (err) {
        console.error('Fetch doctor profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Fetch available slots when selectedDate changes
  useEffect(() => {
    if (!id || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setSelectedTime('');
        setErrorMessage('');
        const res = await appointmentService.getSlots(id, selectedDate);
        if (res.data.success) {
          setSlotsInfo(res.data);
        }
      } catch (err) {
        console.error('Fetch slots error:', err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [id, selectedDate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/doctors/${id}`));
      return;
    }

    if (user.role !== 'patient') {
      setErrorMessage('Only registered patients can book doctor appointments.');
      return;
    }

    if (!selectedTime) {
      setErrorMessage('Please select an available time slot for your appointment.');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await appointmentService.createAppointment({
        doctor_id: doctor.doctor_id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason || 'General Specialist Consultation'
      });

      if (res.data.success) {
        setBookingSuccess(true);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading doctor profile & clinic availability..." />;
  if (!doctor) return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Doctor Profile Not Found</h3>
      <button onClick={() => navigate('/find-doctors')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs">
        Return to Doctors List
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* --- DOCTOR PROFILE HERO BANNER --- */}
      <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={doctor.profile_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
                alt={doctor.doctor_name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 ring-4 ring-white dark:ring-slate-900" title="Verified Practitioner">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  {doctor.specialization_name}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {doctor.qualifications || 'MBBS, MD'}
                </span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                {doctor.doctor_name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-teal-500" />
                  <span>{doctor.hospital || 'Specialty Clinic'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{doctor.location}, {doctor.state || 'Tamil Nadu'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <span>{doctor.languages || 'Tamil, English'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating & Fee Box */}
          <div className="flex flex-col items-start md:items-end space-y-2 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0">
            <StarRating rating={doctor.rating || 4.8} size="md" />
            <div className="flex items-baseline font-bold text-slate-900 dark:text-white pt-1">
              <span className="text-2xl text-emerald-600 dark:text-emerald-400">₹{doctor.consultation_fee}</span>
              <span className="text-xs font-medium text-slate-400 ml-1">/ Consultation</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
              Instant Appointment Guarantee
            </span>
          </div>

        </div>
      </div>


      {/* --- CONTENT LAYOUT: DETAILS vs STICKY BOOKING PANEL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: About, Schedule & Reviews (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* About Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-3">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              <span>About {doctor.doctor_name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {doctor.about || `${doctor.doctor_name} is a senior medical specialist with over ${doctor.experience} years of clinical experience in ${doctor.specialization_name}. Affiliated with top medical institutions, providing expert diagnosis and personalized patient care.`}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block text-[11px]">Clinical Experience</span>
                <span className="text-slate-900 dark:text-white text-sm font-bold">{doctor.experience}+ Years Active</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Verification Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold capitalize">{doctor.verification_status || 'Approved'}</span>
              </div>
            </div>
          </div>

          {/* Working Schedule Table */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Weekly Consultation Schedule</span>
            </h3>

            {doctor.availability && doctor.availability.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctor.availability.map((avail) => (
                  <div key={avail.availability_id || avail._id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{avail.day}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{avail.start_time} - {avail.end_time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">Monday to Saturday: 09:00 AM - 05:00 PM</p>
            )}
          </div>

          {/* Patient Reviews */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                <span>Patient Feedback & Reviews ({doctor.reviews?.length || 0})</span>
              </h3>
              <StarRating rating={doctor.rating || 4.8} size="sm" />
            </div>

            {doctor.reviews && doctor.reviews.length > 0 ? (
              <div className="space-y-4">
                {doctor.reviews.map((rev) => (
                  <div key={rev.review_id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={rev.patient_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                          alt={rev.patient_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{rev.patient_name}</span>
                      </div>
                      <StarRating rating={rev.rating} size="xs" showNumber={false} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium text-center py-4">No reviews posted yet. Be the first patient to review after your appointment!</p>
            )}
          </div>

        </div>


        {/* RIGHT COLUMN: STICKY BOOKING PANEL (5 cols) */}
        <div className="lg:col-span-5 sticky top-28">
          
          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Book Appointment</h3>
                <p className="text-xs text-slate-500 font-medium">Select date & live time slot</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{doctor.consultation_fee}</span>
                <span className="text-[10px] text-slate-400 block font-medium">Inclusive of taxes</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-5">
              
              {/* 1. SELECT DATE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Consultation Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* 2. LIVE TIME SLOTS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    2. Available Slots ({slotsInfo.day || ''})
                  </label>
                  {slotsInfo.available && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      ● Doctor Working
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-slate-400 animate-pulse font-medium">Checking live slot availability...</div>
                ) : !slotsInfo.available ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 text-amber-700 dark:text-amber-300 text-xs text-center font-semibold">
                    {slotsInfo.message || 'Doctor is not available on this date.'}
                  </div>
                ) : slotsInfo.slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {slotsInfo.slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                          slot.isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed line-through'
                            : selectedTime === slot.time
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                            : 'bg-slate-100/70 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 font-medium">No slots available for this date.</p>
                )}
              </div>

              {/* 3. REASON FOR APPOINTMENT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  3. Consultation Reason
                </label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms or consultation reason..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              {/* CONFIRM BOOKING CTA */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-2xl font-heading font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all"
              >
                {bookingLoading ? (
                  <span>Processing Appointment...</span>
                ) : (
                  <>
                    <span>Confirm & Book Visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>

        </div>

      </div>


      {/* --- SUCCESS MODAL POPUP --- */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/20 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                Appointment Booked!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Your consultation request with <strong className="text-emerald-500">{doctor.doctor_name}</strong> for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been submitted.
              </p>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate('/patient/dashboard')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs rounded-2xl shadow-lg"
                >
                  Go to My Appointments
                </button>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="w-full py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl"
                >
                  Book Another Slot
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
