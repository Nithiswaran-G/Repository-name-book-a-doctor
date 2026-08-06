import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Mail, Phone, MapPin, ShieldCheck, ArrowRight, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] text-slate-400 pt-20 pb-10 border-t border-white/10 transition-colors relative overflow-hidden">
      {/* Soft Glow Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                Medi<span className="text-gradient-emerald">Nova</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              MediNova is an elite clinical appointment platform connecting patients with top-rated medical specialists across India. Book appointments instantly with full privacy & zero waiting time.
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Medical Specialists & NABH Clinics</span>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/find-doctors" className="hover:text-emerald-400 transition-colors">Find a Doctor</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About MediNova</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/register?role=doctor" className="text-emerald-400 hover:text-emerald-300 font-bold">Join as a Doctor</Link>
              </li>
            </ul>
          </div>

          {/* Specialties (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">Specialties</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-medium">
              <li>Cardiology & Heart Surgery</li>
              <li>Dermatology & Cosmetology</li>
              <li>Neurology & Spine Care</li>
              <li>Pediatrics & Newborn Care</li>
              <li>Orthopedics & Joint Replacement</li>
              <li>General Internal Medicine</li>
            </ul>
          </div>

          {/* Contact & Newsletter (3 cols) */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider">MediNova Health Desk</h4>
            <div className="space-y-3 text-xs font-medium text-slate-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>MediNova Towers, Anna Salai, Chennai, Tamil Nadu 600002</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 (044) 4800-DOCTOR</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@medinova.com</span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-300 mb-2">Subscribe to Health Updates</p>
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 focus-within:border-emerald-500 transition-colors">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-transparent text-xs text-white px-3 focus:outline-none w-full placeholder-slate-500"
                />
                <button className="p-2 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0 font-medium">
          <p>© {new Date().getFullYear()} MediNova Healthcare Inc. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>for clinical excellence and patient care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
