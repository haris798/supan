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
  SupabaseProject,
  UsageMetrics,
  AnalyticsOverview,
  TableInfo,
  MetricHistoryPoint,
  SupabaseConnectionConfig
} from './types';
import { QuotaMetricsCard } from './components/QuotaMetricsCard';
import { Header } from './components/Header';
import { AnalyticsOverviewSection } from './components/AnalyticsOverviewSection';
import { LargestTablesSection } from './components/LargestTablesSection';
import { AnalyticsModal } from './components/AnalyticsModal';
import { TableDetailModal } from './components/TableDetailModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { supabase } from './supabaseClient';

const emptyProject: SupabaseProject = {
  id: 'connected-project',
  name: 'My Supabase',
  ref: 'pcoyvfhcniscynjkndlw',
  region: 'ap-southeast-1',
  ipAddress: '127.0.0.1',
  createdAt: new Date().toISOString(),
  status: 'Active',
  organization: 'Personal',
  databaseVersion: '15.1'
};

const emptyMetrics: UsageMetrics = {
  restApiRequests: 0,
  restApiTrend: 0,
  authUsersCount: 0,
  storageFilesCount: 0,
  realtimeConnections: 0,
};

const emptyAnalytics: AnalyticsOverview = {
  dbSizeBytes: 0,
  connectionsCount: 0,
  cacheHitRate: 0,
  tablesCount: 0,
  activeQueries: 0,
  cpuUsagePct: 0,
  memoryUsagePct: 0,
};

