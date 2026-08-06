import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../../components/SearchBar';
import DoctorCard from '../../components/DoctorCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import { doctorService } from '../../services/api';
import {
  Stethoscope,
  Heart,
  Sparkles,
  Activity,
  Baby,
  Bone,
  Brain,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  UserCheck,
  ChevronDown,
  Building2,
  PhoneCall,
  Zap
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [location, setLocation] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [specsRes, docsRes] = await Promise.all([
          doctorService.getSpecializations(),
          doctorService.getDoctors({ limit: 4 })
        ]);
        if (specsRes.data.success) setSpecializations(specsRes.data.specializations);
        if (docsRes.data.success) setFeaturedDoctors(docsRes.data.doctors.slice(0, 4));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (specialization && specialization !== 'all') params.set('specialization', specialization);
    if (location) params.set('location', location);
    navigate(`/find-doctors?${params.toString()}`);
  };

  const getSpecIcon = (iconName) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Activity': return <Activity className="w-6 h-6 text-sky-500" />;
      case 'Baby': return <Baby className="w-6 h-6 text-purple-500" />;
      case 'Bone': return <Bone className="w-6 h-6 text-emerald-500" />;
      case 'Brain': return <Brain className="w-6 h-6 text-indigo-500" />;
      default: return <Stethoscope className="w-6 h-6 text-emerald-500" />;
    }
  };

  const faqs = [
    {
      q: "How do I book an appointment on MediNova?",
      a: "Simply search for a doctor by specialty, city/district, or name, select your preferred date and available time slot, fill in your consultation reason, and confirm! You will receive instant confirmation."
    },
    {
      q: "Are all doctors on MediNova verified medical professionals?",
      a: "Yes. Every doctor listed on MediNova undergoes strict background, medical registration license, and hospital affiliation verification by our medical board before public listing."
    },
    {
      q: "Can I cancel or reschedule my appointment later?",
      a: "Yes. You can manage, reschedule, or cancel any upcoming appointment directly from your Patient Dashboard with zero cancellation fee."
    },
    {
      q: "Is my personal and medical history kept confidential?",
      a: "100%. MediNova employs bank-grade end-to-end encryption for all patient medical notes and appointment records in full compliance with healthcare privacy regulations."
    }
  ];

  return (
    <div className="space-y-28 pb-20 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-24 border-b border-slate-200/60 dark:border-white/10 bg-radial-glow bg-grid-mesh">
        
        {/* Soft Ambient Blur Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-soft"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-soft"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full glass-panel text-emerald-700 dark:text-emerald-300 font-bold text-xs shadow-sm border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>NABH Accredited & Verified Doctor Network</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                Redefining Modern <br />
                <span className="text-gradient-emerald">Clinical Appointments.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                Connect with India's most distinguished medical specialists. Discover real-time availability, schedule instantly with zero waiting time, and manage your health seamlessly.
              </p>

              {/* Hero Search Bar */}
              <div className="pt-2">
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
              </div>

              {/* Quick Key Highlights */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Slot Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>89 Doctors in Tamil Nadu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Booking Fees</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Card Stack Column (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md">
                
                {/* Main Hero Doctor Card */}
                <div className="glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-white/10 relative z-20">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
                      alt="Dr. Rajesh Sundaram"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">Dr. Rajesh Sundaram</h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Chief Senior Cardiologist</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Apollo Hospitals, Chennai</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Next Available Slot:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Today, 04:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="font-medium">Experience:</span>
                      <span className="font-bold">18+ Years</span>
                    </div>
                  </div>

                  <Link
                    to="/find-doctors"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Specialist Consultation</span>
                  </Link>
                </div>

                {/* Floating Badge 1 - Satisfaction Rating */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 z-30 glass-panel rounded-2xl p-3.5 shadow-xl border border-white/40 dark:border-white/10 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <StarRating rating={5.0} size="sm" />
                  </div>
                  <div>
                    <p className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">4.9 / 5.0 Rating</p>
                    <p className="text-[10px] text-slate-500 font-semibold">12,500+ Verified Patient Reviews</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2 - Live Appointment Alert */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -right-6 z-30 glass-panel rounded-2xl p-3.5 shadow-xl border border-white/40 dark:border-white/10 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Zap className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-xs text-slate-900 dark:text-white">Instant Booking Guarantee</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero Waiting Time at Clinic</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-20 pt-10 border-t border-slate-200/80 dark:border-white/10 text-center">
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">89+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Verified Doctors in TN</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">38</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Tamil Nadu Districts Covered</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">15,000+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Appointments Completed</p>
            </div>
            <div>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400">99.4%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Patient Satisfaction Rate</p>
            </div>
          </div>

        </div>
      </section>


      {/* --- MEDICAL SPECIALTIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3.5 py-1 rounded-full">
            Clinical Care Specialties
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
            Explore Doctors by Specialty
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Find certified medical specialists tailored to your specific health requirements across all major departments.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {specializations.map((spec, idx) => (
              <motion.div
                key={spec.specialization_id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  to={`/find-doctors?specialization=${encodeURIComponent(spec.specialization_name)}`}
                  className="group glass-card glass-card-hover rounded-3xl p-6 flex flex-col items-center text-center border border-slate-200/70 dark:border-white/10 block"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getSpecIcon(spec.icon)}
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {spec.specialization_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    {spec.description || 'Comprehensive clinical care & expert consultation'}
                  </p>
                  <span className="inline-block mt-3 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full">
                    {spec.doctor_count || 0} Doctors
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>


      {/* --- FEATURED DOCTORS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3.5 py-1 rounded-full">
              Top Rated Specialists
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
              Featured Doctors Near You
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Consult top-rated physicians, surgeons, and specialists with verified patient credentials.
            </p>
          </div>
          <Link
            to="/find-doctors"
            className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-4 md:mt-0 group"
          >
            <span>Browse All 89 Doctors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.doctor_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </div>
        )}
      </section>


      {/* --- WHY CHOOSE MEDINOVA SECTION --- */}
      <section className="bg-slate-900 text-white py-24 border-y border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1 rounded-full">
              The MediNova Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-4">
              Why Patients & Doctors Trust MediNova
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">
              Designed to eliminate clinic waiting queues and streamline healthcare booking across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "100% NABH Verified Doctors",
                desc: "Every listed physician undergoes strict license registration and credential checks by our medical board."
              },
              {
                icon: Clock,
                title: "Zero Waiting Queue",
                desc: "Book precise 30-minute time slots to consult your doctor immediately upon arriving at the clinic."
              },
              {
                icon: Calendar,
                title: "Seamless Rescheduling",
                desc: "Reschedule or cancel your appointments directly from your dashboard with 1-click convenience."
              },
              {
                icon: UserCheck,
                title: "Encrypted Health History",
                desc: "Your personal medical details and appointment history are stored with bank-grade encryption."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- HOW IT WORKS TIMELINE SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3.5 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
            How MediNova Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Book your medical appointment in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Search & Select Doctor",
              desc: "Filter by specialty, district location, consultation fee, or rating to find the ideal specialist."
            },
            {
              step: "02",
              title: "Choose Date & Time Slot",
              desc: "View live working hours and select a convenient 30-minute consultation time slot."
            },
            {
              step: "03",
              title: "Instant Confirmation",
              desc: "Receive instant booking confirmation and real-time dashboard notifications."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 text-center relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 font-heading font-extrabold text-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* --- HOSPITAL PARTNERS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Partnered with Leading Hospital Networks in South India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
            {['Apollo Hospitals', 'Fortis Healthcare', 'Manipal Hospitals', 'MIOT International', 'Kauvery Hospital', 'SIMS Hospital'].map((hospital, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm font-heading font-bold text-slate-700 dark:text-slate-300">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>{hospital}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- FAQ ACCORDION SECTION --- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-3.5 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mt-3">
            Have Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-heading font-bold text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* --- FINAL CALL TO ACTION BANNER --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-10 md:p-14 text-white overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3.5 py-1 rounded-full">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight">
              Ready to Book Your Doctor Consultation?
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              Join thousands of patients who book their appointments hassle-free with top-rated medical specialists across Tamil Nadu.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/find-doctors"
                className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
              >
                <span>Find Doctors & Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register?role=doctor"
                className="px-6 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition-colors"
              >
                Register as a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
