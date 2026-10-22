import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Search, 
  Check, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Package,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const GlobalModals: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    leads, 
    products, 
    orders, 
    invoices, 
    workflows, 
    executions,
    integrations,
    addLead, 
    addProduct, 
    createDirectOrder, 
    createDirectInvoice, 
    addWorkflow,
    updateIntegrationStatus,
    setActiveTab,
    showToast
  } = useApp();

  // Add Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSource, setLeadSource] = useState<'Meta Lead Form' | 'WhatsApp' | 'Website Form' | 'Manual Entry'>('Meta Lead Form');
  const [leadProduct, setLeadProduct] = useState(products[0]?.name || 'Raw Himalayan Wildflower Honey (500g)');
  const [leadNotes, setLeadNotes] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Raw Forest Honey');
  const [prodPrice, setProdPrice] = useState('650');
  const [prodUnit, setProdUnit] = useState('500g Glass Jar');
  const [prodStock, setProdStock] = useState('50');

  // Create Order Form State
  const [orderCustName, setOrderCustName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('No. 14, Garden Road, Coimbatore, Tamil Nadu - 641002');
  const [orderProductId, setOrderProductId] = useState(products[0]?.id || '');
  const [orderQty, setOrderQty] = useState(1);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('UPI / GPay');

  // Create Invoice Form State
  const [invCustName, setInvCustName] = useState('');
  const [invPhone, setInvPhone] = useState('');
  const [invAmount, setInvAmount] = useState('1300');

  // Create Workflow Form State
  const [wfTitle, setWfTitle] = useState('');
  const [wfCategory, setWfCategory] = useState<'Lead Capture' | 'Sales Nurturing' | 'Order Fulfilment' | 'Repeat Purchase'>('Lead Capture');
  const [wfTrigger, setWfTrigger] = useState('Inbound Meta Lead Form Ingestion');
  const [wfAction, setWfAction] = useState('Send approved WhatsApp Welcome Template + PDF Honey Catalogue');

  // Global Search State
  const [searchTerm, setSearchTerm] = useState('');

  if (!activeModal) return null;

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      showToast('Please provide Name and Phone number');
      return;
    }
    const res = addLead({
      name: leadName,
      phone: leadPhone.startsWith('+91') ? leadPhone : `+91 ${leadPhone}`,
      email: leadEmail || `${leadName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      source: leadSource,
      status: 'New',
      productInterest: leadProduct,
      notes: leadNotes || `Captured via ${leadSource} quick intake`,
      consentRef: `CONS-${Date.now()}`,
      consentStatus: leadConsent ? 'Opted In' : 'Opted Out'
    });
    if (res.isDuplicate) {
      showToast('⚠️ Duplicate phone detected! Linked to existing contact record.');
    } else {
      showToast('✓ Lead added and validated successfully!');
    }
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadNotes('');
    setActiveModal(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) {
      showToast('Product name is required');
      return;
    }
    addProduct({
      sku: `SKU-${prodName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice) || 650,
      currency: 'INR',
      unit: prodUnit,
      stockStatus: parseInt(prodStock) > 0 ? 'In Stock' : 'Out of Stock',
      stockQuantity: parseInt(prodStock) || 0,
      description: 'Premium batch harvested raw unfiltered forest honey.',
      active: true,
      badge: 'Bestseller'
    });
    setProdName('');
    setActiveModal(null);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCustName || !orderPhone) {
      showToast('Customer name and phone are required');
      return;
    }
    const selProd = products.find(p => p.id === orderProductId) || products[0];
    const subtotal = (selProd ? selProd.price : 650) * orderQty;
    createDirectOrder({
      customerName: orderCustName,
      phone: orderPhone.startsWith('+91') ? orderPhone : `+91 ${orderPhone}`,
      shippingAddress: orderAddress,
      subtotal,
      paymentMethod: orderPaymentMethod,
      items: [
        {
          productId: selProd?.id || 'p1',
          name: selProd?.name || 'Raw Himalayan Wildflower Honey (500g)',
          price: selProd?.price || 650,
          quantity: orderQty,
          total: subtotal
        }
      ]
    });
    setOrderCustName('');
    setOrderPhone('');
    setActiveModal(null);
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustName) {
      showToast('Customer name is required');
      return;
    }
    const subtotal = parseFloat(invAmount) || 1300;
    createDirectInvoice({
      customerName: invCustName,
      customerPhone: invPhone || '+91 98401 22334',
      subtotal
    });
    setInvCustName('');
    setActiveModal(null);
  };

  const handleWorkflowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfTitle) {
      showToast('Workflow title is required');
      return;
    }
    addWorkflow({
      title: wfTitle,
      category: wfCategory,
      description: 'Automated WhatsApp pipeline rule triggered upon incoming event.',
      trigger: wfTrigger,
      conditions: ['Consent Status == Opted In', 'Duplicate Check == False'],
      actions: [wfAction, 'Log to Audit Trail'],
      active: true
    });
    setWfTitle('');
    setActiveModal(null);
  };

  // Search Filter Results
  const matchedLeads = searchTerm.trim() 
    ? leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm))
    : [];
  const matchedOrders = searchTerm.trim()
    ? orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  const matchedProducts = searchTerm.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  const matchedInvoices = searchTerm.trim()
    ? invoices.filter(i => i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || i.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        
        {/* ================= MODAL: ADD LEAD ================= */}
        {activeModal === 'addLead' && (
          <div className="flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Add New Lead</h3>
                  <p className="text-xs text-slate-500">Ingest and run 48h deduplication check</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeadSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Kumar"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98401 23456"
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. priya@example.com"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ingestion Channel</label>
                  <select
                    value={leadSource}
                    onChange={e => setLeadSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Meta Lead Form">Meta Lead Form (Ad campaign)</option>
                    <option value="WhatsApp">WhatsApp Inbound Enquiry</option>
                    <option value="Website Form">Website Direct Form</option>
                    <option value="Manual Entry">Manual Intake / Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product of Interest</label>
                <select
                  value={leadProduct}
                  onChange={e => setLeadProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name} — ₹{p.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intake Notes</label>
                <textarea
                  rows={2}
                  placeholder="Enquiry context, customer queries, special requirements..."
                  value={leadNotes}
                  onChange={e => setLeadNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="leadConsentCheck"
                  checked={leadConsent}
                  onChange={e => setLeadConsent(e.target.checked)}
                  className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="leadConsentCheck" className="text-[11px] text-amber-900 leading-tight">
                  <span className="font-bold">WhatsApp Opt-in Consent Logged</span>: Explicit consent record will be stamped in compliance with WhatsApp Business Messaging policy.
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Create & Ingest Lead
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODAL: CREATE ORDER ================= */}
        {activeModal === 'createOrder' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Create New Order</h3>
                  <p className="text-xs text-slate-500">Initiates order with stock check and GST calculation</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sundaram"
                    value={orderCustName}
                    onChange={e => setOrderCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98402 11223"
                    value={orderPhone}
                    onChange={e => setOrderPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={orderAddress}
                  onChange={e => setOrderAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Select Product</label>
                  <select
                    value={orderProductId}
                    onChange={e => setOrderProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={orderQty}
                    onChange={e => setOrderQty(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={orderPaymentMethod}
                  onChange={e => setOrderPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                >
                  <option value="UPI / GPay">UPI / GPay (QR Code sent via WhatsApp)</option>
                  <option value="Bank NEFT / IMPS">Direct Bank NEFT / IMPS</option>
                  <option value="Cash on Delivery">Cash on Delivery (Verified)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Order Subtotal:</span>
                  <div className="font-bold text-slate-800 text-sm">
                    ₹{((products.find(p => p.id === orderProductId)?.price || 650) * orderQty).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Includes 5% GST:</span>
                  <div className="font-semibold text-emerald-600">
                    + ₹{(((products.find(p => p.id === orderProductId)?.price || 650) * orderQty * 0.05)).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Create Order & Reserve Stock
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODAL: ADD PRODUCT ================= */}
        {activeModal === 'addProduct' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Add Product to Catalogue</h3>
                  <p className="text-xs text-slate-500">Syncs immediately to WhatsApp Catalogue</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wild Raw Forest Comb Honey (400g)"
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Raw Forest Honey">Raw Forest Honey</option>
                    <option value="Infused Honey">Infused Honey</option>
                    <option value="Honeycomb">Honeycomb</option>
                    <option value="Beeswax & Wellness">Beeswax & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={e => setProdUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Stock Qty</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={e => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODAL: CREATE INVOICE ================= */}
        {activeModal === 'createInvoice' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Generate GST Tax Invoice</h3>
                  <p className="text-xs text-slate-500">Creates sequential INV-2026-XXXX record with 5% GST breakdown</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvoiceSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer / Buyer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anandha Bhavan Organics"
                    value={invCustName}
                    onChange={e => setInvCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98401 22334"
                    value={invPhone}
                    onChange={e => setInvPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taxable Subtotal (₹)</label>
                <input
                  type="number"
                  value={invAmount}
                  onChange={e => setInvAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              {/* GST Calculation Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span className="font-mono font-medium">₹{parseFloat(invAmount || '0').toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (2.5%):</span>
                  <span className="font-mono font-medium">₹{((parseFloat(invAmount || '0') * 0.025)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (2.5%):</span>
                  <span className="font-mono font-medium">₹{((parseFloat(invAmount || '0') * 0.025)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total Payable:</span>
                  <span className="font-mono text-emerald-600 text-sm">
                    ₹{(parseFloat(invAmount || '0') * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODAL: CREATE AUTOMATION ================= */}
        {activeModal === 'createWorkflow' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Build Automation Workflow</h3>
                  <p className="text-xs text-slate-500">Configure trigger-action rules for WhatsApp sales pipeline</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWorkflowSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Workflow Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Repeat Customer 20-Day Honey Reorder Reminder"
                  value={wfTitle}
                  onChange={e => setWfTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={wfCategory}
                    onChange={e => setWfCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Lead Capture">Lead Capture</option>
                    <option value="Sales Nurturing">Sales Nurturing</option>
                    <option value="Order Fulfilment">Order Fulfilment</option>
                    <option value="Repeat Purchase">Repeat Purchase</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trigger Event</label>
                  <select
                    value={wfTrigger}
                    onChange={e => setWfTrigger(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Inbound Meta Lead Form Ingestion">Inbound Meta Lead Form Ingestion</option>
                    <option value="Lead Status == Contacted (No Order after 24h)">Lead Status == Contacted (No Order after 24h)</option>
                    <option value="Order Verified Paid by Owner">Order Verified Paid by Owner</option>
                    <option value="Delivered Status + 25 Days Elapsed">Delivered Status + 25 Days Elapsed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Automation Action</label>
                <input
                  type="text"
                  value={wfAction}
                  onChange={e => setWfAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Deploy Automation Rule
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= MODAL: MANAGE INTEGRATIONS ================= */}
        {activeModal === 'manageIntegrations' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Manage Integrations</h3>
                  <p className="text-xs text-slate-500">Toggle live/demo modes and configure gateway adapters</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              {integrations.map(int => (
                <div key={int.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{int.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        int.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {int.status === 'connected' ? 'Connected • Live' : 'Needs setup'}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">{int.description}</p>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Mode: <span className="font-bold text-slate-700 uppercase">{int.mode}</span> | Quota: {int.quotaUsed}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const nextStatus = int.status === 'connected' ? 'disconnected' : 'connected';
                      updateIntegrationStatus(int.id, nextStatus, nextStatus === 'connected' ? 'live' : 'demo');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-all ${
                      int.status === 'connected' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {int.status === 'connected' ? 'Disconnect' : 'Connect Live'}
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Changes reflect immediately on dashboard cards.</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-orange-600 text-white font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ================= MODAL: EXECUTION LOGS ================= */}
        {activeModal === 'executionLogs' && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-slate-900">Automation Execution Logs</h3>
                  <p className="text-xs text-slate-500">Live operational events and idempotent execution history</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto text-xs">
              {executions.map(exec => (
                <div key={exec.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{exec.workflowName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      exec.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {exec.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Source: {exec.triggerSource}</span>
                    <span>Idempotency: {exec.idempotencyKey.substring(0, 16)}...</span>
                  </div>
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    {exec.logs.slice(0, 2).map((log, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-medium">{log.step}:</span>
                        <span className="truncate">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ================= MODAL: GLOBAL SEARCH SPOTLIGHT (Ctrl+K) ================= */}
        {activeModal === 'search' && (
          <div>
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search leads, orders, customers, products, invoices... (Press Esc to close)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
              />
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
              {!searchTerm.trim() ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                  <p className="font-semibold text-slate-500">Quick Jump & Universal Search</p>
                  <p className="text-[11px]">Type lead name, phone number, order number, or product SKU</p>
                </div>
              ) : (
                <>
                  {/* Matched Leads */}
                  {matchedLeads.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Leads</div>
                      {matchedLeads.map(l => (
                        <div
                          key={l.id}
                          onClick={() => {
                            setActiveTab('leads');
                            setActiveModal(null);
                          }}
                          className="p-2.5 rounded-xl hover:bg-orange-50/60 border border-transparent hover:border-orange-200 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{l.name}</span>
                            <span className="text-slate-500 ml-2 font-mono">{l.phone}</span>
                            <div className="text-[11px] text-slate-400">{l.source} • {l.productInterest}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Orders */}
                  {matchedOrders.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Orders</div>
                      {matchedOrders.map(o => (
                        <div
                          key={o.id}
                          onClick={() => {
                            setActiveTab('orders');
                            setActiveModal(null);
                          }}
                          className="p-2.5 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{o.orderNumber}</span>
                            <span className="text-slate-500 ml-2">({o.customerName})</span>
                            <div className="text-[11px] text-slate-400">{o.items.length} items • {o.paymentMethod}</div>
                          </div>
                          <span className="font-mono font-bold text-emerald-600">₹{o.total}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Products */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Products</div>
                      {matchedProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveTab('products');
                            setActiveModal(null);
                          }}
                          className="p-2.5 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{p.name}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{p.sku}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-800">₹{p.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedLeads.length === 0 && matchedOrders.length === 0 && matchedProducts.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No matching records found for "{searchTerm}".
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
