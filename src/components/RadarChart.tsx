import React, { useId } from 'react';
import { AreaScore, PlacementArea } from '../types';
import { PLACEMENT_AREAS } from '../data/questionBank';

interface RadarChartProps {
  areaScores: Record<PlacementArea, AreaScore>;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ areaScores, size = 320 }) => {
  const gradientId = useId();
  const radius = size * 0.38;
  const center = size / 2;
  const areas: PlacementArea[] = ['aptitude', 'dsa', 'core_cs', 'tech_interview', 'hr_interview', 'resume'];
  const totalAxes = areas.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate polygon points for a given set of scores
  const getCoordinates = (scores: number[]) => {
    return scores.map((score, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalized = Math.max(5, Math.min(100, score)) / 100;
      const x = center + radius * normalized * Math.cos(angle);
      const y = center + radius * normalized * Math.sin(angle);
      return { x, y, angle };
    });
  };

  const currentScores = areas.map(a => areaScores[a]?.score || 0);
  const targetScores = areas.map(a => areaScores[a]?.targetScore || 80);

  const currentPoints = getCoordinates(currentScores);
  const targetPoints = getCoordinates(targetScores);

  const currentPathString = currentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const targetPathString = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Concentric Polygons for Grid */}
        {levels.map((level, i) => {
          const gridPoints = areas.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center + radius * level * Math.cos(angle);
            const y = center + radius * level * Math.sin(angle);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ') + ' Z';

          return (
            <g key={i}>
              <path
                d={gridPoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-700/60"
              />
              {/* Scale percentage label */}
              <text
                x={center}
                y={center - radius * level - 2}
                textAnchor="middle"
                className="text-[9px] fill-slate-500 font-mono"
              >
                {Math.round(level * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        {areas.map((_, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="text-slate-700"
            />
          );
        })}

        {/* Target Outline (Dashed) */}
        <path
          d={targetPathString}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-60"
        />

        {/* Current Score Polygon */}
        <path
          d={currentPathString}
          fill={`url(#${gradientId})`}
          stroke="#38bdf8"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out drop-shadow-md"
        />

        {/* Vertex Dots */}
        {currentPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4.5"
            className="fill-sky-400 stroke-slate-900 stroke-2 drop-shadow"
          />
        ))}

        {/* Axis Labels */}
        {areas.map((areaKey, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const labelDist = radius + 28;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          const score = areaScores[areaKey]?.score || 0;
          const info = PLACEMENT_AREAS[areaKey];

          return (
            <g key={areaKey} className="cursor-pointer group">
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                className="text-[11px] font-semibold fill-slate-200 group-hover:fill-sky-400 transition-colors"
              >
                {info.shortName}
              </text>
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-sky-400"
              >
                {score}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-500/30 border border-sky-400 inline-block" />
          <span>Current Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 border-b-2 border-dashed border-slate-400 inline-block" />
          <span>Target Benchmark (80-85%)</span>
        </div>
      </div>
    </div>
  );
};
