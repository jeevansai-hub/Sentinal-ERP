import { useState } from 'react';
import EnterpriseDataGrid from '../common/EnterpriseDataGrid';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';
import { Bell, Check, MailOpen } from 'lucide-react';

interface NotificationItem {
  id: string;
  timestamp: string;
  source: 'System' | 'SLA Monitor' | 'HR' | 'Finance';
  content: string;
  isRead: boolean;
}

export default function NotificationCenterView() {
  const [loading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', timestamp: '2026-06-11 16:30', source: 'SLA Monitor', content: 'Purchase Order approvals are pending over 48 hours in the CFO queue.', isRead: false },
    { id: '2', timestamp: '2026-06-11 15:12', source: 'System', content: 'SKU-2847 in Warehouse A has dropped below safe margin counts.', isRead: false },
    { id: '3', timestamp: '2026-06-11 10:05', source: 'HR', content: 'Workforce salary registers for June are finalized. Review required.', isRead: true },
    { id: '4', timestamp: '2026-06-11 08:00', source: 'Finance', content: 'Scheduled invoice auditing task run completed successfully.', isRead: true }
  ]);

  const handleMarkAsRead = (row: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === row.id ? { ...n, isRead: true } : n));
  };

  const handleBulkMarkRead = (selected: NotificationItem[]) => {
    setNotifications(prev => prev.map(n => {
      if (selected.some(s => s.id === n.id)) {
        return { ...n, isRead: true };
      }
      return n;
    }));
  };

  const columns = [
    { key: 'timestamp', label: 'Time Received', sortable: true },
    { key: 'source', label: 'Source Module', sortable: true },
    { key: 'content', label: 'Alert Message Content', sortable: true },
    {
      key: 'isRead',
      label: 'Read Status',
      sortable: true,
      render: (val: boolean) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
          val 
            ? 'bg-white/5 text-white/40 border border-white/10' 
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
        }`}>
          {val ? 'Read' : 'Unread'}
        </span>
      )
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HERO BANNER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/3 border border-white/5 p-6 rounded-2xl">
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-bold text-white/45 tracking-widest uppercase flex items-center gap-1.5">
            <Bell size={12} />
            <span>Executive Intelligence Suite</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Platform Notification Center</h2>
          <p className="text-xs text-white/40 max-w-lg leading-relaxed">
            Central communications clearinghouse. Audit incoming webhook alerts, SLA warnings, and direct employee task requests.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="h-10 bg-white text-black rounded-xl px-4 flex items-center gap-2 font-bold text-xs">
            <MailOpen size={14} />
            <span>{unreadCount} Unread Notifications</span>
          </div>
        )}
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="grid">
        
        {/* ── ALERTS TABLE GRID ── */}
        <div className="bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
          <EnterpriseDataGrid
            data={notifications}
            columns={columns}
            searchKeys={['source', 'content']}
            searchPlaceholder="Search notifications by keyword or source..."
            bulkActions={[
              { label: 'Mark Selected as Read', action: handleBulkMarkRead }
            ]}
            rowActions={[
              { label: 'Acknowledge', action: handleMarkAsRead, icon: Check }
            ]}
          />
        </div>

      </WorkspaceStateWrapper>

    </div>
  );
}
