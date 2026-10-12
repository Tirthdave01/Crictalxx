import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Mail, CheckCircle2, X, Sparkles, LogIn, UserPlus, KeyRound } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('user'); // 'user', 'admin', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleToLogin) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleToLogin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Quick login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md bg-[#09111c] rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-5 border-b border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xl shadow-emerald-500/25">
            🏏
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            {tab === 'admin' ? 'Match Referee Sign-In' : tab === 'register' ? 'Register Cricketer Account' : 'Player Sign-In'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {tab === 'admin' 
              ? 'Authorized access to question bank and tournament control' 
              : 'Sign in to save your match scores, earn certificates & trophies'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 my-5 text-xs font-mono">
          <button
            onClick={() => { setTab('user'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'user' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Player
          </button>
          <button
            onClick={() => { setTab('admin'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'admin' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Referee
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="mb-5 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            ⚡ Quick 1-Click Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition text-[11px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin (Tirth)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition text-[11px]"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Demo Player</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Forms */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Virat Fan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="player@crictalxx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Player Account'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleStandardLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {tab === 'admin' ? 'Admin Email' : 'Player Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder={tab === 'admin' ? 'admin@crictalxx.com' : 'player@crictalxx.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder={tab === 'admin' ? 'admin123' : 'player123'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Default: <span className="font-mono text-slate-400">{tab === 'admin' ? 'admin@crictalxx.com / admin123' : 'player@crictalxx.com / player123'}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : tab === 'admin' ? 'Sign In as Admin' : 'Sign In as Player'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
