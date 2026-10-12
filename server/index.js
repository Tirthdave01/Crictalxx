const express = require('express');
const cors = require('cors');
const path = require('node:path');
const db = require('./db');
const seed = require('./seed');

const app = express();
const PORT = process.env.PORT || 5100;

// Ensure database has match questions seeded
try {
  const rowCount = db.prepare('SELECT count(*) as count FROM questions').get();
  if (!rowCount || rowCount.count === 0) {
    console.log('No questions found in database. Auto-seeding Crictalxx match database...');
    seed();
  }
} catch (err) {
  console.warn('Auto-seed check notice:', err.message);
}

app.use(cors());
app.use(express.json());

// Helper: safe JSON parse
function parseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// ================= AUTHENTICATION ROUTES =================
// 0. QUICK LOGIN / DEMO SWITCHER
app.post('/api/auth/quick-login', (req, res) => {
  try {
    const { role = 'user' } = req.body;
    let user;
    if (role === 'admin') {
      const stmt = db.prepare("SELECT id, name, email, role FROM users WHERE role = 'admin' LIMIT 1");
      user = stmt.get();
      if (!user) {
        // Fallback default admin
        user = { id: 'admin_tirth', name: 'Tirth (Admin)', email: 'admin@crictalxx.com', role: 'admin' };
      }
    } else {
      const stmt = db.prepare("SELECT id, name, email, role FROM users WHERE role = 'user' LIMIT 1");
      user = stmt.get();
      if (!user) {
        user = { id: 'player_rohit', name: 'Cricket Fan', email: 'player@crictalxx.com', role: 'user' };
      }
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Quick login error:', err);
    res.status(500).json({ error: 'Failed to quick login' });
  }
});

// 1. STANDARD LOGIN (Admin or User)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const stmt = db.prepare('SELECT id, name, email, password, role FROM users WHERE LOWER(email) = LOWER(?)');
    const user = stmt.get(email.trim());

    if (!user || user.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 2. REGISTER NEW USER
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const checkStmt = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)');
    const existing = checkStmt.get(email.trim());
    if (existing) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const userId = `usr_${Date.now().toString(36)}`;
    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, 'user')
    `);

    insertStmt.run(userId, name.trim(), email.trim().toLowerCase(), password.trim());

    res.status(201).json({
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});


// 1. GET ALL QUIZZES
app.get('/api/quizzes', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM quizzes ORDER BY rowid ASC');
    const quizzes = stmt.all();

    // Attach total question count to each quiz
    const enriched = quizzes.map(q => {
      let count = 0;
      if (q.id === 'quiz-easy-powerplay') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE difficulty = 'Easy'");
        count = countStmt.get().c;
      } else if (q.id === 'quiz-medium-middle-overs') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE difficulty = 'Medium'");
        count = countStmt.get().c;
      } else if (q.id === 'quiz-hard-death-overs') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE difficulty = 'Hard'");
        count = countStmt.get().c;
      } else if (q.category === 'guess_player') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE category = 'guess_player'");
        count = countStmt.get().c;
      } else if (q.mode === 'rapid_fire') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE mode = 'rapid_fire'");
        count = countStmt.get().c;
      } else if (q.category && q.category !== 'all') {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions WHERE category = ?");
        count = countStmt.get(q.category).c;
      } else {
        const countStmt = db.prepare("SELECT COUNT(*) as c FROM questions");
        count = countStmt.get().c;
      }
      return {
        ...q,
        questionCount: count || 6
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// 2. GET SINGLE QUIZ WITH QUESTIONS
app.get('/api/quizzes/:id', (req, res) => {
  try {
    const quizStmt = db.prepare('SELECT * FROM quizzes WHERE id = ?');
    const quiz = quizStmt.get(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const { difficulty } = req.query;
    let questions = [];

    // Check specific difficulty quizzes
    if (quiz.id === 'quiz-easy-powerplay' || difficulty === 'Easy') {
      const qStmt = db.prepare("SELECT * FROM questions WHERE difficulty = 'Easy' ORDER BY RANDOM() LIMIT 8");
      questions = qStmt.all();
    } else if (quiz.id === 'quiz-medium-middle-overs' || difficulty === 'Medium') {
      const qStmt = db.prepare("SELECT * FROM questions WHERE difficulty = 'Medium' ORDER BY RANDOM() LIMIT 8");
      questions = qStmt.all();
    } else if (quiz.id === 'quiz-hard-death-overs' || difficulty === 'Hard') {
      const qStmt = db.prepare("SELECT * FROM questions WHERE difficulty = 'Hard' ORDER BY RANDOM() LIMIT 8");
      questions = qStmt.all();
    } else if (quiz.category === 'guess_player') {
      const qStmt = db.prepare("SELECT * FROM questions WHERE category = 'guess_player' ORDER BY id ASC");
      questions = qStmt.all();
    } else if (quiz.mode === 'rapid_fire') {
      const qStmt = db.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT 10");
      questions = qStmt.all();
    } else if (quiz.category && quiz.category !== 'all') {
      const qStmt = db.prepare("SELECT * FROM questions WHERE category = ? ORDER BY RANDOM() LIMIT 8");
      questions = qStmt.all(quiz.category);
    } else {
      const qStmt = db.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT 8");
      questions = qStmt.all();
    }

    // Fallback if empty
    if (questions.length === 0) {
      const fallbackStmt = db.prepare("SELECT * FROM questions ORDER BY RANDOM() LIMIT 6");
      questions = fallbackStmt.all();
    }

    // Format questions
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: parseJSON(q.options, []),
      clues: parseJSON(q.clues, [])
    }));

    res.json({
      quiz,
      questions: formattedQuestions
    });
  } catch (err) {
    console.error('Error fetching quiz details:', err);
    res.status(500).json({ error: 'Failed to fetch quiz details' });
  }
});

// 2.5 STATS: DIFFICULTY COUNTS
app.get('/api/stats/difficulties', (req, res) => {
  try {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM questions');
    const easyStmt = db.prepare("SELECT COUNT(*) as count FROM questions WHERE difficulty = 'Easy'");
    const medStmt = db.prepare("SELECT COUNT(*) as count FROM questions WHERE difficulty = 'Medium'");
    const hardStmt = db.prepare("SELECT COUNT(*) as count FROM questions WHERE difficulty = 'Hard'");

    res.json({
      total: totalStmt.get().count,
      easy: easyStmt.get().count,
      medium: medStmt.get().count,
      hard: hardStmt.get().count
    });
  } catch (err) {
    console.error('Error fetching difficulty stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// 3. ADMIN: GET ALL QUESTIONS (with optional category, difficulty, search)
app.get('/api/questions', (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (difficulty && difficulty !== 'all') {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (search) {
      query += ' AND (question LIKE ? OR correct_answer LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id DESC';

    const stmt = db.prepare(query);
    const questions = stmt.all(...params);

    const parsed = questions.map(q => ({
      ...q,
      options: parseJSON(q.options, []),
      clues: parseJSON(q.clues, [])
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// 3.5 ADMIN: QUICK INLINE UPDATE QUESTION DIFFICULTY
app.patch('/api/questions/:id/difficulty', (req, res) => {
  try {
    const { difficulty } = req.body;
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Valid difficulty (Easy, Medium, Hard) required' });
    }

    const stmt = db.prepare('UPDATE questions SET difficulty = ? WHERE id = ?');
    stmt.run(difficulty, req.params.id);

    res.json({ success: true, message: `Question difficulty updated to ${difficulty}` });
  } catch (err) {
    console.error('Error updating difficulty:', err);
    res.status(500).json({ error: 'Failed to update difficulty' });
  }
});

// 4. ADMIN: ADD A QUESTION
app.post('/api/questions', (req, res) => {
  try {
    const { category, mode, difficulty, question, options, correct_answer, explanation, clues } = req.body;

    if (!question || !options || !correct_answer) {
      return res.status(400).json({ error: 'Question, options, and correct answer are required' });
    }

    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);
    const cluesStr = clues ? (typeof clues === 'string' ? clues : JSON.stringify(clues)) : null;

    const stmt = db.prepare(`
      INSERT INTO questions (category, mode, difficulty, question, options, correct_answer, explanation, clues)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      category || 'stats',
      mode || 'standard',
      difficulty || 'Medium',
      question,
      optionsStr,
      correct_answer,
      explanation || '',
      cluesStr
    );

    res.status(201).json({ id: info.lastInsertRowid, message: 'Question created successfully!' });
  } catch (err) {
    console.error('Error adding question:', err);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// 5. ADMIN: UPDATE QUESTION
app.put('/api/questions/:id', (req, res) => {
  try {
    const { category, mode, difficulty, question, options, correct_answer, explanation, clues } = req.body;
    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);
    const cluesStr = clues ? (typeof clues === 'string' ? clues : JSON.stringify(clues)) : null;

    const stmt = db.prepare(`
      UPDATE questions 
      SET category = ?, mode = ?, difficulty = ?, question = ?, options = ?, correct_answer = ?, explanation = ?, clues = ?
      WHERE id = ?
    `);

    stmt.run(category, mode, difficulty, question, optionsStr, correct_answer, explanation, cluesStr, req.params.id);

    res.json({ message: 'Question updated successfully!' });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// 6. ADMIN: DELETE QUESTION
app.delete('/api/questions/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// 7. ADMIN: BULK IMPORT QUESTIONS
app.post('/api/questions/bulk', (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Array of questions required' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO questions (category, mode, difficulty, question, options, correct_answer, explanation, clues)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let importedCount = 0;
    for (const q of questions) {
      const optionsStr = typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []);
      const cluesStr = q.clues ? (typeof q.clues === 'string' ? q.clues : JSON.stringify(q.clues)) : null;
      insertStmt.run(
        q.category || 'stats',
        q.mode || 'standard',
        q.difficulty || 'Medium',
        q.question,
        optionsStr,
        q.correct_answer,
        q.explanation || '',
        cluesStr
      );
      importedCount++;
    }

    res.json({ message: `Successfully imported ${importedCount} questions!`, count: importedCount });
  } catch (err) {
    console.error('Error bulk importing questions:', err);
    res.status(500).json({ error: 'Failed to import questions' });
  }
});

// 8. SUBMIT QUIZ & GENERATE CERTIFICATE
app.post('/api/quizzes/submit', (req, res) => {
  try {
    const { userId = 'user_default', userName = 'Cricket Fan', quizId, answers = [], timeSpentSec = 60 } = req.body;

    // Fetch quiz
    const quizStmt = db.prepare('SELECT * FROM quizzes WHERE id = ?');
    const quiz = quizStmt.get(quizId) || {
      title: 'Cricket Challenge',
      pass_mark_pct: 75
    };

    let correctCount = 0;
    const questionReview = [];

    // Evaluate answers
    for (const ans of answers) {
      const qStmt = db.prepare('SELECT * FROM questions WHERE id = ?');
      const question = qStmt.get(ans.questionId);

      if (question) {
        const isCorrect = (question.correct_answer.trim().toLowerCase() === (ans.selectedAnswer || '').trim().toLowerCase());
        if (isCorrect) correctCount++;

        questionReview.push({
          questionId: question.id,
          questionText: question.question,
          userAnswer: ans.selectedAnswer,
          correctAnswer: question.correct_answer,
          isCorrect,
          explanation: question.explanation
        });
      }
    }

    const totalQuestions = answers.length > 0 ? answers.length : 1;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    const passThreshold = quiz.pass_mark_pct || 75;
    const passed = scorePct >= passThreshold;

    let certificate = null;

    if (passed) {
      // Determine Tier
      let tier = 'Bronze';
      if (scorePct >= 90) tier = 'Gold';
      else if (scorePct >= 75) tier = 'Silver';

      const certId = `CRIC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const certStmt = db.prepare(`
        INSERT INTO certificates (id, user_id, user_name, quiz_id, quiz_title, score_pct, tier, signatory_name, signatory_title, issue_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      certStmt.run(
        certId,
        userId,
        userName,
        quizId,
        quiz.title,
        scorePct,
        tier,
        'Tirth',
        'Founder & Chief Match Referee, Crictalxx',
        issueDate
      );

      certificate = {
        id: certId,
        userId,
        userName,
        quizTitle: quiz.title,
        scorePct,
        tier,
        signatoryName: 'Tirth',
        signatoryTitle: 'Founder & Chief Match Referee, Crictalxx',
        issueDate
      };
    }

    // Save attempt
    const attemptStmt = db.prepare(`
      INSERT INTO quiz_attempts (user_id, quiz_id, quiz_title, total_questions, correct_answers, score_pct, time_spent_sec, certificate_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    attemptStmt.run(
      userId,
      quizId,
      quiz.title,
      totalQuestions,
      correctCount,
      scorePct,
      timeSpentSec,
      certificate ? certificate.id : null
    );

    res.json({
      quizTitle: quiz.title,
      totalQuestions,
      correctAnswers: correctCount,
      scorePct,
      passThreshold,
      passed,
      timeSpentSec,
      certificate,
      review: questionReview
    });
  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ error: 'Failed to evaluate quiz' });
  }
});

// 9. USER DASHBOARD
app.get('/api/dashboard/:userId', (req, res) => {
  try {
    const userId = req.params.userId;

    // Attempts
    const attemptsStmt = db.prepare(`
      SELECT * FROM quiz_attempts WHERE user_id = ? ORDER BY id DESC LIMIT 20
    `);
    const attempts = attemptsStmt.all(userId);

    // Certificates
    const certStmt = db.prepare(`
      SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC
    `);
    const certificates = certStmt.all(userId);

    // Aggregate stats
    const totalPlayed = attempts.length;
    let avgScore = 0;
    let highestScore = 0;
    let totalTime = 0;

    if (totalPlayed > 0) {
      const sumScore = attempts.reduce((acc, a) => acc + a.score_pct, 0);
      avgScore = Math.round(sumScore / totalPlayed);
      highestScore = Math.max(...attempts.map(a => a.score_pct));
      totalTime = attempts.reduce((acc, a) => acc + a.time_spent_sec, 0);
    }

    // Strike rate metric (speed: questions per minute)
    const totalQuestionsAnswered = attempts.reduce((acc, a) => acc + a.total_questions, 0);
    const speedSecPerQ = totalQuestionsAnswered > 0 ? Math.round(totalTime / totalQuestionsAnswered) : 15;

    // Badges calculation
    const badges = [
      { id: 'first_run', name: 'Debut Match', desc: 'Completed your first quiz on Crictalxx', unlocked: totalPlayed >= 1, icon: 'Flag' },
      { id: 'fifty', name: 'Half-Century', desc: 'Achieved a score of 50% or more', unlocked: highestScore >= 50, icon: 'Shield' },
      { id: 'century', name: 'Century Club', desc: 'Scored 90%+ in any quiz challenge', unlocked: highestScore >= 90, icon: 'Award' },
      { id: 'certified', name: 'Official Master', desc: 'Earned at least 1 verified certificate signed by Tirth', unlocked: certificates.length >= 1, icon: 'Medal' },
      { id: 'veteran', name: 'Cricket Veteran', desc: 'Completed 5 or more match challenges', unlocked: totalPlayed >= 5, icon: 'Trophy' }
    ];

    res.json({
      summary: {
        totalPlayed,
        avgScore,
        highestScore,
        speedSecPerQ,
        totalCertificates: certificates.length
      },
      recentAttempts: attempts,
      certificates,
      badges
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// 10. PUBLIC CERTIFICATE VERIFICATION
app.get('/api/certificates/:certId', (req, res) => {
  try {
    const certStmt = db.prepare('SELECT * FROM certificates WHERE id = ?');
    const cert = certStmt.get(req.params.certId);

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found or invalid' });
    }

    res.json({
      verified: true,
      certificate: cert
    });
  } catch (err) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

// Serve frontend static production build
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send('Crictalxx frontend build not found. Please run npm run build in /client.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏏 Crictalxx server is running on port ${PORT}`);
});
