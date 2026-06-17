import { useState, useMemo } from 'react';
import { 
  X, 
  DollarSign,
  Users,
  Network,
  Activity,
  Calendar,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Plus,
  Sparkles
} from 'lucide-react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface HRViewProps {
  user: any;
}

interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: 'Operations' | 'Finance' | 'HR' | 'Engineering' | 'Sales';
  email: string;
  ctc: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  tenure: string;
  readiness: number;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  role: string;
  dates: string;
  duration: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export default function HRView({ user: _user }: HRViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'payroll' | 'leaves'>('directory');
  const [selectedDeptNode, setSelectedDeptNode] = useState<string>('All');
  const [orgTreeExpanded, setOrgTreeExpanded] = useState<Record<string, boolean>>({
    'leadership': true,
    'departments': true
  });

  const [loading] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffDept, setNewStaffDept] = useState<'Operations' | 'Finance' | 'HR' | 'Engineering' | 'Sales'>('Engineering');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffCtc, setNewStaffCtc] = useState('');

  const [employees, setEmployees] = useState<EmployeeRecord[]>([
    { id: '1', name: 'Alex Sterling', role: 'VP Operations', department: 'Operations', email: 'alex.s@sentinel.com', ctc: '₹3,20,000', status: 'Active', tenure: '3.4 yrs', readiness: 95 },
    { id: '2', name: 'Priya Sharma', role: 'HR Operations Manager', department: 'HR', email: 'priya.s@sentinel.com', ctc: '₹1,45,000', status: 'Active', tenure: '2.1 yrs', readiness: 88 },
    { id: '3', name: 'Rahul Varma', role: 'Lead Finance Controller', department: 'Finance', email: 'rahul.v@sentinel.com', ctc: '₹2,10,005', status: 'Active', tenure: '4.2 yrs', readiness: 90 },
    { id: '4', name: 'Jane Doe', role: 'Senior Cloud Engineer', department: 'Engineering', email: 'jane.d@sentinel.com', ctc: '₹1,85,000', status: 'Active', tenure: '1.8 yrs', readiness: 92 },
    { id: '5', name: 'Vikram Malhotra', role: 'VP Sales & Growth', department: 'Sales', email: 'vikram.m@sentinel.com', ctc: '₹2,50,000', status: 'On Leave', tenure: '2.9 yrs', readiness: 84 },
    { id: '6', name: 'Rohan Sen', role: 'Systems Operator', department: 'Engineering', email: 'rohan.s@sentinel.com', ctc: '₹95,000', status: 'Active', tenure: '0.8 yrs', readiness: 70 },
    { id: '7', name: 'Aditi Rao', role: 'HR Recruitment Specialist', department: 'HR', email: 'aditi.r@sentinel.com', ctc: '₹85,000', status: 'Active', tenure: '1.2 yrs', readiness: 78 }
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: '1', employeeName: 'Vikram Malhotra', role: 'VP Sales', dates: 'June 12 - June 15', duration: '4 Days', reason: 'Medical Checkup', status: 'Pending' },
    { id: '2', employeeName: 'Rohan Sen', role: 'Systems Operator', dates: 'June 20 - June 22', duration: '3 Days', reason: 'Relocation Leave', status: 'Pending' }
  ]);

  // Dynamically calculate CTC expenses by department
  const payrollChartData = useMemo(() => {
    const sums: Record<string, number> = {
      Engineering: 0,
      HR: 0,
      Finance: 0,
      Operations: 0,
      Sales: 0
    };

    employees.forEach(emp => {
      const numericVal = Number(emp.ctc.replace(/[^0-9]/g, '')) || 0;
      if (sums[emp.department] !== undefined) {
        sums[emp.department] += numericVal;
      }
    });

    return Object.entries(sums).map(([dept, total]) => ({
      name: dept,
      value: total,
      color: dept === 'Engineering' ? '#3B82F6' :
             dept === 'HR' ? '#10B981' :
             dept === 'Finance' ? '#F59E0B' :
             dept === 'Operations' ? '#8B5CF6' : '#EC4899'
    }));
  }, [employees]);

  // Dynamically calculate Headcount by department
  const headcountChartData = useMemo(() => {
    const counts: Record<string, number> = {
      Engineering: 0,
      HR: 0,
      Finance: 0,
      Operations: 0,
      Sales: 0
    };

    employees.forEach(emp => {
      if (counts[emp.department] !== undefined) {
        counts[emp.department] += 1;
      }
    });

    return Object.entries(counts).map(([dept, count]) => ({
      name: dept,
      value: count,
      color: dept === 'Engineering' ? '#3B82F6' :
             dept === 'HR' ? '#10B981' :
             dept === 'Finance' ? '#F59E0B' :
             dept === 'Operations' ? '#8B5CF6' : '#EC4899'
    }));
  }, [employees]);

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffRole.trim()) return;

    const newEmp: EmployeeRecord = {
      id: String(employees.length + 1),
      name: newStaffName,
      role: newStaffRole,
      department: newStaffDept,
      email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@sentinel.com`,
      ctc: newStaffCtc || '₹1,00,000',
      status: 'Active',
      tenure: '0.1 yrs',
      readiness: 50
    };

    setEmployees(prev => [...prev, newEmp]);
    setShowAddStaffModal(false);
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffEmail('');
    setNewStaffCtc('');
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    const targetReq = leaveRequests.find(req => req.id === id);
    if (targetReq) {
      setEmployees(prev => prev.map(emp => emp.name === targetReq.employeeName ? { ...emp, status: 'On Leave' } : emp));
    }
  };

  const handleDeclineLeave = (id: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Declined' } : req));
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      return selectedDeptNode === 'All' || emp.department === selectedDeptNode;
    });
  }, [employees, selectedDeptNode]);

  const directoryColumns = [
    { 
      key: 'name', 
      label: 'Employee', 
      sortable: true,
      render: (_: any, row: EmployeeRecord) => (
        <div className="text-left">
          <div className="font-semibold text-white/95">{row.name}</div>
          <div className="text-[10px] text-white/40">{row.role}</div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (val: string) => (
        <span className="text-white/60 bg-white/3 border border-white/5 px-2 py-0.5 rounded text-[10px]">
          {val}
        </span>
      )
    },
    { key: 'ctc', label: 'Monthly CTC', sortable: true },
    { key: 'tenure', label: 'Tenure', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => (
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
          val === 'Active' 
            ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
            : val === 'On Leave'
            ? 'border-amber-500/10 bg-amber-500/5 text-amber-400'
            : 'border-rose-500/10 bg-rose-500/5 text-rose-400'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left view-accent-hr">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Users className="text-white h-5 w-5 animate-pulse" />
            Workforce OS &amp; HRMS Operations
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Sentinel Human Resources command portal. Map corporate hierarchies, verify staff directory registries, process pending leave requests, and assess promotion readiness matrices.
          </p>
        </div>
        
        {/* Navigation tabs inside HR */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'directory' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Staff Directory
          </button>
          <button 
            onClick={() => setActiveSubTab('payroll')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'payroll' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Payroll Registry
          </button>
          <button 
            onClick={() => setActiveSubTab('leaves')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'leaves' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Leaves &amp; Holidays
          </button>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        {/* ── 3-COLUMN WORKFORCE ECOSYSTEM ── */}
        {activeSubTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* COLUMN 1: ORG HIERARCHY TREE */}
            <div className="lg:col-span-1 bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Network size={12} />
                  Org Hierarchy Tree
                </span>
                <span className="text-[8px] text-white/40 border border-white/10 px-1.5 py-0.5 rounded font-mono">
                  Interactive
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => setSelectedDeptNode('All')}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    selectedDeptNode === 'All' ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🏢 All Sentinel Nodes</span>
                  <span className="font-mono text-[9px] text-white/40">({employees.length})</span>
                </button>

                {/* Leadership Node */}
                <div className="space-y-1 pl-1">
                  <div 
                    onClick={() => setOrgTreeExpanded(prev => ({ ...prev, leadership: !prev.leadership }))} 
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/80 cursor-pointer py-1"
                  >
                    {orgTreeExpanded['leadership'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <span className="font-bold text-[10px] uppercase tracking-wide">C-Suite &amp; Executives</span>
                  </div>
                  {orgTreeExpanded['leadership'] && (
                    <div className="pl-4 border-l border-white/5 space-y-1">
                      <div 
                        onClick={() => setSelectedDeptNode('Operations')}
                        className={`cursor-pointer px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                          selectedDeptNode === 'Operations' ? 'bg-white/5 text-white font-medium' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <span>👤 Operations Lead</span>
                        <span className="font-mono text-[9px] text-white/30">1</span>
                      </div>
                      <div 
                        onClick={() => setSelectedDeptNode('Finance')}
                        className={`cursor-pointer px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                          selectedDeptNode === 'Finance' ? 'bg-white/5 text-white font-medium' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <span>👤 Finance Controller</span>
                        <span className="font-mono text-[9px] text-white/30">1</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Departments Node */}
                <div className="space-y-1 pl-1">
                  <div 
                    onClick={() => setOrgTreeExpanded(prev => ({ ...prev, departments: !prev.departments }))} 
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/80 cursor-pointer py-1"
                  >
                    {orgTreeExpanded['departments'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <span className="font-bold text-[10px] uppercase tracking-wide">Department Nodes</span>
                  </div>
                  {orgTreeExpanded['departments'] && (
                    <div className="pl-4 border-l border-white/5 space-y-1">
                      <div 
                        onClick={() => setSelectedDeptNode('Engineering')}
                        className={`cursor-pointer px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                          selectedDeptNode === 'Engineering' ? 'bg-white/5 text-white font-medium' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <span>💻 Engineering</span>
                        <span className="font-mono text-[9px] text-white/30">
                          {employees.filter(e => e.department === 'Engineering').length}
                        </span>
                      </div>

                      <div 
                        onClick={() => setSelectedDeptNode('HR')}
                        className={`cursor-pointer px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                          selectedDeptNode === 'HR' ? 'bg-white/5 text-white font-medium' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <span>👥 Human Resources</span>
                        <span className="font-mono text-[9px] text-white/30">
                          {employees.filter(e => e.department === 'HR').length}
                        </span>
                      </div>

                      <div 
                        onClick={() => setSelectedDeptNode('Sales')}
                        className={`cursor-pointer px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                          selectedDeptNode === 'Sales' ? 'bg-white/5 text-white font-medium' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <span>📈 Sales &amp; Growth</span>
                        <span className="font-mono text-[9px] text-white/30">
                          {employees.filter(e => e.department === 'Sales').length}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: STAFF DIRECTORY GRID (CENTER) */}
            <div className="lg:col-span-2 space-y-4 bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Employee Registry</span>
                <button 
                  onClick={() => setShowAddStaffModal(true)}
                  className="h-8 px-3 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Onboard</span>
                </button>
              </div>

              <EnterpriseDataGrid
                data={filteredEmployees}
                columns={directoryColumns}
                searchKeys={['name', 'role', 'email']}
                searchPlaceholder="Search directory..."
              />
            </div>

            {/* COLUMN 3: WORKFORCE INSIGHTS (RIGHT) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Heatmap & Attendance stats */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity size={12} />
                    Live Attendance Heatmap
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, idx) => {
                      const healths = ['bg-emerald-500/40 border-emerald-500/20', 'bg-emerald-500/80 border-emerald-500/40', 'bg-white/10 border-white/5', 'bg-emerald-500/60 border-emerald-500/30'];
                      const styles = healths[idx % healths.length];
                      return (
                        <div 
                          key={idx} 
                          className={`h-4.5 rounded-sm border ${styles} transition-all duration-200 hover:scale-110 cursor-pointer`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] text-white/40 pt-1">
                    <span>Week 1</span>
                    <span>Week 4</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-white/60">
                  <span>June Avg Attendance</span>
                  <span className="font-bold text-emerald-400">96.4%</span>
                </div>
              </div>

              {/* Promotion Readiness Scores */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp size={12} />
                    Promotion Readiness
                  </span>
                </div>

                <div className="space-y-3">
                  {employees.slice(0, 3).map((emp) => (
                    <div key={emp.id} className="space-y-1 text-xs">
                      <div className="flex justify-between text-white/70">
                        <span>{emp.name}</span>
                        <span className="font-mono text-[10px] text-white/90 font-bold">{emp.readiness}% Ready</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-500" 
                          style={{ width: `${emp.readiness}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workforce Distribution Chart */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12} />
                    Workforce Distribution
                  </span>
                </div>
                <div className="bg-neutral-950/20 rounded-xl p-1.5 border border-white/5">
                  <EnterpriseChart type="bar" data={headcountChartData} height="140px" colorTheme="hr" />
                </div>
              </div>
              
              {/* Leave Calendar Panel preview */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12} />
                    Upcoming Leaves
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {leaveRequests.filter(r => r.status === 'Approved').map(req => (
                    <div key={req.id} className="p-2 bg-white/3 border border-white/5 rounded-lg text-left">
                      <div className="text-[10px] font-semibold text-white">{req.employeeName}</div>
                      <div className="text-[9px] text-white/40 mt-0.5">{req.dates}</div>
                    </div>
                  ))}
                  {leaveRequests.filter(r => r.status === 'Approved').length === 0 && (
                    <div className="text-[10px] text-white/30 italic py-2">
                      No approved leaves active this week.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PAYROLL REGISTRY ── */}
        {activeSubTab === 'payroll' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-6xl mx-auto">
            {/* Left Column: Table */}
            <div className="lg:col-span-2 bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payroll Disbursement Register</h3>
                  <p className="text-[10px] text-white/40">Verify and run monthly staff payroll directly through Axis sync gateway</p>
                </div>
                
                <button 
                  onClick={() => alert("Axis Bank sync request: Monthly payroll registers cleared successfully.")}
                  className="h-9 px-3 bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <DollarSign size={13} />
                  <span>Run Payroll Payout</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] text-white/45 font-bold uppercase tracking-wider">
                      <th className="py-2.5 text-left">Employee</th>
                      <th className="py-2.5 text-left">Monthly Base CTC</th>
                      <th className="py-2.5 text-left">Provident Fund (PF)</th>
                      <th className="py-2.5 text-left">Professional Tax</th>
                      <th className="py-2.5 text-right">Gateway Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-white/[0.01]">
                        <td className="py-3 font-semibold text-white/90">
                          {emp.name}
                          <span className="text-[9px] text-white/40 block font-normal">{emp.role}</span>
                        </td>
                        <td className="py-3 font-mono text-white/70">{emp.ctc}</td>
                        <td className="py-3 font-mono text-white/40">₹4,200</td>
                        <td className="py-3 font-mono text-white/40">₹200</td>
                        <td className="py-3 text-right text-emerald-400 font-bold font-sans">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
                          Ready
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Chart */}
            <div className="lg:col-span-1 bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <DollarSign size={12} />
                  Monthly Budget by Department
                </span>
              </div>
              <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                <EnterpriseChart type="bar" data={payrollChartData} height="220px" colorTheme="finance" />
              </div>
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[10px] text-white/50 leading-relaxed font-mono">
                Axis sync portal active. This bar chart is computed dynamically in real-time from CTC indexes in the staff registry.
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: LEAVE APPROVALS ── */}
        {activeSubTab === 'leaves' && (
          <div className="space-y-6 text-left max-w-4xl mx-auto">
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Leave Approval Queue</h3>
                <p className="text-[10px] text-white/40">Approve or deny submitted leave applications</p>
              </div>

              <div className="space-y-3">
                {leaveRequests.map(req => (
                  <div 
                    key={req.id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : req.status === 'Declined'
                        ? 'bg-rose-500/5 border-rose-500/20'
                        : 'bg-white/3 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white/95">{req.employeeName}</h4>
                        <span className="text-[10px] text-white/40">({req.role})</span>
                      </div>
                      <p className="text-[10px] text-white/60 leading-relaxed">
                        Date duration: <strong className="text-white">{req.dates} ({req.duration})</strong> • Reason: <em className="text-white/40">"{req.reason}"</em>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto">
                      {req.status === 'Pending' ? (
                        <>
                          <button 
                            onClick={() => handleDeclineLeave(req.id)}
                            className="h-8 w-8 rounded-lg border border-white/10 bg-black/40 hover:bg-rose-500/10 hover:border-rose-500/30 flex items-center justify-center text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Decline"
                          >
                            <X size={13} />
                          </button>
                          <button 
                            onClick={() => handleApproveLeave(req.id)}
                            className="h-8 w-8 rounded-lg bg-white hover:bg-neutral-200 flex items-center justify-center text-black transition-colors cursor-pointer"
                            title="Approve"
                          >
                            <Plus size={13} className="text-black rotate-45" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                          req.status === 'Approved'
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {leaveRequests.length === 0 && (
                  <div className="p-8 text-center text-white/30 italic border border-dashed border-white/5 rounded-xl">
                    No active leave requests pending.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </WorkspaceStateWrapper>

      {/* ── ONBOARD STAFF MODAL ── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl w-full max-w-md p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                Onboard New Staff Member
              </span>
              <button 
                onClick={() => setShowAddStaffModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-white/60 font-semibold">Staff Name</label>
                <input 
                  type="text" 
                  value={newStaffName} 
                  onChange={e => setNewStaffName(e.target.value)} 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white focus:border-white/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold">Corporate Role</label>
                <input 
                  type="text" 
                  value={newStaffRole} 
                  onChange={e => setNewStaffRole(e.target.value)} 
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white focus:border-white/20 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 font-semibold">Department Node</label>
                  <select 
                    value={newStaffDept} 
                    onChange={e => setNewStaffDept(e.target.value as any)}
                    className="w-full h-9 px-2 bg-neutral-900 border border-white/10 rounded-lg outline-none text-white focus:border-white/20 transition-colors"
                  >
                    <option value="Engineering" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Engineering</option>
                    <option value="HR" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Human Resources</option>
                    <option value="Finance" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Finance</option>
                    <option value="Operations" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Operations</option>
                    <option value="Sales" className="bg-neutral-900 text-white" style={{ backgroundColor: '#121212', color: '#ffffff' }}>Sales &amp; Growth</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/60 font-semibold">Monthly CTC</label>
                  <input 
                    type="text" 
                    value={newStaffCtc} 
                    onChange={e => setNewStaffCtc(e.target.value)} 
                    placeholder="e.g. ₹1,20,000"
                    className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 font-semibold">Corporate Email</label>
                <input 
                  type="email" 
                  value={newStaffEmail} 
                  onChange={e => setNewStaffEmail(e.target.value)} 
                  placeholder="Leave empty for auto-generation"
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg outline-none text-white focus:border-white/20 transition-colors"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white cursor-pointer hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 cursor-pointer"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
