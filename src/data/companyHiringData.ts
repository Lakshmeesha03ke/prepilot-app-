export interface CompanyProcessRound {
  roundNumber: number;
  name: string;
  type: 'Online Assessment' | 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'Techno-Managerial' | 'HR & Cultural';
  duration: string;
  format: string;
  cutoffOrExpectation: string;
  keyTopics: string[];
  tips: string;
}

export interface CompanyHiringProfile {
  id: string;
  name: string;
  logo: string;
  tier: 'Tier-1 FAANG / Product Giants' | 'Mass Recruiters / IT Services' | 'Fintech & High-Growth Unicorns';
  tierBadgeColor: string;
  roleTitles: string[];
  packageLPA: string;
  overview: string;
  
  // Previous vs Current Hiring Process
  previousProcess: {
    year: string;
    summary: string;
    characteristics: string[];
  };
  currentProcess: {
    year: string;
    summary: string;
    keyChanges: string[];
  };
  
  // Round by round breakdown
  rounds: CompanyProcessRound[];
  
  // Skill Weightages
  topSkills: { name: string; percentage: number }[];
  frequentQuestions: string[];
  curatedKeywords: string[];
}

export const COMPANY_HIRING_DATA: CompanyHiringProfile[] = [
  {
    id: 'meta',
    name: 'Meta (Facebook)',
    logo: '♾️',
    tier: 'Tier-1 FAANG / Product Giants',
    tierBadgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    roleTitles: ['Software Engineer (E3/E4)', 'Systems Engineer', 'Frontend Engineer'],
    packageLPA: '₹35 - ₹65 LPA (Global Base + RSUs)',
    overview: 'Meta focuses heavily on raw problem-solving speed, clean optimal code without syntax errors, and mastery over standard data structures (Trees, Graphs, Hash Maps, Dynamic Programming).',
    
    previousProcess: {
      year: '2021 - 2023 Process',
      summary: 'Heavy reliance on hard mathematical dynamic programming, onsite whiteboard coding, and broad open-ended algorithmic questions.',
      characteristics: [
        '3 to 4 rounds of back-to-back live algorithm whiteboard coding',
        'Emphasis on solving 2 medium/hard LeetCode questions in 45 minutes',
        'Minimal focus on behavioral (only 1 short HR conversation)'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Shifted towards automated CodeSignal General Coding Framework (GCF), production-grade clean code, API modularity, and strict evaluation on Meta Core Cultural Values.',
      keyChanges: [
        'Round 1: Automated 70-min CodeSignal assessment (4 problems: Arrays, String Simulation, Matrix, Complex Hash/Tree)',
        'Round 2: Technical Screen (45 min) — Expectation to solve 2 standard Meta-tagged Mediums with optimal time/space complexity',
        'Round 3: Systems & Coding Architecture / Low-Level Design (LLD)',
        'Round 4: Behavioral STAR Interview evaluated strictly against Meta Values: "Move Fast", "Focus on Long-Term Impact", "Build Awesome Things"'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Automated CodeSignal / Online Assessment',
        type: 'Online Assessment',
        duration: '70 Minutes',
        format: '4 Coding Problems (1 Easy, 2 Medium, 1 Hard Implementation)',
        cutoffOrExpectation: 'Score 820+ / 850 on CodeSignal GCF framework',
        keyTopics: ['Array Manipulation', 'Two Pointers & Sliding Window', 'Hash Maps', 'Matrix Traversal'],
        tips: 'Speed is critical. Aim to solve Q1 and Q2 within the first 20 minutes to leave time for test cases on Q3 and Q4.'
      },
      {
        roundNumber: 2,
        name: 'Technical Screen (Live Coding)',
        type: 'Technical Round 1',
        duration: '45 Minutes',
        format: 'Live Video Coding (CoderPad) with Meta Engineer',
        cutoffOrExpectation: 'Complete 2 Medium problems with zero bugs and dry run with custom test cases',
        keyTopics: ['Binary Trees (LCA, Path Sum)', 'Graph BFS/DFS', 'Topological Sort', 'Valid Palindrome variants'],
        tips: 'Always communicate your approach before typing. State Time and Space Big-O complexities explicitly.'
      },
      {
        roundNumber: 3,
        name: 'Deep Technical & Low-Level Design',
        type: 'Technical Round 2',
        duration: '45 Minutes',
        format: 'Live problem solving on scalable data structures and OOP models',
        cutoffOrExpectation: 'Clean modular classes, edge-case resilience, and concurrency awareness',
        keyTopics: ['LRU Cache', 'Trie / Autocomplete', 'Design Hit Counter', 'Custom Iterators'],
        tips: 'Show how your code scales to millions of concurrent reads and writes.'
      },
      {
        roundNumber: 4,
        name: 'Behavioral & Leadership Evaluation',
        type: 'HR & Cultural',
        duration: '45 Minutes',
        format: 'STAR method situational and retrospective questions',
        cutoffOrExpectation: 'High ownership, ability to resolve conflicts, and rapid iteration mindset',
        keyTopics: ['Disagreements with Teammates', 'Handling Ambiguous Project Specs', 'Overcoming Outages'],
        tips: 'Structure every story: Situation, Task, Action (what YOU did), and Measurable Result.'
      }
    ],
    topSkills: [
      { name: 'Trees & Graphs (BFS/DFS)', percentage: 35 },
      { name: 'Two Pointers & Hash Tables', percentage: 25 },
      { name: 'Dynamic Programming & Memoization', percentage: 20 },
      { name: 'System & Class Design (LLD)', percentage: 20 }
    ],
    frequentQuestions: [
      'Lowest Common Ancestor of a Binary Tree III (with parent pointer)',
      'Subarray Sum Equals K (Prefix Sum + Hash Map)',
      'Minimum Remove to Make Valid Parentheses',
      'Word Break (DP / Trie)',
      'Design In-Memory File System'
    ],
    curatedKeywords: ['CodeSignal', 'Two Pointers', 'BFS', 'STAR Technique', 'Move Fast', 'CoderPad']
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    tier: 'Tier-1 FAANG / Product Giants',
    tierBadgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    roleTitles: ['Software Engineer (L3/Campus)', 'Associate Cloud Engineer', 'Data Scientist'],
    packageLPA: '₹32 - ₹55 LPA',
    overview: 'Google tests deep computer science fundamentals, novel problem variation solving (anti-memorization), clean code aesthetics, and "Googleyness".',
    
    previousProcess: {
      year: '2020 - 2023 Process',
      summary: '5 back-to-back 45-minute on-site whiteboard algorithmic rounds with very high DP/combinatorics weight.',
      characteristics: [
        'Pure algorithmic puzzles without library helpers',
        'Heavy emphasis on mathematical proofs and invariants',
        'Googleyness questions scattered informally across coding rounds'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Streamlined online hiring with Google Online Challenge (GOC), 3 remote coding interviews, and dedicated Googleyness & Leadership evaluation.',
      keyChanges: [
        'Round 1: Google Online Challenge (GOC) — 2 challenging algorithmic problems in 60 minutes on HackerEarth/custom platform',
        'Round 2 & 3: 2 In-depth Technical Google Meet interviews (Focus on Graphs, Disjoint Set Union, Segment Trees, Trie)',
        'Round 4: Googleyness & Leadership round (Evaluates intellectual humility, ethics, teamwork, and collaborative bias)'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Google Online Challenge (GOC)',
        type: 'Online Assessment',
        duration: '60 Minutes',
        format: '2 Advanced Algorithmic Problems with complex mathematical/graph constraints',
        cutoffOrExpectation: 'Pass 100% test cases on Problem 1 and at least 70% on Problem 2',
        keyTopics: ['Graph Shortest Path (Dijkstra)', 'Binary Search on Answer', 'Segment Trees / BIT', 'Combinatorics'],
        tips: 'Google tests corner cases aggressively (empty inputs, 10^9 constraints, integer overflow).'
      },
      {
        roundNumber: 2,
        name: 'Technical Interview 1 (DSA & Code Quality)',
        type: 'Technical Round 1',
        duration: '45 Minutes',
        format: 'Google Docs / Interview tool live coding without autocomplete',
        cutoffOrExpectation: 'No copy-pasting, clear variable naming, and optimal algorithmic bounds',
        keyTopics: ['Trees', 'Union-Find', 'Sliding Window', 'Dijkstra on Grid'],
        tips: 'Practice writing code in plain text editors without syntax highlighting.'
      },
      {
        roundNumber: 3,
        name: 'Technical Interview 2 (Scalability & Extensions)',
        type: 'Technical Round 2',
        duration: '45 Minutes',
        format: 'Extending a base problem with concurrent streams or massive file constraints',
        cutoffOrExpectation: 'Propose and optimize distributed data structures',
        keyTopics: ['Stream Processing', 'Trie / Prefix Trees', 'Memory Optimization', 'DAG Processing'],
        tips: 'Ask clarifying questions on input bounds before proposing any solution.'
      },
      {
        roundNumber: 4,
        name: 'Googleyness & Leadership',
        type: 'HR & Cultural',
        duration: '45 Minutes',
        format: 'Behavioral exploration of ethical judgment and navigating ambiguity',
        cutoffOrExpectation: 'Shows empathy, willingness to learn from failure, and intellectual honesty',
        keyTopics: ['Intellectual Humility', 'Doing the Right Thing', 'Navigating Ambiguous Projects'],
        tips: 'Never blame colleagues in behavioral examples. Focus on constructive collaboration.'
      }
    ],
    topSkills: [
      { name: 'Graph Theory & DSU', percentage: 35 },
      { name: 'Binary Search & Monotonic Stacks', percentage: 25 },
      { name: 'Dynamic Programming & Trees', percentage: 25 },
      { name: 'Googleyness & Ethics', percentage: 15 }
    ],
    frequentQuestions: [
      'Evaluate Division (Graph Weighted DFS / Union-Find)',
      'Snapshot Array (Binary Search on History)',
      'Word Ladder II (Bidirectional BFS)',
      'Robot Room Cleaner (Backtracking & Orientation)',
      'Stream of Characters (Aho-Corasick / Trie)'
    ],
    curatedKeywords: ['GOC', 'Googleyness', 'Union-Find', 'Dijkstra', 'Segment Trees']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    tier: 'Tier-1 FAANG / Product Giants',
    tierBadgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    roleTitles: ['Software Development Engineer 1 (SDE 1)', 'Data Engineer', 'QAE'],
    packageLPA: '₹28 - ₹45 LPA',
    overview: 'Amazon rigorously evaluates candidates across both strong Data Structures & Algorithms and the 16 Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action).',
    
    previousProcess: {
      year: '2020 - 2023 Process',
      summary: 'Debugging round + 2 coding questions on HackerRank, followed by 3 technical rounds focusing primarily on trees, graphs, and OOPS.',
      characteristics: [
        '20-minute code debugging round in C++/Java',
        'Coding OA with standard medium LeetCode questions',
        'Informal behavioral questions at end of each round'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Rigorous 3-part OA including Work Simulation / Work Style Assessment, followed by 3 Technical rounds where each round devotes 20 minutes specifically to Leadership Principles.',
      keyChanges: [
        'Round 1: Amazon OA (Part 1: 2 Coding Problems in 70 min, Part 2: Work Simulation & SDE scenarios, Part 3: Work Style Assessment)',
        'Round 2: Technical Round 1 (DSA + Customer Obsession & Ownership LP)',
        'Round 3: Technical Round 2 (OOP / Low-Level Design + Dive Deep LP)',
        'Round 4: Bar Raiser Interview (An independent Amazon Bar Raiser evaluating high standard and long-term trajectory)'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Amazon Online Assessment (OA 1 + Work Simulation)',
        type: 'Online Assessment',
        duration: '90 Minutes',
        format: '2 Coding problems + Amazon Work Simulation (handling agile sprints, ticketing)',
        cutoffOrExpectation: 'Both coding problems 100% passed + Leadership Principle alignment in simulations',
        keyTopics: ['Priority Queue / Heaps', 'Dynamic Programming', 'Graph Shortest Path', 'Hash Maps'],
        tips: 'Do not neglect the Work Style Assessment! Many high-scoring coders get rejected due to poor LP responses.'
      },
      {
        roundNumber: 2,
        name: 'Technical Interview 1 (DSA & Customer Obsession)',
        type: 'Technical Round 1',
        duration: '60 Minutes',
        format: '20 min LP questions + 40 min live coding on Amazon internal tool',
        cutoffOrExpectation: 'Clean bug-free implementation and 2 detailed STAR leadership stories',
        keyTopics: ['Binary Search Trees', 'Topological Sorting', 'Sliding Window', 'Customer Obsession'],
        tips: 'Every answer must tie back to customer impact and data-driven metrics.'
      },
      {
        roundNumber: 3,
        name: 'Technical Interview 2 (System & Class Design)',
        type: 'System Design',
        duration: '60 Minutes',
        format: 'Low-Level Object Oriented Design (Locker System, Parking Lot, Shopping Cart)',
        cutoffOrExpectation: 'Design patterns (Factory, Strategy, Observer), clean interfaces, SOLID principles',
        keyTopics: ['Design Amazon Locker System', 'Design Rate Limiter', 'Design Chess / Elevator', 'SOLID'],
        tips: 'Clarify non-functional requirements (throughput, thread-safety, persistence).'
      },
      {
        roundNumber: 4,
        name: 'Bar Raiser Round',
        type: 'HR & Cultural',
        duration: '60 Minutes',
        format: 'Vigorous inquiry by a certified external Amazon Bar Raiser into your deepest project failures and successes',
        cutoffOrExpectation: 'Must raise the bar of the current team average in both coding and culture',
        keyTopics: ['Have Backbone; Disagree and Commit', 'Deliver Results under Tight Deadlines', 'Bias for Action'],
        tips: 'Be prepared for 4 levels of "Why?" drill-downs on your resume projects.'
      }
    ],
    topSkills: [
      { name: '16 Leadership Principles (STAR)', percentage: 30 },
      { name: 'Heaps & Priority Queues', percentage: 25 },
      { name: 'Graphs & BFS/DFS', percentage: 25 },
      { name: 'Low-Level Object Oriented Design', percentage: 20 }
    ],
    frequentQuestions: [
      'Amazon Locker Delivery Optimization (BFS / Dijkstra)',
      'Reorganize String (Max Heap / Priority Queue)',
      'Course Schedule II (Topological Sort / Kahns Algorithm)',
      'Design Amazon Shopping Cart (OOP / Strategy Pattern)',
      'Trapping Rain Water (Two Pointers)'
    ],
    curatedKeywords: ['Leadership Principles', 'Bar Raiser', 'Work Simulation', 'SOLID', 'Customer Obsession']
  },
  {
    id: 'tcs',
    name: 'TCS (Tata Consultancy Services)',
    logo: '💼',
    tier: 'Mass Recruiters / IT Services',
    tierBadgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    roleTitles: ['TCS Prime (9-11.5 LPA)', 'TCS Digital (7-7.5 LPA)', 'TCS Ninja (3.6-4 LPA)'],
    packageLPA: '₹3.6 - ₹11.5 LPA (Multi-Tiered NQT)',
    overview: 'TCS is India\'s largest campus recruiter. The TCS National Qualifier Test (NQT) now features 3 distinct bands: Ninja, Digital, and the elite Prime tier.',
    
    previousProcess: {
      year: '2021 - 2023 Process',
      summary: 'Standard 2-tier NQT (Ninja 3.36 LPA & Digital 7 LPA). Simple aptitude, basic English, and 2 basic programming logic problems.',
      characteristics: [
        'Heavy aptitude & numerical ability focus',
        'Basic C/Java syntax problems',
        'Single combined Technical + HR interview'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Revamped 3-Tier NQT with TCS Prime (₹9 - ₹11.5 LPA). Includes Advanced Cognitive, Advanced Coding (DSA, GenAI awareness, System concepts), and rigorous proctored IDE.',
      keyChanges: [
        'Round 1: Foundation Section (Aptitude, Reasoning, Verbal) — Mandatory for all bands',
        'Round 1B: Advanced Cognitive & Advanced Coding Section (2 DSA questions: Arrays/DP/Strings) — Unlocks Digital and Prime interview calls',
        'Round 2: Technical Interview (In-depth questions on projects, DSA, SQL, DBMS, OS, Cloud & GenAI for Prime candidates)',
        'Round 3: Managerial & HR Round (Relocation readiness, communication, company profile)'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'TCS NQT (Foundation + Advanced Section)',
        type: 'Online Assessment',
        duration: '165 Minutes',
        format: 'Section A: Numerical (20Q), Verbal (25Q), Reasoning (20Q) | Section B: Advanced Coding (2 Problems: 90 min)',
        cutoffOrExpectation: 'For Prime: Pass both advanced coding problems + 80%+ on advanced cognitive',
        keyTopics: ['Number Theory & Permutations', 'Array Manipulation', 'String Parsing', 'Dynamic Programming'],
        tips: 'TCS compiler is strict on execution time. Use fast I/O in C++/Java.'
      },
      {
        roundNumber: 2,
        name: 'Technical Interview (Prime / Digital Band)',
        type: 'Technical Round 1',
        duration: '45 - 60 Minutes',
        format: 'Panel Interview testing DSA, CS Fundamentals, and Full Stack / Cloud Projects',
        cutoffOrExpectation: 'Deep understanding of final year project, OOP concepts, SQL queries, and normalization',
        keyTopics: ['Normalization (1NF-BCNF)', 'Indexing in SQL', 'OOP Concepts (Polymorphism, Abstraction)', 'DSA Traversal'],
        tips: 'Be ready to write code on paper or screenshare for standard sorting, reversing linked lists, and SQL joins.'
      },
      {
        roundNumber: 3,
        name: 'Managerial & HR Interview',
        type: 'Techno-Managerial',
        duration: '30 Minutes',
        format: 'Evaluates willingness to work in rotational shifts, relocation across India, and teamwork',
        cutoffOrExpectation: 'Positive attitude, willingness to upskill, flexibility with tech stacks',
        keyTopics: ['Why TCS?', 'Night Shift Readiness', 'Handling Client Deadlines', 'Bond & Relocation Terms'],
        tips: 'Always confirm willingness to relocate and work on diverse business domains.'
      }
    ],
    topSkills: [
      { name: 'Quantitative & Reasoning Aptitude', percentage: 30 },
      { name: 'Core CS (DBMS, OS, Networks)', percentage: 25 },
      { name: 'DSA & Coding (C++/Java/Python)', percentage: 25 },
      { name: 'Project & Technical Viva', percentage: 20 }
    ],
    frequentQuestions: [
      'Find the second largest element in an array without sorting',
      'Explain ACID properties in DBMS with real banking example',
      'Difference between Process and Thread; Virtual Memory in OS',
      'Write SQL query to find Nth highest salary using DENSE_RANK()',
      'Reverse words in a given string without using split() function'
    ],
    curatedKeywords: ['TCS NQT', 'TCS Prime', 'TCS Digital', 'DBMS Normalization', 'ACID', 'SQL Joins']
  },
  {
    id: 'infosys',
    name: 'Infosys',
    logo: '🔷',
    tier: 'Mass Recruiters / IT Services',
    tierBadgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    roleTitles: ['Specialist Programmer (9.5 LPA)', 'Digital Specialist Engineer (6.5 LPA)', 'Systems Engineer (3.6 LPA)'],
    packageLPA: '₹3.6 - ₹9.5 LPA',
    overview: 'Infosys hires through INFYTQ, HackWithInfy, and the Infosys Campus Recruitment Program, offering pathways to Systems Engineer, DSE, and SP roles.',
    
    previousProcess: {
      year: '2021 - 2023 Process',
      summary: 'Heavy aptitude focus with Mathematical critical thinking, verbal reasoning, and basic coding puzzles.',
      characteristics: [
        'Pseudocode output prediction questions',
        'Puzzle-based reasoning section',
        'Standard single round HR interview'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'HackWithInfy and National Qualifier with elevated coding difficulty. SP and DSE qualifiers tackle Medium/Hard dynamic programming and competitive programming challenges.',
      keyChanges: [
        'Round 1: Online Test featuring Reasoning Ability (15Q), Mathematical Ability (10Q), Verbal (20Q), Pseudocode (5Q), Puzzle Solving (4Q)',
        'HackWithInfy Coding Challenge (3 competitive programming questions in 3 hours)',
        'Round 2: Technical Interview (Code dry run, algorithms, database query optimization)',
        'Round 3: HR Interview (Cultural fit, communication, adaptability)'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Infosys Online Assessment / HackWithInfy',
        type: 'Online Assessment',
        duration: '100 - 180 Minutes',
        format: 'Sectional time limits: Reasoning, Math, Verbal, Pseudocode, and Advanced Coding',
        cutoffOrExpectation: 'No negative marking, but strict sectional cutoffs (~70% per section)',
        keyTopics: ['Number Series & Cryptarithmetic', 'Data Interpretation', 'Pseudocode Debugging', 'Dynamic Programming'],
        tips: 'Manage time strictly per section — you cannot return to a previous section once time runs out!'
      },
      {
        roundNumber: 2,
        name: 'Technical Interview (DSE / SP Track)',
        type: 'Technical Round 1',
        duration: '45 Minutes',
        format: 'Coding interview assessing DSA, OOP principles, and Database design',
        cutoffOrExpectation: 'Demonstrate clean modular OOP code and explain time complexities',
        keyTopics: ['Binary Search Trees', 'Recursion & Backtracking', 'SQL Triggers & Views', 'Project Architecture'],
        tips: 'Explain your thought process aloud before writing the final solution.'
      },
      {
        roundNumber: 3,
        name: 'HR & Personal Interview',
        type: 'HR & Cultural',
        duration: '20 Minutes',
        format: 'Assess communication skills, career aspirations, and team dynamics',
        cutoffOrExpectation: 'High clarity of expression and knowledge of Infosys global training center in Mysore',
        keyTopics: ['Tell me about yourself', 'Why Infosys?', 'Strengths & Weaknesses', 'Relocation Readiness'],
        tips: 'Mention your excitement about Infosys Springboard and training programs.'
      }
    ],
    topSkills: [
      { name: 'Mathematical & Logical Aptitude', percentage: 30 },
      { name: 'Data Structures & Algorithms', percentage: 30 },
      { name: 'Database & SQL Queries', percentage: 20 },
      { name: 'Pseudocode & Programming Logic', percentage: 20 }
    ],
    frequentQuestions: [
      'Solve Cryptarithmetic Multiplication puzzles (e.g., SEND + MORE = MONEY)',
      'Detect and remove loop in a Linked List (Floyd Cycle-Finding Algorithm)',
      'Implement Queue using two Stacks',
      'Explain difference between Truncate, Delete, and Drop in SQL',
      'What are Abstract Classes vs Interfaces in Java?'
    ],
    curatedKeywords: ['HackWithInfy', 'DSE', 'Specialist Programmer', 'Cryptarithmetic', 'Pseudocode']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    tier: 'Tier-1 FAANG / Product Giants',
    tierBadgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    roleTitles: ['Software Engineer', 'Support Engineer', 'Product Manager'],
    packageLPA: '₹30 - ₹50 LPA',
    overview: 'Microsoft evaluates algorithmic dexterity, operating systems, memory management, and growth mindset.',
    
    previousProcess: {
      year: '2020 - 2023 Process',
      summary: 'Codility OA followed by 3-4 rounds of coding and low-level data structures.',
      characteristics: [
        'Heavy emphasis on Linked Lists, Binary Trees, and String parsing',
        'Deep questions on C++ pointers and memory management',
        'Direct conversations with Engineering Directors'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Codility assessment with automated code quality review, 3 rounds of Technical Video interviews testing DSA, Systems, and Growth Mindset principles.',
      keyChanges: [
        'Round 1: Codility Online Assessment (3 algorithmic problems in 90 minutes with strict corner case testing)',
        'Round 2: Technical Interview 1 (DSA, Binary Search, Trees, Linked Lists)',
        'Round 3: Technical Interview 2 (System Design, Multithreading, Concurrency, API contracts)',
        'Round 4: Partner / Director Round (Growth Mindset, Handling ambiguous challenges, Customer passion)'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Microsoft Codility Online Assessment',
        type: 'Online Assessment',
        duration: '90 Minutes',
        format: '3 Coding Problems on Codility (scored on correctness and performance)',
        cutoffOrExpectation: 'Score 90%+ on both correctness and asymptotic time complexity',
        keyTopics: ['Bit Manipulation', 'Intervals Scheduling', 'Binary Trees', 'Strings & Hashes'],
        tips: 'Codility runs hidden test cases with 10^5 elements. Always design O(N) or O(N log N) algorithms.'
      },
      {
        roundNumber: 2,
        name: 'Technical Interview 1 (Algorithms & Data Structures)',
        type: 'Technical Round 1',
        duration: '45 - 60 Minutes',
        format: 'Live problem solving with Microsoft engineer',
        cutoffOrExpectation: 'Bug-free code with explicit memory management and pointer validation',
        keyTopics: ['Binary Search on 2D Matrix', 'Serialize & Deserialize Binary Tree', 'LRU Cache'],
        tips: 'Check for null pointers and buffer overflows explicitly.'
      },
      {
        roundNumber: 3,
        name: 'Technical Interview 2 (Systems & Concurrency)',
        type: 'Technical Round 2',
        duration: '60 Minutes',
        format: 'Discussion on threads, locks, race conditions, and scalable architecture',
        cutoffOrExpectation: 'Understand mutexes, semaphores, deadlock prevention, and database indexing',
        keyTopics: ['Multithreading', 'Deadlocks', 'Design URL Shortener', 'Distributed Caching'],
        tips: 'Be familiar with asynchronous programming and cloud services (Azure/AWS concepts).'
      },
      {
        roundNumber: 4,
        name: 'Director / Growth Mindset Round',
        type: 'HR & Cultural',
        duration: '45 Minutes',
        format: 'Executive evaluation of curiosity, learning from setbacks, and passion for Microsoft products',
        cutoffOrExpectation: 'Demonstrates Satya Nadella\'s "Learn-it-all" over "Know-it-all" philosophy',
        keyTopics: ['Growth Mindset in Action', 'Adapting to Sudden Tech Shifts', 'Customer Empathy'],
        tips: 'Emphasize instances where you adopted new technologies or pivoted after feedback.'
      }
    ],
    topSkills: [
      { name: 'Trees, Linked Lists & Heaps', percentage: 35 },
      { name: 'Operating Systems & Concurrency', percentage: 25 },
      { name: 'Low & High Level System Design', percentage: 25 },
      { name: 'Growth Mindset & Culture', percentage: 15 }
    ],
    frequentQuestions: [
      'Serialize and Deserialize a Binary Tree',
      'Merge K Sorted Lists using Min-Heap',
      'Find Median from Data Stream (Two Heaps)',
      'Design TinyURL / URL Shortener (System Design)',
      'Count set bits in integer using Brian Kernighan algorithm'
    ],
    curatedKeywords: ['Codility', 'Growth Mindset', 'Multithreading', 'Min-Heap', 'Satya Nadella']
  },
  {
    id: 'accenture',
    name: 'Accenture',
    logo: '🅰️',
    tier: 'Mass Recruiters / IT Services',
    tierBadgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    roleTitles: ['Advanced Associate Software Engineer (6.5 LPA)', 'Associate Software Engineer (4.5 LPA)'],
    packageLPA: '₹4.5 - ₹6.5 LPA',
    overview: 'Accenture evaluates Cognitive Assessment, Technical Assessment, Coding, and an automated AI-proctored Communication Assessment.',
    
    previousProcess: {
      year: '2021 - 2023 Process',
      summary: 'Elimination-based Cognitive test, basic pseudocode, and single coding question.',
      characteristics: [
        'Strict elimination after Round 1 cognitive test',
        'Basic string manipulation coding questions',
        'Brief telephonic or video interview'
      ]
    },
    currentProcess: {
      year: '2025 - 2027 Current Process',
      summary: 'Four progressive evaluation stages: Cognitive & Technical (90 min) -> Coding Round (45 min) -> AI Communication Test (Speaking/Listening) -> Final Interview.',
      keyChanges: [
        'Stage 1: Cognitive Assessment (50Q: English, Critical Thinking, Abstract Reasoning) + Technical Assessment (40Q: Common Application & MS Office, Pseudocode, Cloud & Security)',
        'Stage 2: Coding Assessment (2 questions: Arrays & Strings in 45 min) — Unlocks AASE 6.5 LPA role',
        'Stage 3: AI Communication Assessment (Automated evaluation of pronunciation, fluency, grammar, and listening comprehension)',
        'Stage 4: Combined Tech + HR Interview'
      ]
    },
    rounds: [
      {
        roundNumber: 1,
        name: 'Cognitive & Technical Assessment',
        type: 'Online Assessment',
        duration: '90 Minutes',
        format: '90 Multiple Choice Questions (English, Critical Thinking, Pseudocode, Networking, Cloud fundamentals)',
        cutoffOrExpectation: 'Cutoff ~65-70%. Instant elimination if Stage 1 is not cleared.',
        keyTopics: ['Critical Reasoning', 'Pseudocode Debugging', 'MS Office & Cloud Security Basics', 'Abstract Reasoning'],
        tips: 'Work quickly — you have exactly 1 minute per question on average.'
      },
      {
        roundNumber: 2,
        name: 'Coding Assessment',
        type: 'Technical Round 1',
        duration: '45 Minutes',
        format: '2 Coding problems in C, C++, Java, or Python',
        cutoffOrExpectation: 'Solve at least 1 fully and 1 partially for ASE; 2 fully for Advanced ASE',
        keyTopics: ['Array Differences & Divisibility', 'String Vowels & Frequency', 'Binary Numbers'],
        tips: 'Test cases frequently test negative numbers and 0 values.'
      },
      {
        roundNumber: 3,
        name: 'AI Communication Assessment',
        type: 'HR & Cultural',
        duration: '20 Minutes',
        format: 'Automated test via Pearson/Versant: Reading sentences aloud, repeating sentences, retelling stories, answering short questions',
        cutoffOrExpectation: 'Requires clear microphone, neutral accent, fluent pacing with no long pauses',
        keyTopics: ['Pronunciation', 'Fluency', 'Listening Comprehension', 'Sentence Mastery'],
        tips: 'Speak in a quiet room with headphones. Do not rush or shout; maintain steady conversational speed.'
      },
      {
        roundNumber: 4,
        name: 'Final Technical & HR Interview',
        type: 'Techno-Managerial',
        duration: '25 - 30 Minutes',
        format: 'Panel interview verifying project contributions and situational adaptability',
        cutoffOrExpectation: 'Confidence, communication clarity, and understanding of college project',
        keyTopics: ['Final Year Project Demo', 'Agile Methodologies', 'Cloud Basics', 'Willingness to Relocate'],
        tips: 'Highlight any hands-on team projects or hackathon experiences.'
      }
    ],
    topSkills: [
      { name: 'Cognitive & Critical Reasoning', percentage: 30 },
      { name: 'AI English & Communication Fluency', percentage: 25 },
      { name: 'Coding (Arrays & Strings)', percentage: 25 },
      { name: 'Cloud & Network Fundamentals', percentage: 20 }
    ],
    frequentQuestions: [
      'Find the count of elements greater than prior elements in an array',
      'Password Checker: Verify string has at least 4 characters, 1 digit, 1 capital letter',
      'Difference of sum of numbers divisible by N vs numbers not divisible by N in range 1 to M',
      'Explain Cloud Deployment Models: Public, Private, Hybrid',
      'What is polymorphism? Differentiate method overloading vs overriding'
    ],
    curatedKeywords: ['AASE', 'Versant Test', 'Pseudocode', 'Cognitive Assessment', 'Accenture']
  }
];
