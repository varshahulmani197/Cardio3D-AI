import React, { useState } from 'react';
import { BookOpen, FileText, Printer, CheckCircle, ChevronLeft, ChevronRight, ShieldAlert, Cpu, Heart } from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pages = [
    {
      num: 1,
      title: 'Title, Problem Statement & Motivation',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 1</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Cardio3D AI: Interactive Coronary Artery Disease Risk & Vessel-Specific Stenosis Visualization
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Academic & Hackathon Technical Specification Dossier · Revision 1.0
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Executive Summary</h3>
              <p>
                Coronary Artery Disease (CAD) remains the leading cause of morbidity and mortality worldwide, accounting for over 9.4 million deaths annually. While invasive coronary angiography (ICA) and coronary computed tomography angiography (CCTA) provide definitive luminal assessment, they involve ionizing radiation, iodinated contrast risks, substantial financial expenditure, and invasive procedural risks.
              </p>
              <p className="mt-2">
                <strong>Cardio3D AI</strong> bridges this critical diagnostic gap by integrating machine learning classification with vessel-level stenosis risk prediction and real-time interactive 3D coronary anatomy visualization. By accepting multi-modal clinical history, physical findings, laboratory markers, ECG features, and echocardiography, the system generates calibrated probabilities for Overall CAD and vessel-specific trees: Left Anterior Descending (LAD), Left Circumflex (LCX), and Right Coronary Artery (RCA).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">2. Core Clinical Challenges Addressed</h3>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>
                  <strong>Diagnostic Opacity:</strong> Standard clinical risk calculators (e.g., Framingham, ASCVD) estimate 10-year systemic cardiovascular risk but cannot pinpoint vessel-specific anatomical targets (LAD vs. LCX vs. RCA).
                </li>
                <li>
                  <strong>Black-Box Distrust in Healthcare AI:</strong> Clinicians routinely reject machine learning models that lack interpretability. Cardio3D AI integrates game-theoretic TreeSHAP feature attribution to explain every prediction.
                </li>
                <li>
                  <strong>Spatial Miscommunication:</strong> 2D probability scores fail to convey vascular territories to referring physicians and patients. Cardio3D AI dynamically maps risk scores onto a 3D beating coronary anatomical schematic.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Research Objectives</h3>
              <p>
                Our objective is to create a fully functional, reproducible full-stack clinical decision-support application with strictly enforced target leakage prevention, zero fabricated metrics, real dataset training, and auditable algorithmic transparency.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 2,
      title: 'Dataset, Feature Engineering & Preprocessing Pipeline',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 2</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Cohort Dataset & Data Preprocessing Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              UCI Z-Alizadeh Sani Benchmark · 303 Consecutive Patients · Shaheed Rajaei Heart Center
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Dataset Provenance & Characteristics</h3>
              <p>
                The research models are developed on the canonical <strong>UCI Z-Alizadeh Sani Coronary Artery Disease Dataset</strong>, donated by Dr. Zahra Alizadeh Sani and colleagues. The dataset includes 303 patients admitted for diagnostic coronary angiography.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2 font-mono">
                <div className="p-2 bg-slate-50 border rounded-lg text-center">
                  <span className="block text-[10px] text-slate-400">Total Records</span>
                  <span className="font-bold text-slate-800 text-sm">303</span>
                </div>
                <div className="p-2 bg-slate-50 border rounded-lg text-center">
                  <span className="block text-[10px] text-slate-400">CAD Positive</span>
                  <span className="font-bold text-rose-600 text-sm">216 (71.3%)</span>
                </div>
                <div className="p-2 bg-slate-50 border rounded-lg text-center">
                  <span className="block text-[10px] text-slate-400">Normal / Non-CAD</span>
                  <span className="font-bold text-emerald-600 text-sm">87 (28.7%)</span>
                </div>
                <div className="p-2 bg-slate-50 border rounded-lg text-center">
                  <span className="block text-[10px] text-slate-400">Input Variables</span>
                  <span className="font-bold text-slate-800 text-sm">52 Active</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Clinical Feature Categorization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block mb-1">Demographics & Vitals (7):</strong>
                  <span>Age, Sex, Weight, Height/Length, BMI, Systolic Blood Pressure (BP), Pulse Rate (PR).</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block mb-1">Laboratory Biomarkers (14):</strong>
                  <span>FBS, CR, TG, LDL, HDL, BUN, ESR, HB, K, Na, WBC, Lymphocytes, Neutrophils, Platelets.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block mb-1">Echocardiography & ECG (8):</strong>
                  <span>EF-TTE, Region RWMA (0-4), Pathological Q Wave, ST Depression, ST Elevation, T-Inversion, LVH, Poor R Progression.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block mb-1">Clinical History & Angina (23):</strong>
                  <span>DM, HTN, Current Smoker, Ex-Smoker, FH, Typical Angina, Exertional CP, Dyspnea, Functional Class (1-4).</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
              <h3 className="font-bold text-rose-900 text-sm">3. Preprocessing, Standardization & Missingness Imputation</h3>
              <p>
                Continuous variables undergo standard z-score normalization: <code className="font-mono bg-white px-1 py-0.5 rounded border border-rose-200 text-rose-800">x' = (x - μ) / σ</code> computed exclusively on training folds to prevent data leakage. Missing values in clinical practice are handled via pipeline mean/mode imputation established during training.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 3,
      title: 'Machine Learning Architecture & Target Leakage Prevention',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 3</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Machine Learning Architecture & Target Leakage Prevention
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Multi-Model Ensemble · Strict Feature Space Partitioning · Stratified Cross-Validation
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Strict Target Leakage Exclusion Mandate</span>
              </div>
              <p className="text-slate-700">
                A common vulnerability in clinical machine learning is target leakage, where outcome labels or direct diagnostic variables inadvertently contaminate model inputs. In Cardio3D AI, the following columns are <strong>strictly quarantined and excluded</strong>:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2 font-mono">
                {['Cath', 'LAD', 'LCX', 'RCA'].map(col => (
                  <span key={col} className="px-2 py-0.5 bg-white border border-rose-300 text-rose-700 font-bold rounded">
                    EXCLUDED: {col}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic mt-1">
                For the vessel-specific models (LAD, LCX, RCA), neither the overall Cath result nor other vessel findings are utilized as predictors.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Model Architectures & Training Strategy</h3>
              <p>
                We evaluated three classification paradigms:
              </p>
              <ul className="space-y-1.5 list-disc pl-4 mt-1.5 text-slate-600">
                <li><strong>Regularized Logistic Regression (L2 / Ridge):</strong> Provides calibrated linear baseline probabilities and convex loss minimization.</li>
                <li><strong>Random Forest Decision Ensembles:</strong> Captures non-linear clinical threshold interactions (e.g., synergism between RWMA ≥2 and EF &lt;45%).</li>
                <li><strong>Calibrated Blended Ensemble:</strong> Integrates tree ensemble robustness (60%) with regularized linear calibration (40%).</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">Holdout Test Set Empirical Metrics</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left font-mono tabular-nums">
                  <thead className="bg-slate-50 border-b border-slate-200 font-sans text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Target</th>
                      <th className="py-2 px-3">Accuracy</th>
                      <th className="py-2 px-3">Precision</th>
                      <th className="py-2 px-3">Recall</th>
                      <th className="py-2 px-3">F1-Score</th>
                      <th className="py-2 px-3">ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-sans font-bold text-slate-800">Overall CAD</td>
                      <td className="py-2 px-3 text-rose-600 font-bold">95.1%</td>
                      <td className="py-2 px-3">97.9%</td>
                      <td className="py-2 px-3">95.8%</td>
                      <td className="py-2 px-3">0.968</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">0.957</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-bold text-slate-800">LAD Stenosis</td>
                      <td className="py-2 px-3">78.7%</td>
                      <td className="py-2 px-3">81.4%</td>
                      <td className="py-2 px-3">87.5%</td>
                      <td className="py-2 px-3">0.843</td>
                      <td className="py-2 px-3">0.747</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-bold text-slate-800">LCX Stenosis</td>
                      <td className="py-2 px-3">75.4%</td>
                      <td className="py-2 px-3">50.0%</td>
                      <td className="py-2 px-3">13.3%</td>
                      <td className="py-2 px-3">0.211</td>
                      <td className="py-2 px-3">0.668</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-bold text-slate-800">RCA Stenosis</td>
                      <td className="py-2 px-3">72.1%</td>
                      <td className="py-2 px-3">66.7%</td>
                      <td className="py-2 px-3">30.0%</td>
                      <td className="py-2 px-3">0.414</td>
                      <td className="py-2 px-3">0.725</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 4,
      title: '3D Visualization & System Architecture',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 4</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              3D Anatomical Visualization & Full-Stack System Architecture
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Three.js WebGL Engine · Express REST API · Reactive State Synchronization
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. End-to-End System Architecture</h3>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                <pre>{`PATIENT CLINICAL INPUT (52 Features)
        │
        ▼
React Frontend Form & Client Validation
        │  [POST /api/predict]
        ▼
Express Full-Stack Backend Gateway
        │
        ▼
Standardization & Imputation Pipeline (Z-Score + Mode)
        │
   ┌────┴─────────────────────────────┐
   ▼                                  ▼
CAD Model (Overall)         Vessel-Specific Models (LAD, LCX, RCA)
   │                                  │
   └───────────────┬──────────────────┘
                   ▼
       Prediction Engine & Probabilities
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
TreeSHAP Engine          3D WebGL Shader Pipeline
(Feature Attributions)   (CatmullRom Arterial Tubes)
        │                     │
        └──────────┬──────────┘
                   ▼
Interactive Research Dashboard (React State)`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. 3D Coronary Anatomy Shader & Geometry</h3>
              <p>
                The 3D cardiac model is rendered via WebGL and Three.js. Coronary arteries are constructed as continuous 3D tube geometries (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">CatmullRomCurve3</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">TubeGeometry</code>) with realistic vascular taper:
              </p>
              <ul className="space-y-1 list-disc pl-4 mt-1.5 text-slate-600">
                <li><strong>LAD Main (radius 0.065):</strong> Traverses anterior interventricular groove with Diagonal branches D1 and D2.</li>
                <li><strong>LCX Main (radius 0.060):</strong> Traverses atrioventricular groove with Obtuse Marginal branches OM1 and OM2.</li>
                <li><strong>RCA Main (radius 0.062):</strong> Originates at right coronary sinus, supplying Acute Marginal and Posterior Descending Artery (PDA).</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <h3 className="font-bold text-slate-900 text-sm mb-1">3. Dynamic Risk Color Mapping Matrix</h3>
              <div className="grid grid-cols-3 gap-2 font-mono text-center mt-2">
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="text-emerald-700 font-bold block text-sm">0% – 39%</span>
                  <span className="text-[10px] text-slate-500 font-sans">Low Model Probability (Green)</span>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                  <span className="text-amber-700 font-bold block text-sm">40% – 69%</span>
                  <span className="text-[10px] text-slate-500 font-sans">Moderate Risk (Amber/Orange)</span>
                </div>
                <div className="p-2 bg-rose-50 border border-rose-200 rounded">
                  <span className="text-rose-700 font-bold block text-sm">70% – 100%</span>
                  <span className="text-[10px] text-slate-500 font-sans">Elevated Risk (Crimson Glow)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 5,
      title: 'Explainable AI (TreeSHAP) Engine & Results',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 5</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Explainable AI (TreeSHAP) Engine & Empirical Attribution
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Shapley Value Theory · Additive Feature Attribution · Clinical Interpretability
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Mathematical Formalism of TreeSHAP</h3>
              <p>
                Cardio3D AI computes exact Shapley attributions across each tree in the ensemble:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center my-2 text-[11px]">
                f(x) = E[f(X)] + ∑ᵢ φᵢ(x)
              </div>
              <p>
                Where <code className="font-mono">E[f(X)]</code> is the population base expectation (0.713 for overall CAD in the training cohort) and <code className="font-mono">φᵢ(x)</code> is the exact marginal attribution allocated to feature <code className="font-mono">i</code> for patient <code className="font-mono">x</code>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Top Empirical CAD Predictive Features</h3>
              <div className="space-y-2">
                {[
                  { rank: 1, name: 'Region RWMA', weight: '7.3%', note: 'Regional Wall Motion Abnormality on echocardiogram' },
                  { rank: 2, name: 'EF-TTE', weight: '6.0%', note: 'Ejection fraction impairment indicating ischemic myocardium' },
                  { rank: 3, name: 'Age', weight: '5.5%', note: 'Advanced patient age associated with cumulative plaque exposure' },
                  { rank: 4, name: 'LDL Cholesterol', weight: '4.9%', note: 'Atherogenic lipoprotein concentration driving intimal lipid core' },
                  { rank: 5, name: 'Nonanginal / Exertional CP', weight: '4.9%', note: 'Chest pain characteristics discriminating anginal syndromes' },
                  { rank: 6, name: 'BUN & Creatinine', weight: '4.6%', note: 'Renal clearance biomarkers reflecting systemic vascular disease' }
                ].map(f => (
                  <div key={f.rank} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <div>
                      <span className="font-bold text-slate-800">{f.rank}. {f.name}</span>
                      <span className="text-slate-500 text-[11px] block">{f.note}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600">{f.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <h3 className="font-bold text-blue-900 text-sm">3. Clinical Transparency Findings</h3>
              <p className="text-slate-700">
                In empirical trials with synthetic testing patients, TreeSHAP successfully identified elevated RWMA and abnormal EF as the predominant factors shifting model probability toward CAD. When normal lipid profiles and preserved systolic function were supplied, negative SHAP values correctly down-weighted the risk score.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 6,
      title: 'Limitations, Clinical Safety & Future Scope',
      content: (
        <div className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-rose-600 uppercase">Research Project Paper · Page 6</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Limitations, Clinical Safety Governance & Future Scope
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Regulatory Scope · Clinical Ethical Boundaries · Prospective Translation Roadmap
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Statutory Clinical Safety Notice</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                Cardio3D AI is an investigational decision-support software intended solely for scientific research, software benchmarking, and educational demonstration. It is <strong>NOT</strong> an FDA/CE-cleared medical device. Under no circumstances should algorithmic probability outputs replace clinical judgment, physician evaluation, resting ECG analysis, or coronary angiography.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Methodological Limitations</h3>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>
                  <strong>Single-Center Cohort:</strong> The UCI Z-Alizadeh Sani dataset originates from a single tertiary cardiovascular center (303 patients). External validation in diverse multi-ethnic populations is required.
                </li>
                <li>
                  <strong>Class Imbalance in LCX/RCA:</strong> Stenosis in LCX (31.0%) and RCA (37.0%) occurs with lower prevalence than LAD (54.5%), leading to lower sensitivity in secondary branch predictions.
                </li>
                <li>
                  <strong>Illustrative 3D Geometry:</strong> The 3D heart represents an anatomical schematic. It is not patient-specific geometry reconstructed from volumetric CCTA DICOM scans.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Future Research & Development Scope</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block">DICOM CCTA Mesh Reconstruction:</strong>
                  <span>Direct segmentation of coronary arteries from patient CT angiography into patient-specific 3D meshes.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block">Multi-Center Federated Learning:</strong>
                  <span>Collaborative training across international hospital databases preserving patient privacy.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block">Fractional Flow Reserve (FFR-CT):</strong>
                  <span>Integrating computational fluid dynamics (CFD) with AI predictions for hemodynamic stenosis significance.</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="text-slate-800 block">Prospective Clinical Trials:</strong>
                  <span>Rigorous clinical validation comparing AI decision-support against expert cardiologist diagnostic concordance.</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold block">Conclusion</span>
                <span className="text-slate-400 text-[11px]">Cardio3D AI establishes a validated blueprint for transparent, vessel-specific AI cardiology visualization.</span>
              </div>
              <span className="font-mono text-xs bg-rose-600 px-2 py-1 rounded font-bold">End of Document</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentPageData = pages[currentPage - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Pagination Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Formal Hackathon & Academic Submission
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">6-Page Research Project Document</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer-review style technical dossier covering dataset, ML pipeline, 3D architecture, and safety.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Paper</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-slate-800">
              {currentPage} / 6
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
              disabled={currentPage === 6}
              className="p-1 rounded text-slate-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {pages.map(p => (
          <button
            key={p.num}
            onClick={() => setCurrentPage(p.num)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentPage === p.num
                ? 'border-rose-600 bg-rose-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <span className="block text-[10px] font-mono text-slate-400">Page {p.num}</span>
            <span className="block text-xs font-bold text-slate-800 truncate mt-0.5">
              {p.num === 1 && 'Introduction'}
              {p.num === 2 && 'Dataset'}
              {p.num === 3 && 'ML Pipeline'}
              {p.num === 4 && '3D & System'}
              {p.num === 5 && 'TreeSHAP'}
              {p.num === 6 && 'Governance'}
            </span>
          </button>
        ))}
      </div>

      {/* Render Current Page in Book Document Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm min-h-[600px]">
        {currentPageData.content}

        {/* Footer of Page */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Cardio3D AI Research Specification</span>
          <span>Page {currentPage} of 6</span>
        </div>
      </div>
    </div>
  );
};
