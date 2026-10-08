import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(!compact);

  if (compact) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-amber-700 dark:text-amber-300">Decision-Support Notice:</span> Predictions are research model estimates and do not constitute clinical diagnoses or direct angiographic measurements.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-slate-100 tracking-wide">CLINICAL SAFETY NOTICE</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline text-slate-300">
              For research, educational, and decision-support purposes only. Not a medical diagnosis.
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors py-0.5 px-2 rounded hover:bg-slate-800 cursor-pointer"
            aria-expanded={expanded}
          >
            <span>{expanded ? 'Hide full notice' : 'View full notice'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed grid sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Non-Diagnostic Classification</strong>
                AI-generated probabilities represent statistical model risk based on the UCI Z-Alizadeh Sani cohort, not confirmed anatomical arterial stenosis.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Physician Discretion Required</strong>
                Never replace clinical evaluation, invasive coronary angiography (ICA), CT angiography (CCTA), or physician judgment with AI outputs.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-slate-300 shrink-0 font-bold mt-0.5">3D</span>
              <div>
                <strong className="text-slate-200 block mb-0.5">Illustrative 3D Geometry</strong>
                The 3D heart represents an anatomical schematic with model probabilities mapped to LAD, LCX, and RCA vessel trees, not patient patient-specific imaging.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
