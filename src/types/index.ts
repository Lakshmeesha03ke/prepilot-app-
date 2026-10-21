export type PlacementArea = 
  | 'aptitude' 
  | 'dsa' 
  | 'core_cs' 
  | 'tech_interview' 
  | 'hr_interview' 
  | 'resume';

export interface AreaInfo {
  id: PlacementArea;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  defaultWeight: number; // For role-based priority
  color: string;
  accentBg: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  targetRole: string;
  college?: string;
  graduationYear?: number;
  driveDate?: string; // YYYY-MM-DD
  dailyHours: number;
  createdAt: string;
  isEarlyBird?: boolean;
  earlyBirdRank?: number;
}

export interface UserAccount {
  profile: UserProfile;
  passwordHash: string;
}

export interface TopicScore {
  topic: string;
  score: number; // 0-100
  attemptCount: number;
  lastAttemptDate?: string;
}

export interface AreaScore {
  area: PlacementArea;
  name: string;
  score: number; // 0-100
  targetScore: number; // default 80-90
  weight: number; // e.g., 1.2 for DSA in SDE role
  assessed: boolean;
  attemptCount: number;
  lastAssessedDate?: string;
  topics: Record<string, TopicScore>;
}

export interface Question {
  id: string;
  area: PlacementArea;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
  timeComplexity?: string;
  hints?: string[];
}

export interface AttemptDetail {
  questionId: string;
  question: string;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  topic: string;
  area: PlacementArea;
}

export interface Attempt {
  id: string;
  userId: string;
  testType: 'diagnostic' | 'practice' | 'mock_interview' | 'ai_practice';
  area: PlacementArea;
  topic?: string;
  score: number; // 0-100%
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  timestamp: string; // ISO string
  details: AttemptDetail[];
}

export interface DailyTask {
  id: string;
  area: PlacementArea;
  topic: string;
  title: string;
  description: string;
  priorityScore: number;
  durationMinutes: number;
  taskType: 'practice' | 'revision' | 'mock' | 'resume';
  completed: boolean;
  explainReason: {
    targetScore: number;
    currentScore: number;
    weight: number;
    gap: number;
    formula: string;
    description: string;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activityHistory: Record<string, { count: number; minutes: number; activities: string[] }>;
}

export interface SpacedRevisionItem {
  id: string;
  topic: string;
  area: PlacementArea;
  intervalDays: number;
  easeFactor: number;
  lastReviewedDate: string;
  nextDueDate: string;
  status: 'due' | 'upcoming' | 'mastered';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'readiness' | 'practice' | 'diagnostic';
}
