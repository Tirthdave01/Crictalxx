import React from 'react';
import { Trophy, HelpCircle, UserCheck, ShieldAlert, Award, Search, Sparkles, LogIn, LogOut, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenLogin, 
  onLogout 
}) {
  const isAdmin = currentUser?.role === 'admin';

  const handleAdminTabClick = () => {
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      onOpenLogin('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080e18]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top Mini Broadcast Live Ticker */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-amber-950/80 border-b border-white/5 py-1 px-4 text-[10px] flex items-center justify-between text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[9px] animate-pulse">
            ● LIVE MATCH CENTER
          </span>
          <span className="hidden sm:inline text-slate-400">
            CRICTALXX CHAMPIONSHIP • THIRD-UMPIRE REPLAY ACTIVE • MCC LAWS VERIFIED
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="hidden md:inline">SPEED: <strong className="text-amber-400">152 KM/H</strong></span>
          <span>CERTIFICATION: <strong className="text-emerald-400">ONLINE</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand with Stadium Emblem */}
          <div 
            onClick={() => setActiveTab('quizzes')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-all">
                <span className="text-2xl drop-shadow">🏏</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#080e18] flex items-center justify-center">
                <Zap className="w-2.5 h-2.5 text-slate-950 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors uppercase">
                  Crictal<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">xx</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 rounded">
                  ELITE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Stadium Quiz & Digital Honors</p>
            </div>
          </div>

          {/* Navigation Tabs with Neon Active Styling */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                activeTab === 'quizzes'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy className={`w-3.5 h-3.5 ${activeTab === 'quizzes' ? 'text-emerald-400' : ''}`} />
              <span>Match Arenas</span>
            </button>

            <button
              onClick={() => setActiveTab('guess_player')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                activeTab === 'guess_player'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${activeTab === 'guess_player' ? 'text-emerald-400' : ''}`} />
              <span>Guess The Player</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-emerald-400' : ''}`} />
              <span>Cricketer Dashboard</span>
            </button>

            <button
              onClick={handleAdminTabClick}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                activeTab === 'admin'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10'
                  : isAdmin
                  ? 'border-transparent text-amber-400 hover:text-white hover:bg-amber-500/10'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Referee Panel</span>
              {!isAdmin && <span className="text-[10px] opacity-75">🔒</span>}
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                activeTab === 'verify'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'verify' ? 'text-emerald-400' : ''}`} />
              <span>Verify Cert</span>
            </button>
          </nav>

          {/* User & Role Controls with Broadcast Pill */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div 
                  onClick={() => onOpenLogin(isAdmin ? 'admin' : 'user')}
                  className={`border rounded-xl px-3 py-1.5 flex items-center space-x-2.5 cursor-pointer transition ${
                    isAdmin 
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-lg shadow-amber-500/10' 
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/40'
                  }`}
                  title="Click to switch account"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${
                    isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isAdmin ? 'REFEREE' : 'PLAYER'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition border border-white/5"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenLogin('user')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/25 transition active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`font-semibold ${activeTab === 'quizzes' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('guess_player')}
            className={`font-semibold ${activeTab === 'guess_player' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Guess Player
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-semibold ${activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={handleAdminTabClick}
            className={`font-semibold ${activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            Referee {isAdmin ? '✓' : '🔒'}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`font-semibold ${activeTab === 'verify' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            Verify
          </button>
        </div>
      </div>
    </header>
  );
}
