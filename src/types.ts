export type RiskCategory = 'low' | 'moderate' | 'high';

export interface VesselResult {
  probability: number;
  percentage: number;
  category: RiskCategory;
  name: string;
  description: string;
}

export interface CADResult {
  probability: number;
  percentage: number;
  category: RiskCategory;
  risk_label: string;
  thresholds: {
    low: number;
    moderate: number;
    high: number;
  };
}

export interface PredictionResponse {
  cad: CADResult;
  vessels: {
    LAD: VesselResult;
    LCX: VesselResult;
    RCA: VesselResult;
  };
  input_quality: {
    completed_count: number;
    total_count: number;
    completeness_ratio: number;
    imputation_used: boolean;
  };
  raw_values: Record<string, any>;
}

export interface ShapContribution {
  feature: string;
  display_name: string;
  feature_value: string | number;
  shap_value: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface ExplainResponse {
  target: 'CAD' | 'LAD' | 'LCX' | 'RCA';
  target_name: string;
  base_value: number;
  prediction_value: number;
  probability_percentage: number;
  summary_text: string;
  contributions: ShapContribution[];
  positive_factors: ShapContribution[];
  negative_factors: ShapContribution[];
  methodology: string;
}

export interface ModelMetricsItem {
  target: string;
  target_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  confusion_matrix: { tp: number; tn: number; fp: number; fn: number };
  roc_curve: Array<{ threshold: number; fpr: number; tpr: number }>;
  top_features: Array<{ feature: string; importance: number }>;
}

export interface DatasetSummary {
  total_records: number;
  cad_positive: number;
  cad_negative: number;
  cad_prevalence: number;
  sex_distribution: { Male: number; Female: number };
  vessel_stenosis: {
    LAD: { count: number; rate: number };
    LCX: { count: number; rate: number };
    RCA: { count: number; rate: number };
  };
  age_bins: Array<{ bin: string; count: number }>;
  distributions: Record<string, { CAD: any; Normal: any }>;
  correlations: Array<Record<string, any>>;
  sample_records: Array<Record<string, string>>;
}

export interface ModelInfo {
  version: string;
  dataset: string;
  records_count: number;
  training_strategy: string;
  models_evaluated: string[];
  target_leakage_prevention: {
    enforced: boolean;
    excluded_columns: string[];
    audit: string;
  };
  feature_counts: {
    numerical: number;
    categorical: number;
    total_model_inputs: number;
  };
}

export interface PatientFormValues {
  Age?: number | '';
  Sex?: string;
  Weight?: number | '';
  Length?: number | '';
  BMI?: number | '';
  BP?: number | '';
  PR?: number | '';
  DM?: string;
  HTN?: string;
  'Current Smoker'?: string;
  'Ex-Smoker'?: string;
  FH?: string;
  Obesity?: string;
  CRF?: string;
  CVA?: string;
  'Airway disease'?: string;
  'Thyroid Disease'?: string;
  'Function Class'?: number | '';
  'Typical Chest Pain'?: string;
  Dyspnea?: string;
  Atypical?: string;
  Nonanginal?: string;
  'Exertional CP'?: string;
  'LowTH Ang'?: string;
  Edema?: string;
  'Weak Peripheral Pulse'?: string;
  'Lung rales'?: string;
  'Systolic Murmur'?: string;
  'Diastolic Murmur'?: string;
  FBS?: number | '';
  CR?: number | '';
  TG?: number | '';
  LDL?: number | '';
  HDL?: number | '';
  BUN?: number | '';
  ESR?: number | '';
  HB?: number | '';
  K?: number | '';
  Na?: number | '';
  WBC?: number | '';
  Lymph?: number | '';
  Neut?: number | '';
  PLT?: number | '';
  'EF-TTE'?: number | '';
  'Region RWMA'?: number | '';
  VHD?: string;
  'Q Wave'?: string;
  'St Elevation'?: string;
  'St Depression'?: string;
  Tinversion?: string;
  LVH?: string;
  'Poor R Progression'?: string;
}
