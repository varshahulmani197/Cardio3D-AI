import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { SafetyBanner } from './components/SafetyBanner';
import { ExportReportModal } from './components/ExportReportModal';
import { DashboardPage } from './pages/DashboardPage';
import { AnatomyTheaterPage } from './pages/AnatomyTheaterPage';
import { PerformancePage } from './pages/PerformancePage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { DatasetPage } from './pages/DatasetPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { AboutPage } from './pages/AboutPage';
import { api } from './services/api';
import { PredictionResponse, ExplainResponse, PatientFormValues } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Patient inputs state
  const [patientValues, setPatientValues] = useState<PatientFormValues>({
    Age: 58,
    Sex: 'Male',
    Weight: 78,
    Length: 172,
    BMI: 26.4,
    BP: 138,
    PR: 76,
    DM: 'N',
    HTN: 'Y',
    'Current Smoker': 'Y',
    'Ex-Smoker': 'N',
    FH: 'Y',
    Obesity: 'N',
    'Typical Chest Pain': 'Y',
    Atypical: 'N',
    Nonanginal: 'N',
    'Exertional CP': 'Y',
    'Function Class': 2,
    'Region RWMA': 1,
    'EF-TTE': 48,
    FBS: 110,
    CR: 1.1,
    TG: 185,
    LDL: 135,
    HDL: 38,
    BUN: 18,
    ESR: 22,
    WBC: 7600,
    'St Depression': '1',
    'St Elevation': '0',
    'Tinversion': '0',
    'Q Wave': '0',
    LVH: 'N',
    'Poor R Progression': 'N'
  });

  // Model prediction and explanation states
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<'LAD' | 'LCX' | 'RCA' | null>(null);
  const [shapTarget, setShapTarget] = useState<'CAD' | 'LAD' | 'LCX' | 'RCA'>('CAD');

  // Loading animation state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Preparing clinical data...');

  // Reset analysis handler
  const handleReset = () => {
    setPatientValues({
      Age: '',
      Sex: 'Male',
      Weight: '',
      Length: '',
      BMI: '',
      BP: '',
      PR: '',
      DM: 'N',
      HTN: 'N',
      'Current Smoker': 'N',
      'Ex-Smoker': 'N',
      FH: 'N',
      Obesity: 'N',
      'Typical Chest Pain': 'N',
      Atypical: 'N',
      Nonanginal: 'N',
      'Exertional CP': 'N',
      'Function Class': 1,
      'Region RWMA': 0,
      'EF-TTE': '',
      FBS: '',
      CR: '',
      TG: '',
      LDL: '',
      HDL: '',
      BUN: '',
      ESR: '',
      WBC: '',
      'St Depression': '0',
      'St Elevation': '0',
      'Tinversion': '0',
      'Q Wave': '0',
      LVH: 'N',
      'Poor R Progression': 'N'
    });
    setPrediction(null);
    setExplanation(null);
    setSelectedVessel(null);
  };

  // Run patient analysis
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      setLoadingStepText('Preparing clinical data...');
      await new Promise(r => setTimeout(r, 200));

      setLoadingStepText('Running CAD prediction model...');
      const predRes = await api.predict(patientValues);

      setLoadingStepText('Analyzing vessel-specific risk (LAD, LCX, RCA)...');
      await new Promise(r => setTimeout(r, 250));

      setLoadingStepText('Generating TreeSHAP feature explanation...');
      const expRes = await api.explain(patientValues, shapTarget);

      setLoadingStepText('Updating 3D coronary anatomy...');
      await new Promise(r => setTimeout(r, 200));

      setPrediction(predRes);
      setExplanation(expRes);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      alert(`Analysis failed: ${err.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SHAP target switch
  const handleSelectShapTarget = async (target: 'CAD' | 'LAD' | 'LCX' | 'RCA') => {
    setShapTarget(target);
    if (prediction) {
      try {
        const expRes = await api.explain(patientValues, target);
        setExplanation(expRes);
      } catch (err) {
        console.error('Failed to change explanation target:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 1. Persistent Statutory Clinical Safety Notice Banner */}
      <SafetyBanner />

      {/* 2. Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onReset={handleReset}
        onExport={() => setIsExportOpen(true)}
        hasResults={!!prediction}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            patientValues={patientValues}
            onPatientValuesChange={setPatientValues}
            prediction={prediction}
            explanation={explanation}
            selectedVessel={selectedVessel}
            onSelectVessel={setSelectedVessel}
            shapTarget={shapTarget}
            onSelectShapTarget={handleSelectShapTarget}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
          />
        )}

        {activeTab === 'anatomy' && (
          <AnatomyTheaterPage vesselResults={prediction?.vessels} />
        )}

        {activeTab === 'performance' && (
          <PerformancePage />
        )}

        {activeTab === 'explainability' && (
          <ExplainabilityPage />
        )}

        {activeTab === 'dataset' && (
          <DatasetPage />
        )}

        {activeTab === 'paper' && (
          <DocumentationPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Cardio3D AI</span>
            <span>·</span>
            <span>Research & Decision-Support System</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-slate-400">UCI Z-Alizadeh Sani Architecture</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Not for direct diagnostic or therapeutic prescription. Always verify with licensed medical specialists.
          </div>
        </div>
      </footer>

      {/* 5. Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        prediction={prediction}
        explanation={explanation}
        patientValues={patientValues}
        onAnalyze={handleAnalyze}
        isAnalyzing={isLoading}
      />
    </div>
  );
}
export default App;
