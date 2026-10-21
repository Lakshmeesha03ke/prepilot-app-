import React from 'react';
import { DailyTask } from '../types';
import { Sparkles, Calculator, Target, Award, ArrowRight } from 'lucide-react';
import { PLACEMENT_AREAS } from '../data/questionBank';

interface ExplainPriorityModalProps {
  task: DailyTask | null;
  onClose: () => void;
  targetRole: string;
}

export const ExplainPriorityModal: React.FC<ExplainPriorityModalProps> = ({
  task,
  onClose,
  targetRole,
}) => {
  if (!task) return null;

  const { targetScore, currentScore, weight, gap, formula, description } = task.explainReason;
  const areaInfo = PLACEMENT_AREAS[task.area];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Explainable Priority Engine</h3>
              <p className="text-xs text-slate-400">Why was this specific task recommended today?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-slate-300">
          {/* Target Role & Area */}
          <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
            <div>
              <span className="text-slate-400 text-[11px] block">Target Role</span>
              <span className="text-slate-100 font-bold">{targetRole}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Preparation Pillar</span>
              <span className="text-sky-400 font-semibold">{areaInfo.name}</span>
            </div>
          </div>

          {/* Mathematical Formula Card */}
          <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-sky-500/30">
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Priority Formula: P = max(0, T - S) × W</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl font-mono text-center text-amber-300 text-sm border border-slate-700">
              {formula}
            </div>
          </div>

          {/* Variable Breakdown Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Target (T)</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">{targetScore}%</span>
              <span className="text-[10px] text-slate-500 block">Benchmark</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Current (S)</span>
              <span className="text-lg font-mono font-extrabold text-amber-400">{currentScore}%</span>
              <span className="text-[10px] text-slate-500 block">Recorded Level</span>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Role Weight (W)</span>
              <span className="text-lg font-mono font-extrabold text-sky-400">{weight}x</span>
              <span className="text-[10px] text-slate-500 block">Role Importance</span>
            </div>
          </div>

          {/* Skill Gap Explanation */}
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Raw Skill Gap (T - S):</span>
              <span className="font-mono font-bold text-amber-300">{gap}% deficit</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Weighted Priority Rank:</span>
              <span className="font-mono font-bold text-sky-300">{task.priorityScore} points</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-700/50">
              {description}
            </p>
          </div>

          {/* Continuous Adaptation Note */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-[11px] flex items-start gap-2">
            <Award className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Continuous Adaptation:</strong> Once you complete this practice task and your score increases, PrePilot will recalculate the skill profile and dynamically replace this item with your next highest priority!
            </span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
