const db = require('./db');

const initialQuestions = [
  // =========================================================================
  // 🔥 HARD & EXTREME QUESTIONS (DEATH OVERS - HARDCORE CRICKET BRAIN-TEASERS)
  // =========================================================================
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'Who was the very first cricketer in international history to be given OUT by the Third Umpire using television replay?',
    options: JSON.stringify(['Sachin Tendulkar', 'Jonty Rhodes', 'Brian Lara', 'Allan Border']),
    correct_answer: 'Sachin Tendulkar',
    explanation: 'In November 1992 at Kingsmead, Durban (India vs South Africa), Sachin Tendulkar was run out by a direct hit from Jonty Rhodes and became the first player dismissed via television replay (adjudicated by Karl Liebenberg).',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'Who is the ONLY bowler in IPL history to have taken THREE separate hat-tricks (for three different teams)?',
    options: JSON.stringify(['Amit Mishra', 'Yuvraj Singh', 'Lasith Malinga', 'Rashid Khan']),
    correct_answer: 'Amit Mishra',
    explanation: 'Amit Mishra achieved three IPL hat-tricks: for Delhi Daredevils (2008 vs Deccan Chargers), Deccan Chargers (2011 vs Kings XI Punjab), and Sunrisers Hyderabad (2013 vs Pune Warriors India).',
    clues: null,
    player_avatar: null
  },
  {
    category: 'world_cup',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'Who bowled the historic FIRST delivery in the inaugural Men\'s Cricket World Cup in 1975 at Lord\'s?',
    options: JSON.stringify(['Madan Lal (India)', 'Dennis Lillee (Australia)', 'Andy Roberts (West Indies)', 'Bob Willis (England)']),
    correct_answer: 'Madan Lal (India)',
    explanation: 'On June 7, 1975 at Lord\'s, India\'s Madan Lal bowled the historic opening delivery of the first-ever Cricket World Cup to England\'s John Jameson.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'career_path',
    mode: 'career_path',
    difficulty: 'Hard',
    question: 'Which globe-trotting batsman holds the record for playing for the MOST different IPL franchises (a staggering 9 teams)?',
    options: JSON.stringify(['Aaron Finch', 'Dinesh Karthik', 'Thisara Perera', 'Yuvraj Singh']),
    correct_answer: 'Aaron Finch',
    explanation: 'Aaron Finch played for 9 different IPL franchises: Rajasthan Royals, Delhi Daredevils, Pune Warriors India, Sunrisers Hyderabad, Mumbai Indians, Gujarat Lions, Kings XI Punjab, Royal Challengers Bangalore, and Kolkata Knight Riders!',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'What is the highest individual score ever recorded on Test debut in the history of international cricket?',
    options: JSON.stringify(['R.E. Foster (287)', 'Jacques Rudolph (222*)', 'Lawrence Rowe (214)', 'Shikhar Dhawan (187)']),
    correct_answer: 'R.E. Foster (287)',
    explanation: 'England\'s Tip Foster scored 287 against Australia at the SCG in December 1903, which remains the highest score by any batsman on Test debut after over 120 years.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'rapid_fire',
    mode: 'rapid_fire',
    difficulty: 'Hard',
    question: 'In 2006 at The Oval, which Test match became the FIRST and ONLY forfeited match in Test cricket history?',
    options: JSON.stringify([
      'England vs Pakistan (Ball-tampering dispute)',
      'Australia vs West Indies (Pitch boycott)',
      'India vs Sri Lanka (Crowd disturbance)',
      'South Africa vs England (Rain dispute)'
    ]),
    correct_answer: 'England vs Pakistan (Ball-tampering dispute)',
    explanation: 'In the 4th Test at The Oval in August 2006, umpires Darrell Hair and Billy Doctrove penalized Pakistan 5 runs for ball-tampering. Inzamam-ul-Haq\'s team protested by refusing to take the field after tea, resulting in cricket\'s only forfeited Test.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'rapid_fire',
    mode: 'rapid_fire',
    difficulty: 'Hard',
    question: 'Under MCC Law 37, how can a batsman be given OUT if they intentionally kick the ball away while running between wickets?',
    options: JSON.stringify(['Obstructing the Field', 'Hit the Ball Twice', 'Timed Out', 'Unfair Play Penalty']),
    correct_answer: 'Obstructing the Field',
    explanation: 'Under Law 37.1, if either batter willfully obstructs or distracts a fielding side by word or action (such as preventing a run out by kicking the ball), they are out Obstructing the Field.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'Who are the only three bowlers in Test history to have claimed all 10 wickets in a single Test innings?',
    options: JSON.stringify([
      'Jim Laker, Anil Kumble, and Ajaz Patel',
      'Shane Warne, Anil Kumble, and Muttiah Muralitharan',
      'Jim Laker, Richard Hadlee, and Malcolm Marshall',
      'Anil Kumble, Glenn McGrath, and Rangana Herath'
    ]),
    correct_answer: 'Jim Laker, Anil Kumble, and Ajaz Patel',
    explanation: 'Jim Laker (10/53 in 1956 vs AUS), Anil Kumble (10/74 in 1999 vs PAK), and Ajaz Patel (10/119 in 2021 vs IND at Wankhede) are the only three members of the Perfect 10 club.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'guess_player',
    mode: 'guess_player',
    difficulty: 'Hard',
    question: 'Solve this deceptive international cricketer dossier from historical milestones:',
    options: JSON.stringify(['Steve Smith', 'Joe Root', 'Kane Williamson', 'Marnus Labuschagne']),
    correct_answer: 'Steve Smith',
    explanation: 'Steve Smith debuted as a leg-spinner batting at No. 8 against Pakistan at Lord\'s in 2010 before transforming into one of the greatest Test batsmen of modern times with 30+ centuries.',
    clues: JSON.stringify([
      'Clue 1: Made his Test debut at Lord\'s in 2010 batting at number 8 and playing primarily as a leg-spinner.',
      'Clue 2: Started in the IPL playing for Royal Challengers Bangalore (2010) and Pune Warriors India without bowling much.',
      'Clue 3: Holds the record for the fewest innings (162 innings) to score 7,000 runs in Test cricket, beating Wally Hammond.',
      'Clue 4: Famous for eccentric leaves, fidgety batting stances, and winning the 2015 World Cup and multiple Ashes urns.'
    ]),
    player_avatar: 'player-silhouette-smith'
  },
  {
    category: 'guess_player',
    mode: 'guess_player',
    difficulty: 'Hard',
    question: 'Deconstruct the mystery behind this multi-national pioneer:',
    options: JSON.stringify(['Dirk Nannes', 'Eoin Morgan', 'Imran Tahir', 'Roelof van der Merwe']),
    correct_answer: 'Dirk Nannes',
    explanation: 'Dirk Nannes was a professional freestyle skier before turning to cricket in his late 20s, bowling at 150 km/h, and representing Netherlands in T20 WC 2009 and Australia in 2010!',
    clues: JSON.stringify([
      'Clue 1: Did not play top-flight professional cricket until age 29 after pursuing a career as a competitive mogul skier.',
      'Clue 2: Clocked 150+ km/h and played in the 2009 T20 World Cup for Netherlands, famously upsetting England at Lord\'s.',
      'Clue 3: Later represented Australia in both ODIs and T20Is in 2009-2010, finishing as the leading wicket-taker in the 2010 World T20.',
      'Clue 4: Bowled for Delhi Daredevils and Chennai Super Kings in the IPL with lethal left-arm pace.'
    ]),
    player_avatar: 'player-silhouette-nannes'
  },
  {
    category: 'ipl',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'Who was the very first player to be auctioned under the hammer in the inaugural IPL Auction in February 2008?',
    options: JSON.stringify(['Shane Warne', 'MS Dhoni', 'Shoaib Akhtar', 'Ricky Ponting']),
    correct_answer: 'Shane Warne',
    explanation: 'Shane Warne was the very first player brought up in the inaugural IPL auction in 2008. He was bought by Rajasthan Royals for $450,000 and led them to the title that same year!',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Hard',
    question: 'What is the lowest team total ever defended in a completed 20-over Indian Premier League match?',
    options: JSON.stringify(['116 runs (CSK vs PBKS, 2009)', '118 runs (SRH vs MI, 2018)', '119 runs (SRH vs PWI, 2013)', '120 runs (MI vs PWI, 2012)']),
    correct_answer: '116 runs (CSK vs PBKS, 2009)',
    explanation: 'In 2009 at Durban, Chennai Super Kings defended just 116/9 by restricting Kings XI Punjab to 92/8, the lowest total ever defended in IPL history.',
    clues: null,
    player_avatar: null
  },

  // =========================================================================
  // ⚡ MEDIUM QUESTIONS (MIDDLE OVERS - TACTICAL CRICKET TRIVIA)
  // =========================================================================
  {
    category: 'guess_player',
    mode: 'guess_player',
    difficulty: 'Medium',
    question: 'Can you identify this prolific run-machine from these international clues?',
    options: JSON.stringify(['Virat Kohli', 'Rohit Sharma', 'AB de Villiers', 'Kane Williamson']),
    correct_answer: 'Virat Kohli',
    explanation: 'Virat Kohli led India to victory in the 2008 U-19 World Cup, holds the record for 50 ODI centuries, and has over 26,000 international runs.',
    clues: JSON.stringify([
      'Clue 1: Led India to victory in the ICC Under-19 World Cup in 2008 in Kuala Lumpur.',
      'Clue 2: Wears iconic Jersey #18 and broke Sachin Tendulkar\'s record with 50 ODI centuries in the 2023 World Cup semi-final.',
      'Clue 3: Highest run-scorer in a single IPL season with 973 runs (4 centuries) in 2016.',
      'Clue 4: Nicknamed "King", won the 2011 ODI World Cup, 2013 Champions Trophy, and 2024 T20 World Cup.'
    ]),
    player_avatar: 'player-silhouette-1'
  },
  {
    category: 'guess_player',
    mode: 'guess_player',
    difficulty: 'Medium',
    question: 'Identify this death-bowling pioneer known for toe-crushing round-arm yorkers:',
    options: JSON.stringify(['Lasith Malinga', 'Jasprit Bumrah', 'Mitchell Starc', 'Dale Steyn']),
    correct_answer: 'Lasith Malinga',
    explanation: 'Lasith Malinga is the only bowler to take 4 wickets in 4 consecutive balls twice in international cricket (vs South Africa in 2007 WC and vs NZ in 2019).',
    clues: JSON.stringify([
      'Clue 1: Debuted in 2004 with an unconventional round-arm "slinging" bowling action.',
      'Clue 2: First bowler in history to take four wickets in four consecutive balls in international cricket (twice!).',
      'Clue 3: Mumbai Indians\' death-over hero who defended 1 run on the final ball of the 2019 IPL Final.',
      'Clue 4: Nicknamed "Slinga", famous for blond curls and kissing the ball before run-up.'
    ]),
    player_avatar: 'player-silhouette-3'
  },
  {
    category: 'career_path',
    mode: 'career_path',
    difficulty: 'Medium',
    question: 'Which player has represented ALL of these IPL franchises?\nDelhi Daredevils (2008-2010) ➔ Kolkata Knight Riders (2011-2017) ➔ Delhi Capitals (2018)',
    options: JSON.stringify(['Gautam Gambhir', 'Dinesh Karthik', 'Robin Uthappa', 'Shikhar Dhawan']),
    correct_answer: 'Gautam Gambhir',
    explanation: 'Gautam Gambhir captained KKR to two IPL trophies (2012 and 2014) before returning to Delhi for his farewell season in 2018.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Medium',
    question: 'Who scored the FASTEST century in ODI cricket history off just 31 deliveries?',
    options: JSON.stringify(['AB de Villiers', 'Corey Anderson', 'Shahid Afridi', 'Glenn Maxwell']),
    correct_answer: 'AB de Villiers',
    explanation: 'AB de Villiers shattered the world record by smashing 100 off 31 balls against the West Indies at the Wanderers in Johannesburg on January 18, 2015.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Medium',
    question: 'Who was the first bowler in international cricket history to capture 800 Test wickets?',
    options: JSON.stringify(['Muttiah Muralitharan', 'Shane Warne', 'James Anderson', 'Anil Kumble']),
    correct_answer: 'Muttiah Muralitharan',
    explanation: 'Sri Lanka\'s Muttiah Muralitharan reached exactly 800 wickets on the final delivery of his Test career against India in Galle in July 2010.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'ipl',
    mode: 'standard',
    difficulty: 'Medium',
    question: 'Who holds the record for winning the MOST Orange Caps (highest run-scorer in a season) in IPL history?',
    options: JSON.stringify(['David Warner (3 times)', 'Virat Kohli (2 times)', 'Chris Gayle (2 times)', 'KL Rahul (2 times)']),
    correct_answer: 'David Warner (3 times)',
    explanation: 'David Warner captured the Orange Cap 3 times: in 2015 (562 runs), 2017 (641 runs), and 2019 (692 runs), all while playing for Sunrisers Hyderabad.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'world_cup',
    mode: 'standard',
    difficulty: 'Medium',
    question: 'In the 2019 ICC World Cup final, which boundary-count metric initially decided the champion after the Super Over tied?',
    options: JSON.stringify(['Total boundaries hit (Fours + Sixes)', 'Fewer wickets lost in regulation', 'Higher head-to-head score', 'Super Over run-rate']),
    correct_answer: 'Total boundaries hit (Fours + Sixes)',
    explanation: 'England hit 26 boundaries (24 fours, 2 sixes) compared to New Zealand\'s 17 (14 fours, 3 sixes), earning England the trophy under the former boundary-count rule.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'rapid_fire',
    mode: 'rapid_fire',
    difficulty: 'Medium',
    question: 'Under ICC regulations, how many fielders are permitted outside the 30-yard inner circle during the first 6 Powerplay overs of a Men\'s T20 match?',
    options: JSON.stringify(['Maximum 2 fielders', 'Maximum 3 fielders', 'Maximum 4 fielders', 'Maximum 1 fielder']),
    correct_answer: 'Maximum 2 fielders',
    explanation: 'During the mandatory 6-over Powerplay in T20 cricket, a maximum of 2 fielders are allowed outside the 30-yard fielding restriction circle.',
    clues: null,
    player_avatar: null
  },

  // =========================================================================
  // 🟢 EASY QUESTIONS (POWERPLAY - FUNDAMENTAL BASICS & ICONS)
  // =========================================================================
  {
    category: 'guess_player',
    mode: 'guess_player',
    difficulty: 'Easy',
    question: 'Who is this iconic finisher who hit the winning six in the 2011 ICC World Cup final?',
    options: JSON.stringify(['MS Dhoni', 'Yuvraj Singh', 'Suresh Raina', 'Dinesh Karthik']),
    correct_answer: 'MS Dhoni',
    explanation: 'MS Dhoni finished the 2011 World Cup final with an iconic six over long-on off Nuwan Kulasekara at Wankhede Stadium.',
    clues: JSON.stringify([
      'Clue 1: Former railway ticket collector from Ranchi who captained India to victory in three ICC trophies.',
      'Clue 2: Wears iconic Jersey #7 and invented the lightning Helicopter Shot.',
      'Clue 3: Revered as "Thala" by Chennai Super Kings fans, winning 5 IPL trophies.',
      'Clue 4: Completed over 100 stumpings in ODIs, the most in cricket history.'
    ]),
    player_avatar: 'player-silhouette-dhoni'
  },
  {
    category: 'stats',
    mode: 'standard',
    difficulty: 'Easy',
    question: 'What is the highest individual score in One Day International (ODI) history?',
    options: JSON.stringify(['Rohit Sharma (264)', 'Martin Guptill (237*)', 'Virender Sehwag (219)', 'Chris Gayle (215)']),
    correct_answer: 'Rohit Sharma (264)',
    explanation: 'Rohit Sharma hammered 264 runs off 173 balls against Sri Lanka at Eden Gardens, Kolkata on 13 November 2014.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'world_cup',
    mode: 'standard',
    difficulty: 'Easy',
    question: 'Which country won the inaugural ICC Men\'s T20 World Cup in 2007 in South Africa?',
    options: JSON.stringify(['India', 'Pakistan', 'Australia', 'South Africa']),
    correct_answer: 'India',
    explanation: 'India defeated Pakistan by 5 runs in the thrilling final at the Wanderers in Johannesburg on September 24, 2007.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'rapid_fire',
    mode: 'rapid_fire',
    difficulty: 'Easy',
    question: 'What is the length of a standard cricket pitch between the bowling creases?',
    options: JSON.stringify(['22 yards (20.12 m)', '20 yards (18.29 m)', '24 yards (21.95 m)', '18 yards (16.46 m)']),
    correct_answer: '22 yards (20.12 m)',
    explanation: 'The cricket pitch is standard rectangular turf measuring 22 yards (20.12 meters) between wickets.',
    clues: null,
    player_avatar: null
  },
  {
    category: 'ipl',
    mode: 'standard',
    difficulty: 'Easy',
    question: 'Which two franchises have won the joint-most Indian Premier League titles (5 titles each)?',
    options: JSON.stringify([
      'Mumbai Indians and Chennai Super Kings',
      'Kolkata Knight Riders and Mumbai Indians',
      'Chennai Super Kings and Rajasthan Royals',
      'Royal Challengers Bangalore and Sunrisers Hyderabad'
    ]),
    correct_answer: 'Mumbai Indians and Chennai Super Kings',
    explanation: 'Both Mumbai Indians (2013, 2015, 2017, 2019, 2020) and Chennai Super Kings (2010, 2011, 2018, 2021, 2023) hold 5 championships each.',
    clues: null,
    player_avatar: null
  }
];

