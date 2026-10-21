import { 
  UserProfile, 
  AreaScore, 
  PlacementArea, 
  DailyTask, 
  Attempt, 
  StreakData, 
  SpacedRevisionItem, 
  AchievementBadge 
} from '../types';
import { PLACEMENT_AREAS, INITIAL_QUESTION_BANK } from '../data/questionBank';
import { generateTopThreeTasks, ROLE_WEIGHTS } from './priorityEngine';

const STORAGE_KEY_PREFIX = 'prepilot_';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialAreaScores(targetRole: string = 'Software Development Engineer (SDE)'): Record<PlacementArea, AreaScore> {
  const roleWeights = ROLE_WEIGHTS[targetRole] || ROLE_WEIGHTS['Software Development Engineer (SDE)'];
  
  const scores: Record<PlacementArea, AreaScore> = {
    aptitude: {
      area: 'aptitude',
      name: PLACEMENT_AREAS.aptitude.name,
      score: 0,
      targetScore: 80,
      weight: roleWeights.aptitude,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
    dsa: {
      area: 'dsa',
      name: PLACEMENT_AREAS.dsa.name,
      score: 0,
      targetScore: 85,
      weight: roleWeights.dsa,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
    core_cs: {
      area: 'core_cs',
      name: PLACEMENT_AREAS.core_cs.name,
      score: 0,
      targetScore: 80,
      weight: roleWeights.core_cs,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
    tech_interview: {
      area: 'tech_interview',
      name: PLACEMENT_AREAS.tech_interview.name,
      score: 0,
      targetScore: 75,
      weight: roleWeights.tech_interview,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
    hr_interview: {
      area: 'hr_interview',
      name: PLACEMENT_AREAS.hr_interview.name,
      score: 0,
      targetScore: 80,
      weight: roleWeights.hr_interview,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
    resume: {
      area: 'resume',
      name: PLACEMENT_AREAS.resume.name,
      score: 0,
      targetScore: 85,
      weight: roleWeights.resume,
      assessed: false,
      attemptCount: 0,
      topics: {},
    },
  };

  return scores;
}

// Preset persona 1: Arjun (SDE Aspirant with strong Aptitude but weak DSA)
const ARJUN_PROFILE: UserProfile = {
  id: 'usr-arjun-01',
  fullName: 'Arjun Sharma',
  email: 'arjun.sharma@campus.edu',
  phone: '9876543210',
  targetRole: 'Software Development Engineer (SDE)',
  college: 'National Institute of Technology',
  graduationYear: 2027,
  driveDate: new Date(Date.now() + 38 * 86400000).toISOString().split('T')[0], // 38 days from today
  dailyHours: 3,
  createdAt: '2026-09-01T08:00:00.000Z',
  isEarlyBird: true,
  earlyBirdRank: 1,
};

const ARJUN_SCORES: Record<PlacementArea, AreaScore> = {
  aptitude: {
    area: 'aptitude',
    name: 'Quantitative & Logical Aptitude',
    score: 85,
    targetScore: 80,
    weight: 1.0,
    assessed: true,
    attemptCount: 6,
    lastAssessedDate: '2026-10-12',
    topics: {
      'Time and Work': { topic: 'Time and Work', score: 90, attemptCount: 3 },
      'Profit and Loss': { topic: 'Profit and Loss', score: 85, attemptCount: 2 },
      'Syllogisms & Logic': { topic: 'Syllogisms & Logic', score: 80, attemptCount: 1 },
    },
  },
  dsa: {
    area: 'dsa',
    name: 'Programming & Data Structures',
    score: 35, // Significantly weak!
    targetScore: 85,
    weight: 1.5,
    assessed: true,
    attemptCount: 4,
    lastAssessedDate: '2026-10-14',
    topics: {
      'Dynamic Programming': { topic: 'Dynamic Programming', score: 20, attemptCount: 2 },
      'Trees & BST': { topic: 'Trees & BST', score: 40, attemptCount: 1 },
      'Arrays & Two Pointers': { topic: 'Arrays & Two Pointers', score: 50, attemptCount: 1 },
    },
  },
  core_cs: {
    area: 'core_cs',
    name: 'Core Computer Science',
    score: 60,
    targetScore: 80,
    weight: 1.3,
    assessed: true,
    attemptCount: 3,
    lastAssessedDate: '2026-10-10',
    topics: {
      'Operating Systems - Deadlocks': { topic: 'Operating Systems - Deadlocks', score: 50, attemptCount: 1 },
      'DBMS - Normalization': { topic: 'DBMS - Normalization', score: 65, attemptCount: 1 },
      'Computer Networks - TCP/IP': { topic: 'Computer Networks - TCP/IP', score: 65, attemptCount: 1 },
    },
  },
  tech_interview: {
    area: 'tech_interview',
    name: 'Technical Interview Prep',
    score: 55,
    targetScore: 75,
    weight: 1.2,
    assessed: true,
    attemptCount: 2,
    lastAssessedDate: '2026-10-08',
    topics: {
      'System Design Fundamentals': { topic: 'System Design Fundamentals', score: 50, attemptCount: 1 },
      'Language Internals': { topic: 'Language Internals', score: 60, attemptCount: 1 },
    },
  },
  hr_interview: {
    area: 'hr_interview',
    name: 'HR & Behavioral Interview',
    score: 75,
    targetScore: 80,
    weight: 0.8,
    assessed: true,
    attemptCount: 2,
    lastAssessedDate: '2026-10-05',
    topics: {
      'Behavioral Frameworks': { topic: 'Behavioral Frameworks', score: 75, attemptCount: 2 },
    },
  },
  resume: {
    area: 'resume',
    name: 'Resume & Portfolio Review',
    score: 70,
    targetScore: 85,
    weight: 0.9,
    assessed: true,
    attemptCount: 1,
    lastAssessedDate: '2026-10-03',
    topics: {
      'ATS & Screening': { topic: 'ATS & Screening', score: 70, attemptCount: 1 },
    },
  },
};

// Preset persona 2: Priya (Data Analyst Aspirant with high DSA/Math but low Aptitude & Resume)
const PRIYA_PROFILE: UserProfile = {
  id: 'usr-priya-02',
  fullName: 'Priya Nair',
  email: 'priya.nair@campus.edu',
  phone: '9876543211',
  targetRole: 'Data Analyst / Data Engineer',
  college: 'Vellore Institute of Technology',
  graduationYear: 2027,
  driveDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0], // 21 days left
  dailyHours: 2,
  createdAt: '2026-09-10T10:00:00.000Z',
  isEarlyBird: true,
  earlyBirdRank: 2,
};

const PRIYA_SCORES: Record<PlacementArea, AreaScore> = {
  aptitude: {
    area: 'aptitude',
    name: 'Quantitative & Logical Aptitude',
    score: 40, // Weak in Aptitude!
    targetScore: 85,
    weight: 1.4, // High weight for Data Analyst
    assessed: true,
    attemptCount: 3,
    lastAssessedDate: '2026-10-11',
    topics: {
      'Speed, Time and Distance': { topic: 'Speed, Time and Distance', score: 35, attemptCount: 1 },
      'Data Sufficiency': { topic: 'Data Sufficiency', score: 45, attemptCount: 2 },
    },
  },
  dsa: {
    area: 'dsa',
    name: 'Programming & Data Structures',
    score: 80, // Strong in coding
    targetScore: 80,
    weight: 1.1,
    assessed: true,
    attemptCount: 5,
    lastAssessedDate: '2026-10-14',
    topics: {
      'Arrays & Two Pointers': { topic: 'Arrays & Two Pointers', score: 85, attemptCount: 2 },
      'Stacks & Queues': { topic: 'Stacks & Queues', score: 80, attemptCount: 2 },
      'Trees & BST': { topic: 'Trees & BST', score: 75, attemptCount: 1 },
    },
  },
  core_cs: {
    area: 'core_cs',
    name: 'Core Computer Science',
    score: 75,
    targetScore: 85,
    weight: 1.3,
    assessed: true,
    attemptCount: 4,
    lastAssessedDate: '2026-10-13',
    topics: {
      'DBMS - Normalization': { topic: 'DBMS - Normalization', score: 85, attemptCount: 2 },
      'Operating Systems': { topic: 'Operating Systems', score: 65, attemptCount: 2 },
    },
  },
  tech_interview: {
    area: 'tech_interview',
    name: 'Technical Interview Prep',
    score: 65,
    targetScore: 75,
    weight: 1.1,
    assessed: true,
    attemptCount: 2,
    lastAssessedDate: '2026-10-09',
    topics: {
      'Databases & Indexing': { topic: 'Databases & Indexing', score: 70, attemptCount: 1 },
    },
  },
  hr_interview: {
    area: 'hr_interview',
    name: 'HR & Behavioral Interview',
    score: 70,
    targetScore: 80,
    weight: 0.9,
    assessed: true,
    attemptCount: 1,
    lastAssessedDate: '2026-10-06',
    topics: {
      'Career Motivation': { topic: 'Career Motivation', score: 70, attemptCount: 1 },
    },
  },
  resume: {
    area: 'resume',
    name: 'Resume & Portfolio Review',
    score: 35, // Very weak resume!
    targetScore: 85,
    weight: 0.9,
    assessed: true,
    attemptCount: 1,
    lastAssessedDate: '2026-10-04',
    topics: {
      'ATS & Screening': { topic: 'ATS & Screening', score: 35, attemptCount: 1 },
    },
  },
};

const USERS_DB_KEY = `${STORAGE_KEY_PREFIX}users_db`;

export class StorageService {
  private static getUserKey(uid: string, key: string): string {
    return `${STORAGE_KEY_PREFIX}${uid}_${key}`;
  }

  // Retrieve user accounts registry from storage
  static getUsersDb(): Record<string, { profile: UserProfile; passwordHash: string }> {
    try {
      const data = localStorage.getItem(USERS_DB_KEY);
      if (data) return JSON.parse(data);
    } catch {}

    // Initialize with standard demo accounts
    const initialDb: Record<string, { profile: UserProfile; passwordHash: string }> = {
      [ARJUN_PROFILE.email.toLowerCase()]: {
        profile: ARJUN_PROFILE,
        passwordHash: 'arjun123',
      },
      [PRIYA_PROFILE.email.toLowerCase()]: {
        profile: PRIYA_PROFILE,
        passwordHash: 'priya123',
      },
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialDb));
    return initialDb;
  }

  static saveUsersDb(db: Record<string, { profile: UserProfile; passwordHash: string }>): void {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  }

  // Active User session (returns null when not authenticated)
  static getActiveUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user`);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  }

  static setActiveUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user`, JSON.stringify(user));
      this.saveUserProfile(user);
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);
    }
  }

  // Real Registration
  static registerUser(
    fullName: string,
    email: string,
    password: string,
    targetRole: string = 'Software Development Engineer (SDE)',
    college: string = 'Engineering College',
    driveDate?: string,
    dailyHours: number = 2,
    phone?: string
  ): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!fullName.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const db = this.getUsersDb();
    if (db[cleanEmail]) {
      return { success: false, error: 'An account with this email already exists. Please log in instead.' };
    }

    // First 100 early bird batch calculation
    const currentRegisteredCount = Object.keys(db).length;
    const earlyBirdRank = Math.min(100, 78 + currentRegisteredCount + 1);
    const isEarlyBird = earlyBirdRank <= 100;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim().replace(/\s+/g, '') : undefined,
      targetRole,
      college: college.trim() || 'College of Engineering',
      graduationYear: 2027,
      driveDate: driveDate || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      dailyHours: Number(dailyHours) || 2,
      createdAt: new Date().toISOString(),
      isEarlyBird,
      earlyBirdRank,
    };

    // Store in users registry
    db[cleanEmail] = {
      profile: newUser,
      passwordHash: password,
    };
    this.saveUsersDb(db);

    // Initialize scores & tasks for new user
    const initialScores = createInitialAreaScores(targetRole);
    this.saveAreaScores(newUser.id, initialScores);
    const initialTasks = generateTopThreeTasks(initialScores, targetRole, newUser.dailyHours);
    this.saveDailyTasks(newUser.id, initialTasks);
    this.saveStreak(newUser.id, {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      activityHistory: {},
    });

    // Set active session
    this.setActiveUser(newUser);
    return { success: true, user: newUser };
  }

  // Real Login
  static loginUser(emailOrPhone: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const db = this.getUsersDb();

    // 1. Check by direct email in DB
    let record: { profile: UserProfile; passwordHash: string } | undefined = db[cleanInput];

    // 2. If not found by email, check by phone or demo accounts
    if (!record) {
      const allRecords = Object.values(db);
      record = allRecords.find(r => 
        (r.profile.phone && r.profile.phone === cleanInput) ||
        (r.profile.email.toLowerCase() === cleanInput)
      );
    }

    // 3. Fallback check for Arjun and Priya demo accounts
    if (!record) {
      if (cleanInput === ARJUN_PROFILE.email.toLowerCase() || cleanInput === ARJUN_PROFILE.phone) {
        if (password === 'prepilot123' || password === 'password123') {
          this.setActiveUser(ARJUN_PROFILE);
          return { success: true, user: ARJUN_PROFILE };
        }
        return { success: false, error: 'Invalid password for demo profile.' };
      }
      if (cleanInput === PRIYA_PROFILE.email.toLowerCase() || cleanInput === PRIYA_PROFILE.phone) {
        if (password === 'prepilot123' || password === 'password123') {
          this.setActiveUser(PRIYA_PROFILE);
          return { success: true, user: PRIYA_PROFILE };
        }
        return { success: false, error: 'Invalid password for demo profile.' };
      }

      return { 
        success: false, 
        error: `No account found for "${emailOrPhone}". Please register first or check your email/number.` 
      };
    }

    if (record.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials or reset via OTP.' };
    }

    this.setActiveUser(record.profile);
    return { success: true, user: record.profile };
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);
  }

  // Find user by either email or phone
  static findAccount(identifier: string): { profile: UserProfile; emailKey: string } | null {
    const clean = identifier.trim().toLowerCase();
    const db = this.getUsersDb();

    if (db[clean]) {
      return { profile: db[clean].profile, emailKey: clean };
    }

    for (const [emailKey, record] of Object.entries(db)) {
      if (
        record.profile.email.toLowerCase() === clean ||
        (record.profile.phone && record.profile.phone === clean)
      ) {
        return { profile: record.profile, emailKey };
      }
    }

    // Check demo accounts
    if (clean === ARJUN_PROFILE.email.toLowerCase() || clean === ARJUN_PROFILE.phone) {
      return { profile: ARJUN_PROFILE, emailKey: ARJUN_PROFILE.email };
    }
    if (clean === PRIYA_PROFILE.email.toLowerCase() || clean === PRIYA_PROFILE.phone) {
      return { profile: PRIYA_PROFILE, emailKey: PRIYA_PROFILE.email };
    }

    return null;
  }

  // Generate OTP for Password Reset
  static generateOtp(identifier: string): { success: boolean; otp?: string; destination?: string; error?: string } {
    const clean = identifier.trim();
    if (!clean) {
      return { success: false, error: 'Please enter your registered email address or phone number.' };
    }

    const account = this.findAccount(clean);
    if (!account) {
      return { 
        success: false, 
        error: `No user account found matching "${clean}". Please verify your email or mobile number.` 
      };
    }

    // Generate clean 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    const otpData = {
      otp,
      expiry,
      identifier: clean.toLowerCase(),
      emailKey: account.emailKey,
    };

    localStorage.setItem(`${STORAGE_KEY_PREFIX}active_otp`, JSON.stringify(otpData));

    const isEmail = clean.includes('@');
    const destination = isEmail 
      ? clean 
      : (clean.length === 10 ? `+91 ${clean.slice(0, 5)} ${clean.slice(5)}` : clean);

    return { 
      success: true, 
      otp, 
      destination 
    };
  }

  // Verify OTP
  static verifyOtp(enteredOtp: string): { success: boolean; emailKey?: string; error?: string } {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_otp`);
    if (!raw) {
      return { success: false, error: 'No OTP request found or it has expired. Please request a new OTP.' };
    }

    try {
      const data = JSON.parse(raw);
      if (Date.now() > data.expiry) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_otp`);
        return { success: false, error: 'This OTP has expired. Please request a new one.' };
      }

      if (data.otp !== enteredOtp.trim()) {
        return { success: false, error: 'Incorrect OTP. Please enter the 6-digit code received.' };
      }

      return { success: true, emailKey: data.emailKey };
    } catch {
      return { success: false, error: 'Failed to verify OTP. Please try again.' };
    }
  }

  // Complete Password Reset with Verified OTP
  static resetPasswordWithOtp(enteredOtp: string, newPassword: string): { success: boolean; error?: string } {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const verify = this.verifyOtp(enteredOtp);
    if (!verify.success || !verify.emailKey) {
      return { success: false, error: verify.error || 'Invalid or expired OTP.' };
    }

    const db = this.getUsersDb();
    if (db[verify.emailKey]) {
      db[verify.emailKey].passwordHash = newPassword;
      this.saveUsersDb(db);
    }

    // Clear active OTP
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_otp`);
    return { success: true };
  }

  // Reset Password (Direct fallback)
  static resetPassword(email: string, newPassword: string): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const db = this.getUsersDb();
    if (!db[cleanEmail]) {
      return { success: false, error: 'No account registered with this email address.' };
    }
    db[cleanEmail].passwordHash = newPassword;
    this.saveUsersDb(db);
    return { success: true };
  }

  // Early Bird Stats (First 100 students free)
  static getEarlyBirdStats(): { claimed: number; total: number; remaining: number } {
    const db = this.getUsersDb();
    const count = Object.keys(db).length;
    const claimed = Math.min(100, 78 + count);
    const remaining = Math.max(0, 100 - claimed);
    return { claimed, total: 100, remaining };
  }

  // Switch to preset persona for instant demo verification
  static switchToPreset(persona: 'arjun' | 'priya'): UserProfile {
    if (persona === 'arjun') {
      this.setActiveUser(ARJUN_PROFILE);
      this.saveAreaScores(ARJUN_PROFILE.id, ARJUN_SCORES);
      this.saveStreak(ARJUN_PROFILE.id, {
        currentStreak: 4,
        longestStreak: 7,
        lastActiveDate: getTodayString(),
        activityHistory: {
          [getTodayString()]: { count: 2, minutes: 45, activities: ['DSA Practice Test', 'Core CS Review'] },
        },
      });
      return ARJUN_PROFILE;
    } else {
      this.setActiveUser(PRIYA_PROFILE);
      this.saveAreaScores(PRIYA_PROFILE.id, PRIYA_SCORES);
      this.saveStreak(PRIYA_PROFILE.id, {
        currentStreak: 2,
        longestStreak: 5,
        lastActiveDate: getTodayString(),
        activityHistory: {
          [getTodayString()]: { count: 1, minutes: 30, activities: ['Aptitude Practice'] },
        },
      });
      return PRIYA_PROFILE;
    }
  }

  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.getUserKey(profile.id, 'profile'), JSON.stringify(profile));
  }

  static getUserProfile(uid: string): UserProfile | null {
    const data = localStorage.getItem(this.getUserKey(uid, 'profile'));
    return data ? JSON.parse(data) : null;
  }

  // Area Scores
  static getAreaScores(uid: string, targetRole: string): Record<PlacementArea, AreaScore> {
    const key = this.getUserKey(uid, 'area_scores');
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }

    if (uid === ARJUN_PROFILE.id) {
      this.saveAreaScores(uid, ARJUN_SCORES);
      return ARJUN_SCORES;
    }
    if (uid === PRIYA_PROFILE.id) {
      this.saveAreaScores(uid, PRIYA_SCORES);
      return PRIYA_SCORES;
    }

    const initial = createInitialAreaScores(targetRole);
    this.saveAreaScores(uid, initial);
    return initial;
  }

  static saveAreaScores(uid: string, scores: Record<PlacementArea, AreaScore>): void {
    localStorage.setItem(this.getUserKey(uid, 'area_scores'), JSON.stringify(scores));
  }

  // Attempts
  static getAttempts(uid: string): Attempt[] {
    const key = this.getUserKey(uid, 'attempts');
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Record an attempt and recalculate scores + streaks + recommendations!
  static recordAttempt(uid: string, attempt: Attempt, targetRole: string): {
    updatedScores: Record<PlacementArea, AreaScore>;
    updatedTasks: DailyTask[];
    updatedStreak: StreakData;
  } {
    // 1. Save attempt in history
    const attempts = this.getAttempts(uid);
    attempts.unshift(attempt);
    localStorage.setItem(this.getUserKey(uid, 'attempts'), JSON.stringify(attempts));

    // 2. Recalculate area score
    const scores = this.getAreaScores(uid, targetRole);
    const areaData = scores[attempt.area];

    // Rolling weighted score update:
    // If first attempt, score = attempt.score
    // Otherwise rolling 65% previous + 35% recent attempt
    if (!areaData.assessed || areaData.attemptCount === 0) {
      areaData.score = Math.round(attempt.score);
      areaData.assessed = true;
      areaData.attemptCount = 1;
    } else {
      areaData.score = Math.round(areaData.score * 0.65 + attempt.score * 0.35);
      areaData.attemptCount += 1;
    }
    areaData.lastAssessedDate = getTodayString();

    // Update topic score if topic exists
    if (attempt.topic) {
      const currentTopic = areaData.topics[attempt.topic] || {
        topic: attempt.topic,
        score: attempt.score,
        attemptCount: 0,
      };
      currentTopic.attemptCount += 1;
      currentTopic.score = Math.round(
        currentTopic.attemptCount === 1 ? attempt.score : (currentTopic.score * 0.6 + attempt.score * 0.4)
      );
      currentTopic.lastAttemptDate = getTodayString();
      areaData.topics[attempt.topic] = currentTopic;
    }

    this.saveAreaScores(uid, scores);

    // 3. Update qualifying streak
    const streak = this.recordQualifyingActivity(
      uid, 
      `${attempt.area.toUpperCase()} ${attempt.testType} (${attempt.correctCount}/${attempt.totalQuestions})`,
      Math.round(attempt.timeSpentSeconds / 60)
    );

    // 4. Update Spaced Revision item
    this.updateSpacedRevision(uid, attempt.area, attempt.topic || 'General Practice', attempt.score >= 70);

    // 5. Generate fresh top three tasks
    const tasks = generateTopThreeTasks(scores, targetRole);
    this.saveDailyTasks(uid, tasks);

    return {
      updatedScores: scores,
      updatedTasks: tasks,
      updatedStreak: streak,
    };
  }

  // Daily Tasks
  static getDailyTasks(uid: string, targetRole: string, dailyHours: number = 2): DailyTask[] {
    const key = this.getUserKey(uid, `daily_tasks_${getTodayString()}`);
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }

    const scores = this.getAreaScores(uid, targetRole);
    const newTasks = generateTopThreeTasks(scores, targetRole, dailyHours);
    this.saveDailyTasks(uid, newTasks);
    return newTasks;
  }

  static saveDailyTasks(uid: string, tasks: DailyTask[]): void {
    localStorage.setItem(this.getUserKey(uid, `daily_tasks_${getTodayString()}`), JSON.stringify(tasks));
  }

  static toggleTaskCompletion(uid: string, taskId: string, targetRole: string): DailyTask[] {
    const tasks = this.getDailyTasks(uid, targetRole);
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      target.completed = !target.completed;
      if (target.completed) {
        this.recordQualifyingActivity(uid, `Completed Task: ${target.title}`, target.durationMinutes);
      }
      this.saveDailyTasks(uid, tasks);
    }
    return tasks;
  }

  // Streak Management
  static getStreak(uid: string): StreakData {
    const key = this.getUserKey(uid, 'streak');
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      activityHistory: {},
    };
  }

  static saveStreak(uid: string, streak: StreakData): void {
    localStorage.setItem(this.getUserKey(uid, 'streak'), JSON.stringify(streak));
  }

  static recordQualifyingActivity(uid: string, activityName: string, durationMinutes: number = 15): StreakData {
    const streak = this.getStreak(uid);
    const today = getTodayString();
    
    // Check if already active today
    if (!streak.activityHistory[today]) {
      streak.activityHistory[today] = {
        count: 1,
        minutes: durationMinutes,
        activities: [activityName],
      };

      // Check if lastActiveDate was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (streak.lastActiveDate === yesterdayString) {
        streak.currentStreak += 1;
      } else if (streak.lastActiveDate === today) {
        // Same day, streak doesn't change
      } else {
        // Missed one or more days
        streak.currentStreak = 1;
      }

      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      streak.lastActiveDate = today;
    } else {
      // Already counted day for streak, just append activity record
      streak.activityHistory[today].count += 1;
      streak.activityHistory[today].minutes += durationMinutes;
      streak.activityHistory[today].activities.push(activityName);
    }

    this.saveStreak(uid, streak);
    return streak;
  }

  // Spaced Revision
  static getSpacedRevisionItems(uid: string): SpacedRevisionItem[] {
    const key = this.getUserKey(uid, 'revision_items');
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }
    // Default initial spaced revision items
    const initial: SpacedRevisionItem[] = [
      {
        id: 'rev-01',
        topic: 'Operating Systems - Deadlocks',
        area: 'core_cs',
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedDate: '2026-10-14',
        nextDueDate: getTodayString(),
        status: 'due',
      },
      {
        id: 'rev-02',
        topic: 'Dynamic Programming',
        area: 'dsa',
        intervalDays: 2,
        easeFactor: 2.2,
        lastReviewedDate: '2026-10-13',
        nextDueDate: getTodayString(),
        status: 'due',
      },
      {
        id: 'rev-03',
        topic: 'Time and Work',
        area: 'aptitude',
        intervalDays: 4,
        easeFactor: 2.7,
        lastReviewedDate: '2026-10-12',
        nextDueDate: '2026-10-16',
        status: 'upcoming',
      },
    ];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  static updateSpacedRevision(uid: string, area: PlacementArea, topic: string, succeeded: boolean): void {
    const items = this.getSpacedRevisionItems(uid);
    const existing = items.find(i => i.topic.toLowerCase() === topic.toLowerCase());
    const today = getTodayString();

    if (existing) {
      existing.lastReviewedDate = today;
      if (succeeded) {
        existing.intervalDays = Math.round(existing.intervalDays * existing.easeFactor);
        existing.easeFactor = Math.min(3.0, existing.easeFactor + 0.1);
        existing.status = existing.intervalDays >= 7 ? 'mastered' : 'upcoming';
      } else {
        existing.intervalDays = 1; // reset to 1 day for repeated struggle
        existing.easeFactor = Math.max(1.3, existing.easeFactor - 0.2);
        existing.status = 'due';
      }
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + existing.intervalDays);
      existing.nextDueDate = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    } else {
      const interval = succeeded ? 2 : 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + interval);
      items.push({
        id: `rev-${Date.now()}`,
        topic,
        area,
        intervalDays: interval,
        easeFactor: 2.5,
        lastReviewedDate: today,
        nextDueDate: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
        status: succeeded ? 'upcoming' : 'due',
      });
    }

    localStorage.setItem(this.getUserKey(uid, 'revision_items'), JSON.stringify(items));
  }

  // Badges
  static getBadges(uid: string): AchievementBadge[] {
    const key = this.getUserKey(uid, 'badges');
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {}
    }
    const initial: AchievementBadge[] = [
      {
        id: 'b-first-step',
        title: 'Diagnostic Pioneer',
        description: 'Completed your first 6-area placement diagnostic assessment.',
        icon: 'Compass',
        unlocked: true,
        unlockedAt: '2026-10-10',
        category: 'diagnostic',
      },
      {
        id: 'b-streak-3',
        title: 'Consistency Spark',
        description: 'Maintained a 3-day active placement study streak.',
        icon: 'Flame',
        unlocked: true,
        unlockedAt: '2026-10-13',
        category: 'streak',
      },
      {
        id: 'b-readiness-75',
        title: 'Placement Ready (75+)',
        description: 'Achieved a Placement Readiness Score of 75 or higher.',
        icon: 'Trophy',
        unlocked: false,
        category: 'readiness',
      },
      {
        id: 'b-dsa-warrior',
        title: 'DSA Challenger',
        description: 'Solved at least 10 Data Structures & Algorithm practice questions.',
        icon: 'Code',
        unlocked: false,
        category: 'practice',
      },
    ];
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
}
