import React from 'react';
import { HeartPulse, ShieldAlert, CheckCircle2, XCircle, Sparkles, Layers, Globe, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
          Medical Background & Platform Mission
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">About Cardio3D AI</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          An interactive, explainable clinical decision-support research application bridging statistical machine learning, vessel-level CAD prediction, and 3D coronary spatial anatomy.
        </p>
      </div>

      {/* What is CAD? */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-600" />
          <span>What is Coronary Artery Disease (CAD)?</span>
        </h2>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            Coronary Artery Disease (CAD) is a chronic inflammatory disorder characterized by the progressive accumulation of fibrofatty atheromatous plaques within the intima of the epicardial coronary arteries. Over decades, lipid infiltration, smooth muscle proliferation, and calcification lead to arterial lumen narrowing (stenosis), limiting myocardial oxygen delivery.
          </p>
          <p>
            When luminal diameter is compromised by greater than 50% to 70%, exertional myocardial ischemia ensues, clinically presenting as angina pectoris, dyspnea, or Regional Wall Motion Abnormalities (RWMA). Plaque erosion or rupture can trigger acute coronary thrombus formation, precipitating acute myocardial infarction (STEMI / NSTEMI).
          </p>
        </div>
      </div>

      {/* Scope Comparison: What This System Does vs Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WHAT IT DOES */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm border-b border-emerald-100 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>What Cardio3D AI DOES</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Accepts standardized patient clinical variables (demographics, labs, ECG, echocardiography).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Predicts probabilistic risk for overall CAD using models trained on real angiographic labels.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Predicts individual vessel stenosis risks for LAD, LCX, and RCA branches.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Maps risk probabilities onto an interactive 3D coronary anatomy model for intuitive spatial inspection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Calculates game-theoretic TreeSHAP feature attributions explaining which clinical factors drove the model output.</span>
            </li>
          </ul>
        </div>

        {/* WHAT IT DOES NOT DO */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-rose-100 pb-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>What Cardio3D AI DOES NOT DO</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✗</span>
              <span>Does NOT provide medical diagnoses or replace physician judgment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✗</span>
              <span>Does NOT substitute for invasive coronary angiography (ICA) or coronary CT angiography (CCTA).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✗</span>
              <span>Does NOT directly measure physical lumen diameter or plaque burden in millimeters.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✗</span>
              <span>Does NOT render the patient's actual anatomical organs; 3D geometry is an illustrative educational template.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✗</span>
              <span>Does NOT prescribe medical therapy, revascularization, or procedural interventions.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Prominent Statutory Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-300 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>Statutory Clinical Safety Notice</span>
        </div>
        <p className="leading-relaxed">
          This software is engineered as an investigational research prototype and educational decision-support instrument. AI-generated predictions are probabilistic statistical estimates and must never be interpreted as confirmed clinical diagnoses. Clinical management of coronary disease must always be performed by licensed physicians following standard professional guidelines (AHA/ACC/ESC).
        </p>
      </div>

      {/* Future Scope Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-600" />
          <span>Future Research Scope & Roadmap</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>DICOM CCTA Volumetric Mesh Reconstruction</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Automated segmentation from 3D Coronary CT Angiography datasets to produce patient-specific coronary vessel geometry.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Center Federated Learning</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Privacy-preserving federated model training across diverse global cohorts (e.g., Cleveland Clinic, Framingham, UK Biobank).
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Cpu className="w-3.5 h-3.5 text-purple-600" />
              <span>Computational Fluid Dynamics (FFR-CT)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Coupling AI stenosis predictions with Navier-Stokes hemodynamic modeling to estimate non-invasive fractional flow reserve.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              <span>Prospective Clinical Validation Trials</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Formal prospective trials measuring impact on diagnostic turnaround times and coronary catheterization appropriateness criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
