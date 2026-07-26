import {
  SupabaseProject,
  UsageMetrics,
  AnalyticsOverview,
  TableInfo,
  MetricHistoryPoint
} from './types';

export const initialProjects: SupabaseProject[] = [
  {
    id: 'proj_ap_south_1',
    name: 'Production Primary DB',
    ref: 'xu4zztntzvgdfnfivgd535',
    region: 'AP-SOUTH-1',
    ipAddress: '17.6.1.141',
    createdAt: 'Jul 4, 2026',
    status: 'Active',
    organization: 'Acme Corp Cloud',
    databaseVersion: 'PostgreSQL 15.6'
  },
  {
    id: 'proj_us_east_1',
    name: 'Staging Environment',
    ref: 'stg9876543210abcdefg',
    region: 'US-EAST-1',
    ipAddress: '54.210.88.19',
    createdAt: 'May 12, 2026',
    status: 'Active',
    organization: 'Acme Corp Cloud',
    databaseVersion: 'PostgreSQL 15.6'
  },
  {
    id: 'proj_eu_central_1',
    name: 'Analytics Service DB',
    ref: 'anl1122334455667788',
    region: 'EU-CENTRAL-1',
    ipAddress: '18.192.40.11',
    createdAt: 'Jan 15, 2026',
    status: 'Maintenance',
    organization: 'Acme Corp Cloud',
    databaseVersion: 'PostgreSQL 15.5'
  }
];

export const initialUsageMetrics: UsageMetrics = {
  restApiRequests: 9300, // Displays as 9.3K
  restApiTrend: 5.4,
  authUsersCount: 44,
  storageFilesCount: 4,
  realtimeConnections: 0
};

export const initialAnalyticsOverview: AnalyticsOverview = {
  dbSizeBytes: 28311552, // 27 MB
  connectionsCount: 1,
  cacheHitRate: 100.0,
  tablesCount: 18,
  activeQueries: 0,
  cpuUsagePct: 2.1,
  memoryUsagePct: 18.4
};

