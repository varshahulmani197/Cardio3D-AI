import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ModelMetricsItem } from '../types';
import { HelpCircle, Brain, BookOpen, AlertCircle, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const ExplainabilityPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, ModelMetricsItem> | null>(null);

  useEffect(() => {
    api.getPerformance().then(setMetrics).catch(console.error);
  }, []);

  const cadTopFeatures = metrics?.CAD?.top_features || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Transparent & Interpretable Machine Learning
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">Explainable AI (XAI) Framework</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Cardio3D AI integrates Shapley Additive exPlanations (SHAP) to transform complex machine-learning predictions into transparent, clinically auditable feature attributions.
        </p>
      </div>

      {/* SHAP Mathematical Foundation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-600">
            <Brain className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Game-Theoretic Rigor</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Derived from cooperative game theory (Lloyd Shapley, 1953), allocating payout fairly among participating players (features) based on their marginal contributions.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Additive Efficiency</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Guarantees that the sum of all individual feature attributions exactly equals the difference between the patient prediction and the expected population baseline rate.
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            <BookOpen className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Consistency & Missingness</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            If a model shifts so that a feature has greater impact, its SHAP attribution never decreases. Features with zero marginal effect receive an attribution of zero.
          </p>
        </div>
      </div>

      {/* Global Feature Importance Ranking */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Global Feature Importance Ranking (Overall CAD)</h3>
            <p className="text-[11px] text-slate-400">Mean absolute attribution weight across the 303 patient cohort</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            Ensemble Importance
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {cadTopFeatures.slice(0, 10).map((f, i) => {
            const pct = Math.round(f.importance * 100);
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-slate-400 font-mono text-[11px]">{i + 1}.</span>
                    <strong className="text-slate-800">{f.feature}</strong>
                  </div>
                  <span className="font-mono text-slate-600 font-semibold">{pct}% relative weight</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, f.importance * 800)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Interpretation Guide & Ethical Boundary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
            <span>How to Read Individual Patient Attributions</span>
          </h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
              <span><strong>Positive SHAP (+Δ):</strong> Pushed the model's estimated risk probability higher than the baseline rate. (e.g., Abnormal RWMA, elevated LDL, advanced age).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span><strong>Negative SHAP (-Δ):</strong> Pushed the model's prediction lower (protective or normal findings, e.g., High HDL, preserved ejection fraction &gt;60%).</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3 text-xs text-amber-900">
          <h3 className="font-bold text-sm text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Ethical Boundary: Attribution vs. Causation</span>
          </h3>
          <p className="leading-relaxed">
            SHAP explains <strong>how the statistical model processed its numerical inputs</strong>, NOT biological etiology. A high SHAP attribution for Age does not mean age solely "caused" coronary atheroma. It means the algorithm found high correlation with CAD presence in the training cohort.
          </p>
          <p className="text-[11px] text-amber-800/80 italic">
            Clinical guideline: Always state "This feature increased the model's predictive output" rather than "This feature caused the patient's stenosis."
          </p>
        </div>
      </div>
    </div>
  );
};
