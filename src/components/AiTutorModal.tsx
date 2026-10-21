import React, { useState } from 'react';
import { AreaScore, PlacementArea, UserProfile } from '../types';
import { PLACEMENT_AREAS } from '../data/questionBank';
import { 
  Sparkles, 
  Bot, 
  FileText, 
  Users, 
  Terminal, 
  Calendar, 
  Send, 
  Loader2, 
  CheckCircle, 
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

interface AiTutorModalProps {
  user: UserProfile;
  areaScores: Record<PlacementArea, AreaScore>;
  onClose: () => void;
  onQuestionGenerated?: (q: any) => void;
  initialTab?: 'weak_question' | 'interview_eval' | 'resume_bullet' | 'drive_plan';
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  user,
  areaScores,
  onClose,
  initialTab = 'weak_question',
}) => {
  const [activeTab, setActiveTab] = useState<'weak_question' | 'interview_eval' | 'resume_bullet' | 'drive_plan'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tab 1: Weak Topic Question Generator state
  const [selectedArea, setSelectedArea] = useState<PlacementArea>('dsa');
  const [customTopic, setCustomTopic] = useState('Dynamic Programming');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [generatedQuestion, setGeneratedQuestion] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);

  // Tab 2: Interview Mock Evaluator state
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR'>('HR');
  const [interviewQuestion, setInterviewQuestion] = useState(
    'Tell me about a time you encountered a serious roadblock in a technical team project. How did you resolve it?'
  );
  const [candidateResponse, setCandidateResponse] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<string | null>(null);

  // Tab 3: Resume Bullet Enhancer state
  const [projectTitle, setProjectTitle] = useState('Campus Placement Portal');
  const [rawBullet, setRawBullet] = useState('Built a web application for student placement registration using React and Node JS.');
  const [enhancedBulletResult, setEnhancedBulletResult] = useState<string | null>(null);

  // Tab 4: Day-wise Drive Planner state
  const [drivePlanResult, setDrivePlanResult] = useState<string | null>(null);

  // Calculate days left to drive
  const calculateDaysLeft = () => {
    if (!user.driveDate) return 30;
    const diff = new Date(user.driveDate).getTime() - new Date().getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // 1. Generate Weak Topic Question
  const handleGenerateQuestion = async () => {
    setLoading(true);
    setError(null);
    setGeneratedQuestion(null);
    setSelectedOption(null);
    setRevealAnswer(false);

    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: PLACEMENT_AREAS[selectedArea].name,
          topic: customTopic,
          difficulty,
          targetRole: user.targetRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.question) {
        setGeneratedQuestion(data.question);
      } else {
        throw new Error(data.error || 'Failed to generate question');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not connect to Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Evaluate Mock Interview Response
  const handleEvaluateInterview = async () => {
    if (!candidateResponse.trim()) return;
    setLoading(true);
    setError(null);
    setInterviewFeedback(null);

    try {
      const res = await fetch('/api/ai/interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionType: interviewType,
          question: interviewQuestion,
          studentAnswer: candidateResponse,
          targetRole: user.targetRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        setInterviewFeedback(data.feedback);
      } else {
        throw new Error(data.error || 'Evaluation failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to get interview feedback.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Enhance Resume Bullet Point
  const handleEnhanceResume = async () => {
    if (!rawBullet.trim()) return;
    setLoading(true);
    setError(null);
    setEnhancedBulletResult(null);

    try {
      const res = await fetch('/api/ai/resume-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawBullet,
          projectTitle,
          role: user.targetRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setEnhancedBulletResult(data.suggestions);
      } else {
        throw new Error(data.error || 'Enhancement failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to enhance resume bullet.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Generate Placement Drive Plan
  const handleGenerateDrivePlan = async () => {
    setLoading(true);
    setError(null);
    setDrivePlanResult(null);

    const simpleScores = Object.fromEntries(
      Object.entries(areaScores).map(([k, v]) => [k, v.score])
    );

    try {
      const res = await fetch('/api/ai/drive-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysLeft: calculateDaysLeft(),
          dailyHours: user.dailyHours,
          targetRole: user.targetRole,
          readinessScore: Math.round(Object.values(areaScores).reduce((acc, a) => acc + a.score, 0) / 6),
          skillScores: simpleScores,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setDrivePlanResult(data.plan);
      } else {
        throw new Error(data.error || 'Failed to generate plan');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate sprint plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 md:p-7 shadow-2xl relative my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-500 text-white rounded-xl shadow-lg shadow-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">PrePilot AI Placement Suite</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">Personalized placement coaching & diagnostic generation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-b border-slate-800 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('weak_question')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'weak_question'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weak-Topic Practice</span>
          </button>

          <button
            onClick={() => setActiveTab('interview_eval')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'interview_eval'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Mock Interview Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('resume_bullet')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'resume_bullet'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume Enhancer</span>
          </button>

          <button
            onClick={() => setActiveTab('drive_plan')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'drive_plan'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Drive Countdown Plan</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto flex-1 py-4 pr-1 text-xs">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300">
              {error}
            </div>
          )}

          {/* TAB 1: WEAK-TOPIC QUESTION GENERATOR */}
          {activeTab === 'weak_question' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Placement Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => {
                        const val = e.target.value as PlacementArea;
                        setSelectedArea(val);
                        if (val === 'dsa') setCustomTopic('Dynamic Programming');
                        else if (val === 'aptitude') setCustomTopic('Time and Work');
                        else if (val === 'core_cs') setCustomTopic('OS Deadlocks & Scheduling');
                        else if (val === 'tech_interview') setCustomTopic('System Design Caching');
                        else if (val === 'hr_interview') setCustomTopic('STAR Behavioral Scenarios');
                        else setCustomTopic('ATS Action Verbs');
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                    >
                      {(Object.keys(PLACEMENT_AREAS) as PlacementArea[]).map(a => (
                        <option key={a} value={a}>{PLACEMENT_AREAS[a].name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Weak Topic / Sub-skill</label>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                      placeholder="e.g. Dynamic Programming, Normalization..."
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium (Standard Campus Level)</option>
                      <option value="Hard">Hard (Product Company Tier)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleGenerateQuestion}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating tailored placement question...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Weak-Topic Question</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Display Generated Question */}
              {generatedQuestion && (
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-sky-500/30 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {generatedQuestion.difficulty} • {generatedQuestion.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">Targeting: {user.targetRole}</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed whitespace-pre-line">
                    {generatedQuestion.question}
                  </p>

                  <div className="space-y-2">
                    {generatedQuestion.options?.map((opt: string, idx: number) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === generatedQuestion.correctIndex;
                      let btnStyle = 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800';

                      if (revealAnswer) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-sky-500/20 border-sky-400 text-sky-100 ring-1 ring-sky-400';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!revealAnswer) setSelectedOption(idx);
                          }}
                          className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedOption !== null && !revealAnswer && (
                    <button
                      onClick={() => setRevealAnswer(true)}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                    >
                      Check Answer & Explanation
                    </button>
                  )}

                  {revealAnswer && (
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700 text-slate-300 space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 text-sky-300 font-bold">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Explanation & Solution</span>
                      </div>
                      <p className="leading-relaxed">{generatedQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERVIEW EVALUATOR */}
          {activeTab === 'interview_eval' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setInterviewType('HR');
                      setInterviewQuestion('Tell me about a time you had a major disagreement with a team member. How did you handle it?');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold ${
                      interviewType === 'HR' ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    HR / Behavioral Mock
                  </button>
                  <button
                    onClick={() => {
                      setInterviewType('Technical');
                      setInterviewQuestion('Explain how Redis caching works in a high-traffic microservices architecture, and when cache invalidation can cause a stampede.');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold ${
                      interviewType === 'Technical' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Technical Interview Mock
                  </button>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Interview Question:</label>
                  <input
                    type="text"
                    value={interviewQuestion}
                    onChange={(e) => setInterviewQuestion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-medium">Your Practice Response:</label>
                    <span className="text-[11px] text-slate-500">
                      {interviewType === 'HR' ? 'Tip: Use STAR (Situation, Task, Action, Result)' : 'Tip: Mention trade-offs & scale'}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={candidateResponse}
                    onChange={(e) => setCandidateResponse(e.target.value)}
                    placeholder="Type your spoken interview response here as you would articulate it to a recruiter..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluateInterview}
                    disabled={loading || !candidateResponse.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Get AI Recruiter Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {interviewFeedback && (
                <div className="p-5 bg-slate-800/90 rounded-2xl border border-emerald-500/30 text-slate-200 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>AI Interview Assessment & STAR Feedback</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {interviewFeedback}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESUME BULLET ENHANCER */}
          {activeTab === 'resume_bullet' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Project / Experience Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Target Placement Role</label>
                    <input
                      type="text"
                      disabled
                      value={user.targetRole}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">
                    Draft Resume Bullet Point (What you currently have):
                  </label>
                  <textarea
                    rows={3}
                    value={rawBullet}
                    onChange={(e) => setRawBullet(e.target.value)}
                    placeholder="e.g. Created a full stack application for our college club with React and Firebase."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    PrePilot uses Google's formula: "Accomplished [X] as measured by [Y], by doing [Z]"
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleEnhanceResume}
                    disabled={loading || !rawBullet.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-purple-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Optimizing for ATS & Impact...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>Enhance Bullet Point</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {enhancedBulletResult && (
                <div className="p-5 bg-slate-800/90 rounded-2xl border border-purple-500/30 text-slate-200 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>ATS-Optimized High-Impact Resume Variations</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {enhancedBulletResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DAY-WISE DRIVE PLANNER */}
          {activeTab === 'drive_plan' && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Days to Drive</span>
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      {calculateDaysLeft()} Days Left
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily Study Budget</span>
                    <span className="text-xl font-mono font-extrabold text-sky-400">
                      {user.dailyHours} Hours / Day
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Placement Role</span>
                    <span className="text-sm font-bold text-slate-200 block truncate">
                      {user.targetRole}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs">
                  PrePilot's placement sprint planner synthesizes your recorded 6-area skill scores, weak topic gaps, and study availability to build a phased day-by-day roadmap.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={handleGenerateDrivePlan}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing placement sprint...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Generate Day-Wise Sprint Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {drivePlanResult && (
                <div className="p-5 bg-slate-800/90 rounded-2xl border border-amber-500/30 text-slate-200 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Personalized Placement Drive Sprint Schedule</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-300 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {drivePlanResult}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
