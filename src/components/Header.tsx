import React from 'react';
import {
  Menu,
  SlidersHorizontal,
  RefreshCw,
  Database,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Key,
  Sun,
  Moon,
  Plus,
  FolderGit2
} from 'lucide-react';
import { SupabaseProject, SupabaseProjectProfile } from '../types';
import { formatCountdown } from '../utils';

interface HeaderProps {
  currentProject: SupabaseProject;
  projects: (SupabaseProject | SupabaseProjectProfile)[];
  onSelectProject: (project: any) => void;
  onOpenAddProject?: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefreshSec: number;
  countdown: number;
  onOpenConfig: () => void;
  onOpenSimulator: () => void;
  onOpenBuildApk?: () => void;
  isConnectedLive: boolean;
  latencyMs?: number | null;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onOpenAddProject,
  isRefreshing,
  onRefresh,
  autoRefreshSec,
  countdown,
  onOpenConfig,
  onOpenSimulator,
  onOpenBuildApk,
  isConnectedLive,
  latencyMs,
  theme = 'dark',
  onToggleTheme
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center space-x-2 bg-[#22242c] hover:bg-[#2a2c36] px-3 py-1.5 rounded-xl border border-[#2e313c] text-sm font-medium transition-all group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[180px] font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">
              {currentProject.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${projectDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-[#1f2128] border border-[#323542] rounded-2xl shadow-2xl z-50 py-2 overflow-hidden animate-fadeIn">
              <div className="px-3.5 py-2 text-[11px] font-semibold text-gray-400 border-b border-[#2d303b] flex items-center justify-between">
                <span className="uppercase tracking-wider font-mono">Pilih Proyek Supabase</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {projects.length} Proyek
                </span>
              </div>
              
              <div className="max-h-64 overflow-y-auto divide-y divide-[#262834]">
                {projects.map((p) => {
                  const isCurrent = p.id === currentProject.id;
                  const projectRef = (p as any).ref || p.id;
                  const projectRegion = (p as any).region || 'ap-southeast-1';

                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#282b35] transition-colors group ${
                        isCurrent ? 'bg-emerald-950/30 text-emerald-300 font-medium' : 'text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold truncate group-hover:text-emerald-300">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                              Aktif
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                          {projectRegion} • {projectRef}
                        </span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-[#2d303b] p-2 bg-[#17181e] space-y-1">
                {onOpenAddProject && (
                  <button
                    onClick={() => {
                      setProjectDropdownOpen(false);
                      onOpenAddProject();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 flex items-center space-x-2 transition-colors border border-dashed border-emerald-500/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Proyek Baru</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenConfig();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-[#262833] flex items-center space-x-2 transition-colors"
                >
                  <FolderGit2 className="w-4 h-4 text-gray-400" />
                  <span>Kelola Multi-Proyek...</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Title or Status badge with SUPAN APK Icon */}
      <div className="hidden md:flex items-center space-x-2.5">
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

      {/* Right side: Refresh, Config */}
      <div className="flex items-center space-x-2">
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

        {/* Theme Toggle Button (Light/Dark Mode) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
            className="p-2 rounded-xl bg-[#22242c] hover:bg-[#2c2f3a] border border-[#2e313c] text-gray-300 hover:text-white transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
