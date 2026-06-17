import { useState } from 'react';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import EnterpriseChart from '../common/EnterpriseChart';
import { Cpu, Save, Plus, ArrowRight } from 'lucide-react';

export default function WorkflowStudioView() {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState('Trigger');

  const nodes = [
    { name: 'Trigger (Event)', value: 100, x: 25, y: 30, color: '#3B82F6' },
    { name: 'Filter (Verify)', value: 100, x: 75, y: 30, color: '#F59E0B' },
    { name: 'API Action (Post)', value: 100, x: 50, y: 75, color: '#10B981' }
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Workspace automation flow configuration saved successfully!');
    }, 550);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Cpu size={12} />
            <span>Intelligence & Automation Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Visual Workflow Studio</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            AI Operating System workflow designer. Construct multi-step conditional chains, configure action payloads, and map system endpoints.
          </p>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: ACTIVE DESIGN CANVAS */}
          <div className="lg:col-span-8 bg-neutral-950/40 border border-white/5 p-5 rounded-2xl text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Connective Nodes Topology</span>
              <button 
                onClick={() => alert('New step node added.')}
                className="h-7 px-2.5 bg-white/5 border border-white/8 hover:bg-white/10 rounded-lg text-[9px] font-mono text-white/70 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Plus size={10} /> Add Node
              </button>
            </div>
            <EnterpriseChart type="workflow" data={nodes} height="200px" colorTheme="admin" />
          </div>

          {/* RIGHT COLUMN: PARAMETER INSPECTOR */}
          <div className="lg:col-span-4 bg-neutral-950/40 border border-white/5 p-5 rounded-2xl text-left space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Node Inspector</span>
              <span className="text-[9px] font-mono text-white/35">ID: wf-202</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-1.5 flex-wrap">
                {['Trigger', 'Filter', 'Action'].map(step => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(step)}
                    className={`px-3 py-1.5 border rounded-lg font-mono text-[9px] font-bold cursor-pointer transition-all ${
                      activeStep === step
                        ? 'bg-white text-black border-white'
                        : 'bg-white/3 border-white/5 text-white/50 hover:bg-white/5'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {activeStep === 'Trigger' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Trigger Event Type</label>
                    <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl font-mono text-[10px] text-white flex items-center gap-1.5">
                      <span>Event: Invoice Overdue</span>
                      <ArrowRight size={10} className="text-white/40" />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">Runs whenever an invoice in Finance Center flags status Overdue.</p>
                </div>
              )}

              {activeStep === 'Filter' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Evaluation Constraints</label>
                    <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl font-mono text-[10px] text-white">
                      <span>Value &gt; ₹5,00,000</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">Limits trigger scope to high-value capital items requiring CFO approval.</p>
                </div>
              )}

              {activeStep === 'Action' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Action Endpoint payload</label>
                    <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl font-mono text-[10px] text-white">
                      <span>POST integration/slack/chat</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">Dispatches alert payload to the appropriate channel in Slack.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              className="w-full h-10 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Save size={13} />
              <span>Save Workflow Config</span>
            </button>
          </div>

        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
