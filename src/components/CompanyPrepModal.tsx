import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  History, 
  Zap, 
  HelpCircle, 
  Code2, 
  Award, 
  TrendingUp, 
  Compass, 
  ExternalLink,
  ChevronDown,
  BrainCircuit,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { COMPANY_HIRING_DATA, CompanyHiringProfile, CompanyProcessRound } from '../data/companyHiringData';
import { UserProfile, PlacementArea } from '../types';

interface CompanyPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onStartCompanyPractice?: (companyName: string, area: PlacementArea) => void;
}

export const CompanyPrepModal: React.FC<CompanyPrepModalProps> = ({
  isOpen,
  onClose,
  user,
  onStartCompanyPractice,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('meta');
  const [activeTab, setActiveTab] = useState<'process' | 'rounds' | 'questions' | 'ai_strategy'>('process');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Product Giants' | 'Mass Recruiters'>('All');
  
  // AI Strategy states
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen) return null;

  const selectedCompany: CompanyHiringProfile = 
    COMPANY_HIRING_DATA.find(c => c.id === selectedCompanyId) || COMPANY_HIRING_DATA[0];

  const filteredCompanies = COMPANY_HIRING_DATA.filter(c => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Product Giants') return c.tier.includes('FAANG') || c.tier.includes('Product');
    if (activeFilter === 'Mass Recruiters') return c.tier.includes('Mass');
    return true;
  });

  const handleAskCompanyAi = async (promptOverride?: string) => {
    const questionToAsk = promptOverride || aiQuestion;
    if (!questionToAsk.trim()) return;

    setIsLoadingAi(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'company_strategy',
          company: selectedCompany.name,
          userRole: user.targetRole,
          area: 'technical',
          topic: selectedCompany.topSkills.map(s => s.name).join(', '),
          question: `Candidate target: ${user.targetRole} at ${selectedCompany.name}. Student question/request: ${questionToAsk}. Provide a concise, high-impact breakdown of expectations, previous vs current recruitment trends, and key tips to clear the 2026-2027 selection rounds.`,
        }),
      });

      const data = await response.json();
      if (data.explanation) {
        setAiAnalysis(data.explanation);
      } else {
        setAiAnalysis(
          `### Strategic Preparation for ${selectedCompany.name}\n\n` +
          `1. **Focus on Modern Evaluation Criteria**: ${selectedCompany.name} prioritizes clean, modular code and strict time complexity over memorized solutions.\n` +
          `2. **Critical Areas**: Emphasize ${selectedCompany.topSkills[0]?.name} and ${selectedCompany.topSkills[1]?.name}.\n` +
          `3. **Interview Pacing**: Dedicate 5 minutes to clarifying edge cases, 15 minutes to writing optimal code, and 10 minutes to dry-running with custom test cases.\n` +
          `4. **Behavioral Alignment**: Frame all project narratives using the STAR method with measurable metrics.`
        );
      }
    } catch {
      setAiAnalysis(
        `### Expert Placement Tips for ${selectedCompany.name}\n\n` +
        `• **Latest Shift**: Modern assessments heavily penalize syntax bugs and brute force solutions.\n` +
        `• **Top Priority**: Master ${selectedCompany.frequentQuestions[0]} and related concepts.\n` +
        `• **Target Metrics**: Aim for 85%+ accuracy on technical aptitude and sub-35 minute completion on DSA problems.`
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg text-white">Company-Wise Placement Tracker</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  2025 - 2027 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Comprehensive previous vs current hiring process comparison, round syllabus, and company patterns
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Quick Selector Bar */}
        <div className="border-b border-slate-800 bg-slate-950/60 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1 hidden sm:inline">Tier:</span>
            {(['All', 'Product Giants', 'Mass Recruiters'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Quick Company Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {filteredCompanies.map(c => {
              const isSelected = c.id === selectedCompany.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCompanyId(c.id);
                    setAiAnalysis(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/50'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <span>{c.logo}</span>
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Company Banner */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {selectedCompany.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-lg text-white">{selectedCompany.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${selectedCompany.tierBadgeColor}`}>
                  {selectedCompany.tier}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {selectedCompany.packageLPA}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {selectedCompany.overview}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Target Roles:</span>
                <span className="text-sky-300 font-mono">{selectedCompany.roleTitles.join(' • ')}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onStartCompanyPractice) {
                  onStartCompanyPractice(selectedCompany.name, 'dsa');
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Practice Pattern</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 pt-2 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('process')}
            className={`pb-2.5 px-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'process'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Previous vs Current Process
          </button>

          <button
            onClick={() => setActiveTab('rounds')}
            className={`pb-2.5 px-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'rounds'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Round-by-Round Breakdown ({selectedCompany.rounds.length})
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2.5 px-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'questions'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            High-Frequency Questions & Weightages
          </button>

          <button
            onClick={() => setActiveTab('ai_strategy')}
            className={`pb-2.5 px-2 font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ai_strategy'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            AI Placement Coach Strategy
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: PREVIOUS VS CURRENT PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Previous Process Card */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                      <History className="w-4 h-4" />
                      <span>Previous Process ({selectedCompany.previousProcess.year})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                      Legacy Pattern
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {selectedCompany.previousProcess.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 uppercase font-bold block">
                      Characteristics:
                    </span>
                    {selectedCompany.previousProcess.characteristics.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-rose-400 mt-0.5">•</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Process Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-950/80 border border-emerald-500/40 space-y-3 shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                      <Zap className="w-4 h-4 fill-emerald-400" />
                      <span>Current Hiring Process ({selectedCompany.currentProcess.year})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-bold animate-pulse">
                      Active Now
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {selectedCompany.currentProcess.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] text-emerald-300/80 uppercase font-bold block">
                      Key Modern Evolution & Criteria:
                    </span>
                    {selectedCompany.currentProcess.keyChanges.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Strategy Callout */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3 text-xs text-sky-200">
                <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sky-300 text-sm">Key Takeaway for {selectedCompany.name}</div>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">
                    Recruiters in 2026/2027 look for real problem formulation, clean variable naming, edge case resilience, and structured communication rather than memorized code templates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROUND-BY-ROUND BREAKDOWN */}
          {activeTab === 'rounds' && (
            <div className="space-y-3">
              {selectedCompany.rounds.map((round) => (
                <div 
                  key={round.roundNumber}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        R{round.roundNumber}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">{round.name}</h5>
                        <span className="text-[11px] text-slate-400 font-medium">{round.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" /> {round.duration}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                        Format & Structure
                      </span>
                      <p className="text-slate-300 font-medium bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                        {round.format}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-400/80 uppercase font-bold block mb-1">
                        Clearance Benchmark / Cutoff
                      </span>
                      <p className="text-emerald-300 font-medium bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                        {round.cutoffOrExpectation}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                      High-Priority Syllabus / Tested Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {round.keyTopics.map((topic, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700/60 text-sky-300 text-[11px] font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 font-semibold">PrePilot Pro Tip: </strong>
                      <span>{round.tips}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: HIGH-FREQUENCY QUESTIONS & WEIGHTAGES */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Skill Weightage Bars */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <span>Topic Weightage Distribution for {selectedCompany.name}</span>
                </h5>

                <div className="space-y-2.5 pt-1">
                  {selectedCompany.topSkills.map((skill, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{skill.name}</span>
                        <span className="font-mono font-bold text-sky-400">{skill.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Real Frequently Asked Questions (Past 12 Months)</span>
                  </h5>
                  <span className="text-[11px] text-slate-400">Repeated in 40%+ campus drives</span>
                </div>

                <div className="space-y-2 pt-1">
                  {selectedCompany.frequentQuestions.map((q, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-200">{q}</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('ai_strategy');
                          setAiQuestion(`Explain the optimal approach and code for this question: "${q}"`);
                          handleAskCompanyAi(`Explain the optimal approach, time/space complexity, and code for: "${q}" at ${selectedCompany.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-500/20 shrink-0 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-sky-400" /> Solve with AI
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI PLACEMENT COACH STRATEGY */}
          {activeTab === 'ai_strategy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-purple-400" />
                  <h5 className="font-bold text-sm text-white">Ask PrePilot AI About {selectedCompany.name}</h5>
                </div>
                <p className="text-xs text-slate-300">
                  Ask any question about hiring rounds, cutoffs, negotiation tips, or request an instant code breakdown.
                </p>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    `What is the cutoff for ${selectedCompany.name} Round 1?`,
                    `Give me a 7-day study plan for ${selectedCompany.name}`,
                    `How to clear the behavioral questions at ${selectedCompany.name}?`,
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAiQuestion(preset);
                        handleAskCompanyAi(preset);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/60 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder={`e.g. How does ${selectedCompany.name} evaluate candidates in 2026?`}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskCompanyAi();
                    }}
                  />
                  <button
                    onClick={() => handleAskCompanyAi()}
                    disabled={isLoadingAi || !aiQuestion.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
                  >
                    {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>

              {/* AI Response Display */}
              {isLoadingAi && (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Loader2 className="w-7 h-7 text-purple-400 animate-spin mx-auto" />
                  <p className="text-xs">Analyzing {selectedCompany.name} recruitment patterns and generation data...</p>
                </div>
              )}

              {aiAnalysis && !isLoadingAi && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-xs text-slate-200 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" /> PrePilot AI Strategy Analysis
                    </span>
                    <button
                      onClick={() => setAiAnalysis(null)}
                      className="text-slate-500 hover:text-slate-300 text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed text-slate-300">
                    {aiAnalysis}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Viewing:</span>
            <strong className="text-white font-semibold">{selectedCompany.name}</strong>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400">{selectedCompany.tier}</span>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
