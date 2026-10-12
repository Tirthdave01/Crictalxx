import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QuizPlayer from './components/QuizPlayer';
import GuessPlayerMode from './components/GuessPlayerMode';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import VerifyCertificate from './components/VerifyCertificate';
import CertificateModal from './components/CertificateModal';
import LoginModal from './components/LoginModal';
import { Trophy, Timer, Award, Play, Search, Zap, Star, ShieldCheck, ArrowRight, Sparkles, ShieldAlert, Lock, LogIn, Flame, Crosshair, BarChart3 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('crictalxx_user_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'player_rohit',
      name: 'Cricket Fan',
      email: 'player@crictalxx.com',
      role: 'user'
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalDefaultTab, setLoginModalDefaultTab] = useState('user');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [verifyInitialId, setVerifyInitialId] = useState('');
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [matchDifficultyFilter, setMatchDifficultyFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('crictalxx_user_auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('crictalxx_user_auth');
    }
  }, [currentUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (verifyId) {
      setVerifyInitialId(verifyId);
      setActiveTab('verify');
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    try {
      const res = await fetch('/api/quizzes');
      const data = await res.json();
      setQuizzes(data || []);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
  };

  const handleEarnCertificate = (cert) => {
    setActiveCertificate(cert);
  };

  const handleOpenLogin = (targetRole = 'user') => {
    setLoginModalDefaultTab(targetRole === 'admin' ? 'admin' : 'user');
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('quizzes');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col stadium-bg text-slate-100">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setSelectedQuizId(null);
          setActiveTab(tab);
        }} 
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedQuizId ? (
          <QuizPlayer
            quizId={selectedQuizId}
            userName={currentUser?.name || 'Cricket Fan'}
            userId={currentUser?.id || 'player_rohit'}
            onEarnCertificate={handleEarnCertificate}
            onBack={() => {
              setSelectedQuizId(null);
              fetchQuizzes();
            }}
          />
        ) : (
          <>
            {/* TAB: MATCH QUIZZES */}
            {activeTab === 'quizzes' && (
              <div className="space-y-10">
                {/* Hero Stadium Floodlight Banner */}
                <div className="relative overflow-hidden rounded-3xl broadcast-card p-8 sm:p-12 border border-white/10 shadow-2xl">
                  {/* Stadium Glow Orbs */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-5">
                      <Flame className="w-4 h-4 text-emerald-400 fill-current" />
                      <span>Season 2026 • High-Stakes Cricket IQ Arena</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
                      Test Your Cricket IQ. <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
                        Earn Official Signed Honors.
                      </span>
                    </h1>

                    <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                      Compete in authentic cricket brain-busters: <strong className="text-rose-400">Death Overs Masterclasses</strong>, third-umpire origins, MCC law disputes, and <strong className="text-emerald-400">Guess the Player</strong> clue dossiers. Score 75%+ to claim your verified honors certificate officially signed by founder <strong className="text-amber-300 font-bold">Tirth</strong>.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <button
                        onClick={() => {
                          setMatchDifficultyFilter('Hard');
                          const hardQuiz = quizzes.find(q => q.id === 'quiz-hard-death-overs');
                          if (hardQuiz) handleStartQuiz(hardQuiz.id);
                        }}
                        className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-xl shadow-rose-500/25 transition flex items-center gap-2 active:scale-95"
                      >
                        <Flame className="w-4 h-4 fill-current" />
                        <span>Play Hardcore Match (Death Overs)</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('guess_player')}
                        className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-300 font-bold rounded-xl text-xs sm:text-sm border border-emerald-500/30 transition flex items-center gap-2 hover:border-emerald-400"
                      >
                        <Search className="w-4 h-4 text-emerald-400" />
                        <span>Guess The Player Dossier</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm border border-white/10 transition flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4 text-amber-400" />
                        <span>Cricketer Stats</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Match Arenas Section & Difficulty HUD Filter */}
                <div>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                          Match Championship Arenas
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Select your challenge division: Powerplay fundamentals, Middle Overs tactics, or Death Overs brain-teasers
                      </p>
                    </div>

                    {/* Filter HUD Selector */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-[#09111c] p-1.5 rounded-2xl border border-white/10 shadow-lg text-xs">
                      <button
                        onClick={() => setMatchDifficultyFilter('all')}
                        className={`px-3.5 py-2 rounded-xl font-bold transition ${
                          matchDifficultyFilter === 'all' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        All Arenas ({quizzes.length})
                      </button>

                      <button
                        onClick={() => setMatchDifficultyFilter('Hard')}
                        className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          matchDifficultyFilter === 'Hard' 
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                            : 'text-rose-400 hover:bg-rose-950/40'
                        }`}
                      >
                        <span>🔴 Hard (Death Overs)</span>
                      </button>

                      <button
                        onClick={() => setMatchDifficultyFilter('Medium')}
                        className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          matchDifficultyFilter === 'Medium' 
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                            : 'text-amber-400 hover:bg-amber-950/40'
                        }`}
                      >
                        <span>🟡 Medium (Tactical)</span>
                      </button>

                      <button
                        onClick={() => setMatchDifficultyFilter('Easy')}
                        className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                          matchDifficultyFilter === 'Easy' 
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                            : 'text-emerald-400 hover:bg-emerald-950/40'
                        }`}
                      >
                        <span>🟢 Easy (Powerplay)</span>
                      </button>
                    </div>
                  </div>

                  {loadingQuizzes ? (
                    <div className="text-center py-16 text-slate-400">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="font-semibold text-sm">Pre-match pitch inspection in progress...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quizzes
                        .filter(quiz => matchDifficultyFilter === 'all' || quiz.difficulty === matchDifficultyFilter || quiz.id.toLowerCase().includes(matchDifficultyFilter.toLowerCase()))
                        .map((quiz) => {
                          const isHard = quiz.difficulty === 'Hard' || quiz.id.includes('hard');
                          const isEasy = quiz.difficulty === 'Easy' || quiz.id.includes('easy');

                          const diffMeta = isHard
                            ? { label: 'DEATH OVERS • HARD', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30', borderHover: 'hover:border-rose-500/50' }
                            : isEasy
                            ? { label: 'POWERPLAY • EASY', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', borderHover: 'hover:border-emerald-500/50' }
                            : { label: 'MIDDLE OVERS • MEDIUM', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', borderHover: 'hover:border-amber-500/50' };

                          return (
                            <div
                              key={quiz.id}
                              className={`broadcast-card rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group ${diffMeta.borderHover}`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${diffMeta.color}`}>
                                    {diffMeta.label}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/5">
                                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                                    {quiz.time_limit_sec}s Limit
                                  </span>
                                </div>

                                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                                  {quiz.title}
                                </h3>

                                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">
                                  {quiz.description}
                                </p>

                                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs">
                                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                                    <Award className="w-3.5 h-3.5" /> Pass: {quiz.pass_mark_pct}% for Certificate
                                  </span>
                                  <span className="text-slate-500 text-[11px] font-mono">
                                    {quiz.questionCount || 8} Deliveries
                                  </span>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                  Badge: <strong className="text-amber-300">{quiz.badge_name || 'Champion'}</strong>
                                </span>

                                <button
                                  onClick={() => {
                                    if (quiz.mode === 'guess_player') {
                                      setActiveTab('guess_player');
                                    } else {
                                      handleStartQuiz(quiz.id);
                                    }
                                  }}
                                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition group-hover:scale-105 active:scale-95"
                                >
                                  <span>Step Out to Pitch</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: GUESS THE PLAYER */}
            {activeTab === 'guess_player' && (
              <GuessPlayerMode
                userName={currentUser?.name || 'Cricket Fan'}
                userId={currentUser?.id || 'player_rohit'}
                onEarnCertificate={handleEarnCertificate}
              />
            )}

            {/* TAB: USER DASHBOARD */}
            {activeTab === 'dashboard' && (
              <UserDashboard
                userName={currentUser?.name || 'Cricket Fan'}
                userId={currentUser?.id || 'player_rohit'}
                onOpenCertificate={(cert) => setActiveCertificate(cert)}
              />
            )}

            {/* TAB: ADMIN PANEL */}
            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminPanel />
              ) : (
                <div className="max-w-md mx-auto my-12 broadcast-card rounded-2xl p-8 text-center shadow-xl border border-amber-500/30">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-white">Match Referee Access Required</h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    The question management console is restricted to administrators. Please sign in with the referee credentials.
                  </p>

                  <button
                    onClick={() => handleOpenLogin('admin')}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In as Admin (Tirth)</span>
                  </button>
                </div>
              )
            )}

            {/* TAB: VERIFY CERTIFICATE */}
            {activeTab === 'verify' && (
              <VerifyCertificate
                initialCertId={verifyInitialId}
                onOpenCertificate={(cert) => setActiveCertificate(cert)}
              />
            )}
          </>
        )}
      </main>

      {/* AUTHENTICATION / LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* GLOBAL POPUP: SIGNED OFFICIAL CERTIFICATE MODAL */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Broadcast Style Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#050910] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-black text-white tracking-wider">CRICTALXX</span>
            <span>• Official Cricket Arena & Honors Platform</span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            Authorized & Engineered by <span className="text-emerald-400 font-bold">Tirth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
