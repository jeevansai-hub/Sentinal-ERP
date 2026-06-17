import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export interface ChartDataNode {
  name: string;
  value: number;
  color?: string;
  // Comparative / target value
  compareValue?: number;
  // Stacked segments
  stackedValues?: { label: string; value: number; color?: string }[];
  // Radar metrics
  radarValues?: number[];
  // Risk matrix coordinates (0-100)
  x?: number;
  y?: number;
  riskStatus?: 'Low' | 'Medium' | 'High';
  // Network connections
  links?: string[]; // connected node names
  // Gantt timelines
  start?: number;
  duration?: number;
  
  // AI-Ready Metadata (For future predictive and anomaly runs)
  aiMetadata?: {
    insight?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    isAnomaly?: boolean;
    recommendation?: string;
    predictiveSignal?: number;
    summary?: string;
  };
}

interface EnterpriseChartProps {
  type: 
    | 'line' 
    | 'area'
    | 'bar' 
    | 'stackedBar'
    | 'donut' 
    | 'radar' 
    | 'treemap' 
    | 'riskMatrix' 
    | 'network' 
    | 'gantt'
    | 'heatmap'
    | 'forecast'
    | 'comparative'
    | 'kpiTrend'
    | 'orbit'
    | 'workflow';
  data: ChartDataNode[];
  radarLabels?: string[];
  height?: string;
  onNodeClick?: (node: ChartDataNode) => void;
  colorTheme?: 'default' | 'admin' | 'hr' | 'finance' | 'inventory' | 'rose' | 'amber';
}

interface TreemapRect {
  node: ChartDataNode;
  x: number; // percentage left
  y: number; // percentage top
  w: number; // percentage width
  h: number; // percentage height
  index: number;
}

// Recursive binary space partitioning algorithm for mathematical treemap distribution
function computeTreemap(nodes: ChartDataNode[], x: number, y: number, w: number, h: number): TreemapRect[] {
  if (nodes.length === 0) return [];
  if (nodes.length === 1) {
    return [{ node: nodes[0], x, y, w, h, index: 0 }];
  }

  const total = nodes.reduce((sum, n) => sum + n.value, 0);
  if (total === 0) {
    return nodes.map((node, i) => ({
      node,
      x: x + (i * w) / nodes.length,
      y,
      w: w / nodes.length,
      h,
      index: i
    }));
  }

  // Find partition point that balances values as evenly as possible
  let splitIdx = 1;
  let leftSum = nodes[0].value;
  let minDiff = Math.abs(leftSum - (total - leftSum));

  for (let i = 2; i < nodes.length; i++) {
    const tempSum = leftSum + nodes[i - 1].value;
    const diff = Math.abs(tempSum - (total - tempSum));
    if (diff < minDiff) {
      leftSum = tempSum;
      splitIdx = i;
      minDiff = diff;
    } else {
      break;
    }
  }

  const leftNodes = nodes.slice(0, splitIdx);
  const rightNodes = nodes.slice(splitIdx);
  const leftRatio = leftSum / total;

  const rects: TreemapRect[] = [];
  if (w > h) {
    // Horizontal Split
    const leftW = w * leftRatio;
    rects.push(...computeTreemap(leftNodes, x, y, leftW, h));
    rects.push(...computeTreemap(rightNodes, x + leftW, y, w - leftW, h));
  } else {
    // Vertical Split
    const leftH = h * leftRatio;
    rects.push(...computeTreemap(leftNodes, x, y, w, leftH));
    rects.push(...computeTreemap(rightNodes, x, y + leftH, w, h - leftH));
  }

  return rects.map((r, i) => ({ ...r, index: i }));
}

// Helper to construct a smooth cubic Bezier curve through points
function getBezierCurvePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Control points: divide X distance in three parts
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y;
    const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
    const cp2y = p1.y;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return path;
}

