import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface AndroidFrameProps {
  isMobileView: boolean;
  onToggleView: () => void;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  isMobileView,
  onToggleView,
  children,
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  if (!isMobileView) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6">
      {/* Device frame container */}
      <div className="relative w-full max-w-[430px] h-[915px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-[6px] border-slate-700/80 ring-1 ring-slate-600 flex flex-col overflow-hidden">
        
        {/* Top Speaker & Punch Hole Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 ring-1 ring-slate-700/50" />
        </div>

        {/* Android Status Bar */}
        <div className="h-9 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none z-30 pt-1 shrink-0">
          <span className="font-mono tracking-tight">{currentTime}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span>88%</span>
              <Battery className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 w-full bg-slate-900 overflow-y-auto rounded-b-[36px] relative flex flex-col custom-scrollbar">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="h-6 flex items-center justify-center shrink-0 z-30 bg-slate-900">
          <div className="w-32 h-1 bg-slate-500 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
        </div>

      </div>

      {/* Floating Toggle Pill */}
      <button
        onClick={onToggleView}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-xl transition-all hover:scale-105"
      >
        <Smartphone className="w-4 h-4" />
        <span>Switch to Full Desktop View</span>
      </button>
    </div>
  );
};
