import React, { useRef, useEffect } from 'react';
import { Award, Download, Printer, CheckCircle, X, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function CertificateModal({ certificate, onClose }) {
  const certRef = useRef(null);

  useEffect(() => {
    // Fire festive cricket victory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!certificate) return null;

  const isGold = certificate.scorePct >= 90;
  const isSilver = certificate.scorePct >= 75 && certificate.scorePct < 90;

  const tierColor = isGold 
    ? 'from-amber-400 via-yellow-200 to-amber-500 text-amber-900 border-amber-400' 
    : isSilver 
    ? 'from-slate-200 via-gray-100 to-slate-300 text-slate-800 border-slate-300' 
    : 'from-amber-600 via-orange-300 to-amber-700 text-amber-950 border-amber-600';

  const downloadPDF = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Crictalxx-Certificate-${certificate.id}.pdf`);
    } catch (err) {
      console.error('Error downloading certificate PDF:', err);
      window.print();
    }
  };

  const copyVerifyLink = () => {
    const url = `${window.location.origin}?verify=${certificate.id}`;
    navigator.clipboard.writeText(url);
    alert(`Certificate Verification Link copied to clipboard!\n${url}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-6 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Official Cricket Certificate Earned!
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">Score of {certificate.scorePct}% meets honors qualification</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Printable Area */}
        <div className="mt-6 flex justify-center overflow-x-auto p-2">
          <div 
            ref={certRef}
            id="certificate-print-area"
            className="relative w-[780px] h-[540px] bg-gradient-to-br from-amber-50/95 via-white to-amber-100/90 text-slate-900 rounded-lg shadow-xl p-8 border-[12px] border-amber-600/90 flex flex-col justify-between overflow-hidden select-none"
            style={{
              boxShadow: '0 0 0 2px #b45309, 0 10px 30px -5px rgba(0,0,0,0.4)',
              fontFamily: "'Georgia', 'Times New Roman', serif"
            }}
          >
            {/* Background Watermark Pattern */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none flex items-center justify-center">
              <span className="text-[180px] font-black tracking-widest text-slate-950">🏏</span>
            </div>

            {/* Inner Gold Inset Border */}
            <div className="absolute inset-3 border-2 border-amber-500/50 pointer-events-none rounded"></div>

            {/* Corner Ornamental Accents */}
            <div className="absolute top-4 left-4 text-amber-700/60 font-serif text-lg">✦</div>
            <div className="absolute top-4 right-4 text-amber-700/60 font-serif text-lg">✦</div>
            <div className="absolute bottom-4 left-4 text-amber-700/60 font-serif text-lg">✦</div>
            <div className="absolute bottom-4 right-4 text-amber-700/60 font-serif text-lg">✦</div>

            {/* Certificate Header */}
            <div className="text-center relative z-10 pt-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-xl text-amber-600">🏆</span>
                <span className="tracking-[0.25em] text-xs font-bold uppercase text-amber-800 font-sans">
                  Crictalxx Cricket Academy
                </span>
                <span className="text-xl text-amber-600">🏆</span>
              </div>
              <h1 className="text-3xl font-black tracking-wider text-slate-900 uppercase font-serif mt-1">
                Certificate of Cricket Excellence
              </h1>
              <p className="text-xs italic text-slate-600 mt-1">
                This prestigious recognition is proudly presented to
              </p>
            </div>

            {/* Recipient Name */}
            <div className="text-center relative z-10 py-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-950 underline decoration-amber-500/60 underline-offset-8 font-serif">
                {certificate.userName || 'Cricket Maestro'}
              </div>
              <p className="text-xs text-slate-700 max-w-lg mx-auto mt-4 font-sans leading-relaxed">
                For demonstrating exceptional cricket IQ, mastery of match tactics, and scoring an outstanding{' '}
                <span className="font-bold text-amber-900">{certificate.scorePct}%</span> in the{' '}
                <span className="font-semibold text-slate-900">"{certificate.quizTitle || 'Championship Challenge'}"</span>.
              </p>
            </div>

            {/* Badges, QR Code & Signatures Footer */}
            <div className="relative z-10 pt-2 border-t border-amber-300/80 flex items-end justify-between px-6 font-sans">
              {/* Left: Issue Date & Unique Cert ID */}
              <div className="text-left">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Date of Honor</div>
                <div className="text-xs font-bold text-slate-800">{certificate.issueDate || 'October 2026'}</div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  ID: <span className="font-semibold text-amber-900">{certificate.id}</span>
                </div>
              </div>

              {/* Center: Official Seal / Tier Medallion */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierColor} border-2 shadow-md flex flex-col items-center justify-center p-1 text-center`}>
                  <Award className="w-5 h-5 text-amber-900 mb-0.5" />
                  <span className="text-[9px] font-black uppercase tracking-tight leading-none">
                    {certificate.tier || 'Gold'} Tier
                  </span>
                  <span className="text-[8px] font-bold opacity-90 mt-0.5">HONORS</span>
                </div>
                <span className="text-[9px] text-amber-800 font-bold uppercase tracking-wider mt-1">
                  OFFICIAL SEAL
                </span>
              </div>

              {/* Right: Signature by Tirth */}
              <div className="text-center w-56">
                <div className="h-20 flex items-end justify-center pb-0.5">
                  <img 
                    src="/signature.png" 
                    alt="Authorized Signature of Tirth" 
                    className="h-18 max-w-full object-contain filter drop-shadow-md transform scale-110 -mb-0.5"
                  />
                </div>
                <div className="border-t-2 border-slate-800 pt-1">
                  <div className="text-sm font-bold text-slate-950 font-serif tracking-wide">
                    {certificate.signatoryName || 'Tirth'}
                  </div>
                  <div className="text-[10px] text-slate-700 font-sans font-semibold tracking-tight">
                    {certificate.signatoryTitle || 'Founder & Chief Match Referee, Crictalxx'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital verification code embedded: <strong className="text-slate-200">{certificate.id}</strong></span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copyVerifyLink}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border border-slate-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Verification Link</span>
            </button>

            <button
              onClick={downloadPDF}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/25 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Certificate (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