const initialQuizzes = [
  // --- DIFFICULTY-BASED MATCH ARENAS ---
  {
    id: 'quiz-hard-death-overs',
    title: 'Death Overs Masterclass (Hardcore Trivia)',
    description: 'Not for casual fans! Test third-umpire origins, 9-franchise journeymen, 10-wicket hauls, and obscure MCC law disputes.',
    category: 'all',
    difficulty: 'Hard',
    mode: 'standard',
    time_limit_sec: 90,
    pass_mark_pct: 80,
    badge_name: 'Death Over Tactician',
    badge_icon: 'Award'
  },
  {
    id: 'quiz-guess-player',
    title: 'The Master Sleuth: Guess The Player',
    description: 'Classified cricketer dossiers with progressive clues. Uncover mystery superstars using the fewest clues possible.',
    category: 'guess_player',
    difficulty: 'Hard',
    mode: 'guess_player',
    time_limit_sec: 240,
    pass_mark_pct: 80,
    badge_name: 'Cricket Sleuth',
    badge_icon: 'Search'
  },
  {
    id: 'quiz-medium-middle-overs',
    title: 'Middle Overs Battle: Tactical Trivia',
    description: 'Franchise histories, 31-ball hundreds, 800 wickets, and boundary-count World Cup drama.',
    category: 'all',
    difficulty: 'Medium',
    mode: 'standard',
    time_limit_sec: 120,
    pass_mark_pct: 75,
    badge_name: 'Middle Overs General',
    badge_icon: 'Shield'
  },
  {
    id: 'quiz-super-over',
    title: 'The Super Over: Rapid Fire Blitz',
    description: 'High intensity match rules, fielding restrictions, and record chase trivia against a fast-ticking clock.',
    category: 'rapid_fire',
    difficulty: 'Medium',
    mode: 'rapid_fire',
    time_limit_sec: 90,
    pass_mark_pct: 75,
    badge_name: 'Speed Striker',
    badge_icon: 'Zap'
  },
  {
    id: 'quiz-easy-powerplay',
    title: 'Powerplay Arena: Cricket Core Basics',
    description: 'Friendly warm-up match covering 264 knocks, 22-yard turf fundamentals, and iconic World Cup memories.',
    category: 'all',
    difficulty: 'Easy',
    mode: 'standard',
    time_limit_sec: 150,
    pass_mark_pct: 70,
    badge_name: 'Powerplay Striker',
    badge_icon: 'Flag'
  }
];

