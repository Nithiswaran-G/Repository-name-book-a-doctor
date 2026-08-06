import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/api';
import { Stethoscope, User, Lock, Mail, Phone, MapPin, Award, Building2, AlertCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  
  const { registerPatient, registerDoctor } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Patient specific
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [medicalInfo, setMedicalInfo] = useState('');

  // Doctor specific
  const [specId, setSpecId] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [experience, setExperience] = useState('5');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('Chennai');
  const [fee, setFee] = useState('650');
  const [about, setAbout] = useState('');
  const [languages, setLanguages] = useState('Tamil, English');

  useEffect(() => {
    doctorService.getSpecializations().then((res) => {
      if (res.data.success) {
        setSpecializations(res.data.specializations);
        if (res.data.specializations.length > 0) {
          setSpecId(res.data.specializations[0].specialization_id);
        }
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (role === 'patient') {
        const data = await registerPatient({
          name,
          email,
          password,
          phone,
          address,
          date_of_birth: dob,
          gender,
          medical_information: medicalInfo
        });
        if (data.success) {
          setSuccessMessage('Registration successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/patient/dashboard'), 1200);
        }
      } else {
        const data = await registerDoctor({
          name,
          email,
          password,
          phone,
          address,
          specialization_id: specId,
          qualifications,
          experience,
          hospital,
          location,
          consultation_fee: fee,
          about,
          languages
        });
        if (data.success) {
          setSuccessMessage('Doctor application submitted! Redirecting to doctor portal...');
          setTimeout(() => navigate('/doctor/dashboard'), 1500);
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed. Please check input details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-radial-glow">
      
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6 relative z-10"
      >
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            Create Your MediNova Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Join India's premier healthcare and doctor appointment network
          </p>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              role === 'patient'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register as Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              role === 'doctor'
                ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register as Doctor
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Common Fields Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-emerald-500 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'doctor' ? 'Dr. Rajesh Sundaram' : 'John Doe'}
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Common Fields Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-emerald-500 absolute left-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Doctor Specific Fields */}
          {role === 'doctor' ? (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Medical Specialization
                  </label>
                  <select
                    value={specId}
                    onChange={(e) => setSpecId(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {specializations.map((spec) => (
                      <option key={spec.specialization_id} value={spec.specialization_id}>
                        {spec.specialization_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    required
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="MBBS, MD (Cardiology)"
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    District / City
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Chennai"
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="Apollo Specialty Hospital"
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

            </div>
          ) : (
            /* Patient Specific Fields */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-transparent focus:border-emerald-500 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-heading font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>Creating MediNova Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}
