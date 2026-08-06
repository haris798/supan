import React from 'react';
import { X, LayoutGrid, Key, Database, Copy, Check, Table as TableIcon, Code, Layers, TrendingUp, TrendingDown } from 'lucide-react';
import { TableInfo } from '../types';
import { formatTableSize, formatGrowthMb } from '../utils';

interface TableDetailModalProps {
  table: TableInfo | null;
  onClose: () => void;
}

// Mini sparkline chart showing cumulative 24h growth with an interactive hover tooltip.
// Uses real per-hour snapshots from table_size_history when available,
// otherwise falls back to a deterministic synthetic series ending at growth24hMb.
const GrowthSparkline: React.FC<{ table: TableInfo }> = ({ table }) => {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  const { dataPoints, labels, isReal, absoluteMb } = React.useMemo(() => {
    const history = table.sizeHistory;
    if (history && history.length >= 2) {
      // Real snapshots: cumulative growth in MB relative to the first snapshot,
      // plus the absolute size in MB for the tooltip.
      const base = history[0].sizeBytes;
      const points = history.map((h) => +((h.sizeBytes - base) / 1048576).toFixed(3));
      const absMb = history.map((h) => +((h.sizeBytes / 1048576).toFixed(2)));
      const timeLabels = history.map((h) =>
        new Date(h.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      return { dataPoints: points, labels: timeLabels, isReal: true, absoluteMb: absMb };
    }

    // Fallback: deterministic per-table series (seeded noise, ends at growth24hMb)
    const nameHash = table.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const target = table.growth24hMb ?? 0;
    const points = Array.from({ length: 24 }, (_, i) => {
      const noise = Math.sin((i + nameHash) * 0.7) * 0.02 + Math.cos(i * 0.4) * 0.012;
      const progress = (i + 1) / 24;
      return +(target * progress + noise * Math.abs(target)).toFixed(3);
    });
    return { dataPoints: points, labels: null, isReal: false, absoluteMb: null };
  }, [table.name, table.growth24hMb, table.sizeHistory]);

  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min || 1;

  const width = 600;
  const height = 64;
  const padding = 8;

  const points = dataPoints.map((val, index) => {
    const x = (index / (dataPoints.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${(width - padding).toFixed(1)},${height} L ${padding},${height} Z`;

  const isPositive = (table.growth24hMb ?? 0) > 0.05;
  const isNegative = (table.growth24hMb ?? 0) < -0.05;
  const strokeColor = isPositive ? '#34d399' : isNegative ? '#fb7185' : '#94a3b8';

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
    // Map rendered x-position back into viewBox coordinates (preserveAspectRatio="none" stretches x uniformly)
    const viewX = ((e.clientX - rect.left) / rect.width) * width;
    const clamped = Math.min(Math.max(viewX, padding), width - padding);
    const idx = Math.round(((clamped - padding) / (width - padding * 2)) * (dataPoints.length - 1));
    setHoverIndex(Math.max(0, Math.min(dataPoints.length - 1, idx)));
  };

  const handleMouseLeave = () => setHoverIndex(null);

  return (
    <div className="mb-4 p-4 rounded-2xl bg-[#15171c] border border-[#2c303d]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-gray-400 flex items-center space-x-1.5">
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : isNegative ? (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          ) : null}
          <span>Pertumbuhan Ukuran — 24 Jam Terakhir</span>
          {isReal && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase tracking-wide">
              Riwayat Nyata
            </span>
          )}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : isNegative
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-slate-500/10 text-slate-400 border-slate-500/25'
          }`}
        >
          {formatGrowthMb(table.growth24hMb ?? 0)}
        </span>
      </div>

      {/* Chart area with hover tooltip */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-14 cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={`grow-grad-${table.id.replace(/[^a-zA-Z0-9]/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grow-grad-${table.id.replace(/[^a-zA-Z0-9]/g, '-')})`} />
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={(width - padding).toFixed(1)}
            cy={(height - padding - ((dataPoints[dataPoints.length - 1] - min) / range) * (height - padding * 2)).toFixed(1)}
            r="3"
            fill={strokeColor}
            className={isPositive || isNegative ? 'animate-pulse' : ''}
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
                strokeDasharray="3 3"
                opacity="0.7"
              />
              <circle cx={hoverX} cy={hoverY} r="4.5" fill={strokeColor} stroke="#0f1014" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Tooltip bubble */}
        {hoverIndex !== null && (
          <div
            className="absolute -top-1 -translate-x-1/2 -translate-y-full pointer-events-none z-10 px-2.5 py-1.5 rounded-xl bg-[#232631] border border-[#3a3f52] shadow-lg shadow-black/40 whitespace-nowrap"
            style={{ left: `${(hoverIndex / (dataPoints.length - 1)) * 100}%` }}
          >
            <div className="text-[9px] font-mono text-gray-400 uppercase tracking-wide">
              {labels ? labels[hoverIndex] : `Jam ${hoverIndex}`}
            </div>
            {isReal && absoluteMb ? (
              <div className="text-[11px] font-bold text-gray-100">
                {absoluteMb[hoverIndex].toFixed(2)} MB{' '}
                <span className="text-gray-500 font-medium">(total)</span>
              </div>
            ) : null}
            <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-gray-300'}`}>
              {formatGrowthMb(hovered ?? 0)}
              <span className="text-gray-500 font-medium"> growth</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-gray-500">
        <span>{labels ? labels[0] : '0h'}</span>
        <span className="text-emerald-400/80">+{max.toFixed(2)} MB (puncak)</span>
        <span>{labels ? labels[labels.length - 1] : '24h'}</span>
      </div>
    </div>
  );
};

export const TableDetailModal: React.FC<TableDetailModalProps> = ({ table, onClose }) => {
  const [copiedSql, setCopiedSql] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'data' | 'columns' | 'sql'>('data');

  if (!table) return null;

  const sqlQuery = `SELECT * FROM ${table.schema}.${table.name} ORDER BY ${table.primaryKey || '1'} DESC LIMIT 10;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a1c22] border border-[#2e313d] rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2a2d39] flex items-center justify-between bg-[#1f2128]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] flex items-center justify-center text-[#00e676] border border-emerald-500/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#2d303d] text-emerald-400">
                  {table.schema}
                </span>
                <h2 className="text-base font-bold text-gray-100">{table.name}</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Ukuran: <strong className="text-gray-200">{formatTableSize(table.formattedSize, table.sizeBytes)}</strong> • Estimasi Baris: <strong className="text-gray-200">{table.estimatedRows.toLocaleString()}</strong>
              </p>

              {/* 24h growth badge */}
              {typeof table.growth24hMb === 'number' && (
                <span
                  className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    table.growth24hMb > 0.05
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : table.growth24hMb < -0.05
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/25'
                  }`}
                  title="Growth ukuran tabel dalam 24 jam terakhir"
                >
                  {table.growth24hMb > 0.05 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : table.growth24hMb < -0.05 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  <span className="opacity-70 font-medium">Growth 24h:</span>
                  {formatGrowthMb(table.growth24hMb)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#282b36] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-[#2a2d39] bg-[#1a1c22] flex space-x-4">
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'data'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Sampel Data ({table.sampleData?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('columns')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'columns'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skema Kolom ({table.columns?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'sql'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SQL Query</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* 24h growth sparkline (always visible when growth data exists) */}
          {typeof table.growth24hMb === 'number' && <GrowthSparkline table={table} />}

          {activeTab === 'data' && (
            <div className="space-y-3">
              {table.description && (
                <div className="p-3 rounded-xl bg-[#22242e] border border-[#2c303d] text-xs text-gray-300">
                  {table.description}
                </div>
              )}

              {table.sampleData && table.sampleData.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-[#2e313e] bg-[#15171c]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1e2027] text-gray-400 font-semibold text-[10px] border-b border-[#2e313e]">
                      <tr>
                        {Object.keys(table.sampleData[0]).map((col) => (
                          <th key={col} className="px-4 py-2.5 font-bold tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#232631] text-gray-300">
                      {table.sampleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#1e212a] transition-colors">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="px-4 py-2.5 max-w-[200px] truncate font-mono text-[11px]">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs bg-[#15171c] rounded-2xl border border-[#282b36]">
                  Tidak ada baris data sampel.
                </div>
              )}
            </div>
          )}

          {activeTab === 'columns' && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-[#2e313e] bg-[#15171c]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1e2027] text-gray-400 font-semibold text-[10px] border-b border-[#2e313e]">
                    <tr>
                      <th className="px-4 py-2.5">Nama Kolom</th>
                      <th className="px-4 py-2.5">Tipe Data</th>
                      <th className="px-4 py-2.5">Nullable</th>
                      <th className="px-4 py-2.5">Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#232631] text-gray-300">
                    {table.columns?.map((col) => (
                      <tr key={col.name} className="hover:bg-[#1e212a] transition-colors">
                        <td className="px-4 py-2.5 font-bold text-gray-100 font-mono">{col.name}</td>
                        <td className="px-4 py-2.5 font-mono text-emerald-400">{col.type}</td>
                        <td className="px-4 py-2.5 text-gray-400">{col.isNullable ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2.5">
                          {col.isPk ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                              <Key className="w-3 h-3" />
                              <span>PK</span>
                            </span>
                          ) : (
                            <span className="text-gray-600">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="relative bg-[#121317] p-4 rounded-2xl border border-[#2d303c] font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto">
                <button
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#252834] hover:bg-[#313545] text-gray-300 hover:text-white transition-colors flex items-center space-x-1 text-[11px]"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Tercopy' : 'Copy'}</span>
                </button>
                <code>{sqlQuery}</code>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#2a2d39] bg-[#1f2128] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2c2f3c] hover:bg-[#383c4d] text-gray-200 font-semibold text-xs transition-colors"
          >
            Tutup Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
