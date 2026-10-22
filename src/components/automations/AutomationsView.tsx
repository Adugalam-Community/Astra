import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Play, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Terminal 
} from 'lucide-react';

export const AutomationsView: React.FC = () => {
  const { 
    workflows, 
    executions, 
    toggleWorkflowActive, 
    runLeadSimulation, 
    simulationActive,
    setActiveTab 
  } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Deterministic Automation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Predefined rules with idempotency protection, bounded retries, and explicit consent gates.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('flowchart');
            if (!simulationActive) runLeadSimulation('valid_meta');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Flow Simulator</span>
        </button>
      </div>

      {/* Workflows Cards */}
      <div className="space-y-4">
        <div className="text-xs font-heading font-bold text-slate-500 uppercase tracking-wider px-1">
          Active Workflow Definitions ({workflows.length})
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {workflows.map(wf => (
            <div
              key={wf.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                wf.active 
                  ? 'bg-white border-slate-200 hover:border-orange-300' 
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    {wf.category}
                  </span>

                  <button
                    onClick={() => toggleWorkflowActive(wf.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {wf.active ? (
                      <ToggleRight className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 mt-2">
                  {wf.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {wf.description}
                </p>

                {/* Trigger */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono">
                  <span className="text-orange-600 font-bold block mb-0.5">Trigger:</span>
                  <span className="text-slate-700">{wf.trigger}</span>
                </div>

                {/* Conditions */}
                <div className="mt-3.5 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Conditions (All Must Pass):</span>
                  {wf.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-3.5 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Actions:</span>
                  {wf.actions.map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-orange-700">
                      <span className="text-orange-500 mt-0.5">→</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Runs: <strong className="text-slate-900 font-mono">{wf.executionCount}</strong></span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Idempotent
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-600" />
            Workflow Execution Logs & Idempotency Audit
          </h2>
          <span className="text-xs text-slate-500">Showing last {executions.length} runs</span>
        </div>

        <div className="space-y-2.5">
          {executions.map(exec => (
            <div
              key={exec.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{exec.workflowName}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Source: <span className="text-slate-700 font-medium">{exec.triggerSource}</span> • Idempotency: <code className="text-orange-600 font-mono">{exec.idempotencyKey}</code>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${
                    exec.status === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : exec.status === 'skipped'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {exec.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(exec.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Sub-steps */}
              <div className="space-y-1 pt-1.5 border-t border-slate-200">
                {exec.logs.map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="text-slate-400">{step.step}:</span>
                    <span className="font-mono text-slate-700 truncate max-w-md">{step.message}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