function seed() {
  console.log('Seeding Crictalxx database with truly challenging & balanced questions...');

  db.exec('DELETE FROM questions;');
  db.exec('DELETE FROM quizzes;');
  db.exec('DELETE FROM users;');

  // Seed default Admin & Player
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('admin_tirth', 'Tirth (Admin)', 'admin@crictalxx.com', 'admin123', 'admin');
  insertUser.run('player_rohit', 'Cricket Fan', 'player@crictalxx.com', 'player123', 'user');

  const insertQ = db.prepare(`
    INSERT INTO questions (category, mode, difficulty, question, options, correct_answer, explanation, clues, player_avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let hardCount = 0, medCount = 0, easyCount = 0;
  for (const q of initialQuestions) {
    if (q.difficulty === 'Hard') hardCount++;
    else if (q.difficulty === 'Medium') medCount++;
    else if (q.difficulty === 'Easy') easyCount++;

    insertQ.run(
      q.category,
      q.mode,
      q.difficulty,
      q.question,
      q.options,
      q.correct_answer,
      q.explanation,
      q.clues,
      q.player_avatar
    );
  }

  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (id, title, description, category, mode, time_limit_sec, pass_mark_pct, question_ids, badge_name, badge_icon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const qz of initialQuizzes) {
    insertQuiz.run(
      qz.id,
      qz.title,
      qz.description,
      qz.category,
      qz.mode,
      qz.time_limit_sec,
      qz.pass_mark_pct,
      qz.question_ids || 'dynamic',
      qz.badge_name,
      qz.badge_icon
    );
  }

  console.log(`Seeded ${initialQuestions.length} questions:`);
  console.log(`  🔴 Hard (Brain-busters): ${hardCount}`);
  console.log(`  🟡 Medium (Tactical): ${medCount}`);
  console.log(`  🟢 Easy (Warm-up): ${easyCount}`);
}

if (require.main === module) {
  seed();
}

module.exports = seed;
