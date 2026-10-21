import React, { useState } from 'react';
import { 
  UserProfile, 
  AreaScore, 
  PlacementArea, 
  DailyTask, 
  StreakData, 
  SpacedRevisionItem, 
  AchievementBadge 
} from '../types';
import { PLACEMENT_AREAS } from '../data/questionBank';
import { ReadinessGauge } from './ReadinessGauge';
import { RadarChart } from './RadarChart';
import { StreakHeatmap } from './StreakHeatmap';
import { ExplainPriorityModal } from './ExplainPriorityModal';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Flame, 
  Calendar, 
  ArrowRight, 
  Target, 
  BookOpen, 
  Bot, 
  FileText, 
  Users, 
  Trophy, 
  Compass, 
  TrendingUp,
  AlertCircle,
  Building2,
  Gift
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  areaScores: Record<PlacementArea, AreaScore>;
  dailyTasks: DailyTask[];
  streak: StreakData;
  revisionItems: SpacedRevisionItem[];
  badges: AchievementBadge[];
  onToggleTask: (taskId: string) => void;
  onStartAssessment: (area?: PlacementArea, topic?: string, isDiagnostic?: boolean) => void;
  onOpenAiTutor: (tab?: 'weak_question' | 'interview_eval' | 'resume_bullet' | 'drive_plan') => void;
  onOpenCompanyPrep?: () => void;
  onOpenStartupPlan?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  areaScores,
  dailyTasks,
  streak,
  revisionItems,
  badges,
  onToggleTask,
  onStartAssessment,
  onOpenAiTutor,
  onOpenCompanyPrep,
  onOpenStartupPlan,
}) => {
  const [selectedTaskToExplain, setSelectedTaskToExplain] = useState<DailyTask | null>(null);
  const [selectedAreaTab, setSelectedAreaTab] = useState<PlacementArea>('dsa');

  // Days to drive calculation
  const getDaysLeft = () => {
    if (!user.driveDate) return 30;
    const diff = new Date(user.driveDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const daysLeft = getDaysLeft();
  const dueRevisions = revisionItems.filter(r => r.status === 'due');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      
      {/* 1. Startup Early-Bird Banner with User's Exact Sentence */}
      <div 
        onClick={onOpenStartupPlan}
        className="bg-gradient-to-r from-amber-500/10 via-indigo-950/40 to-slate-900 border border-amber-500/30 p-3.5 px-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-amber-400/50 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                Startup Early-Bird Policy
              </span>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                {user.isEarlyBird !== false ? '✓ FREE LIFETIME ACCESS UNLOCKED' : 'Active Batch'}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 leading-snug font-medium">
              “Who come first 100 email they will get all resources and my preparation feature will be free. After comes will maintain fee according to what you take like mock interview, AI recommendations, etc.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform">
          <span>View Plan Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 2. Personalized Greeting & Daily Preparation Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/60 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Target: {user.targetRole}
              </span>
              <span className="text-xs text-slate-400">
                • {user.dailyHours} hrs/day goal
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">{user.fullName.split(' ')[0]}</span> 👋
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Your placement preparation engine analyzed your latest practice performance. Today's priority focuses on closing weighted skill gaps before your campus drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Company Prep Shortcut */}
            {onOpenCompanyPrep && (
              <button
                onClick={onOpenCompanyPrep}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/25"
              >
                <Building2 className="w-4 h-4" />
                <span>Company Trackers (Meta, TCS...)</span>
              </button>
            )}

            <button
              onClick={() => onStartAssessment(undefined, undefined, true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-sky-500/20"
            >
              <Compass className="w-4 h-4" />
              <span>Full Diagnostic Test</span>
            </button>
            
            <button
              onClick={() => onOpenAiTutor('weak_question')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-bold text-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>AI Placement Tools</span>
            </button>
          </div>
        </div>

        {/* Quick Drive Status Banner if drive date configured */}
        {daysLeft !== null && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                <strong>{daysLeft} Days</strong> remaining until company placement drives begin.
              </span>
            </div>
            <button
              onClick={() => onOpenAiTutor('drive_plan')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              <span>View Day-Wise Sprint Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Company-Wise Quick Selection Rail */}
      {onOpenCompanyPrep && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">Target Company Hiring Trackers</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Previous vs Current
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore round cutoffs, modern selection formats, and tailored practice for Meta, TCS, Google, Amazon, Infosys, and Accenture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['Meta (♾️)', 'TCS (💼)', 'Google (🔍)', 'Amazon (📦)', 'Infosys (🔷)'].map((c, i) => (
              <button
                key={i}
                onClick={onOpenCompanyPrep}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs whitespace-nowrap transition-colors"
              >
                {c}
              </button>
            ))}
            <button
              onClick={onOpenCompanyPrep}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span>All 6 Companies</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Readiness Gauge & 6-Area Radar Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Placement Readiness Gauge */}
        <div className="lg:col-span-7 flex flex-col">
          <ReadinessGauge 
            areaScores={areaScores} 
            onAreaClick={(area) => setSelectedAreaTab(area)} 
          />
        </div>

        {/* 6-Area Radar / Spider Chart */}
        <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Six-Area Skill Balance</h3>
              <p className="text-xs text-slate-400">Current performance vs Target benchmark</p>
            </div>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Target className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <RadarChart areaScores={areaScores} size={280} />
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-1">
            Tip: Balanced preparation prevents elimination in initial technical rounds.
          </p>
        </div>
      </div>

      {/* 3. Today's Top Three Prioritized Tasks (Explainable Priority Engine) */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-slate-700/60 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">Today's Top 3 Preparation Tasks</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Formula P = (T - S) × W
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized and recalculated after every completed assessment or practice set
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {dailyTasks.filter(t => t.completed).length} / 3 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyTasks.map((task) => {
            const areaInfo = PLACEMENT_AREAS[task.area];

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative group ${
                  task.completed
                    ? 'bg-slate-900/60 border-emerald-500/30 opacity-75'
                    : 'bg-slate-850/90 border-slate-700/80 hover:border-sky-500/50 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${areaInfo.accentBg}`}>
                      {areaInfo.shortName}
                    </span>
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <h4 className={`text-sm font-bold mt-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.durationMinutes} mins</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Explain Button */}
                    <button
                      onClick={() => setSelectedTaskToExplain(task)}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold hover:underline"
                    >
                      Why this?
                    </button>

                    {/* Launch Practice Button */}
                    <button
                      onClick={() => onStartAssessment(task.area, task.topic)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Streaks & Spaced Revision Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Streak & Activity Heatmap */}
        <div className="lg:col-span-7">
          <StreakHeatmap streak={streak} />
        </div>

        {/* Spaced Revision Reminders */}
        <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-slate-100 text-sm">Spaced Revision Schedule</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {dueRevisions.length} Due for Review
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Topics scheduled via spaced repetition intervals to prevent forgetting past material before placement day.
            </p>

            <div className="space-y-2.5">
              {revisionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{item.topic}</span>
                    <span className="text-[10px] text-slate-400">
                      {PLACEMENT_AREAS[item.area].shortName} • Interval: {item.intervalDays}d
                    </span>
                  </div>

                  <button
                    onClick={() => onStartAssessment(item.area, item.topic)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      item.status === 'due'
                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {item.status === 'due' ? 'Revise Now' : 'Review'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Algorithm: Modified Leitner Spacing</span>
            <span className="text-purple-400 font-semibold cursor-pointer hover:underline" onClick={() => onOpenAiTutor('weak_question')}>
              Generate Practice
            </span>
          </div>
        </div>
      </div>

      {/* 5. Quick AI Placement Launchers */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Specialized AI Preparation Modules</h3>
            <p className="text-xs text-slate-400">AI-assisted tutoring for critical interview phases</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Powered by Gemini
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onOpenAiTutor('weak_question')}
            className="p-3.5 bg-slate-900/70 hover:bg-slate-750 rounded-xl border border-slate-700 hover:border-sky-500/50 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-200">Weak-Topic Generator</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Infinite custom placement MCQs tailored to your lowest score</p>
          </button>

          <button
            onClick={() => onOpenAiTutor('interview_eval')}
            className="p-3.5 bg-slate-900/70 hover:bg-slate-750 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-200">HR STAR Interview</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Evaluate behavioral answers for Situation, Task, Action & Result</p>
          </button>

          <button
            onClick={() => onOpenAiTutor('interview_eval')}
            className="p-3.5 bg-slate-900/70 hover:bg-slate-750 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-200">Technical Mock</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">System design, tricky internals & engineering trade-offs feedback</p>
          </button>

          <button
            onClick={() => onOpenAiTutor('resume_bullet')}
            className="p-3.5 bg-slate-900/70 hover:bg-slate-750 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-200">ATS Resume Enhancer</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Rewrite project bullets with quantified metrics and action verbs</p>
          </button>
        </div>
      </div>

      {/* 6. Achievement Badges */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">Placement Milestones</h3>
          </div>
          <span className="text-xs text-slate-400">
            {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                b.unlocked
                  ? 'bg-slate-900/80 border-amber-500/30 text-slate-200'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-lg ${b.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-600'}`}>
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold leading-tight">{b.title}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Explaining Selected Priority Task */}
      <ExplainPriorityModal
        task={selectedTaskToExplain}
        onClose={() => setSelectedTaskToExplain(null)}
        targetRole={user.targetRole}
      />

    </div>
  );
};
