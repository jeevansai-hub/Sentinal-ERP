import { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Award, 
  TrendingUp, 
  FileText, 
  Clock, 
  Download,
  Sparkles,
  ChevronRight,
  Brain,
  Plus
} from 'lucide-react';

interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  orgName?: string;
  industry?: string;
}

interface ProfileViewProps {
  user: UserSession | null;
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'payroll'>('profile');
  const [aiCareerInsight, setAiCareerInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Profile data details
  const employeeData = {
    empId: 'SN-EMP-20819',
    designation: 'Lead Operations Director',
    department: 'Corporate Operations Control',
    phone: '+91 98765 43210',
    location: 'Bangalore HQ (Hybrid)',
    joinedDate: 'January 15, 2024',
    supervisor: 'Alexander Sterling (VP Corporate Operations)',
    peers: ['Priya Sharma (HR Operations)', 'Rahul Varma (Financial Analyst)'],
    attendanceRate: '98.4%',
    completedTraining: '100% (SOC 2, ISO 27001)',
  };

  const currentGoals = [
    { title: 'Reduce pending PO approval cycles below 2 hours', progress: 85, category: 'Operational Efficiency' },
    { title: 'Finalize quarterly SCM logistics restructuring', progress: 60, category: 'Supply Chain Sourcing' },
    { title: 'Rollout role-based credential audit across 4 divisions', progress: 100, category: 'Infrastructure Compliance' }
  ];

  const certifiedList = [
    { title: 'Certified Information Systems Auditor (CISA)', issuer: 'ISACA', date: '2025' },
    { title: 'Project Management Professional (PMP)', issuer: 'PMI', date: '2024' },
    { title: 'SOC 2 Core Implementer Standards Certificate', issuer: 'Sentinel Trust Guard', date: '2026' }
  ];

  // AI Career Advice Generator
  const generateCareerAdvice = () => {
    setLoadingInsight(true);
    setAiCareerInsight(null);
    setTimeout(() => {
      setLoadingInsight(false);
      setAiCareerInsight(
        "Based on your operational logs, you exhibit strong efficiency in workflow automation audits (averaging 85% reduction times). Suggested path: Transition towards VP of Intelligent Systems Operations. Next recommended cert: AWS Certified Solutions Architect Associate."
      );
    }, 900);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── HEADER BANNER ── */}
      <div className="bg-white/3 border border-white/5 rounded-3xl p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-32 w-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Profile Card left info */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-black font-extrabold text-2xl border border-white/10 shrink-0">
            {user?.displayName?.[0] || 'A'}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-bold tracking-tight text-white">{user?.displayName || 'Administrator'}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Briefcase size={12} />
                <span>{employeeData.designation}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{employeeData.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'performance' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Goals &amp; Reviews
          </button>
          <button 
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'payroll' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Compensation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TAB 1: PROFILE OVERVIEW */}
        {activeTab === 'profile' && (
          <>
            {/* Left Column: Personal info & Certs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile details grid */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workplace Parameters</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-white/40 block">Employee ID</span>
                    <span className="font-mono text-white/90">{employeeData.empId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Department Node</span>
                    <span className="font-semibold text-white/90">{employeeData.department}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Email Address</span>
                    <span className="font-mono text-white/90">{user?.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Corporate Phone</span>
                    <span className="font-mono text-white/90">{employeeData.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Joining Date</span>
                    <span className="font-semibold text-white/90">{employeeData.joinedDate}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/40 block">Active Attendance Rate</span>
                    <span className="font-bold text-emerald-400">{employeeData.attendanceRate}</span>
                  </div>
                </div>
              </div>

              {/* Organization Hierarchy Card */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Corporate Line Hierarchy</h3>
                </div>
                
                <div className="space-y-3.5 text-xs text-left">
                  {/* Supervisor */}
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white/20"></div>
                    <div className="space-y-0.5">
                      <span className="text-white/45 block text-[10px] uppercase font-bold">Reporting Manager</span>
                      <span className="font-semibold text-white/90">{employeeData.supervisor}</span>
                    </div>
                  </div>

                  {/* Peers */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <div className="space-y-1">
                      <span className="text-white/45 block text-[10px] uppercase font-bold">Peer Connections</span>
                      <div className="flex flex-col gap-1 text-white/80 font-medium">
                        {employeeData.peers.map((peer, i) => (
                          <span key={i}>{peer}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications and Compliance uploads */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Uploads &amp; Certifications</h3>
                  <button className="text-[10px] font-bold text-white hover:underline flex items-center gap-0.5 cursor-pointer">
                    <Plus size={10} />
                    <span>Upload Cert</span>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {certifiedList.map((cert, i) => (
                    <div key={i} className="p-3 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5 text-left">
                        <div className="font-semibold text-white/90">{cert.title}</div>
                        <div className="text-[10px] text-white/40">{cert.issuer} • Issued {cert.date}</div>
                      </div>
                      <button className="text-white/40 hover:text-white transition-colors cursor-pointer">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: AI Insights & Quick Stats */}
            <div className="space-y-6">
              
              {/* AI Career Advice Card */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-5 text-left space-y-4 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-white/5">
                  <Brain size={30} className="animate-pulse" />
                </div>
                
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Sparkles size={14} className="text-white" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Career Pathways</h3>
                </div>

                {loadingInsight ? (
                  <div className="text-xs text-white/40 py-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                    <span>Analyzing performance records...</span>
                  </div>
                ) : aiCareerInsight ? (
                  <div className="space-y-3">
                    <p className="text-xs text-white/75 leading-relaxed font-sans">{aiCareerInsight}</p>
                    <button 
                      onClick={() => setAiCareerInsight(null)}
                      className="text-[9px] font-bold text-white/40 hover:text-white uppercase tracking-widest block pt-1 cursor-pointer"
                    >
                      Reset AI Audit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Evaluate active system logs to map developmental training and role recommendations.
                    </p>
                    <button 
                      onClick={generateCareerAdvice}
                      className="h-9 px-3 w-full bg-white text-black text-xs font-semibold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Synthesize Performance Logs</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Achievements Badges Card */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 text-left space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Achievements &amp; Accolades</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Award size={10} />
                    Compliance Master
                  </span>
                  <span className="px-2.5 py-1 text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={10} />
                    SLA Accelerator
                  </span>
                  <span className="px-2.5 py-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} />
                    98% Attendance
                  </span>
                </div>
              </div>

            </div>
          </>
        )}

        {/* TAB 2: PERFORMANCE GOALS */}
        {activeTab === 'performance' && (
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active OKRs &amp; Performance Objectives</h3>
              </div>

              <div className="space-y-4">
                {currentGoals.map((goal, i) => (
                  <div key={i} className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between items-start text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block">{goal.category}</span>
                        <h4 className="font-semibold text-white/95">{goal.title}</h4>
                      </div>
                      <span className="font-bold text-white">{goal.progress}% completed</span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full transition-all duration-500" style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYROLL / COMPENSATION */}
        {activeTab === 'payroll' && (
          <div className="lg:col-span-3 space-y-6 text-left">
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Corporate Compensation Matrix</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
                  <span className="text-white/40 block">Gross Monthly CTC</span>
                  <div className="text-xl font-bold text-white font-mono">₹1,85,000</div>
                  <span className="text-[10px] text-white/30">Tax declarations fully filed for Q2</span>
                </div>
                
                <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
                  <span className="text-white/40 block">Isolated Bank Account Link</span>
                  <div className="text-xl font-bold text-white font-mono">Axis Bank •••• 9283</div>
                  <span className="text-[10px] text-white/30">Direct salary deposit sync enabled</span>
                </div>
              </div>

              {/* Pay slips table */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block">Downloadable Payroll Statements</span>
                
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText size={14} className="text-white/50" />
                      <span className="font-semibold text-white/90">Salary Slip — May 2026</span>
                    </div>
                    <button className="text-white/45 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold">
                      <Download size={12} />
                      <span>PDF</span>
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText size={14} className="text-white/50" />
                      <span className="font-semibold text-white/90">Salary Slip — April 2026</span>
                    </div>
                    <button className="text-white/45 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold">
                      <Download size={12} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
