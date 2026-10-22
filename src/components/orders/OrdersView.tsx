import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Truck, 
  X, 
  CreditCard 
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    verifyOrderPayment, 
    updateOrderStatus, 
    generateInvoiceForOrder, 
    setActiveTab,
    showToast 
  } = useApp();

  const [stateFilter, setStateFilter] = useState<string>('all');
  const [verifyModalOrder, setVerifyModalOrder] = useState<Order | null>(null);
  const [utrNumber, setUtrNumber] = useState('');

  const filteredOrders = orders.filter(o => {
    if (stateFilter === 'all') return true;
    return o.lifecycleState === stateFilter;
  });

  const handleVerifyPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyModalOrder) return;
    if (!utrNumber.trim()) {
      showToast('Please enter a valid Bank UTR or Payment Reference number');
      return;
    }

    const success = verifyOrderPayment(verifyModalOrder.id, utrNumber);
    if (success) {
      setVerifyModalOrder(null);
      setUtrNumber('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            Orders & Fulfilment Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict Payment Verification Gate • 5% GST Automated Invoicing • Stock Protection
          </p>
        </div>

        {/* State Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-sm">
          {['all', 'Pending Confirmation', 'Confirmed', 'Paid', 'Fulfilled'].map(s => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                stateFilter === s
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? `All (${orders.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Security Rule Reminder Box */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-snug">
          <span className="font-bold text-amber-800">ScaleAstra Integrity Rule: </span>
          Never mark an order as Paid based solely on a customer screenshot or claim. Payment requires 
          an authorized owner bank statement verification or verified gateway webhook signature.
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="p-14 text-center text-slate-400 rounded-2xl bg-white border border-slate-200 space-y-2">
            <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No orders matching this filter</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-3.5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-mono font-bold text-xs text-orange-700">
                    #{order.orderNumber.split('-')[2] || 'ORD'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{order.orderNumber}</span>
                      <span className="text-slate-500 text-xs">• {order.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {order.phone} • {order.shippingAddress}
                    </div>
                  </div>
                </div>

                {/* State Badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold ${
                    order.lifecycleState === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.lifecycleState === 'Fulfilled'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : order.lifecycleState === 'Pending Confirmation'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {order.lifecycleState}
                  </span>
                </div>
              </div>

              {/* Items & Financial Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                {/* Items column */}
                <div className="sm:col-span-6 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Ordered Honey Items:</div>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono text-slate-900 font-medium">₹{it.total.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="text-[10px] text-slate-400 italic mt-1">
                      Note: {order.notes}
                    </div>
                  )}
                </div>

                {/* Verification details */}
                <div className="sm:col-span-3 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Payment Verification:</div>
                  <div className="text-slate-800 font-medium">
                    {order.paymentStatus === 'Verified Paid' ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Pending Proof
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {order.paymentProofRef || order.paymentMethod}
                  </div>
                </div>

                {/* Totals */}
                <div className="sm:col-span-3 text-right space-y-0.5">
                  <div className="text-[11px] text-slate-500">
                    Subtotal: ₹{order.subtotal.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    GST (5%): ₹{order.taxAmount.toFixed(2)}
                  </div>
                  <div className="text-base font-bold text-slate-900 font-heading">
                    Total: ₹{order.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Stock Reserved
                  </span>
                  {order.invoiceId && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      Invoice: {order.invoiceId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {order.lifecycleState === 'Pending Confirmation' && (
                    <button
                      onClick={() => setVerifyModalOrder(order)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Verify Payment UTR</span>
                    </button>
                  )}

                  {order.lifecycleState === 'Paid' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Fulfilled')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch & Fulfil</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (!order.invoiceId) {
                        generateInvoiceForOrder(order.id);
                      }
                      setActiveTab('invoices');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View GST Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verify Payment Modal */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Owner Payment Verification Gate
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Order: <span className="text-slate-800 font-bold">{verifyModalOrder.orderNumber}</span> (₹{verifyModalOrder.total.toFixed(2)})
                </p>
              </div>
              <button 
                onClick={() => setVerifyModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyPaymentSubmit} className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900">{verifyModalOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payable Amount:</span>
                  <span className="font-mono text-orange-600 font-bold">₹{verifyModalOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Bank UTR / UPI Transaction Reference ID *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. UTR-9921048821 or pay_On9821a"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Verify against your current account statement before confirming.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800">
                ✓ Once verified, the order moves to <strong>Paid</strong> state and a sequential GST Tax Invoice will be generated automatically.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
