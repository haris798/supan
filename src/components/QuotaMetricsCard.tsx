import React from 'react';
import { AnalyticsOverview, UsageMetrics } from '../types';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface QuotaMetricsCardProps {
  analytics?: AnalyticsOverview;
  metrics?: UsageMetrics;
}

interface ProgressRingProps {
  percentage: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = React.memo(({
  percentage,
  size = 20,
  strokeWidth = 2.5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColor = percentage >= 90 
    ? 'stroke-rose-500' 
    : percentage >= 80 
    ? 'stroke-amber-400' 
    : 'stroke-emerald-400';

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
        className={`${strokeColor} transition-all duration-500 ease-out`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
    </svg>
  );
});

export const QuotaMetricsCard: React.FC<QuotaMetricsCardProps> = React.memo(({
  analytics,
  metrics,
}) => {
  // Calculate dynamic database size in MB if available
  const dbSizeMb = analytics?.dbSizeBytes
    ? Math.round(analytics.dbSizeBytes / (1024 * 1024))
    : 0;
  
  const egressMb = 0;
  const egressLimitMb = 5 * 1024; // 5 GB
  const egressPct = Math.max(0, Math.min(100, (egressMb / egressLimitMb) * 100));

  const dbLimitMb = 500;
  const dbPct = Math.max(0, Math.min(100, (dbSizeMb / dbLimitMb) * 100));

  const mau = metrics?.authUsersCount ?? 0;
  const mauLimit = 50000;
  const mauPct = Math.max(0, Math.min(100, (mau / mauLimit) * 100));

  const storageGb = metrics?.storageFilesCount ? (metrics.storageFilesCount * 0.05).toFixed(1) : "0";
  const storageLimitGb = 1;
  const storagePct = parseFloat(storageGb) > 0 ? (parseFloat(storageGb) / storageLimitGb) * 100 : 0;

  const maxUsagePct = Math.max(egressPct, dbPct, mauPct, storagePct);
  const isWarning = maxUsagePct >= 80 && maxUsagePct < 90;
  const isCritical = maxUsagePct >= 90;

  const quotaItems = [
    {
      id: 'egress',
      label: 'Egress',
      value: `${egressMb} MB`,
      limit: '5 GB',
      percentage: egressPct,
    },
    {
      id: 'db_size',
      label: 'Database Size',
      value: `${dbSizeMb} MB`,
      limit: '500 MB',
      percentage: dbPct,
    },
    {
      id: 'mau',
      label: 'Monthly Active Users',
      value: `${mau.toLocaleString()}`,
      limit: '50,000',
      percentage: mauPct,
    },
    {
      id: 'storage',
      label: 'File Storage',
      value: `${storageGb} GB`,
      limit: '1 GB',
      percentage: storagePct,
    },
  ];

  return (
    <div className="relative mb-6">
      {/* Threshold Alert Warning Banner if usage > 80% */}
      {(isWarning || isCritical) && (
        <div className={`mb-3 p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
          isCritical 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {isCritical 
                ? 'Peringatan Kuota Kritis: Penggunaan database melebihi 90% dari kuota!'
                : 'Peringatan Kuota: Penggunaan resource mendekati batas 80%.'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/30">
            {isCritical ? 'CRITICAL' : 'WARNING'}
          </span>
        </div>
      )}

      {/* Main Quota Container Card */}
      <div className="bg-[#18191e] border border-[#272935] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#272935] pb-2.5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Usage</span>
          <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>{isCritical ? 'Action Required' : isWarning ? 'Nearing Limits' : 'Healthy Limits'}</span>
          </span>
        </div>

        {quotaItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between text-xs font-mono ${
              index !== 0 ? 'pt-3.5 border-t border-dashed border-[#282b38]' : ''
            }`}
          >
            {/* Left: Progress Ring + Title Case Label */}
            <div className="flex items-center space-x-3 truncate pr-2">
              <ProgressRing percentage={item.percentage} size={20} strokeWidth={2.5} />
              <span className="text-[11px] sm:text-xs font-semibold text-gray-300 truncate">
                {item.label}
              </span>
            </div>

            {/* Right: Value / Limit */}
            <div className="flex items-center space-x-1.5 shrink-0 text-[11px] sm:text-xs font-mono">
              <span className={`font-bold ${
                item.percentage >= 90 ? 'text-rose-400' : item.percentage >= 80 ? 'text-amber-300' : 'text-gray-100'
              }`}>{item.value}</span>
              <span className="text-gray-500 font-normal">/</span>
              <span className="text-gray-400 font-medium">{item.limit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

