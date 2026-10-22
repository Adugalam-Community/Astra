import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building2, 
  Terminal, 
  Save, 
  Search 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { workspace, updateWorkspace, auditLogs } = useApp();

  const [name, setName] = useState(workspace.name);
  const [niche, setNiche] = useState(workspace.niche);
  const [gstNumber, setGstNumber] = useState(workspace.gstNumber);
  const [phone, setPhone] = useState(workspace.phone);
  const [email, setEmail] = useState(workspace.email);
  const [address, setAddress] = useState(workspace.address);
  const [auditSearch, setAuditSearch] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace({
      name,
      niche,
      gstNumber,
      phone,
      email,
      address
    });
  };

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Workspace Settings & Security Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-tenant isolation, business configuration, and tamper-evident append-only ledger.
          </p>
        </div>

        <div className="text-xs text-amber-800 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-mono">
          Phase 1: Managed Pilot (Ceiling: ₹25,000)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Form (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-600" />
              Business Workspace Profile
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Product Niche & Category</label>
                <input
                  type="text"
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">GSTIN (India)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={e => setGstNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Operating Facility Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Audit Log (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-600" />
                Append-Only Audit Log
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                Tamper Evident
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                placeholder="Filter audit logs by action or actor..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 text-xs">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-orange-700">
                      [{log.action}]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-700 text-[11px] leading-snug">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                    <span>Actor: {log.actorName} ({log.role})</span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
