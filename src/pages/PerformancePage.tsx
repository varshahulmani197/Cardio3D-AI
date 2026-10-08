import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ModelMetricsItem, ModelInfo } from '../types';
import { CheckCircle2, ShieldCheck, Activity, Award, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PerformancePage: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, ModelMetricsItem> | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [activeModel, setActiveModel] = useState<'CAD' | 'LAD' | 'LCX' | 'RCA'>('CAD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, info] = await Promise.all([
          api.getPerformance(),
          api.getModelInfo()
        ]);
        setMetrics(m);
        setModelInfo(info);
      } catch (err) {
        console.error('Failed to load performance metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-700">Loading model evaluation artifacts...</p>
      </div>
    );
  }

  const currentMetrics = metrics[activeModel];
  const cm = currentMetrics.confusion_matrix;
  const sensitivity = cm.tp / (cm.tp + cm.fn);
  const specificity = cm.tn / (cm.tn + cm.fp);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Empirical Validation & Cross-Validation
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">Model Performance & Evaluation</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Empirical evaluation results generated from the test partition of the UCI Z-Alizadeh Sani Coronary Artery Disease cohort. Target leakage columns (<code className="font-mono text-slate-800">LAD</code>, <code className="font-mono text-slate-800">LCX</code>, <code className="font-mono text-slate-800">RCA</code>, <code className="font-mono text-slate-800">Cath</code>) are strictly excluded from predictive features.
        </p>
      </div>

      {/* Target Model Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-md">
        {(['CAD', 'LAD', 'LCX', 'RCA'] as const).map(targetKey => (
          <button
            key={targetKey}
            onClick={() => setActiveModel(targetKey)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
              activeModel === targetKey
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {targetKey} Model
          </button>
        ))}
      </div>

      {/* Primary Metrics Table for all 4 models */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Comparative Performance Summary Matrix</h3>
          <span className="text-xs text-slate-400 font-mono">Test Partition (n=61, 20% holdout)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4 text-center">Overall CAD</th>
                <th className="py-3 px-4 text-center">LAD Stenosis</th>
                <th className="py-3 px-4 text-center">LCX Stenosis</th>
                <th className="py-3 px-4 text-center">RCA Stenosis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-800">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-medium text-slate-700">Accuracy</td>
                <td className="py-3 px-4 text-center font-bold text-rose-600">{(metrics.CAD.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LAD.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LCX.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.RCA.accuracy * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-medium text-slate-700">Precision (PPV)</td>
                <td className="py-3 px-4 text-center">{(metrics.CAD.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LAD.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LCX.precision * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.RCA.precision * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-medium text-slate-700">Recall (Sensitivity)</td>
                <td className="py-3 px-4 text-center">{(metrics.CAD.recall * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LAD.recall * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.LCX.recall * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center">{(metrics.RCA.recall * 100).toFixed(1)}%</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-medium text-slate-700">F1 Score</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">{metrics.CAD.f1.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.LAD.f1.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.LCX.f1.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.RCA.f1.toFixed(3)}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-sans font-medium text-slate-700">ROC-AUC</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">{metrics.CAD.roc_auc.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.LAD.roc_auc.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.LCX.roc_auc.toFixed(3)}</td>
                <td className="py-3 px-4 text-center">{metrics.RCA.roc_auc.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Deep Dive for Currently Selected Model */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentMetrics.target_name} Confusion Matrix</h3>
              <p className="text-[11px] text-slate-400">Classification distribution on holdout test set</p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              Threshold = 0.50
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-center font-mono py-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-sans font-semibold text-emerald-700 uppercase block">True Positive (TP)</span>
              <span className="text-2xl font-bold text-emerald-800">{cm.tp}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Disease correctly detected</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-[10px] font-sans font-semibold text-rose-700 uppercase block">False Positive (FP)</span>
              <span className="text-2xl font-bold text-rose-800">{cm.fp}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Normal misclassified</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-sans font-semibold text-amber-700 uppercase block">False Negative (FN)</span>
              <span className="text-2xl font-bold text-amber-800">{cm.fn}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Disease missed by model</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] font-sans font-semibold text-emerald-700 uppercase block">True Negative (TN)</span>
              <span className="text-2xl font-bold text-emerald-800">{cm.tn}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Normal correctly identified</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Sensitivity:</span>
              <strong className="font-mono text-slate-800">{(sensitivity * 100).toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded">
              <span className="text-slate-500">Specificity:</span>
              <strong className="font-mono text-slate-800">{(specificity * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* ROC Curve */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">ROC Curve (Receiver Operating Characteristic)</h3>
              <p className="text-[11px] text-slate-400">True Positive Rate vs. False Positive Rate across thresholds</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AUC = {currentMetrics.roc_auc.toFixed(3)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentMetrics.roc_curve} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="fpr"
                  label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -10, fontSize: 11 }}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  dataKey="tpr"
                  label={{ value: 'True Positive Rate (Sensitivity)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  tick={{ fontSize: 10 }}
                  domain={[0, 1]}
                />
                <Tooltip
                  formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Rate']}
                  labelFormatter={(lbl: any) => `FPR: ${(Number(lbl) * 100).toFixed(1)}%`}
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#e11d48' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 italic text-center">
            Discriminative power: {currentMetrics.roc_auc >= 0.9 ? 'Outstanding' : (currentMetrics.roc_auc >= 0.8 ? 'Excellent' : 'Acceptable')} clinical separation.
          </p>
        </div>
      </div>

      {/* Model Information & Audit Details */}
      {modelInfo && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Training Metadata & Target Leakage Prevention Audit</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Dataset & Size:</span>
              <strong className="text-slate-800 block">{modelInfo.dataset}</strong>
              <span className="text-slate-500 font-mono">303 patient records (216 CAD / 87 Normal)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Target Leakage Exclusion:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {modelInfo.target_leakage_prevention.excluded_columns.map(col => (
                  <span key={col} className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-mono text-[10px] font-bold">
                    {col} (Excluded)
                  </span>
                ))}
              </div>
              <span className="text-slate-500 text-[10px] block mt-1">Strict diagnostic column separation verified</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-400 block text-[11px]">Validation Protocol:</span>
              <strong className="text-slate-800 block">{modelInfo.training_strategy}</strong>
              <span className="text-slate-500 text-[10px] block">Random seed = 42 for exact reproducibility</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
