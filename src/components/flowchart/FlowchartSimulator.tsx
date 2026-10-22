import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitFork, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Terminal, 
  Zap 
} from 'lucide-react';

export const FlowchartSimulator: React.FC = () => {
  const { 
    simulationActive, 
    simSteps, 
    runLeadSimulation, 
    resetSimulation, 
    executions,
    workspace 
  } = useApp();

  const [simMode, setSimMode] = useState<'happy' | 'duplicate' | 'optout'>('happy');

  const nodes = [
    {
      id: 'source',
      title: '1. Inbound Lead Source',
      subtitle: 'Meta Instant Form / Website / WhatsApp',
      type: 'trigger',
      detail: 'Webhook payload with HMAC-SHA256 signature received.'
    },
    {
      id: 'validate',
      title: '2. Validate Incoming Data',
      subtitle: 'Is data valid?',
      type: 'decision',
      detail: 'Checks 10-digit Indian phone, name, email formatting.'
    },
    {
      id: 'dedup',
      title: '3. Deduplication Engine',
      subtitle: 'Is this a duplicate lead?',
      type: 'decision',
      detail: 'Searches 48h phone records. If YES: update record, suppress outbound message.'
    },
    {
      id: 'integration',
      title: '4. Messaging Verification',
      subtitle: 'Is integration connected & verified?',
      type: 'decision',
      detail: 'Checks WhatsApp Cloud API / MSGPEDIA adapter token & rate limit.'
    },
    {
      id: 'consent',
      title: '5. Consent & Privacy Gate',
      subtitle: 'Valid consent & not opted out?',
      type: 'decision',
      detail: 'Enforces Indian DPDP & Meta policy. Opt-out contacts are never messaged.'
    },
    {
      id: 'send',
      title: '6. Send Approved Template',
      subtitle: 'Was message accepted by provider?',
      type: 'action',
      detail: 'Dispatches approved WhatsApp Honey Catalogue. Stores provider wamid.'
    },
    {
      id: 'sales',
      title: '7. Salesperson Follow-Up',
      subtitle: 'Customer interested -> Create Order?',
      type: 'decision',
      detail: 'Tracks enquiry notes. Converts lead to Draft Order.'
    },
    {
      id: 'stock_payment',
      title: '8. Stock & Payment Verification',
      subtitle: 'Stock confirmed & payment verified?',
      type: 'decision',
      detail: 'Strict Rule: Never mark paid without bank UTR / gateway verification!'
    },
    {
      id: 'invoice',
      title: '9. Tax Invoicing & Fulfilment',
      subtitle: 'Generate sequential GST invoice',
      type: 'action',
      detail: 'Generates INV-2026-XXXX with 5% GST and triggers warehouse dispatch.'
    },
    {
      id: 'repeat',
      title: '10. Repeat Purchase Eligibility',
      subtitle: 'Consent-verified 30-day reorder check',
      type: 'action',
      detail: 'Queues natural food restock prompt if opted-in.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                <GitFork className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-heading font-extrabold text-slate-900">
                ScaleAstra MVP Functional Flowchart (YES / NO Decisions)
              </h1>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Direct implementation of the verified specification and functional architecture. Simulates 
              incoming lead ingestion, deduplication, consent verification, WhatsApp template delivery, 
              order creation, verified payment, and GST invoice generation.
            </p>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSimMode('happy');
                runLeadSimulation('valid_meta');
              }}
              disabled={simulationActive}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>1. Happy Path (Meta Lead)</span>
            </button>

            <button
              onClick={() => {
                setSimMode('duplicate');
                runLeadSimulation('duplicate_phone');
              }}
              disabled={simulationActive}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-all disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>2. Duplicate Phone Test</span>
            </button>

            <button
              onClick={() => {
                setSimMode('optout');
                runLeadSimulation('opted_out');
              }}
              disabled={simulationActive}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs hover:bg-rose-100 transition-all disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>3. Opted-Out Policy Test</span>
            </button>

            {simSteps.length > 0 && (
              <button
                onClick={resetSimulation}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Guardrail Callout */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 text-amber-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Strict Guardrail: Never claim a message, payment, or invoice succeeded without provider confirmation.</span>
          </div>
          <div className="font-mono text-slate-600">
            Tenant: {workspace.id} • Currency: {workspace.currencySymbol} INR
          </div>
        </div>
      </div>

      {/* Main Flowchart Grid: Left Nodes & Right Live Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Decision Pipeline (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-heading font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              Deterministic Decision Nodes
            </h2>
            <span className="text-[11px] text-slate-400">10 Verified Execution Gates</span>
          </div>

          <div className="space-y-3 relative">
            {nodes.map((node, index) => {
              const executedStep = simSteps[index];
              const isCurrent = simSteps.length === index + 1 && simulationActive;

              let borderStyle = 'border-slate-200 bg-white';
              let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';

              if (executedStep) {
                if (executedStep.status === 'passed') {
                  borderStyle = 'border-emerald-300 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400';
                  badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                } else if (executedStep.status === 'warning') {
                  borderStyle = 'border-amber-300 bg-amber-50/50 shadow-sm ring-1 ring-amber-400';
                  badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                } else if (executedStep.status === 'failed') {
                  borderStyle = 'border-rose-300 bg-rose-50/50 shadow-sm ring-1 ring-rose-400';
                  badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
                }
              }

              return (
                <div
                  key={node.id}
                  className={`relative p-4 rounded-xl border transition-all duration-300 ${borderStyle} ${
                    isCurrent ? 'scale-[1.01] ring-2 ring-orange-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Step Indicator Dot */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                        executedStep?.status === 'passed'
                          ? 'bg-emerald-600 text-white'
                          : executedStep?.status === 'warning'
                          ? 'bg-amber-500 text-white'
                          : executedStep?.status === 'failed'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {executedStep?.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : executedStep?.status === 'failed' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">{node.title}</h3>
                          <span className={`text-[10px] px-2 py-0.2 rounded border uppercase font-mono ${badgeColor}`}>
                            {node.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-orange-600 font-semibold mt-0.5">
                          {node.subtitle}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {node.detail}
                        </p>

                        {/* Executed Detail if active */}
                        {executedStep && (
                          <div className={`mt-2.5 p-2.5 rounded-lg text-[11px] font-mono border ${
                            executedStep.status === 'passed'
                              ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                              : executedStep.status === 'warning'
                              ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                              : 'bg-rose-100/70 border-rose-300 text-rose-900'
                          }`}>
                            <span className="font-bold mr-1">Decision [{executedStep.decision}]:</span>
                            {executedStep.detail}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decision Gate Badge */}
                    <div className="text-right flex-shrink-0">
                      {node.type === 'decision' && (
                        <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          <span className="text-emerald-600">YES</span> / <span className="text-rose-600">NO</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Execution Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-heading font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-600" />
              Live Execution Tracer
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
              Idempotency Protected
            </span>
          </div>

          {/* Tracer Console Window */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 ml-2">scaleastra-engine.log</span>
              </div>
              <span className="text-[10px] text-orange-400 font-bold">
                {simulationActive ? '● SIMULATING' : 'IDLE'}
              </span>
            </div>

            {simSteps.length === 0 ? (
              <div className="py-14 text-center text-slate-500 space-y-2">
                <Zap className="w-8 h-8 text-orange-400/40 mx-auto" />
                <p className="text-xs">Click one of the 3 test buttons above to trigger the live flowchart engine.</p>
                <p className="text-[10px] text-slate-500">
                  Tests: Meta Lead Ingestion • Phone Deduplication • Consent Opt-Out Guardrail
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {simSteps.map((s, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border leading-snug animate-in fade-in duration-200 ${
                      s.status === 'passed' 
                        ? 'bg-[#0B1A24] border-emerald-800/60 text-emerald-300' 
                        : s.status === 'warning'
                        ? 'bg-[#1C1710] border-amber-800/60 text-amber-300'
                        : 'bg-[#1F0E14] border-rose-800/60 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-white">{s.step}</span>
                      <span className="font-mono">GATE: [{s.decision}]</span>
                    </div>
                    <p className="text-[11px] text-slate-200">{s.detail}</p>
                  </div>
                ))}

                {!simulationActive && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 flex items-center justify-between">
                    <span>Workflow completed. Audit log appended.</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Past Executions History */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              Recent Workflow Executions ({executions.length})
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
              {executions.slice(0, 4).map(exec => (
                <div key={exec.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 truncate max-w-[200px]">
                      {exec.workflowName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Trigger: {exec.triggerSource}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                      exec.status === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : exec.status === 'skipped'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {exec.status.toUpperCase()}
                    </span>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                      {new Date(exec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
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
