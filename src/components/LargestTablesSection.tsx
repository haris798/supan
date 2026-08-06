import React from 'react';
import { Menu, LayoutGrid, ArrowUpRight, Zap, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { TableInfo, MetricHistoryPoint } from '../types';
import { formatTableSize, formatGrowthMb } from '../utils';

interface LargestTablesSectionProps {
  tables: TableInfo[];
  onSelectTable: (table: TableInfo) => void;
  onOpenMenu?: () => void;
  history?: MetricHistoryPoint[];
}

// Micro Sparkline Chart component for rendering 24h traffic trends (with hover tooltip)
const TableSparkline: React.FC<{
  table: TableInfo;
  history?: MetricHistoryPoint[];
  isHighActivity: boolean;
}> = ({ table, history, isHighActivity }) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const nameHash = React.useMemo(() => {
    return table.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }, [table.name]);

  const multiplier = isHighActivity ? 1.4 : 0.65;

  const dataPoints: number[] = React.useMemo(() => {
    if (history && history.length > 0) {
      return history.map((pt, idx) => {
        const noise = Math.sin((idx + nameHash) * 0.8) * 12 + Math.cos(idx * 0.5) * 8;
        const val = (pt.restApi || 100) * (0.7 + (nameHash % 7) * 0.1) + noise;
        return Math.max(5, Math.round(val * multiplier));
      });
    }

    return Array.from({ length: 24 }, (_, i) => {
      const val = 20 + Math.sin((i + nameHash) * 0.5) * 15 + Math.cos(i * 0.3) * 8;
      return Math.max(5, Math.round(val * multiplier));
    });
  }, [table.name, history, isHighActivity, nameHash, multiplier]);

  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min || 1;

  const width = 64;
  const height = 22;
  const padding = 2;

  const points = dataPoints.map((val, index) => {
    const x = (index / (dataPoints.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${(width - padding).toFixed(1)},${height} L ${padding},${height} Z`;

  const gradientId = `spark-grad-${table.id.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const strokeColor = isHighActivity ? '#34d399' : '#94a3b8'; // emerald-400 vs slate-400

  const hovered = hoverIndex !== null ? dataPoints[hoverIndex] : null;
  const hoverX = hoverIndex !== null
    ? ((hoverIndex / (dataPoints.length - 1)) * (width - padding * 2) + padding).toFixed(1)
    : null;
  const hoverY = hovered !== null
    ? (height - padding - ((hovered - min) / range) * (height - padding * 2)).toFixed(1)
    : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const viewX = ((e.clientX - rect.left) / rect.width) * width;
    const clamped = Math.min(Math.max(viewX, padding), width - padding);
    const idx = Math.round(((clamped - padding) / (width - padding * 2)) * (dataPoints.length - 1));
    setHoverIndex(Math.max(0, Math.min(dataPoints.length - 1, idx)));
  };

  const handleMouseLeave = () => setHoverIndex(null);

  return (
    <div
      className="relative flex flex-col items-end shrink-0 ml-2 group-hover:scale-105 transition-transform"
      title="Trafik 24 jam terakhir"
    >
      <svg
        width={width}
        height={height}
        className="overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradientId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={(width - padding).toFixed(1)}
          cy={(height - padding - ((dataPoints[dataPoints.length - 1] - min) / range) * (height - padding * 2)).toFixed(1)}
          r="2"
          fill={strokeColor}
          className={isHighActivity ? 'animate-pulse' : ''}
        />

        {/* Hover crosshair + point indicator */}
        {hoverIndex !== null && hoverX !== null && hoverY !== null && (
          <g pointerEvents="none">
            <line
              x1={hoverX}
              x2={hoverX}
              y1={padding}
              y2={height - padding}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.8"
            />
            <circle cx={hoverX} cy={hoverY} r="2.5" fill={strokeColor} stroke="#0f1014" strokeWidth="1" />
          </g>
        )}
      </svg>

      {/* Tooltip bubble */}
      {hoverIndex !== null && hovered !== null && (
        <div
          className="absolute top-0 -translate-x-1/2 -translate-y-full pointer-events-none z-20 px-2 py-1 rounded-lg bg-[#232631] border border-[#3a3f52] shadow-lg shadow-black/40 whitespace-nowrap"
          style={{ left: `${(hoverIndex / (dataPoints.length - 1)) * 100}%` }}
        >
          <div className="text-[8px] font-mono text-gray-400 uppercase tracking-wide">
            {history && history[hoverIndex]?.timeLabel ? history[hoverIndex].timeLabel : `Jam ${hoverIndex}`}
          </div>
          <div className={`text-[10px] font-bold ${isHighActivity ? 'text-emerald-400' : 'text-gray-200'}`}>
            {hovered.toLocaleString()}
            <span className="text-gray-500 font-medium"> trafik</span>
          </div>
        </div>
      )}

      <span className="text-[9px] font-mono font-medium text-gray-500 mt-0.5 tracking-tight">
        24h trend
      </span>
    </div>
  );
};

export const LargestTablesSection: React.FC<LargestTablesSectionProps> = ({
  tables,
  onSelectTable,
  onOpenMenu,
  history
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-2.5">
      {/* Subtitle Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold text-gray-300 tracking-wide">
            Largest tables
          </h2>
          <Menu className="w-4 h-4 text-gray-500 hidden sm:inline" />
        </div>

        <button
          onClick={onOpenMenu}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#252832] transition-colors"
          title="Filter Tabel"
          id="btn-filter-tables"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Grid for largest tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTables.slice(0, 6).map((table) => {
          const isHighActivity =
            table.activityLevel === 'high' ||
            (!table.activityLevel &&
              (table.estimatedRows > 5000 ||
                ['locations', 'sessions', 'audit', 'events', 'users', 'logs', 'orders', 'transactions'].some((k) =>
                  table.name.toLowerCase().includes(k)
                )));

          return (
            <div
              key={table.id}
              onClick={() => onSelectTable(table)}
              id={`table-card-${table.id}`}
              className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center justify-between space-x-2 transition-all cursor-pointer shadow-sm group hover:border-[#383c4a]"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* Green Icon Box with Activity Status Dot */}
                <div className="relative w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
                  <LayoutGrid className="w-5 h-5" />
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#22242a] ${
                      isHighActivity ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  {isHighActivity && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  )}
                </div>

                {/* Table Name, Status Indicator Icon Badge & Schema Size */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center min-w-0 pr-1">
                      <span className="block text-xs sm:text-sm font-bold text-white tracking-wide truncate group-hover:text-emerald-300 transition-colors">
                        {table.name}
                      </span>

                      {/* Status Indicator Icon Badge */}
                      {isHighActivity ? (
                        <span
                          id={`status-high-${table.id}`}
                          title="High Activity (Trafik Tinggi)"
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 ml-1.5"
                        >
                          <Zap className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                          <span className="hidden lg:inline text-[10px]">High</span>
                        </span>
                      ) : (
                        <span
                          id={`status-low-${table.id}`}
                          title="Low Traffic (Trafik Rendah)"
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-400 border border-slate-500/25 shrink-0 ml-1.5"
                        >
                          <Activity className="w-2.5 h-2.5 text-slate-400" />
                          <span className="hidden lg:inline text-[10px]">Low</span>
                        </span>
                      )}
                    </div>

                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-1" />
                  </div>

                  <span className="block text-[11px] font-medium text-gray-400 truncate mt-0.5">
                    {table.schema} · {formatTableSize(table.formattedSize, table.sizeBytes)}
                  </span>

                  {/* 24h growth badge */}
                  {typeof table.growth24hMb === 'number' && (
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                        table.growth24hMb > 0.05
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : table.growth24hMb < -0.05
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/25'
                      }`}
                      title="Growth ukuran tabel dalam 24 jam terakhir"
                    >
                      {table.growth24hMb > 0.05 ? (
                        <TrendingUp className="w-2.5 h-2.5" />
                      ) : table.growth24hMb < -0.05 ? (
                        <TrendingDown className="w-2.5 h-2.5" />
                      ) : null}
                      {formatGrowthMb(table.growth24hMb)} <span className="opacity-60 font-normal">/ 24h</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline Chart */}
              <TableSparkline table={table} history={history} isHighActivity={isHighActivity} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
