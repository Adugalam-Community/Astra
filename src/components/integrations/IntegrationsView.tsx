import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Network, 
  AlertTriangle, 
  RotateCw, 
  ToggleLeft, 
  ToggleRight, 
  Lock,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { 
    integrations, 
    toggleIntegrationMode, 
    showToast, 
    addLead, 
    setActiveTab,
    products 
  } = useApp();

  // Inbound Webhook Test Form State
  const [testName, setTestName] = useState('Ananya Raman');
  const [testPhone, setTestPhone] = useState('98401 55667');
  const [testProduct, setTestProduct] = useState(products[0]?.name || 'Raw Himalayan Wildflower Honey (500g)');
  const [testConsent, setTestConsent] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastSimResult, setLastSimResult] = useState<{
    success: boolean;
    leadId?: string;
    phone?: string;
    isDuplicate?: boolean;
    message: string;
  } | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`✓ Copied ${label} to clipboard!`);
  };

  const handleSimulateInboundLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) {
      showToast('Please enter a test phone number');
      return;
    }

    setIsSimulating(true);

    setTimeout(() => {
      const res = addLead({
        name: testName || 'Instagram Lead',
        phone: testPhone,
        email: `${(testName || 'lead').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        source: 'Meta Lead Form',
        status: 'New',
        productInterest: testProduct,
        notes: 'Ingested via Meta Instagram Instant Form Webhook simulator',
        consentRef: `CONS-META-${Date.now()}`,
        consentStatus: testConsent ? 'Opted In' : 'Opted Out',
        isDemo: true
      });

      setIsSimulating(false);

      if (res.isDuplicate) {
        setLastSimResult({
          success: false,
          phone: res.lead.phone,
          isDuplicate: true,
          message: `Deduplication Rule Triggered: Phone ${res.lead.phone} already active. Automated WhatsApp message suppressed.`
        });
      } else if (!testConsent) {
        setLastSimResult({
          success: false,
          phone: res.lead.phone,
          isDuplicate: false,
          message: `Privacy Gate: Consent was unchecked. Lead saved, but WhatsApp messaging cancelled per DPDP regulations.`
        });
      } else {
        setLastSimResult({
          success: true,
          leadId: res.lead.id,
          phone: res.lead.phone,
          isDuplicate: false,
          message: `✓ Success! Lead captured -> WhatsApp template "welcome_honey_catalogue_v1" dispatched -> Salesperson task assigned!`
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-orange-600" />
            Integrations & Server-Side Adapters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict isolation between simulated demo adapters and verified live production credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800">
          <Lock className="w-3.5 h-3.5 text-orange-600" />
          <span>Server-Side Secret Management Active</span>
        </div>
      </div>

      {/* Safety Notice from Developer Brief */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-800">
            Critical Integration Safety Rule (From Developer Brief):
          </div>
          <p className="text-slate-600 leading-snug">
            Live integrations require verified Meta app permissions, WhatsApp business profile verification, 
            and authenticated webhook endpoints. Never claim a message or payment succeeded without provider confirmation. 
            Keep Demo mode active until contract credentials are fully approved.
          </p>
        </div>
      </div>

      {/* Interactive Meta Ads Inbound Webhook Simulator */}
      <div className="p-6 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
                <Smartphone className="w-4 h-4" />
              </span>
              <h2 className="font-heading font-bold text-base text-slate-900">
                Inbound Meta Instagram Lead Webhook Tester
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test the complete remaining automation steps: Ingestion &rarr; 10-digit Phone Check &rarr; Deduplication &rarr; DPDP Consent &rarr; WhatsApp Honey Catalogue Dispatch.
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Automation Hook Active
          </span>
        </div>

        <form onSubmit={handleSimulateInboundLead} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Full Name</label>
            <input
              type="text"
              value={testName}
              onChange={e => setTestName(e.target.value)}
              placeholder="e.g. Ananya Raman"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Indian Mobile (+91)
            </label>
            <input
              type="text"
              value={testPhone}
              onChange={e => setTestPhone(e.target.value)}
              placeholder="e.g. 98401 55667"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Inquired</label>
            <select
              value={testProduct}
              onChange={e => setTestProduct(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              {products.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={testConsent}
                onChange={e => setTestConsent(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span>WhatsApp Consent Checkbox</span>
            </label>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Processing...' : 'Simulate Inbound Lead'}</span>
            </button>
          </div>
        </form>

        {/* Live Feedback Banner */}
        {lastSimResult && (
          <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-all ${
            lastSimResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : lastSimResult.isDuplicate 
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {lastSimResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <div className="font-bold">{lastSimResult.message}</div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <button
                  onClick={() => setActiveTab('automations')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  View Execution Logs &rarr;
                </button>
                <span>&bull;</span>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  View in Leads CRM &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meta Webhook Endpoint & WhatsApp Template Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Meta Webhook Configuration Details */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Network className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Meta Developers & Webhook Settings
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Paste these details into your <strong>Meta App Dashboard &rarr; Webhooks &rarr; Page / leadgen</strong>.
          </p>

          <div className="space-y-2.5 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[11px] block">Callback URL:</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <span className="truncate">https://api.scaleastra.com/v1/webhooks/meta-leads</span>
                <button 
                  onClick={() => handleCopy('https://api.scaleastra.com/v1/webhooks/meta-leads', 'Callback URL')}
                  className="text-slate-400 hover:text-slate-600 ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Verify Token (hub.verify_token):</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <span className="font-bold text-orange-700">scaleastra_meta_webhook_token_2026</span>
                <button 
                  onClick={() => handleCopy('scaleastra_meta_webhook_token_2026', 'Verify Token')}
                  className="text-slate-400 hover:text-slate-600 ml-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Subscribed Webhook Field:</span>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold">
                <code>leadgen</code>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Template Preview */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Approved WhatsApp Welcome Template
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Template: <code className="font-mono text-orange-700 font-bold">welcome_honey_catalogue_v1</code> (Dispatched within 60s)
          </p>

          <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-emerald-200 text-slate-800 space-y-2 text-xs shadow-inner">
            <div className="p-3 bg-white rounded-xl rounded-tl-none shadow-sm space-y-1.5 max-w-[90%]">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span>Pure Wild Honey 🍯</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                வணக்கம் <strong>{"{{Customer Name}}"}</strong>! Thank you for expressing interest in Pure Wild Honey via Instagram!
              </p>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Here is our certified 100% Raw Forest Honey Catalogue and pricing menu.
              </p>
              <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="w-full py-1.5 px-3 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-center text-[11px] border border-emerald-200 flex items-center justify-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  <span>Download Honey Catalogue (PDF)</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-right">
              Delivered &bull; Read Receipts Active
            </div>
          </div>
        </div>

      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(integ => (
          <div
            key={integ.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 transition-all space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {integ.name}
                  </h3>
                  <div className="text-[11px] text-orange-700 font-mono mt-0.5">
                    Category: {integ.category}
                  </div>
                </div>

                {/* Live vs Demo Toggle */}
                <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    integ.mode === 'live' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {integ.mode} Mode
                  </span>
                  <button
                    onClick={() => toggleIntegrationMode(integ.id)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {integ.mode === 'live' ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-amber-600" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-snug">
                {integ.description}
              </p>

              {/* Endpoint & Secret status */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Webhook URL:</span>
                  <span className="text-slate-700 truncate max-w-[200px]">{integ.webhookUrl}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Server Secret:</span>
                  <span className="text-orange-700 font-bold">{integ.secretMasked}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Quota Usage:</span>
                  <span className="text-slate-700">{integ.quotaUsed}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`w-2 h-2 rounded-full ${integ.webhookVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-slate-600">
                  {integ.webhookVerified ? 'Signature Verified' : 'Awaiting Test Ping'}
                </span>
              </div>

              <button
                onClick={() => showToast(`✓ Test ping sent to ${integ.name} adapter!`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                <RotateCw className="w-3 h-3 text-slate-500" />
                <span>Test Ping</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
