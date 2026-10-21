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

// Role weights customization
export const ROLE_WEIGHTS: Record<string, Record<PlacementArea, number>> = {
  'Software Development Engineer (SDE)': {
    aptitude: 1.0,
    dsa: 1.5,
    core_cs: 1.3,
    tech_interview: 1.2,
    hr_interview: 0.8,
    resume: 0.9,
  },
  'Data Analyst / Data Engineer': {
    aptitude: 1.4,
    dsa: 1.1,
    core_cs: 1.3, // SQL, DBMS heavily tested
    tech_interview: 1.1,
    hr_interview: 0.9,
    resume: 0.9,
  },
  'Frontend Developer': {
    aptitude: 0.9,
    dsa: 1.2,
    core_cs: 1.0,
    tech_interview: 1.3,
    hr_interview: 0.9,
    resume: 1.0,
  },
  'Backend Engineer': {
    aptitude: 1.0,
    dsa: 1.4,
    core_cs: 1.4,
    tech_interview: 1.3,
    hr_interview: 0.8,
    resume: 0.9,
  },
  'General IT Services (TCS, Infosys, Wipro)': {
    aptitude: 1.4,
    dsa: 1.0,
    core_cs: 1.1,
    tech_interview: 1.0,
    hr_interview: 1.1,
    resume: 0.9,
  },
};

export const DEFAULT_ROLE = 'Software Development Engineer (SDE)';

// Calculate Placement Readiness Score: R = (A + C + K + T + H + V) / 6
export function calculateReadiness(areaScores: Record<PlacementArea, AreaScore>): {
  score: number;
  isProvisional: boolean;
  assessedCount: number;
  totalAreas: number;
} {
  const areas = Object.values(areaScores);
  const totalAreas = areas.length;
  const assessedAreas = areas.filter(a => a.assessed);
  const assessedCount = assessedAreas.length;

  if (assessedCount === 0) {
    return {
      score: 0,
      isProvisional: true,
      assessedCount: 0,
      totalAreas,
    };
  }

  // If some are not assessed, calculate mean of assessed and flag as provisional
  const sumAssessed = assessedAreas.reduce((acc, a) => acc + a.score, 0);
  const averageAssessed = Math.round(sumAssessed / assessedCount);
  const isProvisional = assessedCount < totalAreas;

  return {
    score: averageAssessed,
    isProvisional,
    assessedCount,
    totalAreas,
  };
}

// Explainable Priority Formula: P_i = max(0, T_i - S_i) * W_i
export function generateTopThreeTasks(
  areaScores: Record<PlacementArea, AreaScore>,
  targetRole: string,
  _dailyHours: number = 2
): DailyTask[] {
  const roleWeights = ROLE_WEIGHTS[targetRole] || ROLE_WEIGHTS[DEFAULT_ROLE];
  const priorityList: Array<{
    area: PlacementArea;
    topic: string;
    targetScore: number;
    currentScore: number;
    weight: number;
    gap: number;
    priority: number;
    description: string;
    durationMinutes: number;
    taskType: 'practice' | 'revision' | 'mock' | 'resume';
  }> = [];

  // Iterate over each area
  (Object.keys(areaScores) as PlacementArea[]).forEach((areaKey) => {
    const areaData = areaScores[areaKey];
    const weight = roleWeights[areaKey] || 1.0;
    const targetScore = areaData.targetScore || 80;
    const currentScore = areaData.assessed ? areaData.score : 20; // Unassessed given baseline gap
    const gap = Math.max(0, targetScore - currentScore);
    const priority = Math.round(gap * weight * 10) / 10;

    // Pick top weak topic or default
    const topics = Object.entries(areaData.topics);
    let selectedTopic = 'Core Foundations';
    if (topics.length > 0) {
      // Find topic with lowest score or lowest attempt
      topics.sort((a, b) => a[1].score - b[1].score);
      selectedTopic = topics[0][0];
    } else {
      // Choose representative topic from question bank
      const sampleQ = INITIAL_QUESTION_BANK.find(q => q.area === areaKey);
      selectedTopic = sampleQ ? sampleQ.topic : 'General Practice';
    }

    let taskType: 'practice' | 'revision' | 'mock' | 'resume' = 'practice';
    let duration = 25;
    let desc = `Practice 10 high-yield questions in ${selectedTopic}`;

    if (areaKey === 'dsa') {
      duration = 35;
      desc = `Solve 3 targeted algorithm problems in ${selectedTopic}`;
    } else if (areaKey === 'tech_interview' || areaKey === 'hr_interview') {
      taskType = 'mock';
      duration = 20;
      desc = `Complete AI Mock Interview scenario on ${selectedTopic}`;
    } else if (areaKey === 'resume') {
      taskType = 'resume';
      duration = 15;
      desc = `Optimize project bullet points with action verbs and metrics`;
    }

    priorityList.push({
      area: areaKey,
      topic: selectedTopic,
      targetScore,
      currentScore,
      weight,
      gap,
      priority,
      description: desc,
      durationMinutes: duration,
      taskType,
    });
  });

  // Sort descending by priority score
  priorityList.sort((a, b) => b.priority - a.priority);

  // Return top 3
  return priorityList.slice(0, 3).map((item, idx) => ({
    id: `task-${item.area}-${idx}`,
    area: item.area,
    topic: item.topic,
    title: `${PLACEMENT_AREAS[item.area].shortName}: ${item.topic}`,
    description: item.description,
    priorityScore: item.priority,
    durationMinutes: item.durationMinutes,
    taskType: item.taskType,
    completed: false,
    explainReason: {
      targetScore: item.targetScore,
      currentScore: item.currentScore,
      weight: item.weight,
      gap: item.gap,
      formula: `P = (${item.targetScore} - ${item.currentScore}) × ${item.weight} = ${item.priority}`,
      description: `Target for ${item.area.toUpperCase()} is ${item.targetScore}%, current standing is ${item.currentScore}%. With role weight ${item.weight}x, this yields a high skill gap priority of ${item.priority}.`,
    },
  }));
}
