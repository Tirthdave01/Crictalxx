import React, { useState, useEffect } from 'react';
import { Award, Trophy, Shield, Zap, Download, Eye, Calendar, Clock, CheckCircle2, TrendingUp, Flag, Medal, Sparkles, Target, Star } from 'lucide-react';

export default function UserDashboard({ userName, userId, onOpenCertificate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [userId]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const activeId = userId || 'player_rohit';
      const res = await fetch(`/api/dashboard/${activeId}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Loading cricketer career pavilion...</p>
      </div>
    );
  }

  const summary = dashboardData?.summary || {
    totalPlayed: 0,
    avgScore: 0,
    highestScore: 0,
    speedSecPerQ: 12,
    totalCertificates: 0
  };

  const certificates = dashboardData?.certificates || [];
  const badges = dashboardData?.badges || [];
  const attempts = dashboardData?.recentAttempts || [];

  // Calculate dynamic Cricketer OVR Rating (e.g. 88 OVR)
  const ovrRating = Math.min(99, Math.max(50, Math.round(50 + (summary.avgScore * 0.4) + Math.min(10, summary.totalPlayed * 2))));

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Ultimate Player Hero Card Banner */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Glow behind */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left z-10">
          {/* FIFA/Cricket Ultimate Player Card Avatar */}
          <div className="relative">
            <div className="w-24 h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-emerald-600 p-1 shadow-2xl shadow-amber-500/25">
              <div className="w-full h-full bg-[#080e18] rounded-xl flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl font-black text-amber-300 font-mono">{ovrRating}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">OVR</span>
                <span className="text-2xl mt-1">🏏</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
              PRO
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 justify-center sm:justify-start">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">{userName || 'Cricket Fan'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE CRICKETER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Certified Competitor • Crictalxx International Academy</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-300 font-mono">
              <span>BATTING IQ: <strong className="text-emerald-400">{summary.avgScore}%</strong></span>
              <span>•</span>
              <span>INNINGS: <strong className="text-amber-400">{summary.totalPlayed}</strong></span>
              <span>•</span>
              <span>HONORS: <strong className="text-white">{summary.totalCertificates}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Certificate Badge */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-center md:text-right z-10 w-full md:w-auto">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 block">
            HONORS CERTIFICATES
          </span>
          <div className="text-3xl font-black text-amber-400 flex items-center justify-center md:justify-end gap-2 mt-1">
            <Award className="w-8 h-8 text-amber-400" />
            <span className="font-mono">{summary.totalCertificates}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Signed by Tirth</span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="broadcast-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider">Innings Played</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{summary.totalPlayed}</div>
          <p className="text-[11px] text-slate-500 mt-1">Total match attempts</p>
        </div>

        <div className="broadcast-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider">Batting Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{summary.avgScore}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Career match accuracy</p>
        </div>

        <div className="broadcast-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider">Top Innings</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{summary.highestScore}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Highest match achievement</p>
        </div>

        <div className="broadcast-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider">Strike Rate</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">{summary.speedSecPerQ}s</div>
          <p className="text-[11px] text-slate-500 mt-1">Avg speed per delivery</p>
        </div>
      </div>

      {/* MY CERTIFICATES VAULT */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2.5 uppercase tracking-tight">
              <Award className="w-6 h-6 text-amber-400" /> My Official Signed Certificates
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified cricket honors issued with the authentic signature of founder <strong className="text-white">Tirth</strong>
            </p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-14 px-4 border border-dashed border-white/10 rounded-2xl mt-6 bg-black/20">
            <Award className="w-14 h-14 text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Honors Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
              Step out to the pitch and score 75% or higher on any match arena to claim your official digital certificate signed by Tirth!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-black/40 border border-amber-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-400 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {cert.tier} Honors
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{cert.id}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {cert.quiz_title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Score: <strong className="text-emerald-400 font-bold">{cert.score_pct}%</strong> • {cert.issue_date}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Authorized by:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      ✍️ {cert.signatory_name}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10">
                  <button
                    onClick={() => onOpenCertificate({
                      id: cert.id,
                      userName: cert.user_name,
                      quizTitle: cert.quiz_title,
                      scorePct: cert.score_pct,
                      tier: cert.tier,
                      signatoryName: cert.signatory_name,
                      signatoryTitle: cert.signatory_title,
                      issueDate: cert.issue_date
                    })}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Download Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trophy Cabinet & Achievements */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2.5 mb-1 uppercase tracking-tight">
          <Trophy className="w-6 h-6 text-amber-400" /> Trophy Cabinet & Career Badges
        </h2>
        <p className="text-xs text-slate-400 mb-8">Legendary milestones unlocked across your cricket innings</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-black/40 border-amber-500/50 shadow-xl shadow-amber-500/10'
                  : 'bg-black/20 border-white/5 opacity-35'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl ${
                b.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-white/5 text-slate-600'
              }`}>
                {b.unlocked ? '🏆' : '🔒'}
              </div>
              <h4 className="text-xs font-black text-white">{b.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{b.desc}</p>
              <span className={`inline-block mt-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                b.unlocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'
              }`}>
                {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Match History Log */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2.5 mb-5 uppercase tracking-tight">
          <Clock className="w-5 h-5 text-emerald-400" /> Match Pavilion Innings Log
        </h2>

        {attempts.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No matches logged yet. Step out to the crease!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                  <th className="py-3 px-3">Arena</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Runs</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-white/5 text-slate-300">
                    <td className="py-3.5 px-3 font-bold text-white">{att.quiz_title}</td>
                    <td className="py-3.5 px-3">
                      <span className={`font-mono font-black ${att.score_pct >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {att.score_pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">{att.correct_answers} / {att.total_questions}</td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono">{att.time_spent_sec}s</td>
                    <td className="py-3.5 px-3">
                      {att.certificate_id ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                          Issued ({att.certificate_id})
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px] font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
