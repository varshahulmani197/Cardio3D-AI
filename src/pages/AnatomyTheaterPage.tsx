import React, { useState } from 'react';
import { Heart3D } from '../components/Heart3D';
import { VesselResult } from '../types';
import { Info, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AnatomyTheaterPageProps {
  vesselResults?: {
    LAD?: VesselResult;
    LCX?: VesselResult;
    RCA?: VesselResult;
  } | null;
}

export const AnatomyTheaterPage: React.FC<AnatomyTheaterPageProps> = ({ vesselResults }) => {
  const [selectedVessel, setSelectedVessel] = useState<'LAD' | 'LCX' | 'RCA'>('LAD');

  const vesselDetails = {
    LAD: {
      name: 'Left Anterior Descending Artery (LAD)',
      latin: 'Ramus interventricularis anterior arteriae coronariae sinistrae',
      origin: 'Bifurcation of Left Main Coronary Artery (LMCA)',
      course: 'Passes down the anterior interventricular sulcus to the apex of the heart.',
      branches: ['Diagonal Branch 1 (D1)', 'Diagonal Branch 2 (D2)', 'Septal Perforating Arteries'],
      myocardial_territory: 'Anterior wall of Left Ventricle, anterior two-thirds of the interventricular septum, cardiac apex, and anterolateral papillary muscle.',
      clinical_note: 'Crucial arterial trunk often called the "widowmaker" due to high mortality when proximal occlusion causes acute extensive anterior STEMI and cardiogenic shock.'
    },
    LCX: {
      name: 'Left Circumflex Artery (LCX)',
      latin: 'Ramus circumflexus arteriae coronariae sinistrae',
      origin: 'Bifurcation of Left Main Coronary Artery (LMCA)',
      course: 'Courses along the left atrioventricular (coronary) sulcus posteriorly toward the crux of the heart.',
      branches: ['Obtuse Marginal 1 (OM1)', 'Obtuse Marginal 2 (OM2)', 'Atrial branches', 'SA Nodal Artery (in ~40% of individuals)'],
      myocardial_territory: 'Posterolateral and lateral walls of the Left Ventricle, portions of the Left Atrium, and anterolateral papillary muscle.',
      clinical_note: 'Stenosis in the LCX can produce subtle electrocardiographic manifestations (isolated posterior or lateral ST changes) and atypical symptomatology.'
    },
    RCA: {
      name: 'Right Coronary Artery (RCA)',
      latin: 'Arteria coronaria dextra',
      origin: 'Right aortic sinus of Valsalva',
      course: 'Descends down the right atrioventricular groove, curving toward the posterior interventricular sulcus in right-dominant circulation (~85% of humans).',
      branches: ['Conus Branch', 'Sinus Node Artery (~60%)', 'Acute Marginal Branches', 'Posterior Descending Artery (PDA)', 'AV Nodal Artery (~90%)'],
      myocardial_territory: 'Right Ventricle, inferior and diaphragmatic wall of the Left Ventricle, posterior 1/3 of interventricular septum, and cardiac conduction nodes.',
      clinical_note: 'Proximal RCA occlusion is commonly associated with inferior wall STEMI, right ventricular infarction, and high-degree AV block.'
    }
  };

  const activeVesselInfo = vesselDetails[selectedVessel];
  const activePred = vesselResults?.[selectedVessel];

  return (
    <div className="space-y-6">
      {/* Title & Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Interactive Anatomy & Vascular Territories
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-0.5">3D Coronary Anatomy Theater</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Inspect the coronary arterial architecture in 3D. Click or hover on individual arterial trees to explore myocardial supply territories, branch anatomy, and AI risk projections.
          </p>
        </div>

        {/* Vessel Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['LAD', 'LCX', 'RCA'] as const).map(v => (
            <button
              key={v}
              onClick={() => setSelectedVessel(v)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedVessel === v
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {v} Artery
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Stage & Detailed Anatomy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Full-featured 3D Model Stage (7 cols) */}
        <div className="lg:col-span-7">
          <Heart3D
            vesselResults={vesselResults}
            selectedVessel={selectedVessel}
            onSelectVessel={(v) => v && setSelectedVessel(v)}
            heightClass="h-[520px]"
          />
        </div>

        {/* Vessel Anatomy Dossier & Risk Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-rose-600 uppercase">{selectedVessel} Segment</span>
                <h3 className="text-base font-bold text-slate-900">{activeVesselInfo.name}</h3>
                <p className="text-[11px] text-slate-400 italic">{activeVesselInfo.latin}</p>
              </div>

              {/* Status Badge */}
              {activePred ? (
                <div className="text-right">
                  <span className={`text-xl font-bold font-mono ${
                    activePred.category === 'high' ? 'text-rose-600' : (activePred.category === 'moderate' ? 'text-amber-600' : 'text-emerald-600')
                  }`}>
                    {activePred.percentage}%
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    {activePred.category} Risk
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic">No prediction loaded</span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-slate-700 block mb-0.5">Anatomical Origin & Course:</strong>
                <p className="text-slate-600 leading-relaxed">{activeVesselInfo.origin} · {activeVesselInfo.course}</p>
              </div>

              <div>
                <strong className="text-slate-700 block mb-1">Key Branches:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activeVesselInfo.branches.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="text-slate-700 block mb-0.5">Myocardial Perfusion Territory:</strong>
                <p className="text-slate-600 leading-relaxed">{activeVesselInfo.myocardial_territory}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <strong className="text-slate-800 block mb-0.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clinical Significance & Pathology:</span>
                </strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">{activeVesselInfo.clinical_note}</p>
              </div>
            </div>
          </div>

          {/* Educational Distinction Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Critical Clinical Distinction: Model Probability vs. Anatomical Stenosis</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              The dynamic color changes on the 3D model (Green/Yellow/Red) visually indicate <strong>statistical model-estimated probability</strong> derived from patient laboratory and clinical variables. They do <strong>NOT</strong> represent measured lumen diameter loss, calcification volume, or angiographic percentage narrowing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
