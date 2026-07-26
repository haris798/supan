import React from 'react';
import { X, TrendingUp, Activity, Database, Zap, Download, RefreshCw, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { AnalyticsOverview, UsageMetrics, MetricHistoryPoint } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: AnalyticsOverview;
  metrics: UsageMetrics;
  history: MetricHistoryPoint[];
  onRefresh: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  analytics,
  metrics,
  history,
  onRefresh
}) => {
  const [timeRange, setTimeRange] = React.useState<'1h' | '24h' | '7d'>('24h');
  const [activeTab, setActiveTab] = React.useState<'api' | 'db' | 'cache' | 'storage'>('api');

  if (!isOpen) return null;

  const handleExportData = () => {
    const report = {
      timestamp: new Date().toISOString(),
      analytics,
      usageMetrics: metrics,
      historyDataPoints: history.length
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase-metrics-report-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a1c22] border border-[#2e313d] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2a2d39] flex items-center justify-between bg-[#1f2128]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-100">Analytics & Performance Overview</h2>
              <p className="text-xs text-gray-400">Riwayat metrik penggunaan 24 jam proyek Supabase</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportData}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#282b36] hover:bg-[#323644] text-xs font-semibold text-gray-200 transition-colors border border-[#363a49]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#282b36] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Quick Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#22242d] p-3.5 rounded-2xl border border-[#2c303c]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Total REST API (24h)</span>
              <p className="text-lg font-bold text-white mt-0.5">{metrics.restApiRequests.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-400 font-medium">+{metrics.restApiTrend}% vs kemarin</span>
            </div>

            <div className="bg-[#22242d] p-3.5 rounded-2xl border border-[#2c303c]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Database Size</span>
              <p className="text-lg font-bold text-white mt-0.5">{Math.round(analytics.dbSizeBytes / 1048576)} MB</p>
              <span className="text-[10px] text-gray-400 font-medium">{analytics.tablesCount} Tabel terdaftar</span>
            </div>

            <div className="bg-[#22242d] p-3.5 rounded-2xl border border-[#2c303c]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Cache Hit Rate</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">{analytics.cacheHitRate.toFixed(1)}%</p>
              <span className="text-[10px] text-emerald-400 font-medium">Performa Optimal</span>
            </div>

            <div className="bg-[#22242d] p-3.5 rounded-2xl border border-[#2c303c]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase">Koneksi Aktif</span>
              <p className="text-lg font-bold text-white mt-0.5">{analytics.connectionsCount} Pool</p>
              <span className="text-[10px] text-gray-400 font-medium">Max Limit: 60</span>
            </div>
          </div>

          {/* Chart Controls & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2d39] pb-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'api'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#22242d] text-gray-400 hover:text-white'
                }`}
              >
                REST API Requests
              </button>
              <button
                onClick={() => setActiveTab('db')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'db'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#22242d] text-gray-400 hover:text-white'
                }`}
              >
                DB Connections
              </button>
              <button
                onClick={() => setActiveTab('cache')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'cache'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#22242d] text-gray-400 hover:text-white'
                }`}
              >
                Cache Hit Rate
              </button>
              <button
                onClick={() => setActiveTab('storage')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'storage'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-[#22242d] text-gray-400 hover:text-white'
                }`}
              >
                Ukuran DB (MB)
              </button>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#22242d] p-1 rounded-xl border border-[#2c303c] self-start sm:self-auto">
              {(['1h', '24h', '7d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    timeRange === range
                      ? 'bg-[#313543] text-emerald-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="bg-[#15171c] p-4 rounded-2xl border border-[#292c37] h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'api' ? (
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262935" />
                  <XAxis dataKey="timeLabel" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333746', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="restApi" stroke="#00e676" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApi)" name="REST API Req/h" />
                </AreaChart>
              ) : activeTab === 'db' ? (
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262935" />
                  <XAxis dataKey="timeLabel" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333746', borderRadius: '12px', color: '#fff' }}
                  />
                  <Line type="stepAfter" dataKey="connections" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} name="Koneksi DB" />
                </LineChart>
              ) : activeTab === 'cache' ? (
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorCache" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262935" />
                  <XAxis dataKey="timeLabel" stroke="#6b7280" fontSize={11} />
                  <YAxis domain={[99, 100]} stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333746', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cacheHit" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCache)" name="Cache Hit %" />
                </AreaChart>
              ) : (
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorDb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262935" />
                  <XAxis dataKey="timeLabel" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333746', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="dbSizeMb" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDb)" name="Ukuran DB (MB)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#2a2d39] bg-[#1a1c22] flex items-center justify-between text-xs text-gray-400">
          <span>Otomatis diperbarui setiap detik</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all"
          >
            Tutup Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
