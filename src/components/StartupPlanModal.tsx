import React from 'react';
import { 
  Rocket, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Gift, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Zap,
  Users
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types';

interface StartupPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const StartupPlanModal: React.FC<StartupPlanModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const stats = StorageService.getEarlyBirdStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 border-b border-slate-700/80 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5" /> Startup Launch Special
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Limited to First 100 Students
            </span>
          </div>

          <h3 className="font-extrabold text-xl md:text-2xl text-white">
            PrePilot Founder's Access Program
          </h3>

          {/* User's Exact Startup Sentence Prominently Featured */}
          <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs md:text-sm text-amber-200 font-medium leading-relaxed">
            <strong className="text-amber-300 block font-bold mb-1">📢 Official Startup Policy:</strong>
            “Who come first 100 email they will get all resources and my preparation feature will be free. After comes will maintain fee according to what you take like mock interview, AI recommendations, etc.”
          </div>
        </div>

        {/* Counter & Progress */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-400 font-medium">Early-Bird Allocation:</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">{stats.claimed} claimed</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">100 total spots</span>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 sm:justify-end">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span>Only {stats.remaining} Free Spots Remaining!</span>
            </div>
            <div className="w-48 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.claimed}%` }}
              />
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan 1: First 100 Emails (Free) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-slate-950 border-2 border-emerald-500/50 relative shadow-lg shadow-emerald-500/5 space-y-3">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                100% Free Lifetime
              </div>

              <div>
                <h4 className="font-bold text-base text-white">First 100 Registered Emails</h4>
                <p className="text-[11px] text-emerald-400 mt-0.5">Zero cost, forever unlocked</p>
              </div>

              <div className="text-2xl font-black text-white">
                ₹0 <span className="text-xs font-normal text-slate-400">/ Free forever</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {[
                  'Full 6-Dimensional Placement Assessments',
                  'Company-Wise Prep Trackers (Meta, TCS, Google, Infosys)',
                  'AI Placement Coach (Hints, Explanations, Plans)',
                  'Adaptive Daily Priority Engine',
                  'Android & iOS PWA Offline App',
                  'Future feature updates included',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan 2: After 100 Emails (Standard Fee) */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div>
                <h4 className="font-bold text-base text-white">Subsequent Students (101+)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Pay according to features taken</p>
              </div>

              <div className="text-xl font-bold text-slate-300">
                Standard Pricing <span className="text-xs font-normal text-slate-500">(Pay-per-use)</span>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-slate-300">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>AI Mock Interviews & Feedback</span>
                  <span className="font-mono font-bold text-amber-400">₹299</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Adaptive AI Recommendation Engine</span>
                  <span className="font-mono font-bold text-amber-400">₹499</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Full Placement Master Bundle</span>
                  <span className="font-mono font-bold text-amber-400">₹999 / year</span>
                </div>
                <p className="text-[10px] text-slate-500 italic pt-1">
                  * First 100 students bypass all fees completely.
                </p>
              </div>
            </div>
          </div>

          {/* Current User Status Banner */}
          {user && (
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">
                    Logged in as: <span className="text-sky-300">{user.email}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {user.isEarlyBird !== false 
                      ? `🎉 Congratulations! You are Early Bird #${user.earlyBirdRank || 1} of 100 — 100% Free Lifetime Access Unlocked!`
                      : 'Active account registered on PrePilot.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            PrePilot Startup Initiative by <strong className="text-sky-400">Lakshmeesh</strong>
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
