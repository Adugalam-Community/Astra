import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  ShoppingBag 
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, consentRecords } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-600" />
            Customer Directory & Consent Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit opt-in/opt-out records compliant with DPDP Act & Meta messaging policies.
          </p>
        </div>

        <div className="text-xs text-slate-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Total Customers: <strong className="text-slate-900">{customers.length}</strong></span>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(customer => (
          <div
            key={customer.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {customer.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                  customer.consentStatus === 'Opted In'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {customer.consentStatus}
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{customer.address}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {customer.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Order Stats */}
            <div className="pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Orders Placed</div>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                  <span>{customer.orderCount} orders</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Lifetime Spent</div>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">
                  ₹{customer.totalSpent.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Ledger Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
        <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          Consent Evidence Ledger (Audit Logged)
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left min-w-[650px]">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Consent Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consentRecords.map(cr => (
                <tr key={cr.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-900">{cr.contactName} ({cr.phone})</td>
                  <td className="py-3 px-4 text-slate-700">{cr.channel}</td>
                  <td className="py-3 px-4 text-slate-700">{cr.purpose}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">{cr.source}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                      cr.status === 'Opted In'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {cr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">
                    {new Date(cr.timestamp).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
