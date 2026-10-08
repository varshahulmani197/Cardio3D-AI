import React from 'react';
import { ExplainResponse, ShapContribution } from '../types';
import { HelpCircle, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface SHAPChartProps {
  explanation: ExplainResponse | null;
  target: 'CAD' | 'LAD' | 'LCX' | 'RCA';
  onSelectTarget: (target: 'CAD' | 'LAD' | 'LCX' | 'RCA') => void;
  isLoading?: boolean;
}

export const SHAPChart: React.FC<SHAPChartProps> = ({
  explanation,
  target,
  onSelectTarget,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded"></div>
        <div className="h-40 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">Explainability Results Pending</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Run patient analysis to generate TreeSHAP marginal feature attributions for overall CAD and coronary branches.
        </p>
      </div>
    );
  }

  const { contributions, positive_factors, negative_factors, summary_text, base_value, prediction_value } = explanation;

  // Maximum absolute value for normalization of bar lengths
  const maxAbs = Math.max(...contributions.map(c => Math.abs(c.shap_value)), 0.05);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header & Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Why did the model produce this prediction?</h3>
            <span className="text-xs text-slate-400 font-mono">TreeSHAP Engine</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Marginal Shapley feature contributions explaining model output for this individual patient
          </p>
        </div>

        {/* Target Model Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          {(['CAD', 'LAD', 'LCX', 'RCA'] as const).map(t => (
            <button
              key={t}
              onClick={() => onSelectTarget(t)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                target === t
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t} Model
            </button>
          ))}
        </div>
      </div>

      {/* Model baseline vs patient probability bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Population Base Rate E[f(X)]:</span>
          <span className="font-mono font-bold text-slate-800 text-sm">{Math.round(base_value * 100)}%</span>
          <span className="text-slate-400 text-[10px] block">Dataset cohort expected value</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Patient Model Output f(x):</span>
          <span className="font-mono font-bold text-rose-600 text-sm">{Math.round(prediction_value * 100)}%</span>
          <span className="text-slate-400 text-[10px] block">Calculated predictive risk</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[11px]">Attributed Net Delta:</span>
          <span className={`font-mono font-bold text-sm ${prediction_value >= base_value ? 'text-rose-600' : 'text-emerald-600'}`}>
            {prediction_value >= base_value ? '+' : ''}{Math.round((prediction_value - base_value) * 100)}%
          </span>
          <span className="text-slate-400 text-[10px] block">Sum of all feature Shapley values</span>
        </div>
      </div>

      {/* Dynamic Summary Card */}
      <div className="p-3.5 bg-rose-50/40 border border-rose-100 rounded-lg text-xs text-slate-700 leading-relaxed">
        <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-rose-600" />
          <span>Clinical Feature Attribution Summary</span>
        </div>
        <p className="text-slate-700">{summary_text}</p>
        <p className="text-[11px] text-slate-500 mt-1.5 italic">
          Note: SHAP values describe internal machine learning feature influence and should not be confused with biological causation or standalone diagnoses.
        </p>
      </div>

      {/* Feature Contributions Split: Increasing Risk vs Decreasing Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {/* Positive Factors (Increasing model risk) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-rose-100 text-xs font-semibold text-rose-700">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span>Factors Increasing Model Risk (+Δ)</span>
          </div>

          <div className="space-y-2.5">
            {positive_factors.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No significant positive risk drivers identified.</p>
            ) : (
              positive_factors.map((item, idx) => {
                const barWidth = Math.min(100, (Math.abs(item.shap_value) / maxAbs) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.display_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">val: {String(item.feature_value)}</span>
                        <span className="font-mono font-semibold text-rose-600 tabular-nums text-xs">
                          +{Math.round(item.shap_value * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Negative Factors (Decreasing model risk / Protective) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-emerald-100 text-xs font-semibold text-emerald-700">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Factors Decreasing Model Risk (-Δ)</span>
          </div>

          <div className="space-y-2.5">
            {negative_factors.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No protective factors below baseline in this patient profile.</p>
            ) : (
              negative_factors.map((item, idx) => {
                const barWidth = Math.min(100, (Math.abs(item.shap_value) / maxAbs) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{item.display_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">val: {String(item.feature_value)}</span>
                        <span className="font-mono font-semibold text-emerald-600 tabular-nums text-xs">
                          {Math.round(item.shap_value * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