export default function App() {
  // State variables
  const [projects, setProjects] = React.useState<SupabaseProject[]>([emptyProject]);
  const [currentProject, setCurrentProject] = React.useState<SupabaseProject>(emptyProject);
  const [metrics, setMetrics] = React.useState<UsageMetrics>(emptyMetrics);
  const [analytics, setAnalytics] = React.useState<AnalyticsOverview>(emptyAnalytics);
  const [largestTables, setLargestTables] = React.useState<TableInfo[]>([]);
  const [history, setHistory] = React.useState<MetricHistoryPoint[]>([]);

  // UI view switches & Modals
  const [isMobileFrame, setIsMobileFrame] = React.useState<boolean>(true); // Default to mobile phone view as in prompt screenshot
  const [autoRefreshSec, setAutoRefreshSec] = React.useState<number>(60);
  const [countdown, setCountdown] = React.useState<number>(60);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const [selectedTable, setSelectedTable] = React.useState<TableInfo | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = React.useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState<boolean>(false);

  // Connection config
  const [connectionConfig, setConnectionConfig] = React.useState<SupabaseConnectionConfig>({
    projectUrl: 'https://pcoyvfhcniscynjkndlw.supabase.co',
    anonKey: 'sb_publishable_4HYaHZhOIECG56Eccpe4sA_xj-Ecy9n',
    isConnected: true
  });

  // Real-time Subscriptions
  React.useEffect(() => {
    if (!connectionConfig.isConnected) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          const tableName = payload.table;
          setLargestTables(prev => {
            const existing = prev.find(t => t.name === tableName);
            if (existing) {
              return prev.map(t => 
                t.name === tableName 
                  ? { 
                      ...t, 
                      estimatedRows: Math.max(0, t.estimatedRows + (payload.eventType === 'INSERT' ? 1 : payload.eventType === 'DELETE' ? -1 : 0)),
                      sampleData: payload.new ? [payload.new, ...(t.sampleData || [])].slice(0, 5) : t.sampleData
                    }
                  : t
              ).sort((a, b) => b.estimatedRows - a.estimatedRows);
            } else {
              // Add new table
              const newTable: TableInfo = {
                id: tableName,
                name: tableName,
                schema: payload.schema,
                sizeBytes: 8192,
                formattedSize: '8 kB',
                estimatedRows: 1,
                columnsCount: Object.keys(payload.new || payload.old || {}).length,
                primaryKey: 'id',
                description: 'Auto-detected via realtime',
                columns: [],
                sampleData: payload.new ? [payload.new] : []
              };
              return [...prev, newTable].sort((a, b) => b.estimatedRows - a.estimatedRows);
            }
          });
          
          setMetrics(prev => ({
            ...prev,
            restApiRequests: prev.restApiRequests + 1,
            restApiTrend: 1
          }));
          
          setAnalytics(prev => ({
            ...prev,
            activeQueries: prev.activeQueries + 1
          }));
          
          setTimeout(() => {
            setAnalytics(prev => ({
              ...prev,
              activeQueries: Math.max(0, prev.activeQueries - 1)
            }));
          }, 1000);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
           setAnalytics(prev => ({...prev, connectionsCount: prev.connectionsCount + 1}));
           setMetrics(prev => ({...prev, realtimeConnections: prev.realtimeConnections + 1}));
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setAnalytics(prev => ({...prev, connectionsCount: Math.max(0, prev.connectionsCount - 1)}));
      setMetrics(prev => ({...prev, realtimeConnections: Math.max(0, prev.realtimeConnections - 1)}));
    };
  }, [connectionConfig.isConnected]);

  // Manual & Auto Refresh logic
  const handleTriggerRefresh = React.useCallback(() => {
    setIsRefreshing(true);

    // Placeholder for actual data fetch
    setTimeout(() => {
      setIsRefreshing(false);
      setCountdown(autoRefreshSec);
    }, 400);
  }, [autoRefreshSec]);

  React.useEffect(() => {
    async function fetchRealTables() {
      if (!connectionConfig.isConnected) return;
      
      try {
        const { data: tablesData, error: tablesError } = await supabase.rpc('get_largest_tables');
        
        if (tablesError) {
          console.warn("Could not fetch real tables via RPC.", tablesError);
        } else if (tablesData && Array.isArray(tablesData)) {
          setLargestTables(tablesData.sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 4));
        }

        const { data: metricsData, error: metricsError } = await supabase.rpc('get_dashboard_metrics');

        if (metricsError) {
          console.warn("Could not fetch dashboard metrics via RPC.", metricsError);
        } else if (metricsData) {
          const d = metricsData as any;
          setAnalytics(prev => ({
            ...prev,
            dbSizeBytes: d.dbSizeBytes || prev.dbSizeBytes,
            connectionsCount: d.connectionsCount || prev.connectionsCount,
            tablesCount: d.tablesCount || prev.tablesCount,
          }));
          setMetrics(prev => ({
            ...prev,
            authUsersCount: d.authUsersCount || prev.authUsersCount,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch tables/metrics:", err);
      }
    }
    
    fetchRealTables();
  }, [connectionConfig.isConnected, handleTriggerRefresh]);

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
              <div className="w-7"></div>
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#0d2f21] border border-emerald-500/30">
                  <Database className="w-3.5 h-3.5 text-[#00e676]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#00e676] border border-[#16171a] rounded-full"></span>
                </div>
                <h1 className="text-base font-bold text-white tracking-tight">Dashboard</h1>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-emerald-400 p-1 rounded-lg hover:bg-[#23252e] transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Dashboard Body */}
            <div className="p-4 space-y-5 overflow-y-auto max-h-[720px] custom-scrollbar bg-[#16171a]">
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
              />

              {/* Section 5: Last (Largest tables) */}
              <LargestTablesSection
                tables={largestTables}
                onSelectTable={(table) => setSelectedTable(table)}
                onOpenMenu={() => setIsConfigModalOpen(true)}
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
                <div className="relative w-11 h-11 rounded-2xl bg-[#0d2f21] text-[#00e676] flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Database className="w-6 h-6" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00e676] border-2 border-[#1c1e24] rounded-full"></span>
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
                <LargestTablesSection
                  tables={largestTables}
                  onSelectTable={(t) => setSelectedTable(t)}
                  onOpenMenu={() => setIsConfigModalOpen(true)}
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
    </div>
  );
}
