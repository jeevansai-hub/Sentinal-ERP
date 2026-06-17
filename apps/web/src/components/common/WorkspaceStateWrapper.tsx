import React from 'react';
import { ShieldAlert, WifiOff, RefreshCw, Layers } from 'lucide-react';

interface WorkspaceStateWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | string | null;
  offline?: boolean;
  denied?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  skeletonType?: 'grid' | 'chart' | 'list' | 'card';
  onRetry?: () => void;
}

export default function WorkspaceStateWrapper({
  children,
  loading = false,
  error = null,
  offline = false,
  denied = false,
  empty = false,
  emptyMessage = 'No data records found in this view context.',
  skeletonType = 'list',
  onRetry
}: WorkspaceStateWrapperProps) {
  
  // ── 1. OFFLINE STATE ──
  if (offline) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-950/40 border border-white/5 rounded-2xl h-80 space-y-4">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
          <WifiOff size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Node Connection Lost</h4>
          <p className="text-[10px] text-white/40 max-w-xs leading-relaxed">
            Your workstation has disconnected from the Sentinel ERP main secure cluster.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="h-8 px-3.5 border border-white/10 hover:border-white/20 bg-white/5 rounded-xl text-[10px] font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={11} className="animate-spin-slow" />
            <span>Reconnect Gateway</span>
          </button>
        )}
      </div>
    );
  }

  // ── 2. ACCESS DENIED ──
  if (denied) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-950/40 border border-white/5 rounded-2xl h-80 space-y-4">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Access Node Restricted</h4>
          <p className="text-[10px] text-white/40 max-w-xs leading-relaxed">
            Your authorization role tokens do not grant decryption credentials for this operational workspace.
          </p>
        </div>
      </div>
    );
  }

  // ── 3. RUNTIME / BOUNDARY ERRORS ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-950/40 border border-white/5 rounded-2xl h-80 space-y-4">
        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Decryption Fault</h4>
          <p className="text-[10px] text-white/40 max-w-xs leading-relaxed truncate">
            {typeof error === 'string' ? error : error.message || 'Unknown Workspace Pipeline Exception'}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="h-8 px-3.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
          >
            Retry Load
          </button>
        )}
      </div>
    );
  }

  // ── 4. SKELETON LOADERS ──
  if (loading) {
    return (
      <div className="w-full space-y-4">
        {skeletonType === 'list' && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-11 bg-neutral-950/40 border border-white/5 rounded-xl flex items-center justify-between px-4">
                <div className="h-2.5 w-1/4 shimmer-element rounded" />
                <div className="h-2.5 w-1/3 shimmer-element rounded" />
                <div className="h-2.5 w-12 shimmer-element rounded" />
              </div>
            ))}
          </div>
        )}
        
        {skeletonType === 'grid' && (
          <div className="space-y-4">
            <div className="h-9 w-48 shimmer-element rounded-xl" />
            <div className="border border-white/5 rounded-2xl overflow-hidden bg-neutral-950/40">
              <div className="h-10 bg-white/[0.02] shimmer-element border-b border-white/5" />
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="h-3.5 w-4 shimmer-element rounded" />
                    <div className="h-3.5 flex-1 shimmer-element rounded" />
                    <div className="h-3.5 w-24 shimmer-element rounded" />
                    <div className="h-3.5 w-16 shimmer-element rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {skeletonType === 'chart' && (
          <div className="p-5 border border-white/5 bg-neutral-950/45 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="h-3.5 w-32 shimmer-element rounded-lg" />
              <div className="h-3.5 w-16 shimmer-element rounded-lg" />
            </div>
            <div className="h-44 bg-neutral-950/30 border border-white/5 rounded-xl flex items-end justify-between p-4 relative overflow-hidden">
              <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 400 200" preserveAspectRatio="none">
                {[40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#FFFFFF" strokeDasharray="3,3" />
                ))}
                <path d="M 0 120 Q 100 80 200 130 T 400 90" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
              {[40, 60, 50, 80, 65, 45, 90, 70].map((h, i) => (
                <div key={i} className="w-[8%] shimmer-element rounded-t opacity-20" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        )}

        {skeletonType === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border border-white/5 bg-neutral-950/40 rounded-2xl space-y-3">
                <div className="h-3 w-16 shimmer-element rounded" />
                <div className="h-5 w-24 shimmer-element rounded" />
                <div className="h-2.5 w-full shimmer-element rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── 5. EMPTY STATES ──
  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-950/40 border border-white/5 rounded-2xl h-64 space-y-3">
        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/30">
          <Layers size={16} />
        </div>
        <p className="text-[10px] text-white/40 max-w-xs leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
