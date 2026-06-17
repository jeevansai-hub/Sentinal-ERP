import { useState, useMemo } from 'react';
import { 
  Plus, 
  X, 
  FileText, 
  AlertCircle,
  Check
} from 'lucide-react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface FinanceViewProps {
  user: UserSession | null;
}

interface InvoiceRecord {
  id: string;
  client: string;
  email: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface ExpenseClaim {
  id: string;
  employee: string;
  category: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export default function FinanceView({ user: _user }: FinanceViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'expenses' | 'budgets'>('invoices');
  const [loading] = useState(false);

  // Interactive Invoice creation modal state
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Interactive Expense creation state
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [newEmployee, setNewEmployee] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState('');

  // Invoice Database State
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([
    { id: 'SN-INV-1092', client: 'Reliance Retail', email: 'billing@relianceretail.com', amount: 1450000, date: '2026-06-10', dueDate: '2026-07-10', status: 'Paid' },
    { id: 'SN-INV-1093', client: 'Tata Manufacturing', email: 'finance@tatamfg.com', amount: 3200000, date: '2026-06-08', dueDate: '2026-07-08', status: 'Pending' },
    { id: 'SN-INV-1094', client: 'Apollo Healthcare', email: 'accounts@apollohc.com', amount: 875000, date: '2026-05-15', dueDate: '2026-06-15', status: 'Overdue' },
    { id: 'SN-INV-1095', client: 'BlueDart Logistics', email: 'payables@bluedart.com', amount: 1240000, date: '2026-06-11', dueDate: '2026-07-11', status: 'Pending' },
    { id: 'SN-INV-1096', client: 'L&T Industries', email: 'vendor.invoices@larsentoubro.com', amount: 2750000, date: '2026-06-05', dueDate: '2026-07-05', status: 'Paid' }
  ]);

  // Expense Claims State
  const [expenses, setExpenses] = useState<ExpenseClaim[]>([
    { id: 'EXP-401', employee: 'Jane Doe', category: 'Cloud Infrastructure', amount: 185000, date: '2026-06-05', status: 'Pending' },
    { id: 'EXP-402', employee: 'Vikram Malhotra', category: 'Client Travel & Lodging', amount: 45000, date: '2026-06-02', status: 'Approved' },
    { id: 'EXP-403', employee: 'Rahul Varma', category: 'Office Subscriptions', amount: 12500, date: '2026-05-28', status: 'Approved' },
    { id: 'EXP-404', employee: 'Alex Sterling', category: 'Hardware Procurement', amount: 210000, date: '2026-06-09', status: 'Pending' },
    { id: 'EXP-405', employee: 'Priya Sharma', category: 'HR Team Recruiting Adverts', amount: 38000, date: '2026-06-01', status: 'Approved' }
  ]);

  // Budget Allocation state
  const [budgets] = useState([
    { department: 'Engineering & Operations', allocated: 2500000, spent: 1850000 },
    { department: 'Sales & CRM Marketing', allocated: 1800000, spent: 1120000 },
    { department: 'Supply Chain & SCM', allocated: 1500000, spent: 1420000 },
    { department: 'Human Resources & Recruits', allocated: 800000, spent: 580000 },
    { department: 'Security & Compliance', allocated: 500000, spent: 220000 }
  ]);

  // Format currency helpers
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const invoiceStats = useMemo(() => {
    const total = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

  const expenseStats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const approved = expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = expenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    return { total, approved, pending };
  }, [expenses]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newAmount || !newDueDate) return;

    const newInvoice: InvoiceRecord = {
      id: `SN-INV-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient.trim(),
      email: newEmail.trim() || 'accounting@client.com',
      amount: parseFloat(newAmount),
      date: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      status: 'Pending'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setShowCreateInvoice(false);
    setNewClient('');
    setNewEmail('');
    setNewAmount('');
    setNewDueDate('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.trim() || !newCategory.trim() || !newExpenseAmount || !newExpenseDate) return;

    const newExpense: ExpenseClaim = {
      id: `EXP-${Math.floor(400 + Math.random() * 600)}`,
      employee: newEmployee.trim(),
      category: newCategory.trim(),
      amount: parseFloat(newExpenseAmount),
      date: newExpenseDate,
      status: 'Pending'
    };

    setExpenses(prev => [newExpense, ...prev]);
    setShowCreateExpense(false);
    setNewEmployee('');
    setNewCategory('');
    setNewExpenseAmount('');
    setNewExpenseDate('');
  };

  const handleUpdateInvoiceStatus = (id: string, newStatus: 'Paid' | 'Pending' | 'Overdue') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  const handleApproveExpense = (id: string) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'Approved' } : exp));
  };

  const handleDeclineExpense = (id: string) => {
    setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, status: 'Declined' } : exp));
  };

  const invoiceColumns = [
    { key: 'id', label: 'Invoice ID', sortable: true },
    { key: 'client', label: 'Client Name', sortable: true },
    { key: 'email', label: 'Billing Email', sortable: true },
    { key: 'date', label: 'Draft Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (val: number) => <span className="font-mono">{formatINR(val)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
          val === 'Paid' 
            ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
            : val === 'Pending'
            ? 'border-amber-500/10 bg-amber-500/5 text-amber-400'
            : 'border-rose-500/10 bg-rose-500/5 text-rose-400'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const expenseColumns = [
    { key: 'id', label: 'Claim ID', sortable: true },
    { key: 'employee', label: 'Staff Employee', sortable: true },
    { key: 'category', label: 'Category / Purpose', sortable: true },
    { key: 'date', label: 'Expense Date', sortable: true },
    { 
      key: 'amount', 
      label: 'Claim Value', 
      sortable: true,
      render: (val: number) => <span className="font-mono">{formatINR(val)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
          val === 'Approved' 
            ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
            : val === 'Pending'
            ? 'border-amber-500/10 bg-amber-500/5 text-amber-400'
            : 'border-rose-500/10 bg-rose-500/5 text-rose-400'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const cashflowData = [
    { name: 'Nov', value: 320000 },
    { name: 'Dec', value: 450000 },
    { name: 'Jan', value: 380000 },
    { name: 'Feb', value: 520000 },
    { name: 'Mar', value: 610000 },
    { name: 'Apr', value: 780000 }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── TOP HEADER TITLE ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5 text-left">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">Finance & Corporate Accounts</h2>
          <p className="text-xs text-white/50 leading-relaxed">
            Monitor client billing, process expense audits, monitor cash reserves, and calibrate departmental provisions.
          </p>
        </div>
        
        {/* Navigation tabs inside Finance */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveSubTab('invoices')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'invoices' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Invoices & Billing
          </button>
          <button 
            onClick={() => setActiveSubTab('expenses')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'expenses' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Expense Ledger
          </button>
          <button 
            onClick={() => setActiveSubTab('budgets')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'budgets' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Budgets & Projections
          </button>
        </div>
      </div>

      {/* ── FINANCE OVERVIEW CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2 text-left">
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Invoiced</div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">{formatINR(invoiceStats.total)}</div>
          <div className="text-[9px] text-white/50">{invoices.length} invoices generated</div>
        </div>

        <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2 text-left">
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Collected Revenue</div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">{formatINR(invoiceStats.paid)}</div>
          <div className="text-[9px] text-emerald-400">
            {invoiceStats.total > 0 ? `${Math.round((invoiceStats.paid / invoiceStats.total) * 100)}% collection rate` : '0%'}
          </div>
        </div>

        <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2 text-left">
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Outstanding Accounts</div>
          <div className="text-2xl font-bold tracking-tight text-amber-400 font-mono">{formatINR(invoiceStats.pending)}</div>
          <div className="text-[9px] text-white/50">{invoices.filter(i => i.status === 'Pending').length} pending collection</div>
        </div>

        <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-2 text-left">
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Audited Expenses</div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono">{formatINR(expenseStats.approved)}</div>
          <div className="text-[9px] text-rose-400">
            {formatINR(expenseStats.pending)} pending validation
          </div>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        
        {/* ── TAB 1: INVOICES & BILLING ── */}
        {activeSubTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Invoices registry</span>
              <button
                onClick={() => setShowCreateInvoice(!showCreateInvoice)}
                className="h-8 px-3 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>New Invoice</span>
              </button>
            </div>

            {/* Interactive Create Invoice Form */}
            {showCreateInvoice && (
              <div className="bg-neutral-950/70 border border-white/10 rounded-2xl p-6 text-left space-y-4 max-w-xl mx-auto shadow-2xl relative">
                <button 
                  onClick={() => setShowCreateInvoice(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} />
                    Generate Corporate Invoice
                  </h3>
                  <p className="text-[10px] text-white/40">Invoice will be drafted in 'Pending' state for payment verification.</p>
                </div>

                <form onSubmit={handleCreateInvoice} className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Client Name</label>
                      <input 
                        type="text" 
                        required
                        value={newClient}
                        onChange={(e) => setNewClient(e.target.value)}
                        placeholder="e.g. Reliance Retail"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Billing Email</label>
                      <input 
                        type="email" 
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g. accounts@client.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Invoice Amount (INR)</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-white/40 text-[10px]">₹</div>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={newAmount}
                          onChange={(e) => setNewAmount(e.target.value)}
                          placeholder="e.g. 1240000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Due Date</label>
                      <input 
                        type="date" 
                        required
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateInvoice(false)}
                      className="h-9 px-4 border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-colors text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="h-9 px-5 bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Generate Invoice
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Invoices List Grid */}
            <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
              <EnterpriseDataGrid
                data={invoices}
                columns={invoiceColumns}
                searchKeys={['client', 'id']}
                searchPlaceholder="Search invoices..."
                rowActions={[
                  { 
                    label: 'Mark Paid', 
                    action: (row) => handleUpdateInvoiceStatus(row.id, 'Paid') 
                  }
                ]}
              />
            </div>
          </div>
        )}

        {/* ── TAB 2: EXPENSE LEDGER ── */}
        {activeSubTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Expense claims</span>
              <button
                onClick={() => setShowCreateExpense(!showCreateExpense)}
                className="h-8 px-3 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Log Claim</span>
              </button>
            </div>

            {/* Interactive Log Expense Claim Form */}
            {showCreateExpense && (
              <div className="bg-neutral-950/70 border border-white/10 rounded-2xl p-6 text-left space-y-4 max-w-xl mx-auto shadow-2xl relative">
                <button 
                  onClick={() => setShowCreateExpense(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    Log Operational Expense Claim
                  </h3>
                  <p className="text-[10px] text-white/40">Claims will require auditing and VP approvals before payout sync.</p>
                </div>

                <form onSubmit={handleCreateExpense} className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Employee Name</label>
                      <input 
                        type="text" 
                        required
                        value={newEmployee}
                        onChange={(e) => setNewEmployee(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Category / Purpose</label>
                      <input 
                        type="text" 
                        required
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Cloud Infrastructure"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Claim Amount (INR)</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-white/40 text-[10px]">₹</div>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                          placeholder="e.g. 185000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-6 pr-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Expense Date</label>
                      <input 
                        type="date" 
                        required
                        value={newExpenseDate}
                        onChange={(e) => setNewExpenseDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none text-white focus:border-white/20 h-9"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateExpense(false)}
                      className="h-9 px-4 border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-colors text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="h-9 px-5 bg-white text-black hover:bg-neutral-200 transition-colors text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Log Claim
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Expense Claims Table */}
            <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
              <EnterpriseDataGrid
                data={expenses}
                columns={expenseColumns}
                searchKeys={['employee', 'category']}
                searchPlaceholder="Search expense logs..."
                rowActions={[
                  { 
                    label: 'Approve', 
                    action: (row) => handleApproveExpense(row.id),
                    icon: Check
                  },
                  {
                    label: 'Decline',
                    action: (row) => handleDeclineExpense(row.id)
                  }
                ]}
              />
            </div>
          </div>
        )}

        {/* ── TAB 3: BUDGETS & FORECASTS ── */}
        {activeSubTab === 'budgets' && (
          <div className="space-y-8 text-left">
            
            {/* Cash Flow Forecast Graph Visual */}
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cash Flow & Capital Projections</h3>
                  <p className="text-[10px] text-white/40">Visualized cash movement forecasting models</p>
                </div>
              </div>

              <EnterpriseChart type="line" data={cashflowData} height="200px" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Liquid Reserves</span>
                  <div className="text-base font-bold text-white font-mono">₹8.92Cr</div>
                  <div className="text-[9px] text-emerald-400">● 100% Capital solvency</div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Net Cash Inflow MTD</span>
                  <div className="text-base font-bold text-white font-mono">₹3.08Cr</div>
                  <div className="text-[9px] text-white/50">Collections exceeding expenses</div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold">Estimated Tax Liability</span>
                  <div className="text-base font-bold text-white font-mono">₹24.5L</div>
                  <div className="text-[9px] text-white/50">Accrued provisions for Q2</div>
                </div>
              </div>
            </div>

            {/* Departmental Budgets allocations */}
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-6">
              <div className="space-y-1 border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Departmental Allocation & Consumption</h3>
                <p className="text-[10px] text-white/40">Real-time expenditure tracking vs active budget ceilings</p>
              </div>

              <div className="space-y-5">
                {budgets.map((bud, index) => {
                  const percent = Math.round((bud.spent / bud.allocated) * 100);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <div className="space-y-0.5 text-left">
                          <span className="font-semibold text-white/95">{bud.department}</span>
                          <div className="text-[10px] text-white/40">
                            Spent: <strong className="text-white/70">{formatINR(bud.spent)}</strong> of {formatINR(bud.allocated)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-bold ${percent > 90 ? 'text-rose-400' : percent > 75 ? 'text-amber-400' : 'text-white/80'}`}>
                            {percent}% Consumed
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-white/5 border border-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 90 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-white'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </WorkspaceStateWrapper>
    </div>
  );
}
