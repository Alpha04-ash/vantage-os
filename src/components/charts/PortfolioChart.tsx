"use client";

import React, { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function PortfolioChart({ data }: { data: any[] }) {
  // Add a bit of "noise" to the chart to make it feel alive and high-frequency
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      value: d.value + (Math.random() - 0.5) * 200 // Subtle live variation
    }));
  }, [data]);

  return (
    <div className="w-full h-[250px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F0B90B" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#F0B90B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            hide 
            domain={['auto', 'auto']} 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length && payload[0]?.value !== undefined) {
                return (
                  <div className="bg-[#1E2026] p-3 border border-[#2B2F36] rounded-xl shadow-2xl">
                    <p className="text-[10px] font-bold uppercase text-[#848E9C] mb-1">Portfolio Value</p>
                    <p className="text-sm font-bold font-mono text-[#F0B90B]">${Number(payload[0].value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#F0B90B" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
