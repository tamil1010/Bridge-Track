import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, LogIn, Mail, Lock, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const SKILLS = ['Food', 'Medical', 'Education', 'Rescue', 'Other'];

export default function VolunteerAuth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = mode === 'login' ? '/api/volunteers/login' : '/api/volunteers/signup';
    const body = mode === 'login' 
      ? { email, password } 
      : { name, email, password, location, skills: selectedSkills };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('volunteer', JSON.stringify(data));
        navigate('/volunteer-dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Communication with server failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="flex justify-center py-12">
      <motion.div
        layout
        className="w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl"
      >
        <div className="flex border-b border-neutral-100">
          <button
            onClick={() => setMode('login')}
            className={cn(
              "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all",
              mode === 'login' ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "bg-neutral-50 text-neutral-400 hover:text-neutral-600"
            )}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={cn(
              "flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all",
              mode === 'signup' ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "bg-neutral-50 text-neutral-400 hover:text-neutral-600"
            )}
          >
            Sign Up
          </button>
        </div>

        <div className="p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {mode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {mode === 'login' ? 'Welcome Back' : 'Become a Responder'}
            </h2>
            <p className="text-sm text-neutral-500">
              {mode === 'login' ? 'Access your impact dashboard' : 'Join the community network for good'}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Full Name</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                      <Sparkles className="absolute left-3 top-3.5 text-neutral-400" size={18} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Service Location</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="Village/City"
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                      <MapPin className="absolute left-3 top-3.5 text-neutral-400" size={18} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Your Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-xs font-bold border transition-all",
                            selectedSkills.includes(skill)
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-indigo-300"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Address</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-3.5 text-neutral-400" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Security Password</label>
              <div className="relative">
                <input
                  required
                  type="password"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 pl-10 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-3.5 text-neutral-400" size={18} />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 active:scale-95 disabled:bg-neutral-400"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : mode === 'login' ? 'Continue to Dashboard' : 'Join Network'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkles({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
