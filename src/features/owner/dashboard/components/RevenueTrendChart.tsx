"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HourlyTrendPoint } from "../types/dashboard.types";
import { formatPKR } from "@/lib/formatters";

interface RevenueTrendChartProps {
  data: HourlyTrendPoint[];
  className?: string;
}

export function RevenueTrendChart({ data, className }: RevenueTrendChartProps) {
  // Default active index is the point with isFigmaHighlighted (3p)
  const defaultIndex = React.useMemo(() => {
    const idx = data.findIndex((p) => p.isFigmaHighlighted);
    return idx >= 0 ? idx : 4;
  }, [data]);

  const [activeIndex, setActiveIndex] = React.useState<number>(defaultIndex);

  // Chart dimensions in SVG coordinates
  const svgWidth = 700;
  const svgHeight = 110;
  const paddingX = 35;
  const paddingTop = 25;
  const paddingBottom = 25;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingX * 2;

  // Calculate coordinates
  const coords = React.useMemo(() => {
    if (!data.length) return [];
    const minVal = Math.min(...data.map((d) => d.revenue));
    const maxVal = Math.max(...data.map((d) => d.revenue));
    const valRange = maxVal - minVal || 1;

    return data.map((item, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * chartWidth;
      // Invert Y so highest revenue is at the top
      const normalized = (item.revenue - minVal) / valRange;
      const y = svgHeight - paddingBottom - normalized * chartHeight;
      return { x, y, item, index: idx };
    });
  }, [data, chartWidth, chartHeight, svgHeight]);

  // Generate cubic Bezier SVG path
  const { pathString, areaPathString } = React.useMemo(() => {
    if (coords.length < 2) return { pathString: "", areaPathString: "" };

    let linePath = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const areaPath = `${linePath} L ${last.x},${svgHeight} L ${first.x},${svgHeight} Z`;

    return { pathString: linePath, areaPathString: areaPath };
  }, [coords, svgHeight]);

  const activeCoord = coords[activeIndex] || coords[0];

  return (
    <div className={cn("w-full flex flex-col relative select-none", className)}>
      {/* Chart SVG Canvas */}
      <div className="relative w-full h-[120px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Subtle soft gradient beneath curve */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.12" />
              <stop offset="85%" stopColor="var(--brand-primary)" stopOpacity="0.01" />
              <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path
            d={areaPathString}
            fill="url(#chartGradient)"
            className="transition-all duration-300"
          />

          {/* Main Trend Line */}
          <path
            d={pathString}
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Clickable/Hoverable Target Nodes */}
          {coords.map((coord) => (
            <g
              key={coord.item.hour}
              className="cursor-pointer group"
              onClick={() => setActiveIndex(coord.index)}
              onMouseEnter={() => setActiveIndex(coord.index)}
            >
              {/* Invisible large hover hit area */}
              <circle
                cx={coord.x}
                cy={coord.y}
                r="18"
                fill="transparent"
                className="cursor-pointer"
              />

              {/* Inactive subtle dot on hover */}
              {coord.index !== activeIndex && (
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="3.5"
                  fill="var(--brand-primary)"
                  className="opacity-0 group-hover:opacity-70 transition-opacity"
                />
              )}
            </g>
          ))}

          {/* Active / Highlighted Point (Figma Node 3382:12008) */}
          {activeCoord && (
            <g className="transition-all duration-200">
              {/* Outer soft ring */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="10"
                fill="var(--brand-primary)"
                fillOpacity="0.15"
              />
              {/* Solid dark core dot */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="7"
                fill="var(--brand-primary)"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Card (Figma Node 3382:12009) */}
        {activeCoord && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-150 -translate-x-1/2"
            style={{
              left: `${(activeCoord.x / svgWidth) * 100}%`,
              top: `${Math.max(0, (activeCoord.y / svgHeight) * 100 - 55)}%`,
            }}
          >
            <div className="bg-card border border-default shadow-md rounded-[4px] px-2.5 py-1.5 flex flex-col items-start whitespace-nowrap">
              <span className="font-sans text-[11px] text-body leading-none">
                {activeCoord.item.month || "Today"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-sans text-xs text-primary font-medium capitalize">
                  platform revenue
                </span>
                <span className="font-sans text-xs text-body">:</span>
                <span className="font-sans text-xs text-primary font-semibold">
                  {activeCoord.item.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hour Labels & Bottom Ticks (Figma Node 3382:11975) */}
      <div className="w-full flex items-center justify-between mt-1 pt-1 border-t border-default/40">
        {data.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.hour}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              className="flex-1 flex flex-col items-center gap-1 group py-0.5 cursor-pointer"
            >
              <div
                className={cn(
                  "w-full h-[2px] rounded-full transition-colors",
                  isActive
                    ? "bg-primary"
                    : "bg-default/60 group-hover:bg-primary/50"
                )}
              />
              <span
                className={cn(
                  "font-sans text-[10px] tracking-tight transition-colors",
                  isActive
                    ? "text-heading font-medium"
                    : "text-muted group-hover:text-body"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
