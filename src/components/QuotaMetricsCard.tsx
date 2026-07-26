import React from 'react';
import { Search, HelpCircle, Lightbulb } from 'lucide-react';
import { AnalyticsOverview, UsageMetrics } from '../types';

interface QuotaMetricsCardProps {
  analytics?: AnalyticsOverview;
  metrics?: UsageMetrics;
  onOpenSearch?: () => void;
  onOpenHelp?: () => void;
  onOpenTips?: () => void;
}

interface ProgressRingProps {
  percentage: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 20,
  strokeWidth = 2.5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90 shrink-0">
      {/* Background circle track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="stroke-[#353846]"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="stroke-emerald-400 transition-all duration-500 ease-out"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
    </svg>
  );
};

export const QuotaMetricsCard: React.FC<QuotaMetricsCardProps> = ({
  analytics,
  metrics,
  onOpenSearch,
  onOpenHelp,
  onOpenTips,
}) => {
  // Calculate dynamic database size in MB if available
  const dbSizeMb = analytics?.dbSizeBytes
    ? Math.round(analytics.dbSizeBytes / (1024 * 1024))
    : 44;
  
  // Calculate percentages for ring indicators
  const egressMb = 13;
  const egressLimitMb = 5 * 1024; // 5 GB
  const egressPct = Math.max(1, Math.min(100, (egressMb / egressLimitMb) * 100));

  const dbLimitMb = 500;
  const dbPct = Math.max(2, Math.min(100, (dbSizeMb / dbLimitMb) * 100));

  const mau = metrics?.authUsersCount ?? 1;
  const mauLimit = 50000;
  const mauPct = Math.max(1, Math.min(100, (mau / mauLimit) * 100));

  const storageGb = metrics?.storageFilesCount ? (metrics.storageFilesCount * 0.05).toFixed(1) : "0";
  const storageLimitGb = 1;
  const storagePct = parseFloat(storageGb) > 0 ? (parseFloat(storageGb) / storageLimitGb) * 100 : 0;

  const quotaItems = [
    {
      id: 'egress',
      label: 'EGRESS',
      value: `${egressMb} MB`,
      limit: '5 GB',
      percentage: egressPct,
    },
    {
      id: 'db_size',
      label: 'DATABASE SIZE',
      value: `${dbSizeMb} MB`,
      limit: '500 MB',
      percentage: dbPct,
    },
    {
      id: 'mau',
      label: 'MONTHLY ACTIVE USERS',
      value: `${mau.toLocaleString()}`,
      limit: '50,000',
      percentage: mauPct,
    },
    {
      id: 'storage',
      label: 'FILE STORAGE',
      value: `${storageGb} GB`,
      limit: '1 GB',
      percentage: storagePct,
    },
  ];

  return (
    <div className="relative mb-6">
      {/* Main Quota Container Card */}
      <div className="bg-[#18191e] border border-[#272935] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
        {quotaItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between text-xs font-mono ${
              index !== 0 ? 'pt-3.5 border-t border-dashed border-[#282b38]' : ''
            }`}
          >
            {/* Left: Progress Ring + Uppercase Label */}
            <div className="flex items-center space-x-3 truncate pr-2">
              <ProgressRing percentage={item.percentage} size={20} strokeWidth={2.5} />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-300 uppercase truncate">
                {item.label}
              </span>
            </div>

            {/* Right: Value / Limit */}
            <div className="flex items-center space-x-1.5 shrink-0 text-[11px] sm:text-xs font-mono">
              <span className="font-bold text-gray-100">{item.value}</span>
              <span className="text-gray-500 font-normal">/</span>
              <span className="text-gray-400 font-medium">{item.limit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Capsule Action Floating Toolbar (Matching the picture overlay) */}
      <div className="flex justify-center -mt-4 relative z-10">
        <div className="bg-[#1b1c22]/95 backdrop-blur-md border border-[#2d303e] rounded-full px-3 py-1.5 shadow-2xl flex items-center space-x-2">
          <button
            onClick={onOpenSearch}
            title="Cari Metrik & Tabel"
            className="w-8 h-8 rounded-full border border-[#333748] flex items-center justify-center text-gray-300 hover:text-white hover:border-emerald-400/50 hover:bg-[#252834] transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenHelp}
            title="Bantuan Quota Supabase"
            className="w-8 h-8 rounded-full border border-[#333748] flex items-center justify-center text-gray-300 hover:text-white hover:border-emerald-400/50 hover:bg-[#252834] transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenTips}
            title="Tips Optimasi Database"
            className="w-8 h-8 rounded-full border border-[#333748] flex items-center justify-center text-gray-300 hover:text-white hover:border-emerald-400/50 hover:bg-[#252834] transition-all"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