export default function EnterpriseChart({
  type,
  data,
  radarLabels = [],
  height = '240px',
  onNodeClick,
  colorTheme = 'default'
}: EnterpriseChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate unique key to force re-render and re-trigger SVG/SMIL entrance animations on dataset change
  const animationKey = useMemo(() => {
    return JSON.stringify(data) + type + height;
  }, [data, type, height]);

  // Donut chart layout helper
  const donutSlices = useMemo(() => {
    if (type !== 'donut') return [];
    const total = data.reduce((acc, c) => acc + c.value, 0);
    let cumulativePercent = 0;
    
    return data.map((node, i) => {
      const percent = total > 0 ? node.value / total : 0;
      const startAngle = cumulativePercent * 360;
      cumulativePercent += percent;
      const endAngle = cumulativePercent * 360;
      
      const radStart = (startAngle - 90) * (Math.PI / 180);
      const radEnd = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 100 + 70 * Math.cos(radStart);
      const y1 = 100 + 70 * Math.sin(radStart);
      const x2 = 100 + 70 * Math.cos(radEnd);
      const y2 = 100 + 70 * Math.sin(radEnd);
      
      const largeArc = percent > 0.5 ? 1 : 0;
      const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      return {
        ...node,
        pathData,
        color: node.color || `hsl(${(i * 360) / data.length}, 75%, 60%)`,
        percent: Math.round(percent * 100)
      };
    });
  }, [data, type]);

  // Proportional treemap layout computation
  const treemapRects = useMemo(() => {
    if (type !== 'treemap') return [];
    const sorted = [...data].sort((a, b) => b.value - a.value);
    return computeTreemap(sorted, 0, 0, 100, 100);
  }, [data, type]);

  return (
    <div 
      key={animationKey} 
      style={{ height }} 
      className="w-full relative flex items-center justify-center select-none overflow-hidden transition-all duration-300"
    >
      {/* ── 1. LINE / AREA / FORECAST / COMPARATIVE / KPI TREND CHART ── */}
      {(type === 'line' || type === 'area' || type === 'forecast' || type === 'comparative' || type === 'kpiTrend') && (() => {
        const values = data.map(d => d.value);
        const compareValues = data.map(d => d.compareValue || 0);
        const allVals = [...values, ...compareValues];
        
        const maxVal = Math.max(...allVals, 1);
        const minVal = Math.min(...allVals, 0);

        const points = data.map((node, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * 380 + 10 : 200;
          const y = maxVal !== minVal ? 180 - ((node.value - minVal) / (maxVal - minVal)) * 140 : 100;
          return { x, y, name: node.name, value: node.value, color: node.color };
        });

        const comparePoints = data.map((node, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * 380 + 10 : 200;
          const compareVal = node.compareValue !== undefined ? node.compareValue : node.value * 0.85;
          const y = maxVal !== minVal ? 180 - ((compareVal - minVal) / (maxVal - minVal)) * 140 : 100;
          return { x, y, value: compareVal };
        });

        const linePathD = getBezierCurvePath(points);
        const areaPathD = points.length > 0
          ? `${linePathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`
          : '';

        const compareLinePathD = getBezierCurvePath(comparePoints);

        // Upper and lower confidence forecast bands
        const upperForecastPoints = points.map((p, i) => ({ x: p.x, y: Math.max(p.y - 12 - (i * 2), 5) }));
        const lowerForecastPoints = points.map((p, i) => ({ x: p.x, y: Math.min(p.y + 12 + (i * 2), 195) }));
        const upperPathD = getBezierCurvePath(upperForecastPoints);
        const lowerPathD = getBezierCurvePath(lowerForecastPoints);

        const forecastShadePathD = upperForecastPoints.length > 0
          ? `${upperPathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z` // approximation fill
          : '';

        if (type === 'kpiTrend') {
          // Mini minimal sparkline trend (used inside layouts/cards)
          const isUp = values.length > 1 ? values[values.length - 1] >= values[0] : true;
          return (
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path
                d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x - 10) * (100 / 380)} ${p.y * (40 / 200)}`).join(' ')}
                fill="none"
                stroke={isUp ? '#10B981' : '#EF4444'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="400"
                strokeDashoffset="400"
              >
                <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1s" fill="freeze" />
              </path>
            </svg>
          );
        }

        return (
          <div className="h-full w-full flex flex-col justify-between pt-4">
            <div className="flex-1 w-full flex items-end relative pb-4">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  {/* Default Theme (White -> Purple -> Blue) */}
                  <linearGradient id="lineGlowGrad_default" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_default" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>

                  {/* Admin Theme (White -> Cyan -> Blue) */}
                  <linearGradient id="lineGlowGrad_admin" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_admin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>

                  {/* HR Theme (White -> Emerald -> Teal) */}
                  <linearGradient id="lineGlowGrad_hr" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#0D9488" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_hr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>

                  {/* Finance Theme (White -> Gold -> Amber) */}
                  <linearGradient id="lineGlowGrad_finance" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_finance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  {/* Inventory Theme (White -> Teal -> Blue) */}
                  <linearGradient id="lineGlowGrad_inventory" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_inventory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                  </linearGradient>

                  {/* Rose Theme (White -> Rose -> Red) */}
                  <linearGradient id="lineGlowGrad_rose" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_rose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                  </linearGradient>

                  {/* Amber Theme (White -> Amber -> Orange) */}
                  <linearGradient id="lineGlowGrad_amber" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                  <linearGradient id="areaGlowGrad_amber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="compareGlowGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6B7280" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[40, 80, 120, 160].map((glY) => (
                  <line 
                    key={glY} 
                    x1="0" 
                    y1={glY} 
                    x2="400" 
                    y2={glY} 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1" 
                    strokeDasharray="3,3" 
                  />
                ))}

                {/* Forecast Band shaded confidence region */}
                {type === 'forecast' && forecastShadePathD && (
                  <path
                    d={forecastShadePathD}
                    fill="rgba(255, 255, 255, 0.02)"
                    className="transition-all duration-500"
                  />
                )}

                {/* Forecast upper limit */}
                {type === 'forecast' && upperPathD && (
                  <path
                    d={upperPathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                )}

                {/* Forecast lower limit */}
                {type === 'forecast' && lowerPathD && (
                  <path
                    d={lowerPathD}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                )}

                {/* Comparative target/historical path */}
                {type === 'comparative' && compareLinePathD && (
                  <path
                    d={compareLinePathD}
                    fill="none"
                    stroke="url(#compareGlowGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                    className="transition-all duration-500"
                  />
                )}

                {/* Filled area gradient fill */}
                {(type === 'area' || type === 'forecast' || type === 'comparative') && areaPathD && (
                  <path
                    d={areaPathD}
                    fill={`url(#areaGlowGrad_${colorTheme})`}
                    className="transition-all duration-500"
                  />
                )}

                {/* Main line path with path animation */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke={`url(#lineGlowGrad_${colorTheme})`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    className="transition-all duration-500"
                  >
                    <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.5s" fill="freeze" />
                  </path>
                )}

                {/* Interactive vertices */}
                {points.map((p, idx) => {
                  const isHovered = hoveredIndex === idx;
                  return (
                    <g key={idx} className="group cursor-pointer">
                      {isHovered && (
                        <>
                          <line x1={p.x} y1="0" x2={p.x} y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3,3" />
                          <circle cx={p.x} cy={p.y} r="9" fill="#8B5CF6" opacity="0.25" className="animate-pulse" />
                        </>
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 5 : 3}
                        fill="#FFFFFF"
                        stroke="#8B5CF6"
                        strokeWidth="2"
                        className="transition-all duration-200"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Legends & tooltips overlay */}
              {hoveredIndex !== null && points[hoveredIndex] && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-neutral-950/90 border border-white/10 rounded-xl text-[10px] text-white/80 font-mono shadow-2xl backdrop-blur-md z-20 flex gap-2">
                  <span className="text-white/40">{points[hoveredIndex].name}:</span>
                  <span className="font-bold text-white font-sans">
                    {points[hoveredIndex].value <= 150 ? `${points[hoveredIndex].value}%` : `₹${points[hoveredIndex].value.toLocaleString()}`}
                  </span>
                  {type === 'comparative' && data[hoveredIndex]?.compareValue !== undefined && (
                    <>
                      <span className="text-white/20">|</span>
                      <span className="text-white/40">Target:</span>
                      <span className="font-bold text-white/60">
                        {(data[hoveredIndex]?.compareValue || 0) <= 150 ? `${data[hoveredIndex]?.compareValue}%` : `₹${(data[hoveredIndex]?.compareValue || 0).toLocaleString()}`}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* X-Axis labels */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[8px] font-mono text-white/30 border-t border-white/5 pt-1.5">
                {data.map((node, i) => <span key={i}>{node.name}</span>)}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 2. BAR / STACKED BAR CHART ── */}
      {(type === 'bar' || type === 'stackedBar') && (() => {
        const maxVal = Math.max(...data.map(d => {
          if (type === 'stackedBar' && d.stackedValues) {
            return d.stackedValues.reduce((sum, s) => sum + s.value, 0);
          }
          return d.value;
        }), 1);
        const minVal = 0;

        const barSpacing = 400 / data.length;
        const barW = barSpacing * 0.55;

        return (
          <div className="h-full w-full flex flex-col justify-between pt-4">
            <div className="flex-1 w-full flex items-end relative pb-4">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  {/* Default Theme (Emerald/Green) */}
                  <linearGradient id="barGlowGrad_default" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  {/* Admin Theme (Cyan/Blue) */}
                  <linearGradient id="barGlowGrad_admin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>

                  {/* HR Theme (Teal/Emerald) */}
                  <linearGradient id="barGlowGrad_hr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>

                  {/* Finance Theme (Gold/Amber) */}
                  <linearGradient id="barGlowGrad_finance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>

                  {/* Inventory Theme (Indigo/Purple) */}
                  <linearGradient id="barGlowGrad_inventory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>

                  {/* Rose Theme (Rose/Red) */}
                  <linearGradient id="barGlowGrad_rose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#9F1239" />
                  </linearGradient>

                  {/* Amber Theme (Amber/Orange) */}
                  <linearGradient id="barGlowGrad_amber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[40, 80, 120, 160].map((glY) => (
                  <line 
                    key={glY} 
                    x1="0" 
                    y1={glY} 
                    x2="400" 
                    y2={glY} 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="1" 
                    strokeDasharray="3,3" 
                  />
                ))}

                {data.map((node, idx) => {
                  const segments = (type === 'stackedBar' && node.stackedValues)
                    ? node.stackedValues
                    : [{ label: node.name, value: node.value, color: node.color || `url(#barGlowGrad_${colorTheme})` }];
                  
                  const totalVal = segments.reduce((sum, s) => sum + s.value, 0);
                  const barH = ((totalVal - minVal) / (maxVal - minVal)) * 140 + 10;
                  const xPos = idx * barSpacing + (barSpacing - barW) / 2;
                  const isHovered = hoveredIndex === idx;

                  let cumulativeY = 180;

                  return (
                    <g key={idx} className="cursor-pointer">
                      {/* Interactive Hover Highlight Column */}
                      {isHovered && (
                        <rect 
                          x={xPos - 4} 
                          y="0" 
                          width={barW + 8} 
                          height="200" 
                          fill="rgba(255,255,255,0.02)" 
                        />
                      )}
                      
                      {segments.map((seg, sIdx) => {
                        const segH = totalVal > 0 ? (seg.value / totalVal) * barH : 0;
                        cumulativeY -= segH;
                        
                        return (
                          <rect
                            key={sIdx}
                            x={xPos}
                            y={cumulativeY}
                            width={barW}
                            height={segH}
                            rx={sIdx === segments.length - 1 ? '3' : '0'} // rounded top only
                            fill={seg.color || 'url(#barGlowGradPrimary)'}
                            opacity={hoveredIndex === null || isHovered ? '0.9' : '0.45'}
                            className="transition-all duration-300 hover:filter hover:brightness-110"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <animate attributeName="height" from="0" to={segH} dur="1.2s" fill="freeze" />
                            <animate attributeName="y" from="180" to={cumulativeY} dur="1.2s" fill="freeze" />
                          </rect>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>

              {/* Hover tooltip */}
              {hoveredIndex !== null && data[hoveredIndex] && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-neutral-950/90 border border-white/10 rounded-xl text-[10px] text-white/80 font-mono shadow-2xl backdrop-blur-md z-20 text-left space-y-1">
                  <div className="font-bold text-white">{data[hoveredIndex].name}</div>
                  {type === 'stackedBar' && data[hoveredIndex].stackedValues ? (
                    data[hoveredIndex].stackedValues?.map((seg, sIdx) => (
                      <div key={sIdx} className="flex justify-between gap-4 text-[9px]">
                        <span className="text-white/45">{seg.label}:</span>
                        <span className="font-bold text-white">
                          {seg.value <= 150 ? `${seg.value}%` : `₹${seg.value.toLocaleString()}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between gap-4">
                      <span className="text-white/45">Total:</span>
                      <span className="font-bold text-emerald-400">
                        {data[hoveredIndex].value <= 150 ? `${data[hoveredIndex].value}%` : `₹${data[hoveredIndex].value.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Labels */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[8px] font-mono text-white/30 border-t border-white/5 pt-1.5">
                {data.map((node, i) => <span key={i}>{node.name}</span>)}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 3. DONUT / PIE ALLOCATIONS ── */}
      {type === 'donut' && (
        <div className="relative h-full w-full flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-full max-h-56 transform -rotate-90">
            {donutSlices.map((slice, i) => (
              <path
                key={i}
                d={slice.pathData}
                fill={slice.color}
                opacity={hoveredIndex === i ? '1' : '0.8'}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onNodeClick && onNodeClick(slice)}
              />
            ))}
            {/* Center cutout */}
            <circle cx="100" cy="100" r="48" fill="#030303" />
          </svg>
          
          {/* Overlay centered details */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            {hoveredIndex !== null ? (
              <>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  {donutSlices[hoveredIndex].name}
                </span>
                <span className="text-lg font-bold font-mono text-white mt-0.5">
                  {donutSlices[hoveredIndex].percent}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest">ALLOCATED</span>
                <span className="text-base font-bold text-white font-mono mt-0.5">TOTAL</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── 4. RADAR MATRIX WEB ── */}
      {type === 'radar' && (
        <div className="h-full w-full max-w-56 relative">
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, sIdx) => (
              <circle
                key={sIdx}
                cx="100"
                cy="100"
                r={scale * 80}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {radarLabels.map((_, idx) => {
              const angle = (idx * 2 * Math.PI) / radarLabels.length - Math.PI / 2;
              const x = 100 + 80 * Math.cos(angle);
              const y = 100 + 80 * Math.sin(angle);
              return (
                <line
                  key={idx}
                  x1="100"
                  y1="100"
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {data.map((node, nIdx) => {
              const points = (node.radarValues || []).map((val, idx) => {
                const angle = (idx * 2 * Math.PI) / radarLabels.length - Math.PI / 2;
                const distance = (val / 100) * 80;
                const x = 100 + distance * Math.cos(angle);
                const y = 100 + distance * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ');

              return (
                <polygon
                  key={nIdx}
                  points={points}
                  fill={node.color || 'rgba(255,255,255,0.04)'}
                  stroke={node.color || '#FFFFFF'}
                  strokeWidth="1.5"
                  opacity={hoveredIndex === nIdx ? '0.75' : '0.25'}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(nIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onNodeClick && onNodeClick(node)}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 pointer-events-none">
            {radarLabels.map((lbl, idx) => {
              const angle = (idx * 2 * Math.PI) / radarLabels.length - Math.PI / 2;
              const xPercent = 50 + 44 * Math.cos(angle);
              const yPercent = 50 + 44 * Math.sin(angle);
              return (
                <div
                  key={idx}
                  className="absolute text-[8px] font-bold text-white/35 font-sans transform -translate-x-1/2 -translate-y-1/2 uppercase tracking-wide"
                  style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                >
                  {lbl}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. MATHEMATICAL PROPORTIONAL TREEMAP ── */}
      {type === 'treemap' && (
        <div className="h-full w-full relative bg-neutral-950/20 p-1 rounded-xl border border-white/5 overflow-hidden">
          {treemapRects.map((rect, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => onNodeClick && onNodeClick(rect.node)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'absolute',
                  left: `${rect.x}%`,
                  top: `${rect.y}%`,
                  width: `${rect.w}%`,
                  height: `${rect.h}%`,
                  padding: '4px'
                }}
              >
                <div 
                  className={`h-full w-full rounded-lg border text-left p-2.5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 cursor-pointer bg-white/5 border-white/5 hover:border-white/20 select-none`}
                  style={{
                    backgroundColor: rect.node.color || 'rgba(255,255,255,0.03)',
                    boxShadow: isHovered ? 'inset 0 0 15px rgba(255,255,255,0.05)' : 'none'
                  }}
                >
                  {/* Subtle glassmorphic gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-transparent pointer-events-none" />
                  
                  <div className="truncate">
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider block truncate">{rect.node.name}</span>
                    {rect.h > 20 && (
                      <span className="text-[8px] text-white/40 block mt-0.5 font-mono truncate">Utilization Index</span>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline mt-1 truncate">
                    <span className="text-xs font-mono font-bold text-white">{rect.node.value}%</span>
                    {rect.w > 15 && (
                      <span className="text-[7.5px] text-white/30 uppercase tracking-widest font-mono">Zone {idx + 1}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 6. 2D RISK COORDINATE GRID MATRIX ── */}
      {type === 'riskMatrix' && (
        <div className="h-full w-full relative bg-neutral-950 rounded-xl border border-white/5 overflow-hidden flex flex-col justify-between">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {[60, 120, 180, 240].map((tickY) => (
              <line key={`hy-${tickY}`} x1="0" y1={tickY} x2="400" y2={tickY} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
            ))}
            {[80, 160, 240, 320].map((tickX) => (
              <line key={`vx-${tickX}`} x1={tickX} y1="0" x2={tickX} y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
            ))}

            <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            <text x="385" y="142" fill="rgba(255,255,255,0.15)" fontSize="7px" fontWeight="bold" textAnchor="end" letterSpacing="0.05em">RELIABILITY →</text>
            <text x="208" y="18" fill="rgba(255,255,255,0.15)" fontSize="7px" fontWeight="bold" textAnchor="start" letterSpacing="0.05em">↑ COST EFFICIENCY</text>

            <text x="15" y="25" fill="rgba(255,255,255,0.25)" fontSize="8px" fontWeight="bold" letterSpacing="0.1em" className="uppercase font-mono">Strategic</text>
            <text x="385" y="25" fill="rgba(239, 68, 68, 0.4)" fontSize="8px" fontWeight="bold" letterSpacing="0.1em" textAnchor="end" className="uppercase font-mono">Critical Node</text>
            <text x="15" y="285" fill="rgba(16, 185, 129, 0.4)" fontSize="8px" fontWeight="bold" letterSpacing="0.1em" className="uppercase font-mono">Low Risk</text>
            <text x="385" y="285" fill="rgba(255,255,255,0.25)" fontSize="8px" fontWeight="bold" letterSpacing="0.1em" textAnchor="end" className="uppercase font-mono">Transactional</text>

            {data.map((node, idx) => {
              const xVal = ((node.x !== undefined ? node.x : 50) / 100) * 400;
              const yVal = (1 - (node.y !== undefined ? node.y : 50) / 100) * 300;
              const isHovered = hoveredIndex === idx;

              const dotColor = node.riskStatus === 'Low' 
                ? '#10B981' 
                : node.riskStatus === 'Medium' 
                ? '#FBBF24' 
                : '#EF4444';

              const yOffset = idx % 2 === 0 ? -6 : 8;
              const textY = yVal + yOffset;
              
              const textX = xVal > 300 ? xVal - 10 : xVal + 10;
              const textAnchor = xVal > 300 ? 'end' : 'start';

              const cleanName = node.name
                .replace(' Ltd', '')
                .replace(' Processing', '')
                .replace(' Extrusions', '')
                .replace(' Sourcing', '')
                .replace(' Power', '');

              return (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isHovered ? 14 : 8}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="1"
                    opacity={isHovered ? 0.5 : 0.2}
                    className="transition-all duration-300"
                  >
                    <animate attributeName="r" values={`${isHovered ? 8 : 6};${isHovered ? 16 : 12}`} dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isHovered ? 6 : 4}
                    fill={dotColor}
                    stroke="#030303"
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onNodeClick && onNodeClick(node)}
                  />

                  <g className="pointer-events-none select-none">
                    <text
                      x={textX}
                      y={textY}
                      textAnchor={textAnchor}
                      fill="rgba(0,0,0,0.85)"
                      fontSize="7.5px"
                      fontWeight="bold"
                      stroke="#030303"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      className="font-mono"
                    >
                      {cleanName}
                    </text>
                    <text
                      x={textX}
                      y={textY}
                      textAnchor={textAnchor}
                      fill={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
                      fontSize="7.5px"
                      fontWeight="bold"
                      className="font-mono transition-colors duration-200"
                    >
                      {cleanName}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ── 7. NETWORK RELATIONSHIP GRAPH ── */}
      {type === 'network' && (
        <div className="h-full w-full relative bg-neutral-950 rounded-xl border border-white/5 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            <circle
              cx="200"
              cy="120"
              r="24"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="4,4"
            >
              <animateTransform attributeName="transform" type="rotate" from="0 200 120" to="360 200 120" dur="12s" repeatCount="indefinite" />
            </circle>

            <circle cx="200" cy="120" r="14" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5">
              <animate attributeName="r" values="14;28" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
            </circle>

            {data.map((node, idx) => {
              const xVal = ((node.x !== undefined ? node.x : 50) / 100) * 400;
              const yVal = ((node.y !== undefined ? node.y : 50) / 100) * 240;
              const dotColor = node.color || '#3B82F6';

              return (
                <g key={`links-${idx}`}>
                  <line
                    x1="200"
                    y1="120"
                    x2={xVal}
                    y2={yVal}
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />

                  <circle r="2.5" fill={dotColor} className="filter drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
                    <animate attributeName="cx" from="200" to={xVal} dur={`${1.4 + idx * 0.3}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" from="120" to={yVal} dur={`${1.4 + idx * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            <circle cx="200" cy="120" r="13" fill="#FFFFFF" className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <text x="200" y="123" fill="#000000" fontSize="7px" fontWeight="900" textAnchor="middle" className="font-mono tracking-wider">CORE</text>

            {data.map((node, idx) => {
              const xVal = ((node.x !== undefined ? node.x : 50) / 100) * 400;
              const yVal = ((node.y !== undefined ? node.y : 50) / 100) * 240;
              const isHovered = hoveredIndex === idx;
              const dotColor = node.color || '#3B82F6';

              const textY = yVal < 120 ? yVal - 15 : yVal + 18;

              return (
                <g 
                  key={idx}
                  onClick={() => onNodeClick && onNodeClick(node)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isHovered ? 15 : 10}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="1.5"
                    opacity={isHovered ? 0.5 : 0.25}
                    className="transition-all duration-300"
                  >
                    <animate attributeName="r" values={`${isHovered ? 10 : 8};${isHovered ? 18 : 14}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                  </circle>

                  <circle
                    cx={xVal}
                    cy={yVal}
                    r="8"
                    fill={dotColor}
                    stroke="#030303"
                    strokeWidth="1.5"
                    className="transition-all duration-300 group-hover:scale-110"
                  />

                  <g className="pointer-events-none select-none">
                    <text
                      x={xVal}
                      y={textY}
                      textAnchor="middle"
                      fill="rgba(0,0,0,0.9)"
                      fontSize="7.5px"
                      fontWeight="bold"
                      stroke="#030303"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      className="font-mono uppercase tracking-wider"
                    >
                      {node.name}
                    </text>
                    <text
                      x={xVal}
                      y={textY}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
                      fontSize="7.5px"
                      fontWeight="bold"
                      className="font-mono uppercase tracking-wider transition-colors duration-200"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ── 8. GANTT / TIMELINE ── */}
      {type === 'gantt' && (
        <div className="h-full w-full bg-neutral-950 border border-white/5 rounded-xl p-3 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-12 gap-1 text-[8px] font-bold text-white/35 border-b border-white/5 pb-1 text-center">
            <div className="col-span-4 text-left">Timeline track</div>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="col-span-1 border-l border-white/5">W{idx + 1}</div>
            ))}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {data.map((node, idx) => {
              const startWeek = node.start || 0;
              const duration = node.duration || 2;
              return (
                <div key={idx} className="grid grid-cols-12 gap-1 items-center">
                  <div className="col-span-4 text-[9px] font-semibold text-white/80 truncate text-left">{node.name}</div>
                  <div className="col-span-8 grid grid-cols-8 gap-1 h-5 items-center relative">
                    <div
                      onClick={() => onNodeClick && onNodeClick(node)}
                      className="h-3.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-[7px] font-bold text-white flex items-center px-1.5 cursor-pointer transition-all truncate"
                      style={{
                        gridColumnStart: startWeek + 1,
                        gridColumnEnd: startWeek + duration + 1
                      }}
                    >
                      {node.value}% Done
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 9. HEATMAP ── */}
      {type === 'heatmap' && (
        <div className="h-full w-full grid grid-cols-7 gap-1.5 p-2 bg-neutral-950/20 border border-white/5 rounded-xl">
          {data.map((node, idx) => {
            const isHovered = hoveredIndex === idx;
            // Shading intensity depending on percentage load value (0-100)
            const brightness = Math.min(Math.max(node.value, 10), 100);
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onNodeClick && onNodeClick(node)}
                className="aspect-square rounded border transition-all duration-200 cursor-pointer flex flex-col justify-center items-center relative"
                style={{
                  backgroundColor: `rgba(16, 185, 129, ${brightness / 100})`,
                  borderColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(16, 185, 129, 0.15)',
                  transform: isHovered ? 'scale(1.08)' : 'none',
                  zIndex: isHovered ? 10 : 1
                }}
              >
                {isHovered && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-neutral-950 border border-white/10 rounded text-[8px] font-mono text-white whitespace-nowrap shadow-xl z-30">
                    {node.name}: <span className="font-bold text-emerald-400">{node.value}%</span>
                  </div>
                )}
                <span className="text-[7px] font-mono text-white/80">{node.value}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 10. CONCENTRIC ORBIT CLIENT MAP ── */}
      {type === 'orbit' && (
        <div className="h-full w-full relative bg-neutral-950 rounded-xl border border-white/5 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 240">
            {/* Concentric rings */}
            {[45, 80, 115].map((r, i) => (
              <circle
                key={i}
                cx="200"
                cy="120"
                r={r}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            ))}

            {/* Orbit lines and animated particles */}
            {data.map((node, idx) => {
              const radius = [45, 80, 115][idx % 3];
              const angle = (idx * 2 * Math.PI) / data.length - Math.PI / 4;
              const xVal = 200 + radius * Math.cos(angle);
              const yVal = 120 + radius * Math.sin(angle);
              const dotColor = node.color || '#8B5CF6';

              return (
                <g key={`orbit-links-${idx}`}>
                  <line
                    x1="200"
                    y1="120"
                    x2={xVal}
                    y2={yVal}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <circle r="2.5" fill={dotColor} className="filter drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]">
                    <animate attributeName="cx" from="200" to={xVal} dur={`${1.6 + idx * 0.4}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" from="120" to={yVal} dur={`${1.6 + idx * 0.4}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Core Node */}
            <circle cx="200" cy="120" r="15" fill="#FFFFFF" className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <text x="200" y="123" fill="#000000" fontSize="7px" fontWeight="900" textAnchor="middle" className="font-mono tracking-wider">CORE</text>

            {/* Client Orbit Nodes */}
            {data.map((node, idx) => {
              const radius = [45, 80, 115][idx % 3];
              const angle = (idx * 2 * Math.PI) / data.length - Math.PI / 4;
              const xVal = 200 + radius * Math.cos(angle);
              const yVal = 120 + radius * Math.sin(angle);
              const isHovered = hoveredIndex === idx;
              const dotColor = node.color || '#8B5CF6';
              const textY = yVal < 120 ? yVal - 14 : yVal + 17;

              return (
                <g 
                  key={idx}
                  onClick={() => onNodeClick && onNodeClick(node)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isHovered ? 14 : 9}
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="1.5"
                    opacity={isHovered ? 0.6 : 0.3}
                    className="transition-all duration-300"
                  >
                    <animate attributeName="r" values={`${isHovered ? 9 : 7};${isHovered ? 16 : 13}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
                  </circle>

                  <circle
                    cx={xVal}
                    cy={yVal}
                    r="6"
                    fill={dotColor}
                    stroke="#030303"
                    strokeWidth="1.5"
                  />

                  <g className="pointer-events-none select-none">
                    <text
                      x={xVal}
                      y={textY}
                      textAnchor="middle"
                      fill="rgba(0,0,0,0.9)"
                      fontSize="7px"
                      fontWeight="bold"
                      stroke="#030303"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      className="font-mono uppercase tracking-wider"
                    >
                      {node.name}
                    </text>
                    <text
                      x={xVal}
                      y={textY}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.6)'}
                      fontSize="7px"
                      fontWeight="bold"
                      className="font-mono uppercase tracking-wider transition-colors duration-200"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* ── 11. HORIZONTAL WORKFLOW FLOWCHART ── */}
      {type === 'workflow' && (
        <div className="h-full w-full relative bg-neutral-950 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Connection lines and markers */}
            {data.map((_, idx) => {
              if (idx === data.length - 1) return null;
              const startX = (idx / (data.length - 1)) * 260 + 70;
              const nextX = ((idx + 1) / (data.length - 1)) * 260 + 70;
              const yVal = 100;
              const dotColor = ['#3B82F6', '#F59E0B', '#10B981'][idx % 3];

              return (
                <g key={`flow-links-${idx}`}>
                  <line
                    x1={startX}
                    y1={yVal}
                    x2={nextX}
                    y2={yVal}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                  <line
                    x1={startX}
                    y1={yVal}
                    x2={nextX}
                    y2={yVal}
                    stroke={`url(#lineGlowGrad_${colorTheme === 'default' ? 'admin' : colorTheme})`}
                    strokeWidth="2"
                    strokeDasharray="8, 20"
                    strokeDashoffset="0"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.5s" repeatCount="indefinite" />
                  </line>
                </g>
              );
            })}

            {/* Workflow steps */}
            {data.map((node, idx) => {
              const xVal = data.length > 1 ? (idx / (data.length - 1)) * 260 + 70 : 200;
              const yVal = 100;
              const isHovered = hoveredIndex === idx;
              const dotColor = node.color || ['#3B82F6', '#F59E0B', '#10B981'][idx % 3];

              return (
                <g 
                  key={idx}
                  onClick={() => onNodeClick && onNodeClick(node)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={xVal}
                    cy={yVal}
                    r={isHovered ? 20 : 16}
                    fill="#030303"
                    stroke={dotColor}
                    strokeWidth="2"
                    className="transition-all duration-300 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.05)]"
                  />
                  
                  {isHovered && (
                    <circle
                      cx={xVal}
                      cy={yVal}
                      r="24"
                      fill="none"
                      stroke={dotColor}
                      strokeWidth="1"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Icon representations or numbers */}
                  <text
                    x={xVal}
                    y={yVal + 3}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9px"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    0{idx + 1}
                  </text>

                  {/* Node Name labels */}
                  <g className="pointer-events-none select-none">
                    <text
                      x={xVal}
                      y={yVal + 32}
                      textAnchor="middle"
                      fill="rgba(0,0,0,0.9)"
                      fontSize="7.5px"
                      fontWeight="bold"
                      stroke="#030303"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      className="font-mono uppercase tracking-wider"
                    >
                      {node.name}
                    </text>
                    <text
                      x={xVal}
                      y={yVal + 32}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.65)'}
                      fontSize="7.5px"
                      fontWeight="bold"
                      className="font-mono uppercase tracking-wider transition-colors duration-200"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
