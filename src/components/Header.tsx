import React from 'react';
import {
  Menu,
  SlidersHorizontal,
  RefreshCw,
  Smartphone,
  Monitor,
  Database,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Key
} from 'lucide-react';
import { SupabaseProject } from '../types';
import { formatCountdown } from '../utils';
import { SupanIcon } from './SupanIcon';

interface HeaderProps {
  currentProject: SupabaseProject;
  projects: SupabaseProject[];
  onSelectProject: (project: SupabaseProject) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefreshSec: number;
  countdown: number;
  onOpenConfig: () => void;
  onOpenSimulator: () => void;
  onOpenBuildApk?: () => void;
  isConnectedLive: boolean;
  latencyMs?: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  isMobileFrame,
  onToggleFrame,
  isRefreshing,
  onRefresh,
  autoRefreshSec,
  countdown,
  onOpenConfig,
  onOpenSimulator,
  onOpenBuildApk,
  isConnectedLive,
  latencyMs
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);

  return (
    <header className="w-full bg-[#18191d] border-b border-[#282a32] px-4 py-3 text-white flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Left side: Hamburger menu & Project Selector */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSimulator}
          title="Buka Panel Simulator & Kontrol"
          className="p-2 rounded-xl bg-[#23252d] hover:bg-[#2e313b] text-emerald-400 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center space-x-2 bg-[#22242c] hover:bg-[#2a2c36] px-3 py-1.5 rounded-xl border border-[#2e313c] text-sm font-medium transition-all"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[130px] sm:max-w-[180px] font-semibold text-gray-100">
              {currentProject.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#1f2128] border border-[#323542] rounded-2xl shadow-2xl z-50 py-2 overflow-hidden">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#2d303b]">
                Pilih Proyek Supabase
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs flex items-center justify-between hover:bg-[#282b35] transition-colors ${
                    p.id === currentProject.id ? 'bg-emerald-950/40 text-emerald-400 font-medium' : 'text-gray-300'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-[10px] text-gray-400">{p.region} • {p.ref}</span>
                  </div>
                  {p.id === currentProject.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Title or Status badge with SUPAN APK Icon */}
      <div className="hidden md:flex items-center space-x-2.5">
        <div className="relative group cursor-pointer" title="Supan App Icon">
          <SupanIcon size={30} variant="app-icon" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#18191d]" />
        </div>
        <h1 className="text-base font-bold tracking-tight text-gray-100 flex items-center gap-1.5">
          <span>SUPAN</span>
          <span className="text-xs text-gray-400 font-normal">| Project Dashboard</span>
        </h1>
        {isConnectedLive ? (
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              LIVE API
            </span>
            {latencyMs !== undefined && (
              <div 
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full border ${
                  latencyMs === null 
                    ? 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                    : latencyMs < 200 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : latencyMs < 500
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
                title="API Latency"
              >
                <div className={`w-2 h-2 rounded-full ${
                  latencyMs === null 
                    ? 'bg-gray-500' 
                    : latencyMs < 200 
                      ? 'bg-emerald-500 animate-pulse' 
                      : latencyMs < 500
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-rose-500 animate-pulse'
                }`} />
                <span className="text-[10px] font-bold font-mono">
                  {latencyMs === null ? '---' : `${latencyMs}ms`}
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="bg-amber-500/15 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
            REALTIME SIMULATED
          </span>
        )}
      </div>

      {/* Right side: View Switcher, Build APK, Refresh, Config */}
      <div className="flex items-center space-x-2">
        {/* Build APK Button with Android Icon */}
        {onOpenBuildApk && (
          <button
            onClick={onOpenBuildApk}
            title="Build APK Android Supan"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current text-emerald-400 shrink-0" viewBox="0 0 24 24">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9993.9993-.9993.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592c.1213-.2103.0494-.4786-.1609-.5999-.2103-.1213-.4786-.0494-.5999.1609l-2.0298 3.5155C15.5866 8.3582 13.8504 8 12 8s-3.5866.3582-5.0886.9387L4.8816 5.4231c-.1213-.2103-.3896-.2822-.5999-.1609-.2103.1213-.2822.3896-.1609.5999l1.9973 3.4592C2.688 11.0768.3438 14.2818.0483 18h23.9034c-.2955-3.7182-2.6397-6.9232-6.0697-8.6786z"/>
            </svg>
            <span className="hidden sm:inline">Build APK</span>
          </button>
        )}

        {/* Frame Toggle (Mobile App View vs Wide Responsive) */}
        <button
          onClick={onToggleFrame}
          title={isMobileFrame ? "Beralih ke Tampilan Desktop" : "Beralih ke Tampilan Mobile App"}
          className={`p-2 rounded-xl transition-all border ${
            isMobileFrame
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-[#22242c] border-[#2e313c] text-gray-400 hover:text-gray-200'
          }`}
        >
          {isMobileFrame ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        </button>

        {/* Live Sync Status & Manual Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title={`Perbarui Data (${formatCountdown(countdown)} auto-refresh)`}
          className="flex items-center space-x-1.5 bg-[#22242c] hover:bg-[#2b2d38] border border-[#2e313c] px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-300 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline text-[11px] font-semibold text-gray-300">
            {formatCountdown(countdown)}
          </span>
        </button>

        {/* Supabase Management API Credential Modal Button */}
        <button
          onClick={onOpenConfig}
          title="Pengaturan Koneksi API Supabase"
          className="p-2 rounded-xl bg-[#22242c] hover:bg-[#2c2f3a] border border-[#2e313c] text-gray-300 hover:text-white transition-colors"
        >
          <Key className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Filter/Settings icon */}
        <button
          onClick={onOpenSimulator}
          title="Pengaturan Metrik"
          className="p-2 rounded-xl bg-[#22242c] hover:bg-[#2c2f3a] border border-[#2e313c] text-gray-300 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </header>
  );
};
