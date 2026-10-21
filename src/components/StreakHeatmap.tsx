import React from 'react';
import { StreakData } from '../types';
import { Flame, Calendar, Award, CheckCircle } from 'lucide-react';

interface StreakHeatmapProps {
  streak: StreakData;
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ streak }) => {
  // Generate past 28 days for the 4-week preparation grid
  const days: Array<{ date: string; dayName: string; count: number; minutes: number; isToday: boolean }> = [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const activity = streak.activityHistory[dateStr];
    
    days.push({
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      count: activity ? activity.count : 0,
      minutes: activity ? activity.minutes : 0,
      isToday: i === 0,
    });
  }

  // Calculate total minutes spent over the last 28 days
  const totalMinutes = Object.values(streak.activityHistory).reduce((sum, item) => sum + item.minutes, 0);
  const totalActivities = Object.values(streak.activityHistory).reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Flame className="w-5 h-5 fill-amber-500/30" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Preparation Streak & Activity</h3>
            <p className="text-xs text-slate-400">Qualifying learning activity counts toward consistency</p>
          </div>
        </div>

        {/* Streak Counters */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono font-extrabold text-sm">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak.currentStreak} Days</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Longest</span>
            <div className="flex items-center gap-1 text-emerald-400 font-mono font-extrabold text-sm">
              <Award className="w-3.5 h-3.5" />
              <span>{streak.longestStreak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 28-Day Heatmap Grid */}
      <div className="mt-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last 4 Weeks Activity Heatmap
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {totalActivities} tasks completed ({Math.round(totalMinutes / 60 * 10) / 10}h study)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => {
            let bgClass = 'bg-slate-800/80 border-slate-700/50 text-slate-500';
            if (day.count >= 3) {
              bgClass = 'bg-amber-500 border-amber-400 text-slate-950 font-bold';
            } else if (day.count >= 2) {
              bgClass = 'bg-amber-500/80 border-amber-500 text-slate-950 font-bold';
            } else if (day.count === 1) {
              bgClass = 'bg-amber-500/40 border-amber-500/50 text-amber-300 font-semibold';
            }

            return (
              <div
                key={idx}
                title={`${day.date}: ${day.count} activities (${day.minutes} mins)`}
                className={`relative aspect-square rounded-lg border flex flex-col items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer ${bgClass} ${
                  day.isToday ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900' : ''
                }`}
              >
                <span>{day.dayName}</span>
                {day.count > 0 && (
                  <span className="text-[9px] font-mono leading-none mt-0.5">
                    {day.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
          <span>Rule: Only tests & practice sessions qualify</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700" />
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 border border-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 border border-amber-500" />
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-400" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
