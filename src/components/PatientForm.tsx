import React, { useState } from 'react';
import { PatientFormValues } from '../types';
import { User, Activity, FlaskConical, Stethoscope, FileText, Sparkles, RotateCcw, AlertCircle, Check } from 'lucide-react';

interface PatientFormProps {
  values: PatientFormValues;
  onChange: (values: PatientFormValues) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  loadingStepText?: string;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  values,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  loadingStepText
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'demographics' | 'vitals' | 'labs' | 'ecg' | 'echo' | 'history'>('all');
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // Update a field value
  const handleChange = (field: keyof PatientFormValues, value: any) => {
    const updated = { ...values, [field]: value };
    // Auto calculate BMI if Weight and Length are set
    if ((field === 'Weight' || field === 'Length') && updated.Weight && updated.Length) {
      const w = Number(updated.Weight);
      const l = Number(updated.Length);
      if (w > 0 && l > 0) {
        updated.BMI = parseFloat((w / Math.pow(l / 100, 2)).toFixed(1));
      }
    }
    onChange(updated);
  };

  // Count filled inputs
  const totalTrackedFields = 28;
  const filledFieldsCount = Object.entries(values).filter(([_, v]) => v !== undefined && v !== '' && v !== null).length;

  // Load High-Risk Synthetic Demo Case
  const loadHighRiskDemo = () => {
    const demo: PatientFormValues = {
      Age: 68,
      Sex: 'Male',
      Weight: 84,
      Length: 172,
      BMI: 28.4,
      BP: 155,
      PR: 88,
      DM: 'Y',
      HTN: 'Y',
      'Current Smoker': 'Y',
      'Ex-Smoker': 'N',
      FH: 'Y',
      Obesity: 'N',
      'Typical Chest Pain': 'Y',
      Atypical: 'N',
      Nonanginal: 'N',
      'Exertional CP': 'Y',
      'Function Class': 3,
      'Region RWMA': 3,
      'EF-TTE': 38,
      FBS: 165,
      CR: 1.4,
      TG: 240,
      LDL: 168,
      HDL: 32,
      BUN: 24,
      ESR: 35,
      WBC: 8900,
      'St Depression': '1',
      'St Elevation': '0',
      'Tinversion': '1',
      'Q Wave': '1',
      LVH: 'Y',
      'Poor R Progression': 'Y'
    };
    onChange(demo);
    setDemoNotice('Loaded Synthetic Elevated-Risk Demo Profile (Patient ZAS-DEMO-HIGH). Educational case — NOT a real patient.');
  };

