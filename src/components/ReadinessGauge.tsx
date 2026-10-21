import React, { useState } from 'react';
import { AreaScore, PlacementArea } from '../types';
import { calculateReadiness } from '../services/priorityEngine';
import { PLACEMENT_AREAS } from '../data/questionBank';
import { Info, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReadinessGaugeProps {
  areaScores: Record<PlacementArea, AreaScore>;
  onAreaClick?: (area: PlacementArea) => void;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ areaScores, onAreaClick }) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const readiness = calculateReadiness(areaScores);
  const score = readiness.score;

  // Status configuration based on score
  let statusText = 'Needs Initial Focus';
  let statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  let strokeColor = '#f59e0b'; // amber
  
  if (score >= 75) {
    statusText = 'Placement Ready (High Confidence)';
    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    strokeColor = '#10b981'; // emerald
  } else if (score >= 50) {
    statusText = 'Progressing (Moderate Readiness)';
    statusColor = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    strokeColor = '#0ea5e9'; // sky
  }

  // Circular gauge SVG calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100">Placement Readiness Score</h3>
            <button 
              onClick={() => setShowFormulaModal(true)}
              className="text-slate-400 hover:text-sky-400 transition-colors p-0.5 rounded-full"
              title="View documented calculation formula"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Calculated across 6 placement pillars</p>
        </div>

        {readiness.isProvisional ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Provisional ({readiness.assessedCount}/6 Assessed)
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Complete Profile (6/6)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        {/* Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-slate-700/50"
              />
              {/* Progress animated circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score inside ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {score}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-semibold border ${statusColor}`}>
            {statusText}
          </div>
        </div>

        {/* 6-Area Breakdown list */}
        <div className="md:col-span-7 space-y-2.5">
          {(Object.keys(PLACEMENT_AREAS) as PlacementArea[]).map((areaKey) => {
            const area = areaScores[areaKey];
            const info = PLACEMENT_AREAS[areaKey];
            const currentVal = area?.assessed ? area.score : 0;
            const isAssessed = area?.assessed;

            return (
              <div 
                key={areaKey}
                onClick={() => onAreaClick?.(areaKey)}
                className="cursor-pointer group p-1.5 rounded-lg hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                    {info.shortName}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    {isAssessed ? (
                      <>
                        <span className="text-slate-200 font-bold">{currentVal}%</span>
                        <span className="text-slate-500 text-[10px]">/ {area.targetScore}%</span>
                      </>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Not assessed</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 rounded-full ${
                      !isAssessed 
                        ? 'w-0' 
                        : currentVal >= 75 
                          ? 'bg-emerald-500' 
                          : currentVal >= 50 
                            ? 'bg-sky-500' 
                            : 'bg-amber-500'
                    }`}
                    style={{ width: isAssessed ? `${currentVal}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400">
                <Info className="w-5 h-5" />
                <h4 className="font-bold text-slate-100 text-base">Documented Readiness Formula</h4>
              </div>
              <button 
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p>
                In PrePilot, the Placement Readiness Score represents your readiness across all six placement pillars:
              </p>
              
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 font-mono text-center text-sky-300 text-sm">
                R = (A + C + K + T + H + V) / 6
              </div>

              <ul className="space-y-1 list-disc pl-4 text-slate-400">
                <li><strong className="text-slate-200">A</strong> = Quantitative & Logical Aptitude ({areaScores.aptitude?.assessed ? `${areaScores.aptitude.score}%` : 'Not assessed'})</li>
                <li><strong className="text-slate-200">C</strong> = Coding & Data Structures ({areaScores.dsa?.assessed ? `${areaScores.dsa.score}%` : 'Not assessed'})</li>
                <li><strong className="text-slate-200">K</strong> = Core Computer Science ({areaScores.core_cs?.assessed ? `${areaScores.core_cs.score}%` : 'Not assessed'})</li>
                <li><strong className="text-slate-200">T</strong> = Technical Interview Prep ({areaScores.tech_interview?.assessed ? `${areaScores.tech_interview.score}%` : 'Not assessed'})</li>
                <li><strong className="text-slate-200">H</strong> = HR Interview & Soft Skills ({areaScores.hr_interview?.assessed ? `${areaScores.hr_interview.score}%` : 'Not assessed'})</li>
                <li><strong className="text-slate-200">V</strong> = Resume Preparation & ATS ({areaScores.resume?.assessed ? `${areaScores.resume.score}%` : 'Not assessed'})</li>
              </ul>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                <strong>Handling Missing Data:</strong> If an area has not yet been assessed, it is marked as <em>Not assessed</em> rather than treated as a zero or perfect score. The overall score indicates provisional status until all 6 pillars have at least one diagnostic or practice attempt recorded.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold rounded-xl text-xs transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
