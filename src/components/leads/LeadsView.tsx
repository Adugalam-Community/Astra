import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadSource, LeadStatus } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  ShoppingCart, 
  AlertTriangle, 
  ShieldCheck, 
  X,
  Phone
} from 'lucide-react';

export const LeadsView: React.FC = () => {
  const { 
    leads, 
    products, 
    addLead, 
    updateLeadStatus, 
    convertLeadToOrder, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [orderModalLead, setOrderModalLead] = useState<Lead | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);

  // New Lead form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('Meta Lead Form');
  const [newProductInterest, setNewProductInterest] = useState('Raw Himalayan Wildflower Honey (500g)');
  const [newNotes, setNewNotes] = useState('');
  const [newConsent, setNewConsent] = useState(true);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.productInterest && l.productInterest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
      showToast('Please provide both Name and Phone number');
      return;
    }

    const res = addLead({
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      source: newSource,
      status: 'New',
      productInterest: newProductInterest,
      notes: newNotes || `Lead captured via ${newSource}`,
      consentRef: `CONS-${newSource.substring(0,3).toUpperCase()}-${Date.now()}`,
      consentStatus: newConsent ? 'Opted In' : 'Opted Out'
    });

    if (res.isDuplicate) {
      showToast('⚠️ Duplicate phone detected! Linked to existing contact record.');
    } else {
      showToast('✓ Lead ingested and validated successfully!');
    }

    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalLead) return;

    const ord = convertLeadToOrder(orderModalLead.id, [
      { productId: selectedProduct, quantity }
    ]);

    if (ord) {
      setOrderModalLead(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Lead Management CRM
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Meta ad forms, WhatsApp chats, and web enquiries with automated deduplication & consent checks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone (+91), or product..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-medium hidden md:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-medium hidden md:inline">Source:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Sources</option>
            <option value="Meta Lead Form">Meta Lead Form</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Website Form">Website Form</option>
            <option value="Manual Entry">Manual Entry</option>
          </select>
        </div>
      </div>

      {/* Leads Table & Mobile Cards */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-14 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-orange-400/50 mx-auto" />
            <p className="font-semibold text-slate-700">No leads found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< sm) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <div key={lead.id} className="p-4 space-y-2.5">
                  {/* Top: Avatar, Name & Pipeline Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">{lead.name}</span>
                          {lead.isDuplicate && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                              Duplicate
                            </span>
                          )}
                        </div>
                        <a 
                          href={`tel:${lead.phone}`}
                          className="text-[11px] text-orange-600 font-medium flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Status Select */}
                    <select
                      value={lead.status}
                      onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                        lead.status === 'New'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : lead.status === 'Order Placed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lead.status === 'Qualified'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  {/* Middle: Badges for Source, Consent & Product */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                        {lead.source}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        lead.consentStatus === 'Opted In'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {lead.consentStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 font-medium">
                      {lead.productInterest || 'General Natural Food Inquiry'}
                    </div>
                  </div>

                  {/* Bottom: Date & Quick Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (lead.consentStatus === 'Opted Out') {
                            showToast('⚠️ Policy Violation: Contact opted out. Cannot send WhatsApp message.');
                            return;
                          }
                          showToast(`✓ Approved WhatsApp Catalogue dispatched to ${lead.name}`);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setOrderModalLead(lead)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF1EB] text-[#EA580C] font-semibold text-[11px] border border-[#FED7AA]"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Source & Interest</th>
                    <th className="py-3 px-4">Consent Status</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Captured At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs">{lead.name}</span>
                              {lead.isDuplicate && (
                                <span 
                                  title={`Duplicate phone detected with lead ${lead.duplicateOf}`}
                                  className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium"
                                >
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                  Duplicate
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" /> {lead.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Source & Product */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                          {lead.source}
                        </span>
                        <div className="text-[11px] text-slate-700 font-medium truncate max-w-[200px] mt-1">
                          {lead.productInterest || 'General Natural Food Inquiry'}
                        </div>
                      </td>

                      {/* Consent */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          lead.consentStatus === 'Opted In'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {lead.consentStatus}
                        </span>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                          Ref: {lead.consentRef.substring(0, 14)}...
                        </div>
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            lead.status === 'New'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : lead.status === 'Order Placed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : lead.status === 'Qualified'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Order Placed">Order Placed</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        <div className="text-[10px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick WhatsApp Template */}
                          <button
                            onClick={() => {
                              if (lead.consentStatus === 'Opted Out') {
                                showToast('⚠️ Policy Violation: Contact opted out. Cannot send WhatsApp message.');
                                return;
                              }
                              showToast(`✓ Approved WhatsApp Catalogue dispatched to ${lead.name}`);
                            }}
                            title="Send Approved WhatsApp Catalogue"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Convert to Order */}
                          <button
                            onClick={() => setOrderModalLead(lead)}
                            title="Convert to Order"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF1EB] hover:bg-[#FFE4D6] text-[#EA580C] font-semibold text-[11px] border border-[#FED7AA] transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Order</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Ingest Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-600" />
                Ingest New Lead (Validation Gate)
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Lead Source</label>
                  <select
                    value={newSource}
                    onChange={e => setNewSource(e.target.value as LeadSource)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Meta Lead Form">Meta Lead Form</option>
                    <option value="WhatsApp">WhatsApp Inbound</option>
                    <option value="Website Form">Website Form</option>
                    <option value="Manual Entry">Manual Entry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Product Interest</label>
                  <select
                    value={newProductInterest}
                    onChange={e => setNewProductInterest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Customer Context / Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Inquired about honey comb and natural sweetness..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={newConsent}
                  onChange={e => setNewConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="consent" className="text-[11px] text-slate-600 cursor-pointer leading-tight">
                  <span className="font-semibold text-slate-800">Valid WhatsApp Consent Verified</span>
                  <br />
                  Customer explicitly opted in via Instant Lead Form checkbox or WhatsApp START keyword.
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold shadow-sm"
                >
                  Save & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert to Order Modal */}
      {orderModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-orange-600" />
                  Convert Lead to Order (Draft)
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Customer: <span className="text-slate-800 font-bold">{orderModalLead.name}</span> ({orderModalLead.phone})
                </p>
              </div>
              <button 
                onClick={() => setOrderModalLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Select Product</label>
                <select
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stockStatus === 'Out of Stock'}>
                      {p.name} — ₹{p.price} ({p.stockStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Order Calculation Preview */}
              {(() => {
                const prod = products.find(p => p.id === selectedProduct);
                const price = prod ? prod.price : 0;
                const sub = price * quantity;
                const tax = Number(((sub * 5) / 100).toFixed(2));
                const shipping = sub > 1000 ? 0 : 50;
                const tot = Number((sub + tax + shipping).toFixed(2));
                return (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({quantity} items):</span>
                      <span className="font-mono text-slate-800 font-bold">₹{sub.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>GST (5% Packaged Food):</span>
                      <span className="font-mono text-slate-700">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Standard Shipping:</span>
                      <span className="font-mono text-slate-700">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-xs">
                      <span>Estimated Total:</span>
                      <span className="font-mono text-orange-600">₹{tot.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 leading-snug">
                Note: Orders are created in <strong>Pending Confirmation</strong> state. You must explicitly verify payment UTR before marking paid.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalLead(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold shadow-sm"
                >
                  Create Confirmed Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
