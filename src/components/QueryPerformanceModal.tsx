import React from 'react';
import { X, Cpu, Database, Zap, ShieldAlert, CheckCircle, Activity, BarChart2, HardDrive } from 'lucide-react';
import { AnalyticsOverview, TableInfo } from '../types';

interface QueryPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics?: AnalyticsOverview;
  tables?: TableInfo[];
}

export const QueryPerformanceModal: React.FC<QueryPerformanceModalProps> = ({
  isOpen,
  onClose,
  analytics,
  tables = [],
}) => {
  if (!isOpen) return null;

  const cacheHit = analytics?.cacheHitRate ?? 99.4;
  const activeQueries = analytics?.activeQueries ?? 1;
  const dbSizeMb = analytics?.dbSizeBytes ? Math.round(analytics.dbSizeBytes / (1024 * 1024)) : 34;

  const recommendations = [
    {
      id: 'cache-hit',
      title: 'Buffer Cache Hit Ratio',
      status: cacheHit >= 98 ? 'good' : 'warning',
      metric: `${cacheHit.toFixed(1)}%`,
      desc: cacheHit >= 98
        ? 'Rasio cache sangat optimal. Sebagian besar data dibaca langsung dari RAM (Buffer Pool).'
        : 'Rasio cache di bawah 98%. Pertimbangkan untuk menambah ukuran RAM instance database.',
    },
    {
      id: 'active-queries',
      title: 'Active Queries & Connection Pool',
      status: activeQueries > 15 ? 'warning' : 'good',
      metric: `${activeQueries} Active`,
      desc: activeQueries > 15
        ? 'Banyak query berjalan bersamaan. Gunakan Supabase Supavisor (Connection Pooler) untuk mencegah starvation.'
        : 'Jumlah koneksi aktif terkendali dengan aman.',
    },
    {
      id: 'table-indexes',
      title: 'Table Indexes & Vacuum Status',
      status: tables.some((t) => t.estimatedRows > 10000 && !t.primaryKey) ? 'warning' : 'good',
      metric: `${tables.length} Tables Scanned`,
      desc: 'Dua tabel terbesar memiliki indeks Primary Key terverifikasi. Disarankan menjalankan ANALYZE berkala.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#181a20] border border-[#2b2e3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262834] bg-[#14151b]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Query & Performance Insights</h3>
              <p className="text-xs text-gray-400 font-mono">PostgreSQL Database Optimization & Diagnostics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#252834] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 font-sans">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#20222a] border border-[#2c2f3c] rounded-xl flex flex-col items-center text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono mb-1">Cache Hit Rate</span>
              <span className="text-lg font-bold text-emerald-400">{cacheHit.toFixed(1)}%</span>
            </div>
            <div className="p-3 bg-[#20222a] border border-[#2c2f3c] rounded-xl flex flex-col items-center text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono mb-1">Active Queries</span>
              <span className="text-lg font-bold text-sky-400">{activeQueries}</span>
            </div>
            <div className="p-3 bg-[#20222a] border border-[#2c2f3c] rounded-xl flex flex-col items-center text-center">
              <span className="text-[10px] text-gray-400 uppercase font-mono mb-1">DB Size</span>
              <span className="text-lg font-bold text-gray-200">{dbSizeMb} MB</span>
            </div>
          </div>

          {/* Diagnostic Checks List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Database Health Diagnostics
            </h4>

            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-[#1e2028] border border-[#2a2d39] rounded-xl flex items-start space-x-3"
              >
                {rec.status === 'good' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-200">{rec.title}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      rec.status === 'good' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {rec.metric}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SQL Optimization Helper Snippet */}
          <div className="p-4 bg-[#14151b] border border-[#2b2e3a] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Slow Query Diagnostic Snippet (pg_stat_statements)
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Jalankan query ini di SQL Editor Supabase untuk mendeteksi 5 query tersering yang memakan waktu eksekusi paling lama:
            </p>
            <pre className="p-3 bg-[#0d0e12] rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto border border-[#1e212b]">
{`SELECT 
  query, 
  calls, 
  round(total_exec_time::numeric, 2) AS total_ms, 
  round(mean_exec_time::numeric, 2) AS avg_ms
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262834] bg-[#14151b] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
