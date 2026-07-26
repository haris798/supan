import React from 'react';
import {
  Wifi,
  BatteryCharging,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  Sparkles,
  Smartphone,
  Monitor,
  Database,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  initialProjects,
  initialUsageMetrics,
  initialAnalyticsOverview,
  initialLargestTables,
  generateHistoryData
} from './mockData';
import {
  SupabaseProject,
  UsageMetrics,
  AnalyticsOverview,
  TableInfo,
  MetricHistoryPoint,
  SupabaseConnectionConfig
} from './types';
import { QuotaMetricsCard } from './components/QuotaMetricsCard';
import { Header } from './components/Header';
import { ProjectStatusSection } from './components/ProjectStatusSection';
import { UsageMetricsSection } from './components/UsageMetricsSection';
import { AnalyticsOverviewSection } from './components/AnalyticsOverviewSection';
import { LargestTablesSection } from './components/LargestTablesSection';
import { AnalyticsModal } from './components/AnalyticsModal';
import { TableDetailModal } from './components/TableDetailModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { SimulatedControlsDrawer } from './components/SimulatedControlsDrawer';

export default function App() {
  // State variables
  const [projects, setProjects] = React.useState<SupabaseProject[]>(initialProjects);
  const [currentProject, setCurrentProject] = React.useState<SupabaseProject>(initialProjects[0]);
  const [metrics, setMetrics] = React.useState<UsageMetrics>(initialUsageMetrics);
  const [analytics, setAnalytics] = React.useState<AnalyticsOverview>(initialAnalyticsOverview);
  const [largestTables, setLargestTables] = React.useState<TableInfo[]>(initialLargestTables);
  const [history, setHistory] = React.useState<MetricHistoryPoint[]>(generateHistoryData());

  // UI view switches & Modals
  const [isMobileFrame, setIsMobileFrame] = React.useState<boolean>(true); // Default to mobile phone view as in prompt screenshot
  const [autoRefreshSec, setAutoRefreshSec] = React.useState<number>(60);
  const [countdown, setCountdown] = React.useState<number>(60);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const [selectedTable, setSelectedTable] = React.useState<TableInfo | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = React.useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = React.useState<boolean>(false);

  // Connection config
  const [connectionConfig, setConnectionConfig] = React.useState<SupabaseConnectionConfig>({
    projectUrl: 'https://xu4zztntzvgdfnfivgd535.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    isConnected: false
  });

  // Manual & Auto Refresh logic
  const handleTriggerRefresh = React.useCallback(() => {
    setIsRefreshing(true);

    // Simulate micro data updates
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        restApiRequests: prev.restApiRequests + Math.floor(Math.random() * 5) + 1
      }));

      setAnalytics((prev) => ({
        ...prev,
        cacheHitRate: Math.min(100.0, 99.8 + Math.random() * 0.2)
      }));

      // Append point to history
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory((prev) => [
        ...prev.slice(1),
        {
          timestamp: now.toISOString(),
          timeLabel,
          restApi: metrics.restApiRequests + 1,
          auth: metrics.authUsersCount,
          connections: analytics.connectionsCount,
          cacheHit: 100.0,
          dbSizeMb: Math.round(analytics.dbSizeBytes / 1048576)
        }
      ]);

      setIsRefreshing(false);
      setCountdown(autoRefreshSec);
    }, 400);
  }, [autoRefreshSec, metrics, analytics]);

  // Real-time Countdown timer effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleTriggerRefresh();
          return autoRefreshSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleTriggerRefresh, autoRefreshSec]);

  // Handler to add a new table to top tables list
  const handleAddTable = () => {
    const newId = `tbl_${largestTables.length + 1}`;
    const newTableNames = ['audit_logs', 'notifications', 'order_items', 'spatial_zones', 'user_sessions'];
    const selectedName = newTableNames[largestTables.length % newTableNames.length];

    const newTableItem: TableInfo = {
      id: newId,
      name: selectedName,
      schema: 'public',
      sizeBytes: 155648,
      formattedSize: '152 kB',
      estimatedRows: 420,
      columnsCount: 4,
      primaryKey: 'id',
      description: 'Tabel tambahan real-time.',
      columns: [
        { name: 'id', type: 'uuid', isNullable: false, isPk: true },
        { name: 'payload', type: 'jsonb', isNullable: true, isPk: false },
        { name: 'created_at', type: 'timestamptz', isNullable: false, isPk: false }
      ],
      sampleData: [
        { id: '111-aaa', payload: { event: 'INSERT' }, created_at: new Date().toISOString() }
      ]
    };

    setLargestTables((prev) => [newTableItem, ...prev]);
    setAnalytics((prev) => ({
      ...prev,
      tablesCount: prev.tablesCount + 1
    }));
  };

  return (
    <div className="min-h-screen bg-[#121316] text-gray-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* App Top Navigation Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(p) => setCurrentProject(p)}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        isRefreshing={isRefreshing}
        onRefresh={handleTriggerRefresh}
        autoRefreshSec={autoRefreshSec}
        countdown={countdown}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        isConnectedLive={connectionConfig.isConnected}
      />

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 flex flex-col items-center justify-start">
        
        {/* Toggleable Smartphone Frame vs Fluid Layout */}
        {isMobileFrame ? (
          /* Mobile Smartphone Canvas Frame (Matching exact dimensions and style of reference image) */
          <div className="w-full max-w-[390px] bg-[#16171a] border border-[#2d2f38] rounded-[40px] shadow-2xl overflow-hidden my-2 sm:my-4 flex flex-col relative">
            
            {/* Phone Status Bar */}
            <div className="px-6 pt-3 pb-1 flex items-center justify-between text-xs text-gray-300 select-none bg-[#16171a]">
              <span className="font-bold text-[13px] tracking-tight text-white">9:24</span>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-extrabold text-white">100%</span>
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Mobile Title Header */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-[#23252d] bg-[#16171a]">
              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="text-emerald-400 p-1 rounded-lg hover:bg-[#23252e] transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <h1 className="text-base font-bold text-white tracking-tight">Dashboard</h1>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-emerald-400 p-1 rounded-lg hover:bg-[#23252e] transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Dashboard Body */}
            <div className="p-4 space-y-5 overflow-y-auto max-h-[720px] custom-scrollbar bg-[#16171a]">
              {/* Section 1: Top (Project Status) */}
              <ProjectStatusSection
                project={currentProject}
                onCardClick={(title) => setIsAnalyticsModalOpen(true)}
              />

              {/* Section 2: Middle (Usage metrics - 24h) */}
              <UsageMetricsSection
                metrics={metrics}
                onOpenDetailModal={() => setIsAnalyticsModalOpen(true)}
                onOpenMenu={() => setIsSimulatorOpen(true)}
              />

              {/* Section 3: Bottom (Analytics overview) */}
              <AnalyticsOverviewSection
                analytics={analytics}
                onSeeMore={() => setIsAnalyticsModalOpen(true)}
                onOpenCardDetail={() => setIsAnalyticsModalOpen(true)}
              />

              {/* Section 4: Infrastructure Quota Metrics */}
              <QuotaMetricsCard
                analytics={analytics}
                metrics={metrics}
                onOpenSearch={() => setIsAnalyticsModalOpen(true)}
                onOpenHelp={() => setIsSimulatorOpen(true)}
                onOpenTips={() => setIsAnalyticsModalOpen(true)}
              />

              {/* Section 5: Last (Largest tables) */}
              <LargestTablesSection
                tables={largestTables}
                onSelectTable={(table) => setSelectedTable(table)}
                onOpenMenu={() => setIsSimulatorOpen(true)}
              />
            </div>

            {/* Phone Bottom Notch Indicator Bar */}
            <div className="w-full py-2 bg-[#16171a] flex justify-center">
              <div className="w-32 h-1 bg-gray-600/70 rounded-full" />
            </div>

          </div>
        ) : (
          /* Wide Desktop Fluid Layout */
          <div className="w-full space-y-6">
            
            {/* Top Info Banner */}
            <div className="bg-[#1c1e24] border border-[#2b2e38] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0d2f21] text-[#00e676] flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">{currentProject.name}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {currentProject.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Region: <strong className="text-gray-200">{currentProject.region}</strong> • IP: <strong className="text-gray-200">{currentProject.ipAddress}</strong> • Ref: <strong className="text-gray-200">{currentProject.ref}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end md:self-auto">
                <button
                  onClick={() => setIsAnalyticsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lihat Performance Analytics</span>
                </button>
              </div>
            </div>

            {/* Grid layout for sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ProjectStatusSection project={currentProject} />
                <UsageMetricsSection
                  metrics={metrics}
                  onOpenDetailModal={() => setIsAnalyticsModalOpen(true)}
                  onOpenMenu={() => setIsSimulatorOpen(true)}
                />
              </div>

              <div className="space-y-6">
                <AnalyticsOverviewSection
                  analytics={analytics}
                  onSeeMore={() => setIsAnalyticsModalOpen(true)}
                />
                <QuotaMetricsCard
                  analytics={analytics}
                  metrics={metrics}
                  onOpenSearch={() => setIsAnalyticsModalOpen(true)}
                  onOpenHelp={() => setIsSimulatorOpen(true)}
                  onOpenTips={() => setIsAnalyticsModalOpen(true)}
                />
                <LargestTablesSection
                  tables={largestTables}
                  onSelectTable={(t) => setSelectedTable(t)}
                  onOpenMenu={() => setIsSimulatorOpen(true)}
                />
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#23252e] bg-[#141518] py-4 px-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supabase Real-time Monitoring Engine v2.4</span>
        </div>
        <div>
          <span>Dibuat untuk Supabase Management API • Mode Dark Theme</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        analytics={analytics}
        metrics={metrics}
        history={history}
        onRefresh={handleTriggerRefresh}
      />

      <TableDetailModal
        table={selectedTable}
        onClose={() => setSelectedTable(null)}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={connectionConfig}
        onSaveConfig={(cfg) => {
          setConnectionConfig(cfg);
          setIsConfigModalOpen(false);
        }}
        onDisconnect={() => {
          setConnectionConfig({
            projectUrl: '',
            anonKey: '',
            isConnected: false
          });
        }}
      />

      <SimulatedControlsDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        metrics={metrics}
        analytics={analytics}
        project={currentProject}
        onUpdateMetrics={(fn) => setMetrics(fn)}
        onUpdateAnalytics={(fn) => setAnalytics(fn)}
        onUpdateProject={(fn) => setCurrentProject(fn)}
        autoRefreshSec={autoRefreshSec}
        onChangeAutoRefreshSec={(s) => {
          setAutoRefreshSec(s);
          setCountdown(s);
        }}
        onAddTable={handleAddTable}
      />
    </div>
  );
}
