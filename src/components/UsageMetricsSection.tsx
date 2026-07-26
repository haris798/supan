import React from 'react';
import { Menu, Lock, Folder, Zap, Layers, Sparkles } from 'lucide-react';
import { UsageMetrics } from '../types';

interface UsageMetricsSectionProps {
  metrics: UsageMetrics;
  onOpenDetailModal?: (metricType: string) => void;
  onOpenMenu?: () => void;
}

export const UsageMetricsSection: React.FC<UsageMetricsSectionProps> = ({
  metrics,
  onOpenDetailModal,
  onOpenMenu
}) => {
  // Format numbers nicely like 9.3K
  const formatValue = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm font-semibold text-gray-300 tracking-wide flex items-center space-x-1.5">
          <span>Usage metrics (24h)</span>
        </h2>
        <button
          onClick={onOpenMenu}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#252832] transition-colors"
          title="Opsi Metrik Penggunaan"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of 4 compact cards matching screenshot */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: REST API */}
        <div
          onClick={() => onOpenDetailModal && onOpenDetailModal('REST API')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {formatValue(metrics.restApiRequests)}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">REST API</span>
          </div>
        </div>

        {/* Card 2: Auth */}
        <div
          onClick={() => onOpenDetailModal && onOpenDetailModal('Auth')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {metrics.authUsersCount}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Auth</span>
          </div>
        </div>

        {/* Card 3: Storage */}
        <div
          onClick={() => onOpenDetailModal && onOpenDetailModal('Storage')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Folder className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {metrics.storageFilesCount}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Storage</span>
          </div>
        </div>

        {/* Card 4: Realtime */}
        <div
          onClick={() => onOpenDetailModal && onOpenDetailModal('Realtime')}
          className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {metrics.realtimeConnections}
            </span>
            <span className="block text-xs font-medium text-gray-400 truncate">Realtime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
