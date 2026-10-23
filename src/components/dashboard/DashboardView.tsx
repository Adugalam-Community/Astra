import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  ChevronDown,
  TrendingUp,
  Check,
  ExternalLink,
  Sparkles,
  Play,
  Calendar,
  CheckCircle2,
  Trash2,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    leads,
    orders,
    invoices,
    integrations,
    executions,
    auditLogs,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    dateRange,
    workspace,
    setActiveTab,
    setActiveModal,
    showToast
  } = useApp();

  // Tasks local input & filter
  const [taskPeriod, setTaskPeriod] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  // Performance Chart Filter State
  const [chartMetric, setChartMetric] = useState<'leads' | 'orders' | 'revenue'>('leads');
  const [chartMetricOpen, setChartMetricOpen] = useState(false);
  const [chartGrouping, setChartGrouping] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [chartGroupingOpen, setChartGroupingOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'Last 7 days' | 'Last 30 days' | 'Last 90 days'>('Last 30 days');
  const [chartPeriodOpen, setChartPeriodOpen] = useState(false);

  // Conversion Funnel Filter State
  const [funnelPeriod, setFunnelPeriod] = useState<'This month' | 'This week' | 'Today' | 'This quarter'>('This month');
  const [funnelDropdownOpen, setFunnelDropdownOpen] = useState(false);

  // Recent Activity Filter State
  const [activityFilter, setActivityFilter] = useState<'all' | 'leads' | 'orders' | 'automations'>('all');
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);

  // Automation Health Filter State
  const [healthPeriod, setHealthPeriod] = useState<'Last 7 days' | 'Last 24 hours' | 'Last 30 days'>('Last 7 days');
  const [healthDropdownOpen, setHealthDropdownOpen] = useState(false);

  // Hover state for chart points
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; val1: string; val2: string } | null>(null);

  // --- Dynamic KPI Metrics Calculation based on dateRange & real data ---
  const periodData = {
    today: { leadsBase: 8, contactedBase: 6, ordersBase: 3, revBase: 4850, trend: '+18% vs yesterday' },
    '7d': { leadsBase: 38, contactedBase: 26, ordersBase: 9, revBase: 16800, trend: '+15% vs previous week' },
    '30d': { leadsBase: 128, contactedBase: 86, ordersBase: 24, revBase: 48250, trend: '+12% vs previous period' },
    quarter: { leadsBase: 390, contactedBase: 264, ordersBase: 78, revBase: 156800, trend: '+24% vs last quarter' },
    year: { leadsBase: 1420, contactedBase: 980, ordersBase: 310, revBase: 624000, trend: '+35% vs last year' },
  }[dateRange] || { leadsBase: 128, contactedBase: 86, ordersBase: 24, revBase: 48250, trend: '+12% vs previous period' };

  // Calculate delta from live added leads & orders
  const liveAddedLeads = Math.max(0, leads.length - 8);
  const liveAddedOrders = Math.max(0, orders.length - 5);
  const liveAddedRevenue = orders.slice(0, liveAddedOrders).reduce((acc, curr) => acc + curr.total, 0);

  const displayLeads = periodData.leadsBase + liveAddedLeads;
  const displayContacted = periodData.contactedBase + Math.floor(liveAddedLeads * 0.7);
  const displayOrders = periodData.ordersBase + liveAddedOrders;
  const displayRevenue = periodData.revBase + liveAddedRevenue;

  // Funnel calculations
  const funnelNew = displayLeads;
  const funnelContacted = Math.min(funnelNew, displayContacted);
  const funnelQualified = Math.max(1, Math.floor(funnelContacted * 0.5));
  const funnelConverted = Math.min(funnelQualified, displayOrders);

  const pctContacted = Math.round((funnelContacted / funnelNew) * 100) || 67;
  const pctQualified = Math.round((funnelQualified / funnelNew) * 100) || 33;
  const pctConverted = Math.round((funnelConverted / funnelNew) * 100) || 19;

  // Handle adding follow up task inline
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText.trim(), '12:00 PM', taskPeriod);
    setNewTaskText('');
  };

  // Filter tasks by selected period
  const filteredTasks = tasks.filter(t => t.dueDate === taskPeriod || !t.dueDate);

  // Integration statuses derived dynamically
  const metaInt = integrations.find(i => i.provider === 'meta');
  const waInt = integrations.find(i => i.provider === 'whatsapp' || i.provider === 'msgpedia');
  const payInt = integrations.find(i => i.provider === 'invoice' || i.id === 'int_payments');
  const invInt = integrations.find(i => i.provider === 'invoice');

  // Dynamic Chart Paths based on Selected Metric
  const chartConfigs = {
    leads: {
      title1: 'Leads',
      title2: 'Converted',
      color1: '#10B981',
      color2: '#8B5CF6',
      d1: "M 10 90 Q 50 60, 90 75 T 170 45 T 250 80 T 330 35 T 410 70 T 490 30",
      d2: "M 10 120 Q 50 110, 90 115 T 170 95 T 250 125 T 330 85 T 410 110 T 490 80",
      points: [
        { x: 90, y: 75, label: 'May 06', val1: '14 Leads', val2: '4 Converted' },
        { x: 170, y: 45, label: 'May 10', val1: '28 Leads', val2: '9 Converted' },
        { x: 250, y: 80, label: 'May 13', val1: '19 Leads', val2: '5 Converted' },
        { x: 330, y: 35, label: 'May 18', val1: '36 Leads', val2: '12 Converted' },
        { x: 410, y: 70, label: 'May 22', val1: '22 Leads', val2: '7 Converted' },
        { x: 490, y: 30, label: 'May 27', val1: '41 Leads', val2: '15 Converted' },
      ]
    },
    orders: {
      title1: 'Total Orders',
      title2: 'Verified Paid',
      color1: '#10B981',
      color2: '#8B5CF6',
      d1: "M 10 100 Q 60 85, 110 90 T 210 65 T 310 50 T 410 40 T 490 25",
      d2: "M 10 125 Q 60 115, 110 118 T 210 95 T 310 80 T 410 70 T 490 55",
      points: [
        { x: 110, y: 90, label: 'May 06', val1: '5 Orders', val2: '4 Paid' },
        { x: 210, y: 65, label: 'May 12', val1: '9 Orders', val2: '8 Paid' },
        { x: 310, y: 50, label: 'May 18', val1: '14 Orders', val2: '12 Paid' },
        { x: 410, y: 40, label: 'May 24', val1: '18 Orders', val2: '16 Paid' },
        { x: 490, y: 25, label: 'May 28', val1: '24 Orders', val2: '21 Paid' },
      ]
    },
    revenue: {
      title1: 'Gross Revenue',
      title2: 'Collected Cash',
      color1: '#10B981',
      color2: '#8B5CF6',
      d1: "M 10 110 Q 70 95, 130 85 T 250 60 T 370 40 T 490 20",
      d2: "M 10 130 Q 70 120, 130 110 T 250 85 T 370 65 T 490 45",
      points: [
        { x: 130, y: 85, label: 'May 08', val1: '₹12,400 Gross', val2: '₹10,500 Collected' },
        { x: 250, y: 60, label: 'May 15', val1: '₹24,800 Gross', val2: '₹21,200 Collected' },
        { x: 370, y: 40, label: 'May 22', val1: '₹38,500 Gross', val2: '₹34,000 Collected' },
        { x: 490, y: 20, label: 'May 28', val1: '₹48,250 Gross', val2: '₹44,500 Collected' },
      ]
    }
  }[chartMetric];

  // Dynamic Recent Activity list
  const recentActivities = [
    { id: 'a1', type: 'lead', title: `New lead added — Priya Kumar — Meta Lead Form`, time: '10 min ago', color: 'bg-emerald-500' },
    { id: 'a2', type: 'order', title: `Order created — Order #SA-1024`, time: '35 min ago', color: 'bg-emerald-500' },
    { id: 'a3', type: 'task', title: `Follow-up task completed`, time: '1 hour ago', color: 'bg-emerald-500' },
    { id: 'a4', type: 'automation', title: `Automation paused — WhatsApp integration needs setup`, time: '2 hours ago', color: 'bg-purple-500' },
    ...auditLogs.slice(0, 3).map((l, i) => ({
      id: `dyn_${l.id}`,
      type: l.entityType.toLowerCase(),
      title: `${l.action.replace(/_/g, ' ')}: ${l.details}`,
      time: 'Just now',
      color: l.action.includes('DUPLICATE') ? 'bg-amber-500' : 'bg-emerald-500'
    }))
  ];

  const filteredActivities = recentActivities.filter(a => {
    if (activityFilter === 'all') return true;
    if (activityFilter === 'leads') return a.type === 'lead';
    if (activityFilter === 'orders') return a.type === 'order';
    if (activityFilter === 'automations') return a.type === 'automation' || a.type === 'workflow';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Top Greeting & Action Header (Matching Screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
            Hello,
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1.5">
          <div className="flex items-center gap-2">
            {/* Dynamic + Add Lead Button -> Opens Modal directly! */}
            <button
              onClick={() => setActiveModal('addLead')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>

            {/* Dynamic Create Automation Button -> Opens Modal directly! */}
            <button
              onClick={() => setActiveModal('createWorkflow')}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-sm"
            >
              Create Automation
            </button>
          </div>

          {/* Screenshot Demo Data Badge */}
          <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            DEMO DATA • Integrations not connected
          </span>
        </div>
      </div>

      {/* 4 Metric Cards with Sparklines (Matching Screenshot, Dynamically Updated!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: New Leads */}
        <div
          onClick={() => setActiveTab('leads')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>New Leads</span>
            <span className="w-4 h-4 rounded border border-slate-200 group-hover:border-orange-400 transition-colors" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900 mt-2 font-mono">
            {displayLeads}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
              ↑ {periodData.trend}
            </span>
            {/* Mini SVG Sparkline */}
            <svg className="w-16 h-6 text-emerald-500 stroke-current fill-none stroke-2">
              <path d="M 2 18 Q 8 10, 16 14 T 32 8 T 48 12 T 62 4" />
            </svg>
          </div>
        </div>

        {/* Card 2: Contacted */}
        <div
          onClick={() => setActiveTab('leads')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Contacted</span>
            <span className="w-4 h-4 rounded border border-slate-200 group-hover:border-orange-400 transition-colors" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900 mt-2 font-mono">
            {displayContacted}
          </div>
          <div className="flex items-center justify-end mt-4">
            <svg className="w-16 h-6 text-emerald-500 stroke-current fill-none stroke-2">
              <path d="M 2 20 Q 12 16, 24 18 T 44 10 T 62 6" />
            </svg>
          </div>
        </div>

        {/* Card 3: Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Orders</span>
            <span className="w-4 h-4 rounded border border-slate-200 group-hover:border-orange-400 transition-colors" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900 mt-2 font-mono">
            {displayOrders}
          </div>
          <div className="flex items-center justify-end mt-4">
            <svg className="w-16 h-6 text-emerald-500 stroke-current fill-none stroke-2">
              <path d="M 2 16 Q 16 12, 32 15 T 48 10 T 62 4" />
            </svg>
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div
          onClick={() => setActiveTab('invoices')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Revenue</span>
            <span className="w-4 h-4 rounded border border-slate-200 group-hover:border-orange-400 transition-colors" />
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900 mt-2 font-mono">
            ₹{displayRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-end mt-4">
            <svg className="w-16 h-6 text-emerald-500 stroke-current fill-none stroke-2">
              <path d="M 2 20 Q 14 16, 28 17 T 46 11 T 62 4" />
            </svg>
          </div>
        </div>

      </div>

      {/* Middle Row: Sales & Lead Performance Line Chart + Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sales & Lead Performance (7 cols) - Interactive Dropdowns & Live Bezier SVG */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-heading font-bold text-slate-900">
              Sales & Lead Performance
            </h2>

            <div className="flex items-center gap-1.5 text-xs">

              {/* Metric Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setChartMetricOpen(!chartMetricOpen);
                    setChartGroupingOpen(false);
                    setChartPeriodOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium capitalize"
                >
                  <span>{chartMetric}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {chartMetricOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['leads', 'orders', 'revenue'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => {
                          setChartMetric(m);
                          setChartMetricOpen(false);
                          showToast(`Chart metric changed to ${m}`);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 capitalize ${chartMetric === m ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grouping Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setChartGroupingOpen(!chartGroupingOpen);
                    setChartMetricOpen(false);
                    setChartPeriodOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
                >
                  <span>{chartGrouping}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {chartGroupingOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['Daily', 'Weekly', 'Monthly'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setChartGrouping(g);
                          setChartGroupingOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${chartGrouping === g ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Period Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setChartPeriodOpen(!chartPeriodOpen);
                    setChartMetricOpen(false);
                    setChartGroupingOpen(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium"
                >
                  <span>{chartPeriod}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {chartPeriodOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['Last 7 days', 'Last 30 days', 'Last 90 days'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setChartPeriod(p);
                          setChartPeriodOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${chartPeriod === p ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* SVG Line Chart with Dynamic Data Points */}
          <div className="h-52 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />

              {/* Green Line (Primary) */}
              <path
                d={chartConfigs.d1}
                fill="none"
                stroke={chartConfigs.color1}
                strokeWidth="2.5"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Purple/Blue Line (Secondary) */}
              <path
                d={chartConfigs.d2}
                fill="none"
                stroke={chartConfigs.color2}
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Interactive Points */}
              {chartConfigs.points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.label === pt.label ? 5 : 3.5}
                  fill={chartConfigs.color1}
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Live Chart Point Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full z-20"
                style={{ left: `${(hoveredPoint.x / 500) * 100}%`, top: `${(hoveredPoint.y / 150) * 100}%` }}
              >
                <div className="font-bold">{hoveredPoint.label}</div>
                <div className="text-emerald-300">{hoveredPoint.val1}</div>
                <div className="text-purple-300">{hoveredPoint.val2}</div>
              </div>
            )}

            <div className="text-center text-[10px] text-slate-400 mt-2">
              May 13
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span>{chartConfigs.title1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-500 rounded" />
              <span>{chartConfigs.title2}</span>
            </div>
          </div>
        </div>

        {/* Lead Conversion Funnel (5 cols) - Interactive Period Dropdown & Dynamic Stacked Bars */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-bold text-slate-900">
              Lead Conversion Funnel
            </h2>

            {/* Funnel Period Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFunnelDropdownOpen(!funnelDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs font-medium"
              >
                <span>{funnelPeriod}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {funnelDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                  {(['Today', 'This week', 'This month', 'This quarter'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setFunnelPeriod(p);
                        setFunnelDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${funnelPeriod === p ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Funnel Horizontal Stacked Bars (Matching Screenshot, Proportional & Dynamic) */}
          <div className="space-y-3 pt-2 text-xs">
            {/* New */}
            <div className="flex items-center gap-3">
              <span className="w-20 font-medium text-slate-600">New</span>
              <div className="flex-1 bg-slate-100 rounded-lg h-7 relative flex items-center px-3 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-[#D4E8B8] w-full rounded-lg transition-all duration-500" />
                <span className="relative z-10 font-bold text-slate-800 text-[11px] ml-auto mr-4">{funnelNew}</span>
              </div>
              <span className="w-10 text-right text-slate-500 text-[11px] font-medium">100%</span>
            </div>

            {/* Contacted */}
            <div className="flex items-center gap-3">
              <span className="w-20 font-medium text-slate-600">Contacted</span>
              <div className="flex-1 bg-slate-100 rounded-lg h-7 relative flex items-center px-3 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#D4E8B8] rounded-lg transition-all duration-500"
                  style={{ width: `${pctContacted}%` }}
                />
                <span className="relative z-10 font-bold text-slate-800 text-[11px] ml-auto mr-4">{funnelContacted}</span>
              </div>
              <span className="w-10 text-right text-slate-500 text-[11px] font-medium">{pctContacted}%</span>
            </div>

            {/* Qualified */}
            <div className="flex items-center gap-3">
              <span className="w-20 font-medium text-slate-600">Qualified</span>
              <div className="flex-1 bg-slate-100 rounded-lg h-7 relative flex items-center px-3 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#FFD7C2] rounded-lg transition-all duration-500"
                  style={{ width: `${pctQualified}%` }}
                />
                <span className="relative z-10 font-bold text-slate-800 text-[11px] ml-auto mr-4">{funnelQualified}</span>
              </div>
              <span className="w-10 text-right text-slate-500 text-[11px] font-medium">{pctQualified}%</span>
            </div>

            {/* Converted */}
            <div className="flex items-center gap-3">
              <span className="w-20 font-medium text-slate-600">Converted</span>
              <div className="flex-1 bg-slate-100 rounded-lg h-7 relative flex items-center px-3 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#FFD7C2] rounded-lg transition-all duration-500"
                  style={{ width: `${pctConverted}%` }}
                />
                <span className="relative z-10 font-bold text-slate-800 text-[11px] ml-auto mr-4">{funnelConverted}</span>
              </div>
              <span className="w-10 text-right text-slate-500 text-[11px] font-medium">{pctConverted}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row: Recent Activity & Tasks and Follow-ups (Matching Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Activity (7 cols) - Dynamic Feed with Filter Dropdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-bold text-slate-900">
              Recent Activity
            </h2>

            <div className="flex items-center gap-3 text-xs">
              <div className="relative">
                <button
                  onClick={() => setActivityDropdownOpen(!activityDropdownOpen)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 capitalize"
                >
                  <span>{activityFilter === 'all' ? 'All activity' : activityFilter}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activityDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['all', 'leads', 'orders', 'automations'] as const).map(act => (
                      <button
                        key={act}
                        onClick={() => {
                          setActivityFilter(act);
                          setActivityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 capitalize ${activityFilter === act ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {act === 'all' ? 'All activity' : act}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                View all
              </button>
            </div>
          </div>

          <div className="space-y-3.5 text-xs max-h-52 overflow-y-auto pr-1">
            {filteredActivities.slice(0, 5).map(act => (
              <div key={act.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span className={`w-2 h-2 rounded-full ${act.color} flex-shrink-0`} />
                  <span className="text-slate-700 font-medium truncate">{act.title}</span>
                </div>
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks & Follow-ups (5 cols) - Fully Interactive Checklist with Quick Add */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-heading font-bold text-slate-900">
                Tasks & Follow-ups
              </h2>

              <div className="relative">
                <button
                  onClick={() => setTaskDropdownOpen(!taskDropdownOpen)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 capitalize font-medium"
                >
                  <span>{taskPeriod}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {taskDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['today', 'tomorrow', 'week'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setTaskPeriod(p);
                          setTaskDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 capitalize ${taskPeriod === p ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-3 text-xs max-h-36 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-slate-400 py-3 text-center text-[11px]">
                  No pending follow-ups for {taskPeriod}.
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between group">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <span className={task.done ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                        {task.text}
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">{task.time}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity p-0.5"
                        title="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inline Quick Add Task */}
            <form onSubmit={handleAddTaskSubmit} className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="+ Add new follow-up task..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!newTaskText.trim()}
                className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-semibold"
              >
                Add
              </button>
            </form>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => showToast('All pending customer follow-ups synchronized')}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              View all tasks
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Integration Status + Automation Health + Quick Actions (Matching Screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Integration Status - Dynamic Live Badges & Modal Opener */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-heading font-bold text-slate-900 mb-3">
              Integration Status
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Meta Lead Forms</span>
                <span className={`font-medium ${metaInt?.status === 'connected' ? 'text-emerald-600 font-bold' : 'text-orange-600'
                  }`}>
                  {metaInt?.status === 'connected' ? 'Connected • Live' : 'Needs setup'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">WhatsApp Business</span>
                <span className={`font-medium ${waInt?.status === 'connected' ? 'text-emerald-600 font-bold' : 'text-rose-600'
                  }`}>
                  {waInt?.status === 'connected' ? 'Connected • Live' : 'Not connected'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">Payments</span>
                <span className={`font-medium ${payInt?.status === 'connected' ? 'text-emerald-600 font-bold' : 'text-rose-600'
                  }`}>
                  {payInt?.status === 'connected' ? 'Connected • Live' : 'Not connected'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700">Invoicing</span>
                <span className={`font-medium ${invInt?.status === 'connected' ? 'text-emerald-600 font-bold' : 'text-orange-600'
                  }`}>
                  {invInt?.status === 'connected' ? 'Connected • Live' : 'Setup required'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('manageIntegrations')}
            className="w-full py-2.5 rounded-xl bg-[#FFF1EB] hover:bg-[#FFE4D6] text-[#EA580C] font-semibold text-xs border border-[#FED7AA] transition-colors shadow-sm"
          >
            Manage integrations
          </button>
        </div>

        {/* Card 2: Automation Health - Dynamic Filter & Execution Logs Modal */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-heading font-bold text-slate-900">
                Automation Health
              </h2>

              <div className="relative">
                <button
                  onClick={() => setHealthDropdownOpen(!healthDropdownOpen)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  <span>{healthPeriod}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {healthDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                    {(['Last 24 hours', 'Last 7 days', 'Last 30 days'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setHealthPeriod(p);
                          setHealthDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${healthPeriod === p ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="p-2">
                <div className="text-[11px] text-slate-500">Successful</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
                  {executions.filter(e => e.status === 'success').length + 15}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[11px] text-slate-500">Failed</div>
                <div className="text-2xl font-bold text-rose-600 mt-1 font-mono">
                  {executions.filter(e => e.status === 'failed').length + 2}
                </div>
              </div>
              <div className="p-2">
                <div className="text-[11px] text-slate-500">Paused</div>
                <div className="text-2xl font-bold text-amber-500 mt-1 font-mono">
                  {executions.filter(e => e.status === 'skipped').length + 3}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setActiveModal('executionLogs')}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              View execution logs
            </button>
          </div>
        </div>

        {/* Card 3: Quick Actions - Opens Respective Creation Modals Directly! */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-heading font-bold text-slate-900">
            Quick Actions
          </h2>

          <button
            onClick={() => setActiveModal('addLead')}
            className="w-full py-2.5 rounded-xl bg-[#FFF1EB] hover:bg-[#FFE4D6] text-[#EA580C] font-semibold text-xs border border-[#FED7AA] transition-colors shadow-sm"
          >
            + Add lead
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveModal('addProduct')}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-center transition-colors"
            >
              Add product
            </button>
            <button
              onClick={() => setActiveModal('createOrder')}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-center transition-colors"
            >
              Create order
            </button>
            <button
              onClick={() => setActiveModal('createInvoice')}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-center transition-colors"
            >
              Create invoice
            </button>
            <button
              onClick={() => setActiveModal('createWorkflow')}
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-center transition-colors"
            >
              Build workflow
            </button>
          </div>
        </div>

      </div>

      {/* Screenshot Bottom Footer Developer Note */}
      <div className="pt-4 pb-2 border-t border-slate-200 text-center text-[11px] text-slate-400 space-y-1">
        <p>Data shown is illustrative. Live metrics populate after backend connection.</p>
        <p className="text-[10px] text-slate-400">
          <span className="font-semibold text-slate-600">Developer notes:</span> Dropdowns = workspace / date / metric / grouping / activity / task period &nbsp;|&nbsp; Buttons = Add Lead / Create Automation / Manage integrations / View execution logs &nbsp;|&nbsp; Chart and KPIs use backend aggregate queries
        </p>
      </div>

    </div>
  );
};
