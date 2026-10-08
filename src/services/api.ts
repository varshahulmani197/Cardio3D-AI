import { PredictionResponse, ExplainResponse, ModelMetricsItem, DatasetSummary, ModelInfo, PatientFormValues } from '../types';

export const api = {
  async getHealth(): Promise<{ status: string; version: string }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getModelInfo(): Promise<ModelInfo> {
    const res = await fetch('/api/model-info');
    if (!res.ok) throw new Error('Failed to retrieve model information');
    return res.json();
  },

  async getPerformance(): Promise<Record<string, ModelMetricsItem>> {
    const res = await fetch('/api/performance');
    if (!res.ok) throw new Error('Failed to retrieve model performance metrics');
    return res.json();
  },

  async getDatasetSummary(): Promise<DatasetSummary> {
    const res = await fetch('/api/dataset/summary');
    if (!res.ok) throw new Error('Failed to load dataset insights');
    return res.json();
  },

  async getDatasetRecords(limit = 30, offset = 0): Promise<{ records: any[]; count: number; total: number }> {
    const res = await fetch(`/api/dataset/records?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Failed to fetch dataset records');
    return res.json();
  },

  async predict(patientData: PatientFormValues): Promise<PredictionResponse> {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Prediction request failed' }));
      throw new Error(errData.error || errData.details || 'Prediction failed');
    }
    return res.json();
  },

  async explain(patientData: PatientFormValues, target: 'CAD' | 'LAD' | 'LCX' | 'RCA' = 'CAD'): Promise<ExplainResponse> {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientData, target })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Explanation request failed' }));
      throw new Error(errData.error || errData.details || 'Explanation failed');
    }
    return res.json();
  }
};
