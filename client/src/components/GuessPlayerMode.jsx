import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, Award, CheckCircle2, XCircle, ChevronRight, Eye, Sparkles, RefreshCw, Shield, KeyRound, Lock, Unlock } from 'lucide-react';

export default function GuessPlayerMode({ userName, userId, onEarnCertificate }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/questions?category=guess_player');
      const data = await res.json();
      if (data && data.length > 0) {
        setQuestions(data);
        setMaxPossibleScore(data.length * 100);
      }
    } catch (err) {
      console.error('Failed to load guess player questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const clues = currentQ?.clues || [];

  const handleRevealClue = () => {
    if (revealedClues < clues.length) {
      setRevealedClues(prev => prev + 1);
    }
  };

  const getPointsForCurrentQuestion = () => {
    if (revealedClues === 1) return 100;
    if (revealedClues === 2) return 75;
    if (revealedClues === 3) return 50;
    return 25;
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
    if (isCorrect) {
      setScore(prev => prev + getPointsForCurrentQuestion());
    }
  };

  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setRevealedClues(1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameOver(true);
      const finalScorePct = Math.round((score / maxPossibleScore) * 100);
      if (finalScorePct >= 75) {
        try {
          const submitRes = await fetch('/api/quizzes/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId || 'player_rohit',
              userName: userName || 'Cricket Sleuth',
              quizId: 'quiz-guess-player',
              answers: questions.map(q => ({
                questionId: q.id,
                selectedAnswer: q.correct_answer
              })),
              timeSpentSec: 120
            })
          });
          const submitData = await submitRes.json();
          if (submitData.certificate) {
            onEarnCertificate(submitData.certificate);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setRevealedClues(1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setGameOver(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Decrypting classified cricketer dossiers...</p>
      </div>
    );
  }

  if (gameOver) {
    const scorePct = Math.round((score / maxPossibleScore) * 100);
    const passed = scorePct >= 75;

    return (
      <div className="max-w-xl mx-auto broadcast-card rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-white/10">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/30">
          <Award className="w-12 h-12 text-slate-950" />
        </div>

        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Dossier Mission Concluded</h2>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-mono">Cricket Sleuth Final Intel Scorecard</p>

        <div className="my-8 p-6 bg-black/40 rounded-2xl border border-white/10">
          <div className="text-4xl font-black text-emerald-400">{score} <span className="text-lg text-slate-500 font-mono">/ {maxPossibleScore} PTS</span></div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-mono">Sleuth Accuracy: <strong className="text-white">{scorePct}%</strong></p>

          <div className="mt-5 pt-4 border-t border-white/10 text-xs">
            {passed ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Qualified for Official Honors Certificate signed by Tirth!
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                Aim for 75%+ to unlock your official Certificate signed by Tirth.
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl transition flex items-center gap-2 mx-auto text-xs shadow-lg shadow-emerald-500/25 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Re-open Classified Files
        </button>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="text-center p-8 broadcast-card rounded-2xl border border-white/10">
        <p className="text-slate-400">No Guess The Player questions available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Progress HUD */}
      <div className="broadcast-card rounded-2xl px-5 py-4 flex items-center justify-between border border-white/10 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">Cricketer Intel Dossier</h2>
            <p className="text-[11px] text-slate-400 font-mono">Case #{currentIndex + 1} of {questions.length}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Accumulated</span>
            <span className="text-base font-black text-amber-400 font-mono">{score} PTS</span>
          </div>
          <div className="text-right pl-3 border-l border-white/10">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Current Intel Worth</span>
            <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              +{getPointsForCurrentQuestion()} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Clues & Dossier Card */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Mystery Silhouette Banner */}
        <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-black border border-white/10 flex items-center justify-center text-4xl shadow-inner relative group">
            {isAnswered ? '🌟' : '👤'}
            {!isAnswered && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black uppercase tracking-wider">
                CLASSIFIED DOSSIER
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 font-mono">
                {currentQ.difficulty || 'Hard'} Tier
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1.5 tracking-tight">
              Identify the Mystery International Cricketer
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Solve with fewer clues to maximize your cricket intelligence score!</p>
          </div>
        </div>

        {/* Revealed Clues List */}
        <div className="mt-6 space-y-3.5">
          {clues.map((clue, idx) => {
            const isRevealed = idx < revealedClues;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-xs sm:text-sm transition-all duration-300 border ${
                  isRevealed
                    ? 'bg-white/5 border-emerald-500/30 text-slate-100 shadow-md shadow-emerald-500/5'
                    : 'bg-black/30 border-white/5 text-slate-600 select-none'
                }`}
              >
                {isRevealed ? (
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed font-semibold text-slate-200">{clue}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="italic flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Clue #{idx + 1} Encrypted (Revealing costs -25 pts)</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unlock Next Clue Button */}
        {!isAnswered && revealedClues < clues.length && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleRevealClue}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-2 transition"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Decrypt Clue #{revealedClues + 1} (-25 pts)</span>
            </button>
          </div>
        )}

        {/* 4 Player Options */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3.5 font-mono">
            CONFIRM INTEL IDENTITY:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();

              let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-xl shadow-emerald-900/40 scale-[1.01]';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'opacity-30 bg-black/40 border-white/5 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl border font-bold text-sm text-left flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reveal Explanation Banner */}
        {isAnswered && (
          <div className="mt-6 p-5 bg-black/50 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full Career Dossier Decrypted:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {currentQ.explanation}
            </p>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/25 active:scale-95 uppercase tracking-wider"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Mystery Player' : 'View Mission Scorecard'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
