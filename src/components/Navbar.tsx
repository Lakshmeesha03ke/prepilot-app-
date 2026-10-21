import React, { useState } from 'react';
import { UserProfile, StreakData } from '../types';
import { StorageService } from '../services/storageService';
import { 
  GraduationCap, 
  Flame, 
  Calendar, 
  Smartphone, 
  Monitor, 
  User, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  RefreshCw,
  Compass,
  QrCode,
  Github,
  Building2,
  Gift
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  streak: StreakData;
  isMobileView: boolean;
  onToggleMobileView: () => void;
  onOpenAuth: () => void;
  onOpenDiagnostic: () => void;
  onOpenMobileModal: () => void;
  onOpenGitHub: () => void;
  onOpenCompanyPrep: () => void;
  onOpenStartupPlan: () => void;
  onLogout: () => void;
  onUserChanged: (user: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  streak,
  isMobileView,
  onToggleMobileView,
  onOpenAuth,
  onOpenDiagnostic,
  onOpenMobileModal,
  onOpenGitHub,
  onOpenCompanyPrep,
  onOpenStartupPlan,
  onLogout,
  onUserChanged,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Calculate days left to drive
  const getDaysLeft = () => {
    if (!user.driveDate) return null;
    const diff = new Date(user.driveDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const daysLeft = getDaysLeft();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg text-white tracking-tight">
                Pre<span className="text-sky-400">Pilot</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400">
              Placement Preparation & Readiness Platform
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Target Role Badge */}
          <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 text-[10px] block">Role Focus</span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px] block">
              {user.targetRole}
            </span>
          </div>

          {/* Placement Countdown */}
          {daysLeft !== null && (
            <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center gap-1.5 text-amber-300">
              <Calendar className="w-3.5 h-3.5" />
              <div>
                <span className="text-[10px] block text-amber-400/80 uppercase font-bold">Drive In</span>
                <span className="font-mono font-bold">{daysLeft} Days</span>
              </div>
            </div>
          )}

          {/* Daily Streak Flame */}
          <div className="px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs flex items-center gap-1.5 text-orange-300">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <div>
              <span className="text-[10px] block text-orange-400/80 uppercase font-bold">Streak</span>
              <span className="font-mono font-bold">{streak.currentStreak} Days</span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Company-Wise Prep Tracker Button (NEW) */}
          <button
            onClick={onOpenCompanyPrep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/35 text-indigo-300 font-bold text-xs transition-all shadow-sm"
            title="Prepare by Company (Meta, Google, Amazon, TCS, Infosys, Accenture)"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Companies (Meta, TCS...)</span>
            <span className="sm:hidden">Companies</span>
          </button>

          {/* Early Bird First 100 Free Offer Badge (NEW) */}
          <button
            onClick={onOpenStartupPlan}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
            title="First 100 Emails 100% Free Lifetime Access Policy"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>First 100 Free</span>
          </button>

          {/* GitHub Push / Export Shortcut (PROMINENT) */}
          <button
            onClick={onOpenGitHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-sky-500/50 hover:border-sky-400 text-white font-bold text-xs transition-all shadow-sm shadow-sky-500/10"
            title="Push to GitHub (Lakshmeesha03ke) or Export Source"
          >
            <Github className="w-3.5 h-3.5 text-sky-400" />
            <span>GitHub</span>
          </button>

          {/* Take Diagnostic Shortcut */}
          <button
            onClick={onOpenDiagnostic}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold text-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Diagnostic</span>
          </button>

          {/* Open on Mobile / QR Code button */}
          <button
            onClick={onOpenMobileModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/15 to-indigo-500/15 hover:from-sky-500/25 hover:to-indigo-500/25 border border-sky-500/30 text-sky-300 font-bold text-xs transition-all shadow-sm"
            title="Scan QR or open directly on Android mobile phone"
          >
            <QrCode className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Use on Mobile</span>
          </button>

          {/* View Toggle (Android Frame vs Desktop) */}
          <button
            onClick={onToggleMobileView}
            title={isMobileView ? 'Switch to Full Desktop View' : 'Preview as Android Mobile App'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1 text-xs"
          >
            {isMobileView ? (
              <>
                <Monitor className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Android Frame</span>
              </>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                {user.fullName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                {user.fullName.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs text-slate-200 animate-fade-in">
                <div className="p-3 border-b border-slate-700/60 mb-1">
                  <div className="font-bold text-white text-sm">{user.fullName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                    {user.targetRole}
                  </div>
                </div>

                {/* Preset Switcher for testing */}
                <div className="p-2 bg-slate-900/60 rounded-xl my-1 border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Demo Student Personas:
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        const u = StorageService.switchToPreset('arjun');
                        onUserChanged(u);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] text-sky-300 flex items-center justify-between"
                    >
                      <span>Arjun (High Aptitude / Low DSA)</span>
                      {user.id === 'usr-arjun-01' && <span className="text-emerald-400 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        const u = StorageService.switchToPreset('priya');
                        onUserChanged(u);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 text-[11px] text-purple-300 flex items-center justify-between"
                    >
                      <span>Priya (High DSA / Low Aptitude)</span>
                      {user.id === 'usr-priya-02' && <span className="text-emerald-400 font-bold">✓</span>}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-700/60 text-slate-300 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Switch Account / Register New</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenCompanyPrep();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-700/60 text-slate-300 flex items-center gap-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Company Hiring Trackers (Meta, TCS...)</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenStartupPlan();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-700/60 text-slate-300 flex items-center gap-2"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Startup Program (First 100 Free)</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenGitHub();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-700/60 text-slate-300 flex items-center gap-2"
                >
                  <Github className="w-3.5 h-3.5 text-sky-400" />
                  <span>Push Project to GitHub</span>
                </button>

                <div className="p-2 border-t border-slate-750 text-center text-[10px] text-slate-400">
                  Developed by <strong className="text-sky-400">Lakshmeesh</strong>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-rose-500/10 text-rose-300 flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
