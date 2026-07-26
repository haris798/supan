import React from 'react';
import { Menu, LayoutGrid, ArrowUpRight, Search } from 'lucide-react';
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
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Grid for largest tables (2 columns matching screenshot layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTables.slice(0, 6).map((table) => (
          <div
            key={table.id}
            onClick={() => onSelectTable(table)}
            className="bg-[#22242a] hover:bg-[#282a32] border border-[#2b2e38] p-3.5 rounded-2xl flex items-center space-x-3 transition-all cursor-pointer shadow-sm group hover:border-[#383c4a]"
          >
            {/* Green Icon Box */}
            <div className="w-10 h-10 rounded-2xl bg-[#0d2f21] group-hover:bg-[#113a29] flex items-center justify-center text-[#00e676] shrink-0 transition-colors">
              <LayoutGrid className="w-5 h-5" />
            </div>

            {/* Table Name & Schema Size */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-xs sm:text-sm font-bold text-white tracking-wide truncate group-hover:text-emerald-300 transition-colors">
                  {table.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-1" />
              </div>
              <span className="block text-[11px] font-medium text-gray-400 truncate mt-0.5">
                {table.schema} · {formatTableSize(table.formattedSize, table.sizeBytes)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
