import React, { useState, useEffect } from 'react';
import { PlusCircle, Upload, Trash2, Edit3, CheckCircle, Search, HelpCircle, FileText, Database, ShieldAlert, Sparkles, Filter, Check } from 'lucide-react';

export default function AdminPanel() {
  const [activeSubTab, setActiveSubTab] = useState('manage'); // default to 'manage' to see the breakdown right away!
  const [questions, setQuestions] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [difficultyStats, setDifficultyStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form state
  const [form, setForm] = useState({
    category: 'stats',
    mode: 'standard',
    difficulty: 'Medium',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    clue1: '',
    clue2: '',
    clue3: '',
    clue4: ''
  });

  // Bulk JSON input
  const [bulkInput, setBulkInput] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchDifficultyStats();
  }, [categoryFilter, difficultyFilter]);

  const fetchDifficultyStats = async () => {
    try {
      const res = await fetch('/api/stats/difficulties');
      const data = await res.json();
      if (data) setDifficultyStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter);

      const url = `/api/questions?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDifficulty = async (questionId, newDifficulty) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/difficulty`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: newDifficulty })
      });
      if (res.ok) {
        setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, difficulty: newDifficulty } : q));
        fetchDifficultyStats();
        setMessage({ type: 'success', text: `Updated delivery #${questionId} difficulty to ${newDifficulty}!` });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!form.question || !form.correctAnswer || !form.optionA || !form.optionB) {
      alert('Please fill out the question text, options, and specify the correct answer.');
      return;
    }

    const options = [form.optionA, form.optionB, form.optionC, form.optionD].filter(Boolean);

    let clues = null;
    if (form.category === 'guess_player') {
      clues = [form.clue1, form.clue2, form.clue3, form.clue4].filter(Boolean);
    }

    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.category,
          mode: form.category === 'guess_player' ? 'guess_player' : form.mode,
          difficulty: form.difficulty,
          question: form.question,
          options,
          correct_answer: form.correctAnswer,
          explanation: form.explanation,
          clues
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Question added as [${form.difficulty}] to Crictalxx question bank!` });
        setForm({
          category: 'stats',
          mode: 'standard',
          difficulty: 'Medium',
          question: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: '',
          explanation: '',
          clue1: '',
          clue2: '',
          clue3: '',
          clue4: ''
        });
        fetchQuestions();
        fetchDifficultyStats();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add question' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Network error adding question' });
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkInput.trim()) return;
    try {
      const parsed = JSON.parse(bulkInput);
      const questionsList = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch('/api/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsList })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        setBulkInput('');
        fetchQuestions();
        fetchDifficultyStats();
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      alert('Invalid JSON format. Please verify the JSON syntax.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Question deleted successfully!' });
        fetchQuestions();
        fetchDifficultyStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return q.question?.toLowerCase().includes(term) || q.correct_answer?.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-xl font-black text-white">
              Match Referee Console (Admin)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage question bank, regulate difficulty portions (Easy / Medium / Hard), and curate matches
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'manage' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('add')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'add' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Single Form
          </button>
          <button
            onClick={() => setActiveSubTab('bulk')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'bulk' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Bulk Import
          </button>
        </div>
      </div>

      {/* DIFFICULTY PORTIONS ANALYTICS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Deliveries */}
        <div 
          onClick={() => setDifficultyFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            difficultyFilter === 'all' 
              ? 'bg-slate-800/90 border-amber-400/80 shadow-md shadow-amber-500/10' 
              : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Deliveries</span>
          <div className="text-2xl font-black text-white mt-0.5">{difficultyStats.total}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">All registered questions</span>
        </div>

        {/* Easy Portion */}
        <div 
          onClick={() => setDifficultyFilter(difficultyFilter === 'Easy' ? 'all' : 'Easy')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            difficultyFilter === 'Easy' 
              ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-900/30' 
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">🟢 Easy (Powerplay)</span>
            {difficultyFilter === 'Easy' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-0.5">{difficultyStats.easy}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Beginner & Core Trivia</span>
        </div>

        {/* Medium Portion */}
        <div 
          onClick={() => setDifficultyFilter(difficultyFilter === 'Medium' ? 'all' : 'Medium')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            difficultyFilter === 'Medium' 
              ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-900/30' 
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">🟡 Medium (Middle Overs)</span>
            {difficultyFilter === 'Medium' && <Check className="w-3.5 h-3.5 text-amber-400" />}
          </div>
          <div className="text-2xl font-black text-amber-300 mt-0.5">{difficultyStats.medium}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Tactical Records & Journeys</span>
        </div>

        {/* Hard Portion */}
        <div 
          onClick={() => setDifficultyFilter(difficultyFilter === 'Hard' ? 'all' : 'Hard')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            difficultyFilter === 'Hard' 
              ? 'bg-rose-950/60 border-rose-400 shadow-md shadow-rose-900/30' 
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">🔴 Hard (Death Overs)</span>
            {difficultyFilter === 'Hard' && <Check className="w-3.5 h-3.5 text-rose-400" />}
          </div>
          <div className="text-2xl font-black text-rose-300 mt-0.5">{difficultyStats.hard}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Obscure Laws & Masterclasses</span>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
          message.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* SUBTAB: MANAGE QUESTION BANK WITH DIFFICULTY CONTROLS */}
      {activeSubTab === 'manage' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search question or answer..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Difficulty Portion Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-400">Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">🟢 Easy (Powerplay)</option>
                  <option value="Medium">🟡 Medium (Middle Overs)</option>
                  <option value="Hard">🔴 Hard (Death Overs)</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-400">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="guess_player">Guess Player</option>
                  <option value="career_path">Career Path</option>
                  <option value="stats">Stats</option>
                  <option value="ipl">IPL</option>
                  <option value="world_cup">World Cup</option>
                  <option value="rapid_fire">Rapid Fire</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Difficulty Portion</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Question</th>
                  <th className="py-2.5 px-3">Correct Answer</th>
                  <th className="py-2.5 px-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredQuestions.map((q) => {
                  const isEasy = q.difficulty === 'Easy';
                  const isMed = q.difficulty === 'Medium';
                  const isHard = q.difficulty === 'Hard';

                  const badgeClass = isEasy 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : isMed 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                  return (
                    <tr key={q.id} className="hover:bg-slate-800/30 text-slate-300">
                      {/* Interactive Difficulty Switcher Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={q.difficulty}
                          onChange={(e) => handleUpdateDifficulty(q.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${badgeClass}`}
                          title="Click to instantly reclassify this question's difficulty level"
                        >
                          <option value="Easy" className="bg-slate-900 text-emerald-400">🟢 Easy</option>
                          <option value="Medium" className="bg-slate-900 text-amber-400">🟡 Medium</option>
                          <option value="Hard" className="bg-slate-900 text-rose-400">🔴 Hard</option>
                        </select>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold uppercase">
                          {q.category?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-md truncate text-white">
                        {q.question}
                      </td>

                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        {q.correct_answer}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete delivery"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: SINGLE QUESTION FORM WITH DIFFICULTY CARDS */}
      {activeSubTab === 'add' && (
        <form onSubmit={handleCreateQuestion} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-amber-400" /> Create Cricket Delivery (Question)
          </h2>

          {/* Difficulty Portion Selection Cards */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Select Difficulty Portion:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Easy Card */}
              <div
                onClick={() => setForm({ ...form, difficulty: 'Easy' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  form.difficulty === 'Easy'
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-md shadow-emerald-900/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-emerald-400">🟢 Easy (Powerplay)</span>
                  {form.difficulty === 'Easy' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Core rules, jersey numbers, famous icons</p>
              </div>

              {/* Medium Card */}
              <div
                onClick={() => setForm({ ...form, difficulty: 'Medium' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  form.difficulty === 'Medium'
                    ? 'bg-amber-950/70 border-amber-400 shadow-md shadow-amber-900/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-amber-400">🟡 Medium (Middle Overs)</span>
                  {form.difficulty === 'Medium' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Tactical knocks, IPL teams, milestones</p>
              </div>

              {/* Hard Card */}
              <div
                onClick={() => setForm({ ...form, difficulty: 'Hard' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  form.difficulty === 'Hard'
                    ? 'bg-rose-950/70 border-rose-400 shadow-md shadow-rose-900/30 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="text-rose-400">🔴 Hard (Death Overs)</span>
                  {form.difficulty === 'Hard' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Rare MCC laws, historic bowling spells</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="guess_player">Guess The Player (Progressive Clues)</option>
                <option value="career_path">Career Path / Franchise Journey</option>
                <option value="stats">Stats & Records</option>
                <option value="ipl">IPL Special</option>
                <option value="world_cup">World Cup & Legends</option>
                <option value="rapid_fire">Rapid Fire & Rules</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Mode</label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="standard">Standard Multiple Choice</option>
                <option value="rapid_fire">Rapid Fire Blitz</option>
                <option value="guess_player">Mystery Player Dossier</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Question Prompt / Title</label>
            <textarea
              rows={2}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="e.g., Under Law 28, how many penalty runs are awarded to the batting side if a ball hits a fielded helmet?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* 4 Options Grid */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">4 Multiple Choice Options</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Option A"
                value={form.optionA}
                onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                required
              />
              <input
                type="text"
                placeholder="Option B"
                value={form.optionB}
                onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                required
              />
              <input
                type="text"
                placeholder="Option C"
                value={form.optionC}
                onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Option D"
                value={form.optionD}
                onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Correct Answer */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Correct Answer (must match one of the options exactly)
            </label>
            <input
              type="text"
              placeholder="e.g., 5 penalty runs"
              value={form.correctAnswer}
              onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
              className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-semibold"
              required
            />
          </div>

          {/* Guess the player progressive clues */}
          {form.category === 'guess_player' && (
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-amber-400 block">
                Progressive Clues (Revealed one by one)
              </label>
              <input
                type="text"
                placeholder="Clue 1: Debut year, domestic team, or early career"
                value={form.clue1}
                onChange={(e) => setForm({ ...form, clue1: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Clue 2: Jersey number, role, or batting style"
                value={form.clue2}
                onChange={(e) => setForm({ ...form, clue2: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Clue 3: Major record, tournament win, or iconic knock"
                value={form.clue3}
                onChange={(e) => setForm({ ...form, clue3: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Clue 4: Nickname, famous quote, or franchise"
                value={form.clue4}
                onChange={(e) => setForm({ ...form, clue4: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Explanation & Trivia Context
            </label>
            <textarea
              rows={2}
              placeholder="Context shown to the user after answering this delivery..."
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition"
            >
              Add Question to Bank
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB: BULK JSON IMPORT WITH DIFFICULTY SUPPORT */}
      {activeSubTab === 'bulk' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Bulk Question Import
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste an array of JSON questions including <code className="text-amber-300">"difficulty": "Easy" | "Medium" | "Hard"</code>.
              </p>
            </div>
            <button
              onClick={() => {
                const sample = [
                  {
                    category: "stats",
                    difficulty: "Easy",
                    question: "Who was the first batsman to score a double century in Men's ODI cricket?",
                    options: ["Sachin Tendulkar", "Virender Sehwag", "Rohit Sharma", "Chris Gayle"],
                    correct_answer: "Sachin Tendulkar",
                    explanation: "Sachin Tendulkar scored 200* vs South Africa in Gwalior on 24 February 2010."
                  },
                  {
                    category: "rules",
                    difficulty: "Hard",
                    question: "Under Law 28, how many penalty runs are awarded if a fielded ball hits a helmet on the ground?",
                    options: ["5 penalty runs", "4 penalty runs", "6 penalty runs", "10 penalty runs"],
                    correct_answer: "5 penalty runs",
                    explanation: "5 penalty runs are automatically awarded to the batting side under MCC Law 28.3."
                  }
                ];
                setBulkInput(JSON.stringify(sample, null, 2));
              }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Insert Sample JSON
            </button>
          </div>

          <textarea
            rows={10}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="[ { &quot;category&quot;: &quot;stats&quot;, &quot;difficulty&quot;: &quot;Hard&quot;, &quot;question&quot;: &quot;...&quot;, &quot;options&quot;: [...], &quot;correct_answer&quot;: &quot;...&quot; } ]"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleBulkUpload}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition"
            >
              Process & Import Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
