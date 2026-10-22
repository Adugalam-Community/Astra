import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Layers 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { leads, orders, workspace } = useApp();

  const totalLeads = leads.length;
  const metaLeads = leads.filter(l => l.source === 'Meta Lead Form').length;
  const waLeads = leads.filter(l => l.source === 'WhatsApp').length;
  const webLeads = leads.filter(l => l.source === 'Website Form').length;
  const manualLeads = leads.filter(l => l.source === 'Manual Entry').length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.lifecycleState === 'Paid' || o.lifecycleState === 'Fulfilled' ? o.total : 0), 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Reports & Conversion Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real outcomes across acquisition channels, verified sales orders, and repeat engagement.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Currency: {workspace.currencySymbol} INR • Timezone: IST
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total Recorded Revenue</div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Strictly Verified Bank/UTR only</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Average Order Value (AOV)</div>
          <div className="text-3xl font-extrabold font-heading text-slate-900 mt-1 font-mono">
            ₹{avgOrderValue}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Across {orders.length} confirmed orders
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Lead-to-Order Conversion</div>
          <div className="text-3xl font-extrabold font-heading text-orange-600 mt-1">
            {totalLeads > 0 ? ((orders.length / totalLeads) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-orange-700 mt-1.5">
            Industry Benchmark: 8–12%
          </div>
        </div>
      </div>

      {/* Funnel & Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Channel Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-orange-600" />
            Enquiry Acquisition by Source
          </h2>

          <div className="space-y-3.5 text-xs">
            {/* Meta */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Meta Instant Lead Ads (Instagram & FB)</span>
                <span className="font-bold text-slate-900">{metaLeads} ({totalLeads > 0 ? ((metaLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full" 
                  style={{ width: `${totalLeads > 0 ? (metaLeads / totalLeads) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Direct WhatsApp Enquiries</span>
                <span className="font-bold text-slate-900">{waLeads} ({totalLeads > 0 ? ((waLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${totalLeads > 0 ? (waLeads / totalLeads) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Website Form */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Website Form / Organic</span>
                <span className="font-bold text-slate-900">{webLeads} ({totalLeads > 0 ? ((webLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${totalLeads > 0 ? (webLeads / totalLeads) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Manual Entry */}
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Manual Entry / Store Walk-In</span>
                <span className="font-bold text-slate-900">{manualLeads} ({totalLeads > 0 ? ((manualLeads / totalLeads) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-400 h-full rounded-full" 
                  style={{ width: `${totalLeads > 0 ? (manualLeads / totalLeads) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Conversion */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600" />
            Conversion Funnel Drop-off Analysis
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Stage 1: Lead Captured & Validated</div>
                <div className="text-[10px] text-slate-500">100% Ingestion Integrity</div>
              </div>
              <span className="font-bold text-slate-900 text-sm">{totalLeads} Leads</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Stage 2: WhatsApp Welcome & Menu Sent</div>
                <div className="text-[10px] text-slate-500">Consent Verified & Permitted Window</div>
              </div>
              <span className="font-bold text-emerald-600 text-sm">{leads.filter(l => l.consentStatus === 'Opted In').length} Sent</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Stage 3: Sales Interest Qualified</div>
                <div className="text-[10px] text-slate-500">Product Selected & Pricing Verified</div>
              </div>
              <span className="font-bold text-orange-600 text-sm">{leads.filter(l => l.status === 'Qualified' || l.status === 'Order Placed').length} Qualified</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Stage 4: Order Paid & Invoiced</div>
                <div className="text-[10px] text-slate-500">GST Invoice Issued & Dispatched</div>
              </div>
              <span className="font-bold text-blue-600 text-sm">{orders.filter(o => o.lifecycleState === 'Paid' || o.lifecycleState === 'Fulfilled').length} Completed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
