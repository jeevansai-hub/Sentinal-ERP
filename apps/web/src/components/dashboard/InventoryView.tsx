import { useState, useMemo } from 'react';
import { 
  Package, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';
import EnterpriseChart from '../common/EnterpriseChart';
import WorkspaceStateWrapper from '../common/WorkspaceStateWrapper';

interface InventoryViewProps {
  user: any;
}

interface RackZone {
  id: string;
  name: string;
  capacityPercent: number;
  itemStored: string;
  skuCode: string;
  status: 'Optimal' | 'Overcapacity' | 'Low Stock';
}

interface ReorderTrigger {
  sku: string;
  name: string;
  currentStock: number;
  minSafeStock: number;
  supplier: string;
  reorderQuantity: number;
  status: 'Triggered' | 'Pending' | 'Auto-Approved';
}

export default function InventoryView({ user: _user }: InventoryViewProps) {
  const [loading] = useState(false);
  const [selectedZone, setSelectedZone] = useState<RackZone | null>(null);

  const stockMovementData = [
    { name: 'Mon', value: 80, compareValue: 60 },
    { name: 'Tue', value: 92, compareValue: 70 },
    { name: 'Wed', value: 78, compareValue: 68 },
    { name: 'Thu', value: 88, compareValue: 72 },
    { name: 'Fri', value: 95, compareValue: 78 },
    { name: 'Sat', value: 84, compareValue: 80 },
    { name: 'Sun', value: 90, compareValue: 82 }
  ];

  const [rackZones, setRackZones] = useState<RackZone[]>([
    { id: '1', name: 'Rack A-1', capacityPercent: 82, itemStored: 'Carbon Alloy Rods', skuCode: 'SKU-8821', status: 'Optimal' },
    { id: '2', name: 'Rack A-2', capacityPercent: 95, itemStored: 'Structural Rebars', skuCode: 'SKU-9901', status: 'Overcapacity' },
    { id: '3', name: 'Rack B-1', capacityPercent: 22, itemStored: 'Premium Copper Wire', skuCode: 'SKU-2847', status: 'Low Stock' },
    { id: '4', name: 'Rack B-2', capacityPercent: 70, itemStored: 'High-Tensile Bolts', skuCode: 'SKU-1082', status: 'Optimal' },
    { id: '5', name: 'Zone C-1', capacityPercent: 55, itemStored: 'Aluminum Sheet Coils', skuCode: 'SKU-4912', status: 'Optimal' },
    { id: '6', name: 'Zone C-2', capacityPercent: 12, itemStored: 'Refined Zinc ingots', skuCode: 'SKU-1192', status: 'Low Stock' }
  ]);

  const [reorders, setReorders] = useState<ReorderTrigger[]>([
    { sku: 'SKU-2847', name: 'Premium Copper Wire', currentStock: 120, minSafeStock: 500, supplier: 'Hindalco Extrusions', reorderQuantity: 1000, status: 'Pending' },
    { sku: 'SKU-1192', name: 'Refined Zinc Ingots', currentStock: 45, minSafeStock: 300, supplier: 'Vedanta Sourcing', reorderQuantity: 500, status: 'Pending' }
  ]);

  const handleTriggerReorder = (sku: string) => {
    setReorders(prev => prev.map(item => item.sku === sku ? { ...item, status: 'Triggered' } : item));
    setRackZones(prev => prev.map(zone => {
      if (zone.skuCode === sku) {
        return { ...zone, capacityPercent: 85, status: 'Optimal' };
      }
      return zone;
    }));
    alert(`Reorder dispatch PO generated automatically for ${sku}. Sent to SCM gateway sync.`);
  };

  const treemapData = useMemo(() => {
    return rackZones.map(z => ({
      name: `${z.name} - ${z.itemStored}`,
      value: z.capacityPercent,
      color: z.status === 'Low Stock' 
        ? 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/30 text-amber-400' 
        : z.status === 'Overcapacity' 
        ? 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/30 text-rose-400' 
        : 'bg-white/5 border-white/5 hover:border-white/10 text-white',
      skuCode: z.skuCode,
      status: z.status
    }));
  }, [rackZones]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-left">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Package className="text-white h-5 w-5 animate-pulse" />
            Warehouse Intelligence &amp; Stock Layout
          </h2>
          <p className="text-xs text-white/50 leading-relaxed max-w-2xl">
            Live storage allocation maps, capacity alerts, stock level thresholds, and automated reorder execution nodes.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex gap-4 self-center shrink-0">
          <div className="text-right border-r border-white/10 pr-4">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Average Capacity Use</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">
              {Math.round(rackZones.reduce((acc, curr) => acc + curr.capacityPercent, 0) / rackZones.length)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Replenishments Pending</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5 font-mono">
              {reorders.filter(r => r.status === 'Pending').length} SKUs
            </div>
          </div>
        </div>
      </div>

      <WorkspaceStateWrapper loading={loading} skeletonType="chart">
        {/* ── 2D FLOORPLAN RACK GRID & DETAILS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1 & 2: WAREHOUSE MAP FLOORPLAN */}
          <div className="lg:col-span-2 space-y-4 bg-neutral-950/20 border border-white/5 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
              Warehouse Floorplan Capacity (Treemap Grid)
            </span>
            
            <div className="pt-2">
              <EnterpriseChart 
                type="treemap" 
                data={treemapData} 
                height="240px" 
                onNodeClick={(node) => {
                  const matchedZone = rackZones.find(z => z.skuCode === (node as any).skuCode);
                  if (matchedZone) setSelectedZone(matchedZone);
                }}
              />
            </div>

            {/* Interactive SVG Stock Movement timeline chart */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={12} />
                Stock Movement Flow Band
              </span>

              <div className="bg-neutral-950/20 border border-white/5 rounded-xl p-2.5">
                <EnterpriseChart type="comparative" data={stockMovementData} height="130px" colorTheme="inventory" />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-white/40 px-1">
                <span className="text-emerald-400">● Incoming Stock (Optimal)</span>
                <span className="text-white/45">-- Outgoing Consumption</span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: SELECTED DETAILS & REORDER ENGINE */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Selected rack node information */}
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4 text-left">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                  Rack Telemetry Details
                </span>
              </div>

              {selectedZone ? (
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-white text-sm">{selectedZone.name}</div>
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="text-white/30 block">Stored Item</span>
                      <strong className="text-white/80">{selectedZone.itemStored}</strong>
                    </div>
                    <div>
                      <span className="text-white/30 block">SKU Code</span>
                      <strong className="text-white/80 font-mono">{selectedZone.skuCode}</strong>
                    </div>
                    <div>
                      <span className="text-white/30 block">Allocation Status</span>
                      <span className={`font-bold ${
                        selectedZone.status === 'Low Stock' ? 'text-amber-400' : selectedZone.status === 'Overcapacity' ? 'text-rose-500' : 'text-emerald-400'
                      }`}>{selectedZone.status}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">Capacity Filled</span>
                      <strong className="text-white font-mono">{selectedZone.capacityPercent}%</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/30 italic">Click on any rack cell node in the treemap to query layout metrics.</div>
              )}
            </div>

            {/* Reorder Recommendation Matrix */}
            <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 space-y-4 text-left">
              <div className="border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={12} className="text-amber-400" />
                  Auto Reorder Engine Recommendations
                </span>
              </div>

              <div className="space-y-3.5">
                {reorders.map(item => (
                  <div key={item.sku} className="p-3 bg-white/3 border border-white/5 rounded-xl space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[9px] text-white/30 font-mono mt-0.5">{item.sku}</div>
                      </div>
                      
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => handleTriggerReorder(item.sku)}
                          className="px-2 py-1 bg-white text-black text-[10px] font-bold rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          Reorder
                        </button>
                      ) : (
                        <span className="text-[9px] text-emerald-400 font-bold border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded uppercase tracking-wider">
                          PO Dispatched
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[9px] text-white/50 border-t border-white/5 pt-2">
                      <div>
                        <span>Stock level</span>
                        <strong className="block text-white/85 font-mono">{item.currentStock} units</strong>
                      </div>
                      <div>
                        <span>Safe stock</span>
                        <strong className="block text-white/85 font-mono">{item.minSafeStock} units</strong>
                      </div>
                      <div>
                        <span>Reorder qty</span>
                        <strong className="block text-white/85 font-mono">+{item.reorderQuantity}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </WorkspaceStateWrapper>

    </div>
  );
}
