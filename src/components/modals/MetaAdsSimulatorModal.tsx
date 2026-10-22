import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Smartphone,
  Check,
  RotateCcw,
  Zap,
  Building2,
  Lock
} from 'lucide-react';

export const MetaAdsSimulatorModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    addLead, 
    products, 
    setActiveTab, 
    showToast 
  } = useApp();

  // Stages: 1. 'ad_view' -> 2. 'form_view' -> 3. 'processing' -> 4. 'whatsapp_preview'
  const [stage, setStage] = useState<'ad_view' | 'form_view' | 'processing' | 'whatsapp_preview'>('ad_view');

  // Form Fields
  const [fullName, setFullName] = useState('Arunachalam Raj');
  const [phoneNumber, setPhoneNumber] = useState('98402 12345');
  const [productChoice, setProductChoice] = useState(products[0]?.name || 'Raw Himalayan Wildflower Honey (500g)');
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  // Processing steps animation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [createdLeadInfo, setCreatedLeadInfo] = useState<{ id: string; name: string; phone: string } | null>(null);

  if (activeModal !== 'metaAdsDemo') return null;

  const handleOpenForm = () => {
    setStage('form_view');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      showToast('Please enter mobile number');
      return;
    }

    setStage('processing');
    setCurrentStepIndex(0);

    // Simulate real-time webhook pipeline
    setTimeout(() => setCurrentStepIndex(1), 400); // 10-digit Indian phone validation
    setTimeout(() => setCurrentStepIndex(2), 800); // 48h deduplication check
    setTimeout(() => setCurrentStepIndex(3), 1200); // Consent & DPDP check
    setTimeout(() => {
      setCurrentStepIndex(4); // WhatsApp message dispatch

      // Ingest into ScaleAstra pipeline
      const res = addLead({
        name: fullName || 'Instagram Customer',
        phone: phoneNumber,
        email: `${(fullName || 'customer').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        source: 'Meta Lead Form',
        status: 'New',
        productInterest: productChoice,
        notes: 'Lead captured via simulated Instagram Feed Ad #PWH-AD-2026',
        consentRef: `CONS-INSTA-${Date.now()}`,
        consentStatus: whatsappConsent ? 'Opted In' : 'Opted Out',
        isDemo: true
      });

      setCreatedLeadInfo({
        id: res.lead.id,
        name: res.lead.name,
        phone: res.lead.phone
      });

      setTimeout(() => {
        setStage('whatsapp_preview');
      }, 700);
    }, 1600);
  };

  const handleReset = () => {
    setStage('ad_view');
    setCurrentStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
              <Smartphone className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-sm tracking-tight flex items-center gap-2">
                Meta Ads & Instagram Lead Model Demo
                <span className="text-[10px] font-mono uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Interactive Simulator
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Experience what your customer sees on Instagram and how ScaleAstra automates the backend.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4">
          
          {/* STEP TABS */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pb-2 border-b border-slate-200">
            <span className={`px-3 py-1 rounded-full transition-all ${stage === 'ad_view' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white'}`}>
              1. Instagram Ad
            </span>
            <span>&rarr;</span>
            <span className={`px-3 py-1 rounded-full transition-all ${stage === 'form_view' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white'}`}>
              2. Meta Instant Form
            </span>
            <span>&rarr;</span>
            <span className={`px-3 py-1 rounded-full transition-all ${stage === 'processing' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white'}`}>
              3. ScaleAstra Automation
            </span>
            <span>&rarr;</span>
            <span className={`px-3 py-1 rounded-full transition-all ${stage === 'whatsapp_preview' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white'}`}>
              4. WhatsApp Delivery
            </span>
          </div>

          {/* 1. INSTAGRAM AD VIEW */}
          {stage === 'ad_view' && (
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-scaleIn">
              
              {/* Instagram Post Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xs">
                      🍯
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>purewildhoney.in</span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="text-[10px] text-blue-600 font-normal">Follow</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Sponsored</div>
                  </div>
                </div>
                <div className="text-slate-400 text-xs tracking-widest font-bold">•••</div>
              </div>

              {/* Ad Creative Image Card */}
              <div className="relative aspect-square bg-gradient-to-br from-amber-900 via-slate-900 to-stone-900 p-6 flex flex-col justify-between text-white overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    Western Ghats Organic Honey
                  </span>
                  <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-mono">
                    100% Unpasteurized
                  </span>
                </div>

                <div className="space-y-2 text-center my-auto relative z-10">
                  <div className="text-5xl">🍯</div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-amber-200 tracking-tight leading-tight">
                    Pure Forest Honey Starter Pack
                  </h3>
                  <p className="text-xs text-slate-200 max-w-xs mx-auto leading-relaxed">
                    NMR tested, zero added sugar, harvested directly by forest tribal beekeepers.
                  </p>
                  <div className="inline-block px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-md">
                    Special 15% OFF + Free WhatsApp Tasting Menu
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 text-center relative z-10 font-medium">
                  Limited Harvest Batches Available &bull; Pollachi, TN
                </div>
              </div>

              {/* Action Bar (Instagram CTA Button) */}
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-b border-orange-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Get Exclusive Offer & Catalogue</div>
                  <div className="text-[10px] text-slate-500">Fast 1-Click signup on WhatsApp</div>
                </div>
                <button
                  onClick={handleOpenForm}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <span>Get Offer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Engagement Icons & Caption */}
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                    <MessageCircle className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                    <Send className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                  </div>
                  <Bookmark className="w-5 h-5 cursor-pointer hover:text-slate-900" />
                </div>
                <div className="font-bold text-slate-800 text-[11px]">1,842 likes</div>
                <div className="text-[11px] text-slate-700 leading-snug">
                  <strong>purewildhoney.in</strong> Looking for raw, unprocessed wild forest honey? Get our fresh seasonal catalogue & discount voucher delivered straight to your WhatsApp! 👇
                </div>
              </div>

            </div>
          )}

          {/* 2. META INSTANT LEAD FORM VIEW */}
          {stage === 'form_view' && (
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-slideUp">
              
              <div className="bg-slate-900 text-white p-4 text-center relative">
                <span className="text-3xl block mb-1">🍯</span>
                <h3 className="font-heading font-extrabold text-base text-amber-300">
                  Pure Wild Honey &bull; Starter Offer
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Enter your details to receive our Catalogue & 15% coupon instantly on WhatsApp.
                </p>
                <button
                  onClick={() => setStage('ad_view')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white text-xs"
                >
                  &larr; Back
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Mobile Number (+91)
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 98402 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product You Are Interested In</label>
                  <select
                    value={productChoice}
                    onChange={e => setProductChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.name}>{p.name} - ₹{p.price}</option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp Consent Checkbox (DPDP Compliance) */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 space-y-1.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-800 text-[11px] leading-tight select-none">
                    <input
                      type="checkbox"
                      checked={whatsappConsent}
                      onChange={e => setWhatsappConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 flex-shrink-0"
                    />
                    <span>
                      I agree to receive the <strong>Pure Wild Honey Catalogue</strong>, coupons, and order status via WhatsApp.
                    </span>
                  </label>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Indian DPDP Act & Meta Verified Opt-in Policy</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-heading font-extrabold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Lead & Receive Catalogue</span>
                </button>
              </form>

            </div>
          )}

          {/* 3. REAL-TIME PROCESSING PIPELINE ANIMATION */}
          {stage === 'processing' && (
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-5 text-center animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 flex items-center justify-center text-orange-600 animate-pulse">
                <Zap className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  ScaleAstra Automation Executing...
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deterministic lead ingestion & verification rules
                </p>
              </div>

              <div className="space-y-3 text-left font-mono text-xs max-w-sm mx-auto">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  currentStepIndex >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${currentStepIndex >= 1 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>1. Validating 10-digit Phone (+91)</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  currentStepIndex >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${currentStepIndex >= 2 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>2. Deduplication Engine (48h Check)</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  currentStepIndex >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${currentStepIndex >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>3. Verifying DPDP WhatsApp Consent</span>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                  currentStepIndex >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className={`w-4 h-4 ${currentStepIndex >= 4 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>4. Sending "welcome_honey_catalogue_v1"</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. WHATSAPP CUSTOMER PREVIEW & NEXT ACTIONS */}
          {stage === 'whatsapp_preview' && (
            <div className="max-w-md mx-auto space-y-4 animate-scaleIn">
              
              {/* WhatsApp Smartphone Mockup */}
              <div className="bg-white rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden">
                
                {/* Phone Top Speaker & Camera */}
                <div className="bg-slate-800 py-1.5 flex justify-center">
                  <div className="w-16 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* WhatsApp Chat Header */}
                <div className="bg-[#075E54] text-white p-3 flex items-center gap-2.5 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm shadow">
                    🍯
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span>Pure Wild Honey Co.</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <div className="text-[10px] text-emerald-100">Official Business Account</div>
                  </div>
                </div>

                {/* Chat Background & Message Bubble */}
                <div className="p-4 bg-[#EFEAE2] min-h-[220px] space-y-3">
                  <div className="text-center">
                    <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-600 font-mono">
                      TODAY &bull; 60-SEC AUTO RESPONSE
                    </span>
                  </div>

                  <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none p-3 shadow-sm space-y-2 text-slate-800 text-xs">
                    <div className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                      <span>Pure Wild Honey 🍯</span>
                      <span className="text-[9px] text-slate-400">&bull; Verified</span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-700">
                      வணக்கம் <strong>{fullName}</strong>! Thank you for expressing interest in 100% Raw Forest Honey via Instagram!
                    </p>

                    <p className="text-[11px] leading-relaxed text-slate-700">
                      Here is our certified Organic Honey Catalogue with laboratory NMR test reports and seasonal prices.
                    </p>

                    {/* Quick Action Button in Template */}
                    <div className="pt-1.5 border-t border-slate-100">
                      <div className="w-full py-2 px-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl text-center text-[11px] border border-emerald-200 flex items-center justify-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Download Honey Catalogue (PDF)</span>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 text-right font-mono flex items-center justify-end gap-1">
                      <span>Just now</span>
                      <span className="text-blue-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Success Badge & Next Navigation */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Automation Process Completed Successfully!</span>
                </div>
                <p className="text-xs text-slate-600">
                  Lead <strong>{createdLeadInfo?.name}</strong> has been added to ScaleAstra CRM, the WhatsApp template was logged with an Idempotency Key, and a Salesperson follow-up task is active.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('leads');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold text-center border border-orange-200 transition-colors"
                  >
                    View Leads CRM
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setActiveTab('automations');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold text-center border border-slate-200 transition-colors"
                  >
                    Execution Logs
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Run Again</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
