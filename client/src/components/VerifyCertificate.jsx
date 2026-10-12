import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, Calendar, User, Eye, Sparkles } from 'lucide-react';

export default function VerifyCertificate({ initialCertId, onOpenCertificate }) {
  const [certId, setCertId] = useState(initialCertId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialCertId) {
      handleVerify(initialCertId);
    }
  }, [initialCertId]);

  const handleVerify = async (idToVerify) => {
    const queryId = (idToVerify || certId).trim();
    if (!queryId) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/certificates/${queryId}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data.certificate);
      } else {
        setResult(null);
        setError('No certificate matching this ID was found in the official Crictalxx ledger.');
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying certificate. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="broadcast-card rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/25">
          <ShieldCheck className="w-10 h-10 text-slate-950" />
        </div>

        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          Verify Crictalxx Certificate
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-mono">
          Cryptographically validate authentic cricket honors issued and signed by founder <strong className="text-white">Tirth</strong>
        </p>

        {/* Input box */}
        <div className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g. CRIC-XXXX-XXXX)"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 uppercase font-mono tracking-wider"
          />
          <button
            onClick={() => handleVerify()}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 active:scale-95 uppercase tracking-wider"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Validating...' : 'Verify'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {searched && (
        <div>
          {result ? (
            <div className="broadcast-card border border-emerald-500/50 rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">Verified Authentic & Official</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Validated against Crictalxx Central Ledger</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {result.tier} Honors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Honoree Name</span>
                  <div className="text-lg font-black text-white mt-1 uppercase tracking-tight">{result.user_name}</div>
                </div>

                <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Match Championship</span>
                  <div className="text-lg font-black text-amber-400 mt-1 uppercase tracking-tight">{result.quiz_title}</div>
                </div>

                <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Score Achieved</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{result.score_pct}%</div>
                </div>

                <div className="p-5 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Authorized Signatory</span>
                  <div className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                    <span>✍️ {result.signatory_name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({result.signatory_title})</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => onOpenCertificate({
                    id: result.id,
                    userName: result.user_name,
                    quizTitle: result.quiz_title,
                    scorePct: result.score_pct,
                    tier: result.tier,
                    signatoryName: result.signatory_name,
                    signatoryTitle: result.signatory_title,
                    issueDate: result.issue_date
                  })}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/25 active:scale-95 uppercase tracking-wider"
                >
                  <Eye className="w-4 h-4" /> View Full Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="broadcast-card border border-rose-500/40 rounded-3xl p-8 text-center shadow-xl">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <h3 className="text-base font-black text-white uppercase">Verification Failed</h3>
              <p className="text-xs text-rose-300 mt-1">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
