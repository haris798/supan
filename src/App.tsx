import React from 'react';
import {
  SlidersHorizontal,
  Plus,
  RefreshCw,
  Sparkles,
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
import { BuildApkModal } from './components/BuildApkModal';
import { supabase } from './supabaseClient';

const emptyProject: SupabaseProject = {
  id: 'connected-project',
  name: 'Supabase',
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

const defaultTables: TableInfo[] = [
  {
    id: 'colota_locations',
    name: 'colota_locations',
    schema: 'public',
    sizeBytes: 15728640,
    formattedSize: '15.3 MB',
    estimatedRows: 48200,
    columnsCount: 12,
    primaryKey: 'id',
    activityLevel: 'high',
    description: 'Location and GIS tracking points',
    columns: [
      { name: 'id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'name', type: 'text', isNullable: false, isPk: false },
      { name: 'latitude', type: 'float8', isNullable: false, isPk: false },
      { name: 'longitude', type: 'float8', isNullable: false, isPk: false }
    ]
  },
  {
    id: 'user_sessions',
    name: 'user_sessions',
    schema: 'public',
    sizeBytes: 8388608,
    formattedSize: '8.2 MB',
    estimatedRows: 19400,
    columnsCount: 8,
    primaryKey: 'id',
    activityLevel: 'high',
    description: 'Active authentication user sessions',
    columns: [
      { name: 'id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'user_id', type: 'uuid', isNullable: false, isPk: false },
      { name: 'token', type: 'text', isNullable: false, isPk: false }
    ]
  },
  {
    id: 'audit_logs',
    name: 'audit_logs',
    schema: 'public',
    sizeBytes: 4194304,
    formattedSize: '4.1 MB',
    estimatedRows: 8200,
    columnsCount: 6,
    primaryKey: 'id',
    activityLevel: 'high',
    description: 'System-wide activity and security audit entries',
    columns: [
      { name: 'id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'event', type: 'text', isNullable: false, isPk: false }
    ]
  },
  {
    id: 'spatial_ref_sys',
    name: 'spatial_ref_sys',
    schema: 'public',
    sizeBytes: 3145728,
    formattedSize: '3.1 MB',
    estimatedRows: 4800,
    columnsCount: 5,
    primaryKey: 'srid',
    activityLevel: 'low',
    description: 'PostGIS spatial reference systems data',
    columns: [
      { name: 'srid', type: 'integer', isNullable: false, isPk: true },
      { name: 'auth_name', type: 'text', isNullable: true, isPk: false }
    ]
  },
  {
    id: 'system_configs',
    name: 'system_configs',
    schema: 'public',
    sizeBytes: 1048576,
    formattedSize: '1.0 MB',
    estimatedRows: 120,
    columnsCount: 4,
    primaryKey: 'key',
    activityLevel: 'low',
    description: 'Application feature flags and config parameters'
  },
  {
    id: 'app_categories',
    name: 'app_categories',
    schema: 'public',
    sizeBytes: 524288,
    formattedSize: '512 kB',
    estimatedRows: 45,
    columnsCount: 3,
    primaryKey: 'id',
    activityLevel: 'low',
    description: 'Static category lookup taxonomy'
  }
];

export default function App() {
  // State variables
  const [projects, setProjects] = React.useState<SupabaseProject[]>([emptyProject]);
  const [currentProject, setCurrentProject] = React.useState<SupabaseProject>(emptyProject);
  const [metrics, setMetrics] = React.useState<UsageMetrics>(emptyMetrics);
  const [analytics, setAnalytics] = React.useState<AnalyticsOverview>(emptyAnalytics);
  const [largestTables, setLargestTables] = React.useState<TableInfo[]>(defaultTables);
  const [history, setHistory] = React.useState<MetricHistoryPoint[]>([]);

  // UI view switches & Modals
  const [autoRefreshSec, setAutoRefreshSec] = React.useState<number>(60);
  const [countdown, setCountdown] = React.useState<number>(60);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  // Theme State (Dark / Light Mode)
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('supan_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('supan_theme', next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const [selectedTable, setSelectedTable] = React.useState<TableInfo | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = React.useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState<boolean>(false);
  const [isBuildApkModalOpen, setIsBuildApkModalOpen] = React.useState<boolean>(false);
  const [latencyMs, setLatencyMs] = React.useState<number | null>(null);

  // Connection config
  const [connectionConfig, setConnectionConfig] = React.useState<SupabaseConnectionConfig>({
    projectUrl: 'https://pcoyvfhcniscynjkndlw.supabase.co',
    anonKey: 'sb_publishable_4HYaHZhOIECG56Eccpe4sA_xj-Ecy9n',
    isConnected: true
  });

  // Ping Latency
  React.useEffect(() => {
    if (!connectionConfig.isConnected || !connectionConfig.projectUrl) {
      setLatencyMs(null);
      return;
    }

    let isMounted = true;
    let timeoutId: number;

    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch(`${connectionConfig.projectUrl}/auth/v1/health`, {
          method: 'GET',
          headers: { apikey: connectionConfig.anonKey },
        });
        if (isMounted) {
          setLatencyMs(Math.round(performance.now() - start));
        }
      } catch (err) {
        if (isMounted) setLatencyMs(null);
      }
      
      if (isMounted) {
        timeoutId = window.setTimeout(measureLatency, 5000);
      }
    };

    measureLatency();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [connectionConfig.isConnected, connectionConfig.projectUrl, connectionConfig.anonKey]);

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
    <div className={`min-h-screen ${theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'bg-[#121316] text-gray-100'} flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black transition-colors duration-200`}>
      {/* App Top Navigation Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(p) => setCurrentProject(p)}
        isRefreshing={isRefreshing}
        onRefresh={handleTriggerRefresh}
        autoRefreshSec={autoRefreshSec}
        countdown={countdown}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenBuildApk={() => setIsBuildApkModalOpen(true)}
        isConnectedLive={connectionConfig.isConnected}
        latencyMs={latencyMs}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col justify-start">
        {/* Full Screen Responsive Dashboard Grid */}
        <div className="w-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AnalyticsOverviewSection
                analytics={analytics}
                onSeeMore={() => setIsAnalyticsModalOpen(true)}
                onOpenCardDetail={() => setIsAnalyticsModalOpen(true)}
              />
              <QuotaMetricsCard
                analytics={analytics}
                metrics={metrics}
              />
            </div>

            <div className="space-y-6">
              <LargestTablesSection
                tables={largestTables}
                onSelectTable={(t) => setSelectedTable(t)}
                onOpenMenu={() => setIsConfigModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#23252e] bg-[#141518] py-4 px-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supabase Real-time Monitoring Engine v2.4</span>
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
        projectRef={currentProject.ref}
        connectionConfig={connectionConfig}
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

      <BuildApkModal
        isOpen={isBuildApkModalOpen}
        onClose={() => setIsBuildApkModalOpen(false)}
      />
    </div>
  );
}
