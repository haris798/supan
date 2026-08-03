import React from 'react';
import { Menu, LayoutGrid, ArrowUpRight, Zap, Activity } from 'lucide-react';
import { TableInfo } from '../types';
import { formatTableSize } from '../utils';

interface LargestTablesSectionProps {
  tables: TableInfo[];
  onSelectTable: (table: TableInfo) => void;
  onOpenMenu?: () => void;
}

export const LargestTablesSection: React.FC<LargestTablesSectionProps> = ({
  tables,
  onSelectTable,
  onOpenMenu
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
              className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group hover:border-[#383c4a]"
            >
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
