import { useState } from 'react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { DollarSign, Send, Landmark, Calendar } from 'lucide-react';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  category: string;
}

export default function InvoiceCenterView() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: '1', invoiceNumber: 'INV-2026-001', clientName: 'Vertex Solutions Inc.', amount: 450000, dueDate: '2026-07-15', status: 'Paid', category: 'Enterprise Services' },
    { id: '2', invoiceNumber: 'INV-2026-002', clientName: 'Hyperion Corp.', amount: 1250000, dueDate: '2026-06-30', status: 'Pending', category: 'Software Licensing' },
    { id: '3', invoiceNumber: 'INV-2026-003', clientName: 'Nexus Global', amount: 820000, dueDate: '2026-05-10', status: 'Overdue', category: 'Consulting' },
    { id: '4', invoiceNumber: 'INV-2026-004', clientName: 'Apex Labs', amount: 310000, dueDate: '2026-07-22', status: 'Pending', category: 'Support SLA' },
    { id: '5', invoiceNumber: 'INV-2026-005', clientName: 'Stratosphere Inc.', amount: 980000, dueDate: '2026-04-18', status: 'Overdue', category: 'Enterprise Services' }
  ]);

  const chartData = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'Paid').reduce((acc, c) => acc + c.amount, 0), color: '#34d399' },
    { name: 'Pending', value: invoices.filter(i => i.status === 'Pending').reduce((acc, c) => acc + c.amount, 0), color: '#fbbf24' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').reduce((acc, c) => acc + c.amount, 0), color: '#f87171' }
  ];

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice ID', sortable: true },
    { key: 'clientName', label: 'Client Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (val: number) => <span className="font-mono">₹{val.toLocaleString('en-IN')}</span>
    },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
          val === 'Paid' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : val === 'Pending'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const handleSendReminder = (row: InvoiceItem) => {
    alert(`Reminder notification dispatched for invoice ${row.invoiceNumber} to ${row.clientName}`);
  };

  const handleMarkAsPaid = (selected: InvoiceItem[]) => {
    setLoading(true);
    setTimeout(() => {
      setInvoices(prev => prev.map(inv => {
        if (selected.some(s => s.id === inv.id)) {
          return { ...inv, status: 'Paid' };
        }
        return inv;
      }));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER SECTION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Landmark size={12} />
            <span>Financial Operations Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Invoice & Billing Control</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            CF0 central ledger explorer. Review real-time aging invoices, issue collection warnings, and reconcile account records.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center justify-between text-left gap-4">
            <div>
              <div className="text-[8px] text-white/40 uppercase font-bold">Total Receivables</div>
              <div className="text-xs font-mono font-bold text-white">₹38,10,000</div>
            </div>
            <DollarSign size={16} className="text-white/40" />
          </div>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        {/* ── ANALYTICS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 p-4 rounded-2xl text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Receivables Distribution</span>
              <span className="text-[9px] text-emerald-400 font-mono">Real-time Reconciled</span>
            </div>
            <EnterpriseChart type="donut" data={chartData} height="200px" />
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl text-left space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Accounts Aging Timeline</span>
              <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                Summary of overdue invoices tracking elapsed collection terms.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                <span className="text-white/50 flex items-center gap-1"><Calendar size={10} /> 0-30 Days</span>
                <span className="font-mono text-white">₹12,50,000</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-1.5">
                <span className="text-amber-400 flex items-center gap-1"><Calendar size={10} /> 31-60 Days</span>
                <span className="font-mono text-white">₹8,20,000</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-rose-400 flex items-center gap-1"><Calendar size={10} /> 61+ Days</span>
                <span className="font-mono text-white">₹9,80,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN DATA GRID ── */}
        <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
          <EnterpriseDataGrid
            data={invoices}
            columns={columns}
            searchKeys={['invoiceNumber', 'clientName', 'category']}
            searchPlaceholder="Search invoices by client or ID..."
            bulkActions={[
              { label: 'Mark Selected as Reconciled', action: handleMarkAsPaid }
            ]}
            rowActions={[
              { label: 'Dispatch Alert', action: handleSendReminder, icon: Send }
            ]}
          />
        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
