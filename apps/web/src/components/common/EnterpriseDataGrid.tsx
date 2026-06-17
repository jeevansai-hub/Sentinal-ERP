import { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  SlidersHorizontal 
} from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface EnterpriseDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  bulkActions?: { label: string; action: (selected: T[]) => void }[];
  rowActions?: { label: string; action: (row: T) => void; icon?: React.ComponentType<any> }[];
}

export default function EnterpriseDataGrid<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Filter records...',
  searchKeys = [],
  bulkActions = [],
  rowActions = []
}: EnterpriseDataGridProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(c => c.key))
  );
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Toggle sorting directions
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    const next = new Set(visibleColumns);
    if (next.has(key)) {
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    setVisibleColumns(next);
  };

  // Row selection helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredSortedData.map(r => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  // Filter & Sort Pipeline
  const filteredSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => {
        return searchKeys.some(key => {
          const val = row[key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(query);
        });
      });
    }

    // Sort order
    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        const comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base'
        });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, searchKeys, sortKey, sortDirection]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredSortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSortedData.slice(start, start + rowsPerPage);
  }, [filteredSortedData, currentPage, rowsPerPage]);

  // Export CSV helper
  const handleExportCSV = () => {
    const headerRow = columns
      .filter(c => visibleColumns.has(c.key))
      .map(c => `"${c.label}"`)
      .join(',');

    const bodyRows = filteredSortedData.map(row => {
      return columns
        .filter(c => visibleColumns.has(c.key))
        .map(c => {
          const val = (row as any)[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = [headerRow, ...bodyRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sentinel_export_${Date.now()}.csv`);
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* ── TOOLBAR CONTROL ROW ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input bar */}
        <div className="relative w-full sm:max-w-xs text-left">
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-4 text-xs bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:border-white/20 focus:ring-1 focus:ring-white/10 transition-colors"
          />
          <div className="absolute left-3 top-2.5 text-white/30">
            <Search size={13} />
          </div>
        </div>

        {/* Action button triggers */}
        <div className="flex gap-2 w-full sm:w-auto justify-end relative">
          
          {/* Column Visibility controls */}
          <div className="relative">
            <button 
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="h-9 w-9 bg-white/3 border border-white/5 hover:bg-white/8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
              title="Column Customizer"
            >
              <SlidersHorizontal size={13} />
            </button>

            {showColumnDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowColumnDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-neutral-950 border border-white/10 rounded-xl p-2.5 shadow-2xl z-50 text-left space-y-1.5">
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-1 pb-1 border-b border-white/5">Visible Columns</div>
                  {columns.map(col => (
                    <label key={col.key} className="flex items-center gap-2 px-1 text-[10px] text-white/70 hover:text-white cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.has(col.key)} 
                        onChange={() => toggleColumn(col.key)}
                        className="rounded bg-black border-white/20 text-white accent-white focus:ring-0"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export to CSV Trigger */}
          <button 
            onClick={handleExportCSV}
            className="h-9 px-3 bg-white/3 border border-white/5 hover:bg-white/8 rounded-xl flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Controls */}
      {selectedRows.size > 0 && bulkActions.length > 0 && (
        <div className="bg-white/3 border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs animate-fade-in text-left">
          <span className="text-white/60 font-medium">{selectedRows.size} records selected</span>
          <div className="flex gap-2">
            {bulkActions.map(action => (
              <button
                key={action.label}
                onClick={() => {
                  const selectedItems = data.filter(r => selectedRows.has(r.id));
                  action.action(selectedItems);
                  setSelectedRows(new Set());
                }}
                className="px-2.5 py-1 bg-white text-black hover:bg-neutral-200 text-[10px] font-bold rounded transition-colors cursor-pointer"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── THEME DATA TABLE CONTAINER ── */}
      <div className="bg-neutral-950/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/3 text-[10px] text-white/45 uppercase tracking-wider font-bold">
                <th className="p-3.5 w-10 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={data.length > 0 && selectedRows.size === filteredSortedData.length}
                    className="rounded bg-black border-white/20 text-white accent-white focus:ring-0"
                  />
                </th>
                {columns
                  .filter(c => visibleColumns.has(c.key))
                  .map(col => (
                    <th 
                      key={col.key} 
                      className={`p-3.5 ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {col.sortable && sortKey === col.key && (
                          sortDirection === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                        )}
                      </div>
                    </th>
                  ))}
                {rowActions.length > 0 && <th className="p-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {paginatedData.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-3.5 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="rounded bg-black border-white/20 text-white accent-white focus:ring-0"
                    />
                  </td>
                  {columns
                    .filter(c => visibleColumns.has(c.key))
                    .map(col => {
                      const value = (row as any)[col.key];
                      return (
                        <td key={col.key} className="p-3.5 text-white/80 font-medium">
                          {col.render ? col.render(value, row) : String(value ?? '')}
                        </td>
                      );
                    })}
                  {rowActions.length > 0 && (
                    <td className="p-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {rowActions.map(action => (
                          <button
                            key={action.label}
                            onClick={() => action.action(row)}
                            className="px-2 py-1 border border-white/10 hover:border-white/20 rounded text-[9px] font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {filteredSortedData.length === 0 && (
                <tr>
                  <td colSpan={columns.filter(c => visibleColumns.has(c.key)).length + 2} className="p-8 text-center text-white/30 italic">
                    No records matched the filter query parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION SYSTEM ROW ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[10px] text-white/45 pt-1">
          <span>Displaying page {currentPage} of {totalPages} ({filteredSortedData.length} records)</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-white/5 bg-white/3 hover:bg-white/8 disabled:opacity-30 rounded-lg text-white font-semibold cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-white/5 bg-white/3 hover:bg-white/8 disabled:opacity-30 rounded-lg text-white font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
