import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

import { DashboardView } from './components/dashboard/DashboardView';
import { FlowchartSimulator } from './components/flowchart/FlowchartSimulator';
import { LeadsView } from './components/leads/LeadsView';
import { CustomersView } from './components/customers/CustomersView';
import { ProductsView } from './components/products/ProductsView';
import { OrdersView } from './components/orders/OrdersView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { AutomationsView } from './components/automations/AutomationsView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalModals } from './components/modals/GlobalModals';
import { FirebaseAuthModal } from './components/modals/FirebaseAuthModal';
import { MetaAdsSimulatorModal } from './components/modals/MetaAdsSimulatorModal';

export const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'flowchart':
        return <FlowchartSimulator />;
      case 'leads':
        return <LeadsView />;
      case 'customers':
        return <CustomersView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'invoices':
        return <InvoicesView />;
      case 'automations':
        return <AutomationsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white relative">
      {/* Top Universal Header */}
      <Header />

      {/* Pure Desktop View Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Canvas with Mobile Bottom Spacing */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <GlobalModals />
      <FirebaseAuthModal />
      <MetaAdsSimulatorModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-2xl flex items-center gap-3 animate-slideUp border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
