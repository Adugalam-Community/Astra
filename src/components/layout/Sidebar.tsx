import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';
import {
  Home,
  Users,
  UserCheck,
  Package,
  ShoppingCart,
  FileText,
  Share2,
  Megaphone,
  MessageSquare,
  Network,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  GitFork,
  X,
  Menu,
  MoreHorizontal
} from 'lucide-react';

interface SidebarItem {
  id: NavTab | 'campaigns' | 'conversations';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    leads,
    orders,
    workspace,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  const newLeads = leads.filter(l => l.status === 'New').length;
  const pendingOrders = orders.filter(o => o.paymentStatus === 'Pending Verification').length;

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'leads', label: 'Leads', icon: Users, badge: newLeads > 0 ? newLeads : undefined },
    { id: 'customers', label: 'Customers', icon: UserCheck },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'automations', label: 'Automations', icon: Share2 },
    { id: 'flowchart', label: 'Flow Engine', icon: GitFork },
    { id: 'integrations', label: 'Integrations', icon: Network },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* ================= 1. DESKTOP SIDEBAR ================= */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex h-[calc(100vh-53px)] sticky top-[53px]">

        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                  ? 'bg-[#FFF1EB] text-[#EA580C] font-semibold border border-[#FED7AA]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#EA580C]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Footer Links */}
        <div className="p-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Support</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <span>Collapse sidebar</span>
          </button>
        </div>

      </aside>

      {/* ================= 2. MOBILE SLIDE-OUT DRAWER ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Drawer Content */}
          <div className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white z-50 flex flex-col justify-between shadow-2xl animate-slideRight">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                  <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">
                    ScaleAstra
                  </span>
                  <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                    {workspace.name}
                  </p>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as NavTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                        ? 'bg-[#FFF1EB] text-[#EA580C] font-bold border border-[#FED7AA]'
                        : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#EA580C]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs leading-none">Admin</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Dhanaraj</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileMenuOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/50"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${activeTab === 'dashboard' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <Home className={`w-4 h-4 mb-0.5 ${activeTab === 'dashboard' ? 'text-orange-600' : 'text-slate-400'}`} />
          <span>Home</span>
        </button>

        {/* Tab 2: Leads */}
        <button
          onClick={() => setActiveTab('leads')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${activeTab === 'leads' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <div className="relative">
            <Users className={`w-4 h-4 mb-0.5 ${activeTab === 'leads' ? 'text-orange-600' : 'text-slate-400'}`} />
            {newLeads > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-1 rounded-full bg-orange-600 text-white text-[8px] font-bold flex items-center justify-center">
                {newLeads}
              </span>
            )}
          </div>
          <span>Leads</span>
        </button>

        {/* Tab 3: Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${activeTab === 'orders' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-4 h-4 mb-0.5 ${activeTab === 'orders' ? 'text-orange-600' : 'text-slate-400'}`} />
            {pendingOrders > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-3.5 px-1 rounded-full bg-orange-600 text-white text-[8px] font-bold flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </div>
          <span>Orders</span>
        </button>

        {/* Tab 4: Invoices */}
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${activeTab === 'invoices' ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <FileText className={`w-4 h-4 mb-0.5 ${activeTab === 'invoices' ? 'text-orange-600' : 'text-slate-400'}`} />
          <span>Invoices</span>
        </button>

        {/* Tab 5: More (Drawer Trigger) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${isMobileMenuOpen ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <Menu className="w-4 h-4 mb-0.5 text-slate-400" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
