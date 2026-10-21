import React, { useState } from 'react';
import { 
  UserProfile, 
  AreaScore, 
  PlacementArea, 
  DailyTask, 
  StreakData, 
  SpacedRevisionItem, 
  AchievementBadge,
  Attempt 
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AssessmentModal } from './components/AssessmentModal';
import { AiTutorModal } from './components/AiTutorModal';
import { AuthModal } from './components/AuthModal';
import { AuthView } from './components/AuthView';
import { AndroidFrame } from './components/AndroidFrame';
import { MobileAccessModal } from './components/MobileAccessModal';
import { GitHubModal } from './components/GitHubModal';
import { CompanyPrepModal } from './components/CompanyPrepModal';
import { StartupPlanModal } from './components/StartupPlanModal';

export default function App() {
  // 1. Session State - Strictly require authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return StorageService.getActiveUser();
  });

  // 2. Performance & Learning Data State
  const [areaScores, setAreaScores] = useState<Record<PlacementArea, AreaScore>>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getAreaScores(user.id, user.targetRole) : {} as any;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getDailyTasks(user.id, user.targetRole, user.dailyHours) : [];
  });

  const [streak, setStreak] = useState<StreakData>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getStreak(user.id) : { currentStreak: 0, longestStreak: 0, lastActiveDate: '', activityHistory: {} };
  });

  const [revisionItems, setRevisionItems] = useState<SpacedRevisionItem[]>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getSpacedRevisionItems(user.id) : [];
  });

  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    const user = StorageService.getActiveUser();
    return user ? StorageService.getBadges(user.id) : [];
  });

  // 3. UI & Modal States
  const [isMobileView, setIsMobileView] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showCompanyPrepModal, setShowCompanyPrepModal] = useState(false);
  const [showStartupPlanModal, setShowStartupPlanModal] = useState(false);

  const [assessmentConfig, setAssessmentConfig] = useState<{
    isOpen: boolean;
    area?: PlacementArea;
    topic?: string;
    isDiagnostic?: boolean;
    companyPattern?: string;
  }>({ isOpen: false });

  const [aiTutorConfig, setAiTutorConfig] = useState<{
    isOpen: boolean;
    initialTab?: 'weak_question' | 'interview_eval' | 'resume_bullet' | 'drive_plan';
  }>({ isOpen: false });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize data when user signs in or registers
  const handleUserLoggedIn = (user: UserProfile) => {
    setCurrentUser(user);
    const newScores = StorageService.getAreaScores(user.id, user.targetRole);
    setAreaScores(newScores);
    setDailyTasks(StorageService.getDailyTasks(user.id, user.targetRole, user.dailyHours));
    setStreak(StorageService.getStreak(user.id));
    setRevisionItems(StorageService.getSpacedRevisionItems(user.id));
    setBadges(StorageService.getBadges(user.id));

    showToast(`Welcome ${user.fullName}! Your placement dashboard is ready.`);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    if (!currentUser) return;
    const updated = StorageService.toggleTaskCompletion(currentUser.id, taskId, currentUser.targetRole);
    setDailyTasks(updated);
    setStreak(StorageService.getStreak(currentUser.id));
  };

  // Open Assessment
  const handleStartAssessment = (area?: PlacementArea, topic?: string, isDiagnostic = false, companyPattern?: string) => {
    setAssessmentConfig({
      isOpen: true,
      area,
      topic,
      isDiagnostic,
      companyPattern,
    });
  };

  // Assessment Completed Callback
  const handleAssessmentCompleted = (attempt: Attempt) => {
    if (!currentUser) return;

    // Refresh scores
    const updatedScores = StorageService.getAreaScores(currentUser.id, currentUser.targetRole);
    setAreaScores(updatedScores);

    // Refresh tasks
    const updatedTasks = StorageService.getDailyTasks(currentUser.id, currentUser.targetRole, currentUser.dailyHours);
    setDailyTasks(updatedTasks);

    // Refresh streak & badges
    setStreak(StorageService.getStreak(currentUser.id));
    setRevisionItems(StorageService.getSpacedRevisionItems(currentUser.id));
    setBadges(StorageService.getBadges(currentUser.id));

    showToast(`Assessment submitted! Score: ${attempt.score}% (+${attempt.score > 70 ? '15' : '5'} points)`);
  };

  // Open AI Tutor
  const handleOpenAiTutor = (tab: 'weak_question' | 'interview_eval' | 'resume_bullet' | 'drive_plan' = 'weak_question') => {
    setAiTutorConfig({
      isOpen: true,
      initialTab: tab,
    });
  };

  // If user is not authenticated, show strict Registration / Login screen with GitHub & Startup plan access
  if (!currentUser) {
    return (
      <AndroidFrame
        isMobileView={isMobileView}
        onToggleView={() => setIsMobileView(!isMobileView)}
      >
        <AuthView 
          onLoginSuccess={handleUserLoggedIn} 
          onOpenGitHub={() => setShowGitHubModal(true)}
          onOpenStartupPlan={() => setShowStartupPlanModal(true)}
        />
        <GitHubModal
          isOpen={showGitHubModal}
          onClose={() => setShowGitHubModal(false)}
        />
        <StartupPlanModal
          isOpen={showStartupPlanModal}
          onClose={() => setShowStartupPlanModal(false)}
        />
      </AndroidFrame>
    );
  }

  const appContent = (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-sky-500 text-slate-950 font-bold text-xs shadow-2xl animate-fade-in flex items-center gap-2 border border-sky-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        user={currentUser}
        streak={streak}
        isMobileView={isMobileView}
        onToggleMobileView={() => setIsMobileView(!isMobileView)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenDiagnostic={() => handleStartAssessment(undefined, undefined, true)}
        onOpenMobileModal={() => setShowMobileModal(true)}
        onOpenGitHub={() => setShowGitHubModal(true)}
        onOpenCompanyPrep={() => setShowCompanyPrepModal(true)}
        onOpenStartupPlan={() => setShowStartupPlanModal(true)}
        onLogout={handleLogout}
        onUserChanged={handleUserLoggedIn}
      />

      {/* Main Dashboard */}
      <main className="flex-1 pb-10">
        <DashboardView
          user={currentUser}
          areaScores={areaScores}
          dailyTasks={dailyTasks}
          streak={streak}
          revisionItems={revisionItems}
          badges={badges}
          onToggleTask={handleToggleTask}
          onStartAssessment={handleStartAssessment}
          onOpenAiTutor={handleOpenAiTutor}
          onOpenCompanyPrep={() => setShowCompanyPrepModal(true)}
          onOpenStartupPlan={() => setShowStartupPlanModal(true)}
        />
      </main>

      {/* Persistent Footer with Lakshmeesh Credit */}
      <footer className="py-5 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-slate-950/60 px-4">
        <p className="font-semibold text-slate-400">
          PrePilot — Intelligent Placement Preparation & Readiness Platform
        </p>
        <p className="mt-1 text-slate-400">
          Developed by <strong className="text-sky-400 font-bold text-sm">Lakshmeesh</strong> • 5th Semester Academic Project
        </p>
      </footer>

      {/* Company-Wise Hiring & Preparation Modal */}
      <CompanyPrepModal
        isOpen={showCompanyPrepModal}
        onClose={() => setShowCompanyPrepModal(false)}
        user={currentUser}
        onStartCompanyPractice={(companyName, area) => {
          handleStartAssessment(area, `${companyName} Pattern`, false, companyName);
        }}
      />

      {/* Startup Founder's Plan & Early Bird Modal */}
      <StartupPlanModal
        isOpen={showStartupPlanModal}
        onClose={() => setShowStartupPlanModal(false)}
        user={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Assessment Test Modal */}
      {assessmentConfig.isOpen && (
        <AssessmentModal
          area={assessmentConfig.area}
          topic={assessmentConfig.topic}
          isDiagnostic={assessmentConfig.isDiagnostic}
          userId={currentUser.id}
          onClose={() => setAssessmentConfig({ isOpen: false })}
          onComplete={handleAssessmentCompleted}
        />
      )}

      {/* AI Tutor Suite Modal */}
      {aiTutorConfig.isOpen && (
        <AiTutorModal
          user={currentUser}
          areaScores={areaScores}
          initialTab={aiTutorConfig.initialTab}
          onClose={() => setAiTutorConfig({ isOpen: false })}
        />
      )}

      {/* Authentication & Profile Switcher Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleUserLoggedIn}
      />

      {/* Open on Mobile / PWA Install Modal */}
      <MobileAccessModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
      />

      {/* GitHub Push & Code Export Modal */}
      <GitHubModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />

    </div>
  );

  return (
    <AndroidFrame
      isMobileView={isMobileView}
      onToggleView={() => setIsMobileView(!isMobileView)}
    >
      {appContent}
    </AndroidFrame>
  );
}
