import { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Activity, 
  Users, 
  ChevronRight
} from 'lucide-react';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface ProjectViewProps {
  user: any;
}

interface ProjectTask {
  id: string;
  title: string;
  epic: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  durationWeeks: number;
  startWeek: number;
}

interface Workload {
  name: string;
  role: string;
  allocatedTasks: number;
  maxCapacity: number;
  status: 'Optimal' | 'Overloaded' | 'Underutilized';
}

export default function ProjectView({ user: _user }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'board'>('timeline');
  const [loading] = useState(false);

  const [tasks, setTasks] = useState<ProjectTask[]>([
    { id: 'TSK-101', title: 'Axis Bank API OAuth Integration', epic: 'Finance Hub', status: 'In Progress', assignee: 'Jane Doe', priority: 'High', startWeek: 1, durationWeeks: 3 },
    { id: 'TSK-102', title: 'SCM Risk matrix coordinates plot', epic: 'SCM Engine', status: 'Review', assignee: 'Alex Sterling', priority: 'High', startWeek: 2, durationWeeks: 2 },
    { id: 'TSK-103', title: 'Workforce tree nested state cache', epic: 'HRMS Portal', status: 'Todo', assignee: 'Priya Sharma', priority: 'Medium', startWeek: 3, durationWeeks: 3 },
    { id: 'TSK-104', title: 'Secure gateway threat log queries', epic: 'Security SOC', status: 'In Progress', assignee: 'Rohan Sen', priority: 'High', startWeek: 1, durationWeeks: 4 },
    { id: 'TSK-105', title: 'IAM permissions roles map editor', epic: 'Identity Core', status: 'Done', assignee: 'Aditi Rao', priority: 'Medium', startWeek: 0, durationWeeks: 2 },
    { id: 'TSK-106', title: 'Audit Trail log CSV exporter', epic: 'Compliance', status: 'Backlog', assignee: 'Jane Doe', priority: 'Low', startWeek: 4, durationWeeks: 2 }
  ]);

  const [teamWorkloads] = useState<Workload[]>([
    { name: 'Jane Doe', role: 'Senior Cloud Engineer', allocatedTasks: 4, maxCapacity: 5, status: 'Optimal' },
    { name: 'Alex Sterling', role: 'VP Operations', allocatedTasks: 5, maxCapacity: 5, status: 'Overloaded' },
    { name: 'Priya Sharma', role: 'HR Operations Manager', allocatedTasks: 2, maxCapacity: 5, status: 'Optimal' },
    { name: 'Rohan Sen', role: 'Systems Operator', allocatedTasks: 3, maxCapacity: 5, status: 'Optimal' },
    { name: 'Aditi Rao', role: 'HR Recruitment Specialist', allocatedTasks: 1, maxCapacity: 5, status: 'Underutilized' }
  ]);

  const advanceTaskStatus = (id: string) => {
    const statuses: ProjectTask['status'][] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const idx = statuses.indexOf(task.status);
        const nextStatus = idx < statuses.length - 1 ? statuses[idx + 1] : task.status;
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const ganttData = useMemo(() => {
    return tasks.map(t => ({
      name: t.title,
      value: t.status === 'Done' ? 100 : t.status === 'Review' ? 80 : t.status === 'In Progress' ? 40 : 0,
      start: t.startWeek,
      duration: t.durationWeeks
    }));
  }, [tasks]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <CheckSquare className="text-white h-5 w-5 animate-pulse" />
            Delivery Command &amp; Project Planners
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Track operational project epics. Map tasks in horizontal Gantt milestones, manage scrum sprint backlogs, and inspect workload allocations.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 rounded-xl p-0.5 border border-white/5 shrink-0 self-center">
          <button 
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'timeline' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Milestone Gantt
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'board' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Sprint Scrum Board
          </button>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        {/* ── INTERACTIVE WORKSPACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* COLUMN 1, 2 & 3: TIMELINE OR KANBAN SPRINT BOARD */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} />
                {activeTab === 'timeline' ? 'Gantt Milestone Schedule' : 'Sprint Task Progression'}
              </span>
            </div>

            {activeTab === 'timeline' ? (
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5">
                <EnterpriseChart type="gantt" data={ganttData} height="280px" />
              </div>
            ) : (
              /* Sprint Kanban Scrum board */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {(['Backlog', 'Todo', 'In Progress', 'Review', 'Done'] as ProjectTask['status'][]).map(status => {
                  const statusTasks = tasks.filter(t => t.status === status);
                  
                  return (
                    <div key={status} className="bg-neutral-950/40 border border-white/5 rounded-2xl p-3 space-y-3 min-h-[300px] flex flex-col">
                      
                      {/* Column header */}
                      <div className="border-b border-white/5 pb-2 flex justify-between items-center text-xs">
                        <span className="font-bold text-white/80">{status}</span>
                        <span className="font-mono text-[9px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                          {statusTasks.length}
                        </span>
                      </div>

                      {/* Column cards container */}
                      <div className="flex-1 space-y-3 mt-2">
                        {statusTasks.map(task => (
                          <div 
                            key={task.id}
                            className="bg-neutral-900 border border-white/5 rounded-xl p-3 text-left space-y-2 hover:border-white/20 transition-all group"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[8px] font-mono text-white/30">{task.id}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${
                                task.priority === 'High' 
                                  ? 'border-rose-500/10 bg-rose-500/5 text-rose-400' 
                                  : 'border-white/10 bg-white/5 text-white/50'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            <div className="font-semibold text-xs text-white/95 truncate">
                              {task.title}
                            </div>

                            <div className="flex justify-between items-center text-[9px] text-white/45">
                              <span>{task.assignee}</span>
                              <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">{task.epic}</span>
                            </div>

                            {/* Quick advance control */}
                            {status !== 'Done' && (
                              <button 
                                onClick={() => advanceTaskStatus(task.id)}
                                className="w-full mt-2 py-1 bg-white hover:bg-neutral-200 text-black text-[9px] font-bold rounded flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                              >
                                <span>Next stage</span>
                                <ChevronRight size={10} />
                              </button>
                            )}
                          </div>
                        ))}
                        {statusTasks.length === 0 && (
                          <div className="text-[9px] text-white/20 italic py-8 text-center">
                            Empty
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMN 4: TEAM WORKLOAD ALLOCATIONS (RIGHT) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Users size={12} />
                Team Workload Limits
              </span>
            </div>

            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
              {teamWorkloads.map(member => (
                <div key={member.name} className="space-y-2 text-xs text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-white/95">{member.name}</h5>
                      <span className="text-[9px] text-white/40">{member.role}</span>
                    </div>
                    
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      member.status === 'Optimal' 
                        ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' 
                        : member.status === 'Overloaded'
                        ? 'border-rose-500/10 bg-rose-500/5 text-rose-400'
                        : 'border-white/10 bg-white/5 text-white/50'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="space-y-1 pt-0.5">
                    <div className="flex justify-between text-[9px] text-white/40 font-mono">
                      <span>Task limit load</span>
                      <span>{member.allocatedTasks} / {member.maxCapacity}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          member.status === 'Overloaded' ? 'bg-rose-500' : 'bg-white'
                        }`} 
                        style={{ width: `${(member.allocatedTasks / member.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-[10px] leading-relaxed text-white/50 text-left">
              <span className="text-white font-bold block mb-1">Load Balancing Sync:</span>
              Alerts trigger if an engineer exceeds 5 concurrently active sprint nodes.
            </div>
          </div>

        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
