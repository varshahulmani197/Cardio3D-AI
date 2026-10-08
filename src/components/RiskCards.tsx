import React from 'react';
import { PredictionResponse, RiskCategory } from '../types';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface RiskCardsProps {
  prediction: PredictionResponse | null;
  selectedVessel: 'LAD' | 'LCX' | 'RCA' | null;
  onSelectVessel: (vessel: 'LAD' | 'LCX' | 'RCA' | null) => void;
  isLoading?: boolean;
}

export const RiskCards: React.FC<RiskCardsProps> = ({
  prediction,
  selectedVessel,
  onSelectVessel,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">No Patient Analysis Available</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Complete clinical parameters in the input panel and click <strong className="text-slate-800">Analyze Patient</strong> to evaluate overall CAD probability and vessel-specific stenosis risks.
        </p>
      </div>
    );
  }

  const { cad, vessels } = prediction;

  const getBadgeStyle = (cat: RiskCategory) => {
    switch (cat) {
      case 'high':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          text: 'text-rose-600',
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          text: 'text-amber-600',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          text: 'text-emerald-600',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        };
    }
  };

  const cadStyle = getBadgeStyle(cad.category);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* OVERALL CAD MODEL OUTPUT */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Overall CAD
            </span>
            <span className="text-xs font-semibold capitalize flex items-center gap-1 text-slate-700">
              {cadStyle.icon}
              {cad.category} Risk
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold font-mono tabular-nums ${cadStyle.text}`}>
                {cad.percentage}%
              </span>
              <span className="text-xs text-slate-400 font-mono">probability</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-medium leading-snug">
              {cad.risk_label}
            </p>
          </div>

          {/* Probability bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                cad.category === 'high' ? 'bg-rose-500' : (cad.category === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500')
              }`}
              style={{ width: `${cad.percentage}%` }}
            />
          </div>
        </div>

        {/* LAD VESSEL CARD */}
        {(['LAD', 'LCX', 'RCA'] as const).map(vKey => {
          const v = vessels[vKey];
          const style = getBadgeStyle(v.category);
          const isSelected = selectedVessel === vKey;

          return (
            <button
              key={vKey}
              onClick={() => onSelectVessel(isSelected ? null : vKey)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {vKey} Artery
                </span>
                <span className="text-xs font-semibold capitalize flex items-center gap-1 text-slate-700">
                  {style.icon}
                  {v.category}
                </span>
              </div>

              <div className="my-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-bold font-mono tabular-nums ${style.text}`}>
                    {v.percentage}%
                  </span>
                  <span className="text-xs text-slate-400 font-mono">stenosis risk</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  {v.name}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    v.category === 'high' ? 'bg-rose-500' : (v.category === 'moderate' ? 'bg-amber-500' : 'bg-emerald-500')
                  }`}
                  style={{ width: `${v.percentage}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Decision-Support Note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
        <span>Click any vessel card to highlight and inspect its coronary path in the 3D model.</span>
        <span className="text-slate-400">Target leakage prevention active (LAD, LCX, RCA excluded from features)</span>
      </div>
    </div>
  );
};