export const initialLargestTables: TableInfo[] = [
  {
    id: 'tbl_1',
    name: 'spatial_ref_sys',
    schema: 'public',
    sizeBytes: 7315456,
    formattedSize: '7144 kB',
    estimatedRows: 8500,
    columnsCount: 5,
    primaryKey: 'srid',
    description: 'PostGIS spatial reference systems repository for coordinate definitions.',
    columns: [
      { name: 'srid', type: 'integer', isNullable: false, isPk: true },
      { name: 'auth_name', type: 'character varying(256)', isNullable: true, isPk: false },
      { name: 'auth_srid', type: 'integer', isNullable: true, isPk: false },
      { name: 'srtext', type: 'character varying(2048)', isNullable: true, isPk: false },
      { name: 'proj4text', type: 'character varying(2048)', isNullable: true, isPk: false }
    ],
    sampleData: [
      { srid: 4326, auth_name: 'EPSG', auth_srid: 4326, srtext: 'GEOGCS["WGS 84",DATUM["WGS_1984",...]]', proj4text: '+proj=longlat +datum=WGS84 +no_defs' },
      { srid: 3857, auth_name: 'EPSG', auth_srid: 3857, srtext: 'PROJCS["WGS 84 / Pseudo-Mercator",...]', proj4text: '+proj=merc +a=6378137 +b=6378137...' },
      { srid: 27700, auth_name: 'EPSG', auth_srid: 27700, srtext: 'PROJCS["OSGB 1936 / British National Grid",...]', proj4text: '+proj=tmerc +lat_0=49 +lon_0=-2...' }
    ]
  },
  {
    id: 'tbl_2',
    name: 'colota_locations',
    schema: 'public',
    sizeBytes: 6324224,
    formattedSize: '6176 kB',
    estimatedRows: 24100,
    columnsCount: 8,
    primaryKey: 'id',
    description: 'Geospatial location log records for fleet telemetry tracking.',
    columns: [
      { name: 'id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'device_id', type: 'varchar', isNullable: false, isPk: false },
      { name: 'latitude', type: 'double precision', isNullable: false, isPk: false },
      { name: 'longitude', type: 'double precision', isNullable: false, isPk: false },
      { name: 'speed', type: 'real', isNullable: true, isPk: false },
      { name: 'created_at', type: 'timestamptz', isNullable: false, isPk: false }
    ],
    sampleData: [
      { id: 'a1b2c3d4-0001', device_id: 'DEV-8891', latitude: 19.0760, longitude: 72.8777, speed: 42.5, created_at: '2026-07-25 18:45:00+00' },
      { id: 'a1b2c3d4-0002', device_id: 'DEV-8891', latitude: 19.0782, longitude: 72.8795, speed: 38.0, created_at: '2026-07-25 18:46:12+00' },
      { id: 'a1b2c3d4-0003', device_id: 'DEV-9022', latitude: 19.1120, longitude: 72.8910, speed: 0.0, created_at: '2026-07-25 18:48:30+00' }
    ]
  },
  {
    id: 'tbl_3',
    name: 'gpslite_locations',
    schema: 'public',
    sizeBytes: 327680,
    formattedSize: '320 kB',
    estimatedRows: 1850,
    columnsCount: 6,
    primaryKey: 'id',
    description: 'High-frequency lightweight GPS fix data stream cache.',
    columns: [
      { name: 'id', type: 'bigint', isNullable: false, isPk: true },
      { name: 'tracker_sn', type: 'text', isNullable: false, isPk: false },
      { name: 'geom', type: 'geometry(Point,4326)', isNullable: true, isPk: false },
      { name: 'timestamp', type: 'timestamptz', isNullable: false, isPk: false }
    ],
    sampleData: [
      { id: 104821, tracker_sn: 'GPS-LITE-01', geom: 'POINT(72.877 19.076)', timestamp: '2026-07-25 19:20:00' },
      { id: 104822, tracker_sn: 'GPS-LITE-02', geom: 'POINT(72.880 19.080)', timestamp: '2026-07-25 19:21:15' }
    ]
  },
  {
    id: 'tbl_4',
    name: 'trip_points',
    schema: 'public',
    sizeBytes: 319488,
    formattedSize: '312 kB',
    estimatedRows: 1420,
    columnsCount: 7,
    primaryKey: 'point_id',
    description: 'Waypoints sequence mapping for active vehicle trips.',
    columns: [
      { name: 'point_id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'trip_id', type: 'uuid', isNullable: false, isPk: false },
      { name: 'seq_order', type: 'integer', isNullable: false, isPk: false },
      { name: 'address_text', type: 'text', isNullable: true, isPk: false }
    ],
    sampleData: [
      { point_id: 'p-101', trip_id: 'trip-900', seq_order: 1, address_text: 'Terminal 2 Gate B, Chhatrapati Shivaji Int Airport' },
      { point_id: 'p-102', trip_id: 'trip-900', seq_order: 2, address_text: 'Bandra Kurla Complex, Mumbai' }
    ]
  },
  {
    id: 'tbl_5',
    name: 'user_auth_audit',
    schema: 'auth',
    sizeBytes: 188416,
    formattedSize: '184 kB',
    estimatedRows: 920,
    columnsCount: 5,
    primaryKey: 'id',
    description: 'Supabase Auth login attempts and session security verification audit log.',
    columns: [
      { name: 'id', type: 'uuid', isNullable: false, isPk: true },
      { name: 'user_id', type: 'uuid', isNullable: false, isPk: false },
      { name: 'ip_address', type: 'inet', isNullable: false, isPk: false },
      { name: 'action', type: 'varchar(64)', isNullable: false, isPk: false },
      { name: 'timestamp', type: 'timestamptz', isNullable: false, isPk: false }
    ],
    sampleData: [
      { id: 'auth-log-1', user_id: 'u-8812', ip_address: '103.21.124.8', action: 'token_refreshed', timestamp: '2026-07-25 19:30:10' },
      { id: 'auth-log-2', user_id: 'u-4491', ip_address: '103.21.124.9', action: 'login_success', timestamp: '2026-07-25 19:28:44' }
    ]
  }
];

export const generateHistoryData = (): MetricHistoryPoint[] => {
  const points: MetricHistoryPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    const hourLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Slight variance curve over 24h
    const baseApi = 350 + Math.floor(Math.sin(i / 3) * 150) + Math.floor(Math.random() * 80);
    const authUsers = 38 + Math.floor(Math.sin(i / 5) * 6) + Math.floor(Math.random() * 3);
    const conn = 1 + (i % 6 === 0 ? 1 : 0);
    
    points.push({
      timestamp: time.toISOString(),
      timeLabel: hourLabel,
      restApi: baseApi,
      auth: authUsers,
      connections: conn,
      cacheHit: 99.8 + Math.random() * 0.2,
      dbSizeMb: 26.8 + (24 - i) * 0.01
    });
  }
  return points;
};
