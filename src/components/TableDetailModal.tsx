import React from 'react';
import { X, LayoutGrid, Key, Database, Copy, Check, Table as TableIcon, Code, Layers } from 'lucide-react';
import { TableInfo } from '../types';
import { formatTableSize } from '../utils';

interface TableDetailModalProps {
  table: TableInfo | null;
  onClose: () => void;
}

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
