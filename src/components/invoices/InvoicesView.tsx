import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { invoices, workspace, showToast } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Tax Invoices & GST Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential GST-compliant invoices generated strictly from validated orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>GSTIN: <strong className="font-mono text-slate-900">{workspace.gstNumber}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Invoice List, Right Full Invoice Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Invoices List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider px-1">
            Issued Invoices ({invoices.length})
          </div>

          <div className="space-y-2.5">
            {invoices.map(inv => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/50 border-orange-300 shadow-sm ring-1 ring-orange-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs">{inv.invoiceNumber}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {inv.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 mt-1.5 font-medium">{inv.customerName}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Order: {inv.orderNumber}</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{inv.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Tax Invoice Document (8 cols) */}
        <div className="lg:col-span-8">
          {selectedInvoice ? (
            <div className="space-y-3">
              {/* Document Toolbar */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-sm">
                <span className="text-slate-600 font-medium">
                  Viewing: <strong className="font-mono text-slate-900">{selectedInvoice.invoiceNumber}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => showToast('✓ PDF Invoice downloaded')}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Legal Invoice Paper Sheet */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 invoice-paper">
                
                {/* Letterhead */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <div className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
                      {workspace.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      FSSAI Lic: 12423002000491 • GSTIN: {workspace.gstNumber}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
                      {workspace.address}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Phone: {workspace.phone} • Email: {workspace.email}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-md bg-orange-100 text-orange-800">
                      TAX INVOICE
                    </span>
                    <div className="text-base font-mono font-bold text-slate-900 mt-2">
                      {selectedInvoice.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Date: {new Date(selectedInvoice.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Ref Order: <span className="text-slate-800 font-mono">{selectedInvoice.orderNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      Billed To (Customer):
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{selectedInvoice.customerName}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{selectedInvoice.customerPhone}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 max-w-xs">{selectedInvoice.customerAddress}</div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                      Payment Status & Mode:
                    </div>
                    <div className="font-semibold text-emerald-600 flex items-center sm:justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedInvoice.status.toUpperCase()}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Mode: {selectedInvoice.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3">HSN Code</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Taxable Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">0409 00 00</td>
                          <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-mono">₹{item.price.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                            ₹{item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* GST Calculations */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 max-w-xs">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GST Tax Note:
                    </div>
                    <p>Natural raw honey is subject to 5% GST (CGST 2.5% + SGST 2.5% for intra-state supply in Tamil Nadu).</p>
                  </div>

                  <div className="w-full sm:w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Value:</span>
                      <span className="font-mono">₹{selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>CGST (2.5%):</span>
                      <span className="font-mono">₹{selectedInvoice.cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>SGST (2.5%):</span>
                      <span className="font-mono">₹{selectedInvoice.sgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Grand Total:</span>
                      <span className="font-mono text-orange-600">₹{selectedInvoice.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
                  <div>
                    This is a computer-generated tax invoice verified by ScaleAstra Architecture.
                  </div>
                  <div className="font-bold text-slate-800 text-right">
                    For {workspace.name} <br />
                    <span className="text-[10px] text-orange-600 font-normal">Authorized Signatory</span>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-14 text-center text-slate-400 rounded-2xl bg-white border border-slate-200">
              Select an invoice from the left to view the tax details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
