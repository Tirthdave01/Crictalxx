import React, { useState, useEffect } from 'react';
import { Timer, Award, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Sparkles, RefreshCw, ChevronLeft, Target, Eye, Flame } from 'lucide-react';

export default function QuizPlayer({ quizId, userName, userId, onEarnCertificate, onBack }) {
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [drsUsed, setDrsUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const data = await res.json();
      if (data && data.questions) {
        setQuizData(data.quiz);
        setQuestions(data.questions);
        setTimeLeft(data.quiz.time_limit_sec || 120);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizFinished || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizFinished, loading, timeLeft]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: option
    }));
  };

  const handleUseDRS = () => {
    if (drsUsed || !currentQ) return;
    const incorrect = currentQ.options.filter(
      opt => opt.trim().toLowerCase() !== currentQ.correct_answer.trim().toLowerCase()
    );
    const toHide = incorrect.slice(0, 2);
    setHiddenOptions(toHide);
    setDrsUsed(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setHiddenOptions([]);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setHiddenOptions([]);
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const answersPayload = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id] || null
      }));

      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'player_rohit',
          userName: userName || 'Cricket Ace',
          quizId,
          answers: answersPayload,
          timeSpentSec: (quizData?.time_limit_sec || 120) - timeLeft
        })
      });

      const data = await res.json();
      setResult(data);
      setQuizFinished(true);

      if (data.certificate) {
        onEarnCertificate(data.certificate);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 font-bold uppercase tracking-wider text-sm">Walking out to the pitch under floodlights...</p>
      </div>
    );
  }

  if (quizFinished && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="broadcast-card rounded-3xl p-8 sm:p-10 text-center shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/30">
            <Award className="w-12 h-12 text-slate-950" />
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tight">{result.quizTitle}</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Match Innings Concluded</p>

          <div className="grid grid-cols-3 gap-4 my-8 p-6 bg-black/40 rounded-2xl border border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Runs / Correct</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">
                {result.correctAnswers} <span className="text-lg text-slate-500">/ {result.totalQuestions}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Match IQ / Score</span>
              <span className={`text-3xl font-black mt-1 block ${result.scorePct >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {result.scorePct}%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">Honors Target</span>
              <span className="text-3xl font-black text-slate-300 mt-1 block">{result.passThreshold}%</span>
            </div>
          </div>

          {result.passed ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl text-emerald-300 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Outstanding innings! You qualified for an Official Certificate signed by Tirth!</span>
            </div>
          ) : (
            <div className="p-4 bg-amber-950/60 border border-amber-500/50 rounded-2xl text-amber-300 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>You scored {result.scorePct}%. Score {result.passThreshold}% or more to unlock your signed honors certificate!</span>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setQuizFinished(false);
                setResult(null);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setDrsUsed(false);
                setTimeLeft(quizData?.time_limit_sec || 120);
              }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-200 font-bold rounded-xl transition text-xs flex items-center gap-2 border border-white/10"
            >
              <RefreshCw className="w-4 h-4" /> Replay Match
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl transition text-xs shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              Return to Match Arenas
            </button>
          </div>
        </div>

        {/* Detailed Review Breakdown */}
        <div className="broadcast-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-5 font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Delivery-by-Delivery Analysis & Referee Decisions:</span>
          </h3>
          <div className="space-y-4">
            {result.review?.map((rev, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border text-xs ${
                  rev.isCorrect 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300' 
                    : 'bg-rose-950/20 border-rose-500/40 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-white text-sm leading-snug">
                    Ball #{idx + 1}: {rev.questionText}
                  </div>
                  {rev.isCorrect ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-black text-[10px] shrink-0 border border-emerald-500/30">
                      ✓ HIT (CORRECT)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 font-black text-[10px] shrink-0 border border-rose-500/30">
                      ✕ BOWLED (WRONG)
                    </span>
                  )}
                </div>

                <div className="mt-3 text-slate-400 space-y-1 font-mono text-xs">
                  <p>Your Decision: <strong className={rev.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{rev.userAnswer || 'No Delivery Played'}</strong></p>
                  {!rev.isCorrect && (
                    <p>Official Answer: <strong className="text-emerald-400">{rev.correctAnswer}</strong></p>
                  )}
                </div>

                {rev.explanation && (
                  <p className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-sans italic">
                    💡 <strong>Match Context:</strong> {rev.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="text-center p-8 broadcast-card rounded-2xl border border-white/10">
        <p className="text-slate-400">No questions available for this arena format.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">
          Return
        </button>
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerDisplay = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const isHard = currentQ.difficulty === 'Hard';
  const isEasy = currentQ.difficulty === 'Easy';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Broadcast Scoreboard Header */}
      <div className="broadcast-card rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xl border border-white/10">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-bold transition"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-400" /> Match Pavilion
        </button>

        {/* Ball Progress Indicator */}
        <div className="text-center">
          <div className="text-xs font-black text-white uppercase tracking-wider font-mono">
            DELIVERY {currentIndex + 1} OF {questions.length}
          </div>
          <div className="flex items-center space-x-1.5 mt-1.5">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? 'bg-amber-400 scale-125 shadow-md shadow-amber-400/50'
                    : selectedAnswers[questions[i]?.id]
                    ? 'bg-emerald-500'
                    : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Timer HUD */}
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-black ${
          timeLeft <= 20 
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
            : 'bg-black/40 text-amber-300 border-white/10'
        }`}>
          <Timer className="w-4 h-4 text-amber-400" />
          <span className="text-sm">{timerDisplay}</span>
        </div>
      </div>

      {/* Main Delivery Question Card */}
      <div className="broadcast-card rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/10 relative">
        {/* Category & DRS Lifeline HUD */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center space-x-2 flex-wrap gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
              {currentQ.category?.replace('_', ' ')}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
              isHard
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : isEasy
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {isHard ? '🔴 DEATH OVERS (+30 PTS)' : isEasy ? '🟢 POWERPLAY (+10 PTS)' : '🟡 MIDDLE OVERS (+20 PTS)'}
            </span>
          </div>

          {/* 50-50 DRS Review Lifeline */}
          <button
            onClick={handleUseDRS}
            disabled={drsUsed}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 border ${
              drsUsed 
                ? 'opacity-35 bg-black/40 border-white/5 text-slate-600 cursor-not-allowed' 
                : 'bg-emerald-950/70 hover:bg-emerald-900/70 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/50 active:scale-95'
            }`}
            title="Television DRS Review eliminates 2 incorrect options"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>50:50 DRS REVIEW</span>
            {drsUsed && <span className="text-[9px] text-slate-500 font-normal">(EXHAUSTED)</span>}
          </button>
        </div>

        {/* Question Heading */}
        <div className="py-7">
          <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed tracking-tight whitespace-pre-line">
            {currentQ.question}
          </h3>
        </div>

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === opt;
            const isHidden = hiddenOptions.includes(opt);
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            if (isHidden) {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-dashed border-white/10 bg-black/20 text-slate-600 text-xs text-center flex items-center justify-center font-mono select-none"
                >
                  [ DRS TELEVISION REVIEW ELIMINATED ]
                </div>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border text-sm font-bold text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-xl shadow-emerald-500/30 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-emerald-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black ${
                    isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-black/40 text-slate-400 border border-white/10'
                  }`}>
                    {letter}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-9 pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none text-slate-300 text-xs font-bold rounded-xl transition border border-white/10"
          >
            Previous Delivery
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-xl shadow-emerald-500/25 transition flex items-center gap-2 active:scale-95 uppercase tracking-wider"
          >
            <span>{currentIndex + 1 < questions.length ? 'Next Delivery' : 'Submit Match Innings'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
