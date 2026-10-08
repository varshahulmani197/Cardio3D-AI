import React from 'react';
import { PatientForm } from '../components/PatientForm';
import { Heart3D } from '../components/Heart3D';
import { RiskCards } from '../components/RiskCards';
import { SHAPChart } from '../components/SHAPChart';
import { PredictionResponse, ExplainResponse, PatientFormValues } from '../types';
import { AlertTriangle, UserCheck } from 'lucide-react';

interface DashboardPageProps {
  patientValues: PatientFormValues;
  onPatientValuesChange: (vals: PatientFormValues) => void;
  prediction: PredictionResponse | null;
  explanation: ExplainResponse | null;
  selectedVessel: 'LAD' | 'LCX' | 'RCA' | null;
  onSelectVessel: (vessel: 'LAD' | 'LCX' | 'RCA' | null) => void;
  shapTarget: 'CAD' | 'LAD' | 'LCX' | 'RCA';
  onSelectShapTarget: (target: 'CAD' | 'LAD' | 'LCX' | 'RCA') => void;
  onAnalyze: () => void;
  onReset: () => void;
  isLoading: boolean;
  loadingStepText: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  patientValues,
  onPatientValuesChange,
  prediction,
  explanation,
  selectedVessel,
  onSelectVessel,
  shapTarget,
  onSelectShapTarget,
  onAnalyze,
  onReset,
  isLoading,
  loadingStepText
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Alert Notice */}
      <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-3.5 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">Research & Educational Decision-Support System:</strong> AI predictions are probabilistic risk estimates trained on the UCI Z-Alizadeh Sani cohort. They do not replace invasive catheter angiography or medical diagnostic evaluation.
        </div>
      </div>

      {/* Main Split Console: Patient Form on Left, 3D Heart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Structured Clinical Form (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <PatientForm
            values={patientValues}
            onChange={onPatientValuesChange}
            onSubmit={onAnalyze}
            onReset={onReset}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
          />
        </div>

        {/* Right: 3D Coronary Anatomy & Risk Cards (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          <Heart3D
            vesselResults={prediction?.vessels}
            selectedVessel={selectedVessel}
            onSelectVessel={onSelectVessel}
            heightClass="h-[430px]"
          />

          <RiskCards
            prediction={prediction}
            selectedVessel={selectedVessel}
            onSelectVessel={onSelectVessel}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Patient Summary Card (when prediction available) */}
      {prediction && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">
                Patient Case Summary · Anonymous Session
              </span>
              <p className="text-slate-500 text-[11px]">
                Age: {patientValues.Age || 'Unspecified'} yrs · Sex: {patientValues.Sex || 'Unspecified'} · BP: {patientValues.BP || '—'} mmHg · EF: {patientValues['EF-TTE'] || '—'}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Overall CAD:</span>
              <strong className="text-rose-600">{prediction.cad.percentage}%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Peak Vessel Risk:</span>
              <strong className="text-slate-900">
                {prediction.vessels.LAD.percentage >= prediction.vessels.RCA.percentage && prediction.vessels.LAD.percentage >= prediction.vessels.LCX.percentage
                  ? `LAD (${prediction.vessels.LAD.percentage}%)`
                  : prediction.vessels.RCA.percentage >= prediction.vessels.LCX.percentage
                  ? `RCA (${prediction.vessels.RCA.percentage}%)`
                  : `LCX (${prediction.vessels.LCX.percentage}%)`}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Explainable AI (SHAP) Chart Section */}
      <SHAPChart
        explanation={explanation}
        target={shapTarget}
        onSelectTarget={onSelectShapTarget}
        isLoading={isLoading}
      />
    </div>
  );
};
