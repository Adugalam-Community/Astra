import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  Play,
  Check,
  ExternalLink,
  ShieldAlert,
  User,
  Settings as SettingsIcon,
  X,
  Menu,
  Cloud,
  Database
} from 'lucide-react';
import { DateRangeOption } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    workspace,
    updateWorkspace,
    activeTab,
    setActiveTab,
    runLeadSimulation,
    simulationActive,
    setActiveModal,
    dateRange,
    setDateRange,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    showToast,
    firebaseUser,
    isFirebaseSyncEnabled
  } = useApp();

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModal]);

  const workspaceOptions = [
    'Forest to Home',
    'PureWild Honey Co.',
    'GreenEarth Organics'
  ];

  const dateOptions: { label: string; value: DateRangeOption }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const currentDateLabel = dateOptions.find(d => d.value === dateRange)?.label || 'Last 30 days';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Primary Top Bar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 max-w-7xl mx-auto w-full">

        {/* Left Section: Mobile Hamburger + Logo + Desktop Workspace */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <span
              onClick={() => setActiveTab('dashboard')}
              className="font-heading font-extrabold text-xl text-slate-900 tracking-tight cursor-pointer"
            >
              ScaleAstra
            </span>

            {/* Desktop Workspace Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-medium transition-colors"
              >
                <span>{workspace.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                  {workspaceOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        updateWorkspace({ name: opt });
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${workspace.name === opt ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Breadcrumbs (Desktop only) */}
          <div className="hidden lg:flex items-center text-xs text-slate-400">
            <span>Workspace</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="capitalize font-medium text-slate-600">
              {activeTab === 'dashboard' ? 'Overview' : activeTab}
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div
            onClick={() => setActiveModal('search')}
            className="relative cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              readOnly
              placeholder="Search leads, orders, products..."
              className="w-full pl-9 pr-14 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 cursor-pointer group-hover:border-orange-400 group-hover:bg-white transition-all pointer-events-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right Section: Mobile Search Button + Date filter + Bell + Help + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* Mobile Search Icon Button */}
          <button
            onClick={() => setActiveModal('search')}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Interactive Meta Instagram Ad Model Simulator */}
          <button
            onClick={() => setActiveModal('metaAdsDemo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 hover:from-amber-500/20 hover:to-purple-500/20 text-slate-800 border border-rose-200 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Launch interactive Instagram Ad & Lead Form demo model"
          >
            <span className="text-sm">📱</span>
            <span className="hidden sm:inline">Meta Ads Demo</span>
          </button>

          {/* Quick Flowchart Simulator Trigger (Desktop) */}
          <button
            onClick={() => {
              setActiveTab('flowchart');
              if (!simulationActive) runLeadSimulation('valid_meta');
            }}
            disabled={simulationActive}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Run interactive flowchart engine"
          >
            <Play className={`w-3.5 h-3.5 ${simulationActive ? 'animate-spin' : 'fill-orange-600'}`} />
            <span>Test Flow</span>
          </button>

          {/* Desktop Date Selector Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setDateMenuOpen(!dateMenuOpen);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors"
            >
              <span>{currentDateLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dateMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-scaleIn">
                {dateOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setDateRange(opt.value);
                      setDateMenuOpen(false);
                      showToast(`Dashboard date range set to ${opt.label}`);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${dateRange === opt.value ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                      }`}
                  >
                    <span>{opt.label}</span>
                    {dateRange === opt.value && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Firebase Cloud Sync Status Pill */}
          <button
            onClick={() => setActiveModal('firebaseAuth')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${firebaseUser
                ? isFirebaseSyncEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200'
              }`}
            title="Firebase Cloud Sync (scaleastra-prod)"
          >
            <Cloud className={`w-3.5 h-3.5 ${firebaseUser
                ? isFirebaseSyncEnabled ? 'text-emerald-600' : 'text-amber-600'
                : 'text-slate-400'
              }`} />
            <span className="font-heading font-bold text-[11px]">
              {firebaseUser
                ? (isFirebaseSyncEnabled ? 'Firebase Live' : 'Firebase Paused')
                : 'Firebase Sync'
              }
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${firebaseUser
                ? (isFirebaseSyncEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')
                : 'bg-slate-300'
              }`} />
          </button>

          {/* Bell Icon & Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDateMenuOpen(false);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs animate-scaleIn">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${!n.read ? 'bg-orange-50/20' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setNotificationsOpen(false);
                    }}
                    className="text-[11px] text-slate-600 font-medium hover:text-slate-900"
                  >
                    View audit trail & system logs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Question Icon (Desktop) */}
          <button
            onClick={() => {
              showToast('ScaleAstra v1.0 • WhatsApp Sales Automation Platform');
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:block"
            title="Help & System Info"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Profile Avatar Pill & Menu */}
          <div className="relative">
            <div
              onClick={() => {
                setProfileOpen(!profileOpen);
                setDateMenuOpen(false);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs hover:bg-slate-900 transition-colors">
                A
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-700">
                <span>Admin</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs animate-scaleIn">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Dhanaraj </p>
                  <p className="text-[11px] text-slate-500">Founder & Workspace Admin</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal('manageIntegrations');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>Integration Health</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Sub-Bar: Compact Pills for Workspace & Date Selector (Never Wraps!) */}
      <div className="sm:hidden px-4 py-1.5 bg-slate-50/80 border-t border-slate-200/60 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
        {/* Workspace Pill */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-800 whitespace-nowrap shadow-2xs"
          >
            <span className="truncate max-w-[130px]">{workspace.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
              {workspaceOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    updateWorkspace({ name: opt });
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${workspace.name === opt ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Filter Pill */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setDateMenuOpen(!dateMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 whitespace-nowrap shadow-2xs"
          >
            <span>{currentDateLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
          </button>

          {dateMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
              {dateOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setDateRange(opt.value);
                    setDateMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 ${dateRange === opt.value ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Simulator Pill */}
        <button
          onClick={() => {
            setActiveTab('flowchart');
            if (!simulationActive) runLeadSimulation('valid_meta');
          }}
          disabled={simulationActive}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 font-semibold text-[11px] whitespace-nowrap flex-shrink-0"
        >
          <Play className="w-3 h-3 fill-orange-700" />
          <span>Test Flow</span>
        </button>
      </div>

    </header>
  );
};
