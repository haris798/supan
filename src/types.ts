export interface SupabaseProject {
  id: string;
  name: string;
  ref: string;
  region: string;
  ipAddress: string;
  createdAt: string;
  status: 'Active' | 'Paused' | 'Restoring' | 'Maintenance';
  organization: string;
  databaseVersion: string;
}

export interface UsageMetrics {
  restApiRequests: number; // e.g., 9320 (displayed as 9.3K)
  restApiTrend: number; // % change
  authUsersCount: number; // e.g., 44
  storageFilesCount: number; // e.g., 4
  realtimeConnections: number; // e.g., 0
}

export interface AnalyticsOverview {
  dbSizeBytes: number; // e.g. 28311552 bytes (27 MB)
  connectionsCount: number; // e.g. 1
  cacheHitRate: number; // e.g. 100.0%
  tablesCount: number; // e.g. 18
  activeQueries: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
}

export interface TableInfo {
  id: string;
  name: string;
  schema: string;
  sizeBytes: number;
  formattedSize: string; // e.g. "7144 kB"
  estimatedRows: number;
  columnsCount: number;
  primaryKey: string;
  description?: string;
  columns?: { name: string; type: string; isNullable: boolean; isPk: boolean }[];
  sampleData?: Record<string, any>[];
  activityLevel?: 'high' | 'medium' | 'low';
}

export interface MetricHistoryPoint {
  timestamp: string;
  timeLabel: string;
  restApi: number;
  auth: number;
  connections: number;
  cacheHit: number;
  dbSizeMb: number;
}

export interface DatabaseErrorLog {
  id: string;
  timestamp: string;
  severity: 'ERROR' | 'FATAL' | 'WARNING';
  code: string;
  message: string;
  query?: string;
  detail?: string;
  clientIp?: string;
}

export interface SupabaseConnectionConfig {
  projectUrl: string;
  anonKey: string;
  serviceKey?: string;
  accessToken?: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
