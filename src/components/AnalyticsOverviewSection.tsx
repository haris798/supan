import React from 'react';
import { Menu, Database, Link2, Gauge, LayoutGrid, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalyticsOverview } from '../types';
import { formatGrowthMb } from '../utils';

interface AnalyticsOverviewSectionProps {
  analytics: AnalyticsOverview;
  onSeeMore: () => void;
  onOpenCardDetail?: (cardName: string) => void;
}

export const AnalyticsOverviewSection: React.FC<AnalyticsOverviewSectionProps> = ({
  analytics,
  onSeeMore,
  onOpenCardDetail
}) => {
  // Format bytes to MB/GB
  const formatDbSize = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    return `${Math.round(bytes / 1048576)} MB`;
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Subtitle Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-gray-300 tracking-wide">
            Analytics overview
          </h2>
          <Menu className="w-4 h-4 text-gray-500 hidden sm:inline" />
        </div>

        <button
          onClick={onSeeMore}
          className="text-xs font-semibold text-[#00e676] hover:text-emerald-300 flex items-center space-x-0.5 transition-colors group"
        >
          <span>See more</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid of 4 cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: DB size */}
        <div
          onClick={() => onOpenCardDetail && onOpenCardDetail('DB size')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Database className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {formatDbSize(analytics.dbSizeBytes)}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">DB size</span>
          </div>
        </div>

        {/* Card 2: Connections */}
        <div
          onClick={() => onOpenCardDetail && onOpenCardDetail('Connections')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Link2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {analytics.connectionsCount}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Connections</span>
          </div>
        </div>

        {/* Card 3: Cache hit rate */}
        <div
          onClick={() => onOpenCardDetail && onOpenCardDetail('Cache hit')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {analytics.cacheHitRate.toFixed(1)}%
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Cache hit</span>
          </div>
        </div>

        {/* Card 4: Tables */}
        <div
          onClick={() => onOpenCardDetail && onOpenCardDetail('Tables')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {analytics.tablesCount}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Tables</span>
          </div>
        </div>
      </div>

      {/* Card 5: Total DB growth (24h) — full width */}
      <div
        onClick={() => onOpenCardDetail && onOpenCardDetail('DB growth')}
        className="mt-3 bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center justify-between space-x-3 transition-all cursor-pointer shadow-sm group"
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span
              className={`block text-base sm:text-lg font-bold tracking-wide truncate ${
                (analytics.dbGrowth24hMb ?? 0) > 0.05
                  ? 'text-emerald-400'
                  : (analytics.dbGrowth24hMb ?? 0) < -0.05
                  ? 'text-rose-400'
                  : 'text-white'
              }`}
            >
              {formatGrowthMb(analytics.dbGrowth24hMb ?? 0)}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">DB growth (24h)</span>
          </div>
        </div>
        {(analytics.dbGrowth24hMb ?? 0) > 0.05 ? (
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
        ) : (analytics.dbGrowth24hMb ?? 0) < -0.05 ? (
          <TrendingDown className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
        ) : (
          <TrendingUp className="w-4 h-4 text-gray-600 shrink-0" />
        )}
      </div>
    </div>
  );
};
