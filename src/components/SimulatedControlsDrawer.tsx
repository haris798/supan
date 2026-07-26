import React from 'react';
import { X, SlidersHorizontal, Zap, Plus, Database, RefreshCw, Activity, ShieldAlert, Sparkles } from 'lucide-react';
import { UsageMetrics, AnalyticsOverview, SupabaseProject } from '../types';

interface SimulatedControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: UsageMetrics;
  analytics: AnalyticsOverview;
  project: SupabaseProject;
  onUpdateMetrics: (updater: (prev: UsageMetrics) => UsageMetrics) => void;
  onUpdateAnalytics: (updater: (prev: AnalyticsOverview) => AnalyticsOverview) => void;
  onUpdateProject: (updater: (prev: SupabaseProject) => SupabaseProject) => void;
  autoRefreshSec: number;
  onChangeAutoRefreshSec: (sec: number) => void;
  onAddTable: () => void;
}

export const SimulatedControlsDrawer: React.FC<SimulatedControlsDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  analytics,
  project,
  onUpdateMetrics,
  onUpdateAnalytics,
  onUpdateProject,
  autoRefreshSec,
  onChangeAutoRefreshSec,
  onAddTable
}) => {
  if (!isOpen) return null;

  const handleSpikeTraffic = () => {
    onUpdateMetrics((prev) => ({
      ...prev,
      restApiRequests: prev.restApiRequests + 1250,
      realtimeConnections: prev.realtimeConnections + 3
    }));
    onUpdateAnalytics((prev) => ({
      ...prev,
      connectionsCount: prev.connectionsCount + 2,
      activeQueries: prev.activeQueries + 1
    }));
  };

  const handleSimulateNewUser = () => {
    onUpdateMetrics((prev) => ({
      ...prev,
      authUsersCount: prev.authUsersCount + 1
    }));
  };

  const handleSimulateDataInsert = () => {
    onUpdateAnalytics((prev) => ({
      ...prev,
      dbSizeBytes: prev.dbSizeBytes + 524288 // +512 kB
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1a1c22] border-l border-[#2e313d] w-full max-w-md h-full flex flex-col shadow-2xl text-white overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#2a2d39] flex items-center justify-between bg-[#1f2128]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">Simulator & Real-time Controls</h2>
              <p className="text-[11px] text-gray-400">Simulasikan event live untuk menguji UI dashboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#282b36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Quick Live Events
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleSpikeTraffic}
                className="w-full bg-[#22252f] hover:bg-[#2b2e3c] border border-[#2e3240] p-3 rounded-2xl flex items-center space-x-3 transition-colors text-left"
              >
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-100">Simulasikan Spike Trafik REST API</span>
                  <span className="text-[10px] text-gray-400 block">+1,250 REST API requests & +2 DB Connections</span>
                </div>
              </button>

              <button
                onClick={handleSimulateNewUser}
                className="w-full bg-[#22252f] hover:bg-[#2b2e3c] border border-[#2e3240] p-3 rounded-2xl flex items-center space-x-3 transition-colors text-left"
              >
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-100">Tambah User Auth Baru</span>
                  <span className="text-[10px] text-gray-400 block">Menambah +1 total pendaftaran user Supabase Auth</span>
                </div>
              </button>

              <button
                onClick={handleSimulateDataInsert}
                className="w-full bg-[#22252f] hover:bg-[#2b2e3c] border border-[#2e3240] p-3.5 rounded-2xl flex items-center space-x-3 transition-colors text-left"
              >
                <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-gray-100">Injeksi Batch Data (+512 kB)</span>
                  <span className="text-[10px] text-gray-400 block">Meningkatkan ukuran database di statistik realtime</span>
                </div>
              </button>
            </div>
          </div>

          {/* Auto Refresh Speed */}
          <div className="space-y-2 border-t border-[#2a2d39] pt-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Kecepatan Auto-Sync Realtime
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onChangeAutoRefreshSec(sec)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    autoRefreshSec === sec
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-[#22242d] border-[#2e313e] text-gray-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Project Status Switch */}
          <div className="space-y-2 border-t border-[#2a2d39] pt-4">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Status Proyek Supabase
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Active', 'Maintenance', 'Restoring', 'Paused'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateProject((prev) => ({ ...prev, status: st }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-colors ${
                    project.status === st
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                      : 'bg-[#22242d] border-[#2e313e] text-gray-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Table */}
          <div className="border-t border-[#2a2d39] pt-4">
            <button
              onClick={onAddTable}
              className="w-full py-2.5 rounded-xl bg-[#2a2d3a] hover:bg-[#343848] text-emerald-400 font-bold text-xs border border-emerald-500/20 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tabel Baru ke 'Largest Tables'</span>
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#2a2d39] bg-[#1f2128]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