  // Load Low-Risk Synthetic Demo Case
  const loadLowRiskDemo = () => {
    const demo: PatientFormValues = {
      Age: 39,
      Sex: 'Female',
      Weight: 62,
      Length: 166,
      BMI: 22.5,
      BP: 116,
      PR: 68,
      DM: 'N',
      HTN: 'N',
      'Current Smoker': 'N',
      'Ex-Smoker': 'N',
      FH: 'N',
      Obesity: 'N',
      'Typical Chest Pain': 'N',
      Atypical: 'Y',
      Nonanginal: 'Y',
      'Exertional CP': 'N',
      'Function Class': 1,
      'Region RWMA': 0,
      'EF-TTE': 62,
      FBS: 88,
      CR: 0.8,
      TG: 98,
      LDL: 82,
      HDL: 62,
      BUN: 12,
      ESR: 8,
      WBC: 5800,
      'St Depression': '0',
      'St Elevation': '0',
      'Tinversion': '0',
      'Q Wave': '0',
      LVH: 'N',
      'Poor R Progression': 'N'
    };
    onChange(demo);
    setDemoNotice('Loaded Synthetic Low-Risk Demo Profile (Patient ZAS-DEMO-LOW). Educational case — NOT a real patient.');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Patient Clinical Data</h2>
            <span className="text-xs text-slate-400 font-mono">UCI Z-Alizadeh Sani Schema</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {filledFieldsCount} of {totalTrackedFields}
            </span>
            <span>parameters specified</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">Missing fields handled by pipeline imputation</span>
          </div>
        </div>

        {/* Synthetic Demo Presets */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadHighRiskDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer border border-rose-200"
            title="Load synthetic high-risk patient case"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo: High Risk</span>
          </button>
          <button
            type="button"
            onClick={loadLowRiskDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200"
            title="Load synthetic normal/low-risk patient case"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo: Low Risk</span>
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      {demoNotice && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{demoNotice}</span>
          </div>
          <button
            onClick={() => setDemoNotice(null)}
            className="text-amber-600 hover:text-amber-800 text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
        {[
          { id: 'all', label: 'All Sections' },
          { id: 'demographics', label: 'Demographics' },
          { id: 'vitals', label: 'Vitals' },
          { id: 'labs', label: 'Labs' },
          { id: 'ecg', label: 'ECG' },
          { id: 'echo', label: 'Echocardiography' },
          { id: 'history', label: 'History & Symptoms' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
        {/* 1. DEMOGRAPHICS */}
        {(activeSection === 'all' || activeSection === 'demographics') && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Demographics</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Age</label>
                <div className="relative">
                  <input
                    type="number"
                    min="18"
                    max="100"
                    placeholder="55"
                    value={values.Age ?? ''}
                    onChange={e => handleChange('Age', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">yrs</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Sex</label>
                <select
                  value={values.Sex ?? 'Male'}
                  onChange={e => handleChange('Sex', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="160"
                    placeholder="75"
                    value={values.Weight ?? ''}
                    onChange={e => handleChange('Weight', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Height / Length</label>
                <div className="relative">
                  <input
                    type="number"
                    min="120"
                    max="220"
                    placeholder="170"
                    value={values.Length ?? ''}
                    onChange={e => handleChange('Length', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">cm</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VITAL SIGNS */}
        {(activeSection === 'all' || activeSection === 'vitals') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Vital Signs</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Systolic BP</label>
                <div className="relative">
                  <input
                    type="number"
                    min="70"
                    max="240"
                    placeholder="130"
                    value={values.BP ?? ''}
                    onChange={e => handleChange('BP', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Pulse Rate (PR)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="40"
                    max="180"
                    placeholder="75"
                    value={values.PR ?? ''}
                    onChange={e => handleChange('PR', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Calculated BMI</label>
                <input
                  type="text"
                  readOnly
                  value={values.BMI ? `${values.BMI} kg/m²` : 'Auto-computed'}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. LABORATORY VALUES */}
        {(activeSection === 'all' || activeSection === 'labs') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
              <span>Laboratory Values</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">LDL Cholesterol</label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="350"
                    placeholder="120"
                    value={values.LDL ?? ''}
                    onChange={e => handleChange('LDL', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">HDL Cholesterol</label>
                <div className="relative">
                  <input
                    type="number"
                    min="15"
                    max="100"
                    placeholder="42"
                    value={values.HDL ?? ''}
                    onChange={e => handleChange('HDL', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Triglycerides (TG)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="600"
                    placeholder="160"
                    value={values.TG ?? ''}
                    onChange={e => handleChange('TG', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Fasting Sugar (FBS)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="400"
                    placeholder="100"
                    value={values.FBS ?? ''}
                    onChange={e => handleChange('FBS', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Creatinine (CR)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.3"
                    max="6.0"
                    placeholder="1.0"
                    value={values.CR ?? ''}
                    onChange={e => handleChange('CR', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">BUN</label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    placeholder="16"
                    value={values.BUN ?? ''}
                    onChange={e => handleChange('BUN', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mg/dL</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">ESR Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="18"
                    value={values.ESR ?? ''}
                    onChange={e => handleChange('ESR', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">mm/h</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">WBC Count</label>
                <div className="relative">
                  <input
                    type="number"
                    min="2000"
                    max="25000"
                    placeholder="7200"
                    value={values.WBC ?? ''}
                    onChange={e => handleChange('WBC', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">/mcL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ECHOCARDIOGRAPHY */}
        {(activeSection === 'all' || activeSection === 'echo') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
              <span>Echocardiography (Echo)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Regional Wall Motion Abnormality (RWMA)
                </label>
                <select
                  value={values['Region RWMA'] ?? 0}
                  onChange={e => handleChange('Region RWMA', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                >
                  <option value={0}>0 — No Abnormality (Normal)</option>
                  <option value={1}>1 — Mild Segmental Hypokinesia</option>
                  <option value={2}>2 — Moderate Wall Motion Abnormality</option>
                  <option value={3}>3 — Severe Wall Motion Abnormality</option>
                  <option value={4}>4 — Diffuse / Multi-territory Akinesia</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-0.5">Top predictive marker for regional myocardial ischemia</p>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Left Ventricular Ejection Fraction (EF-TTE)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="15"
                    max="75"
                    placeholder="55"
                    value={values['EF-TTE'] ?? ''}
                    onChange={e => handleChange('EF-TTE', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Normal reference: 50% – 70%</p>
              </div>
            </div>
          </div>
        )}

        {/* 5. ECG FINDINGS */}
        {(activeSection === 'all' || activeSection === 'ecg') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Electrocardiogram (ECG)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { key: 'St Depression', label: 'ST Depression (≥1mm)' },
                { key: 'St Elevation', label: 'ST Elevation' },
                { key: 'Tinversion', label: 'T-Wave Inversion' },
                { key: 'Q Wave', label: 'Pathological Q Wave' },
                { key: 'LVH', label: 'LVH (Sokolow-Lyon)' },
                { key: 'Poor R Progression', label: 'Poor R-Wave Progression' }
              ].map(item => {
                const val = values[item.key as keyof PatientFormValues];
                const isChecked = val === '1' || val === 'Y';
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleChange(item.key as any, isChecked ? '0' : '1')}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      isChecked
                        ? 'border-rose-400 bg-rose-50/50 text-rose-900 font-medium'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                      isChecked ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. CLINICAL HISTORY & SYMPTOMS */}
        {(activeSection === 'all' || activeSection === 'history') && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Clinical History & Angina Pattern</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { key: 'Typical Chest Pain', label: 'Typical Angina' },
                { key: 'Exertional CP', label: 'Exertional Pain' },
                { key: 'DM', label: 'Diabetes Mellitus' },
                { key: 'HTN', label: 'Hypertension' },
                { key: 'Current Smoker', label: 'Active Smoker' },
                { key: 'FH', label: 'Family History CAD' },
                { key: 'Atypical', label: 'Atypical CP' },
                { key: 'Nonanginal', label: 'Non-Anginal CP' }
              ].map(item => {
                const val = values[item.key as keyof PatientFormValues];
                const isChecked = val === 'Y' || val === '1';
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleChange(item.key as any, isChecked ? 'N' : 'Y')}
                    className={`flex items-center justify-between p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      isChecked
                        ? 'border-rose-400 bg-rose-50/50 text-rose-900 font-medium'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                      isChecked ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-300'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Target Leakage Audit Transparency Note */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-500 leading-snug">
        <strong className="text-slate-700">Target Leakage Protection:</strong> Diagnostic outcome columns (<code className="font-mono text-slate-800">LAD</code>, <code className="font-mono text-slate-800">LCX</code>, <code className="font-mono text-slate-800">RCA</code>, <code className="font-mono text-slate-800">Cath</code>) are strictly excluded from the predictive feature space.
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={`flex-1 w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLoading
              ? 'bg-rose-400 cursor-wait'
              : 'bg-rose-600 hover:bg-rose-700 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span>{loadingStepText || 'Analyzing Patient Features...'}</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>ANALYZE PATIENT</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Form</span>
        </button>
      </div>
    </div>
  );
};
