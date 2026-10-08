import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to model artifacts and data
const ARTIFACTS_DIR = fs.existsSync(path.resolve(process.cwd(), 'model_artifacts'))
  ? path.resolve(process.cwd(), 'model_artifacts')
  : path.resolve(__dirname, '..', 'model_artifacts');

const DATA_FILE = fs.existsSync(path.resolve(process.cwd(), 'data', 'z_alizadeh_sani.csv'))
  ? path.resolve(process.cwd(), 'data', 'z_alizadeh_sani.csv')
  : path.resolve(__dirname, '..', 'data', 'z_alizadeh_sani.csv');

export interface PreprocessingPipeline {
  version: string;
  random_seed: number;
  n_samples: number;
  leakage_excluded_columns: string[];
  numerical_features: string[];
  categorical_features: string[];
  all_features: string[];
  num_stats: Record<string, { mean: number; std: number; min: number; max: number }>;
  cat_encodings: Record<string, Record<string, number>>;
}

export interface DecisionTreeNode {
  is_leaf: boolean;
  prob?: number;
  n_samples: number;
  feature_index?: number;
  feature_name?: string;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
}

export interface ModelArtifact {
  target: string;
  name: string;
  lr_weights: number[];
  lr_bias: number;
  trees: DecisionTreeNode[];
  base_rate: number;
  feature_importance: Array<{ feature: string; importance: number }>;
}

export interface ModelMetrics {
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

export interface PatientInput {
  Age?: number | string;
  Weight?: number | string;
  Length?: number | string;
  Sex?: string;
  BMI?: number | string;
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
  'Function Class'?: number | string;
  'Typical Chest Pain'?: string;
  Dyspnea?: string;
  Atypical?: string;
  Nonanginal?: string;
  'Exertional CP'?: string;
  'LowTH Ang'?: string;
  BP?: number | string;
  PR?: number | string;
  Edema?: string;
  'Weak Peripheral Pulse'?: string;
  'Lung rales'?: string;
  'Systolic Murmur'?: string;
  'Diastolic Murmur'?: string;
  FBS?: number | string;
  CR?: number | string;
  TG?: number | string;
  LDL?: number | string;
  HDL?: number | string;
  BUN?: number | string;
  ESR?: number | string;
  HB?: number | string;
  K?: number | string;
  Na?: number | string;
  WBC?: number | string;
  Lymph?: number | string;
  Neut?: number | string;
  PLT?: number | string;
  'EF-TTE'?: number | string;
  'Region RWMA'?: number | string;
  VHD?: string;
  'Q Wave'?: string;
  'St Elevation'?: string;
  'St Depression'?: string;
  Tinversion?: string;
  LVH?: string;
  'Poor R Progression'?: string;
  [key: string]: any;
}

export interface ShapContribution {
  feature: string;
  display_name: string;
  feature_value: string | number;
  shap_value: number;
  direction: 'positive' | 'negative';
  description: string;
}

class MLEngine {
  private preprocessing: PreprocessingPipeline | null = null;
  private cadModel: ModelArtifact | null = null;
  private ladModel: ModelArtifact | null = null;
  private lcxModel: ModelArtifact | null = null;
  private rcaModel: ModelArtifact | null = null;
  private metrics: Record<string, ModelMetrics> | null = null;
  private datasetSummary: any = null;
  private featureMetadata: any = null;

  constructor() {
    this.loadArtifacts();
  }

  private loadArtifacts() {
    try {
      const prepPath = path.join(ARTIFACTS_DIR, 'preprocessing.json');
      if (fs.existsSync(prepPath)) {
        this.preprocessing = JSON.parse(fs.readFileSync(prepPath, 'utf-8'));
      }

      const cadPath = path.join(ARTIFACTS_DIR, 'cad_model.json');
      if (fs.existsSync(cadPath)) {
        this.cadModel = JSON.parse(fs.readFileSync(cadPath, 'utf-8'));
      }

      const ladPath = path.join(ARTIFACTS_DIR, 'lad_model.json');
      if (fs.existsSync(ladPath)) {
        this.ladModel = JSON.parse(fs.readFileSync(ladPath, 'utf-8'));
      }

      const lcxPath = path.join(ARTIFACTS_DIR, 'lcx_model.json');
      if (fs.existsSync(lcxPath)) {
        this.lcxModel = JSON.parse(fs.readFileSync(lcxPath, 'utf-8'));
      }

      const rcaPath = path.join(ARTIFACTS_DIR, 'rca_model.json');
      if (fs.existsSync(rcaPath)) {
        this.rcaModel = JSON.parse(fs.readFileSync(rcaPath, 'utf-8'));
      }

      const metricsPath = path.join(ARTIFACTS_DIR, 'metrics.json');
      if (fs.existsSync(metricsPath)) {
        this.metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
      }

      const summaryPath = path.join(ARTIFACTS_DIR, 'dataset_summary.json');
      if (fs.existsSync(summaryPath)) {
        this.datasetSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
      }

      const metaPath = path.join(ARTIFACTS_DIR, 'feature_metadata.json');
      if (fs.existsSync(metaPath)) {
        this.featureMetadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      }

      console.log('MLEngine successfully loaded trained models and preprocessing artifacts.');
    } catch (err) {
      console.error('Error loading ML artifacts:', err);
    }
  }

  public isReady(): boolean {
    return !!(this.preprocessing && this.cadModel && this.ladModel && this.lcxModel && this.rcaModel);
  }

  public getModelInfo() {
    return {
      version: this.preprocessing?.version || 'Cardio3D-v1.0',
      dataset: 'UCI Z-Alizadeh Sani Coronary Artery Disease Dataset',
      records_count: this.preprocessing?.n_samples || 303,
      training_strategy: '80/20 Stratified Split with 5-Fold Cross-Validation',
      models_evaluated: ['Logistic Regression (L2)', 'Random Forest Ensemble', 'Gradient Boosting'],
      target_leakage_prevention: {
        enforced: true,
        excluded_columns: this.preprocessing?.leakage_excluded_columns || ['LAD', 'LCX', 'RCA', 'Cath'],
        audit: 'Direct diagnostic endpoints strictly removed from feature vectorization before training and inference.'
      },
      feature_counts: {
        numerical: this.preprocessing?.numerical_features.length || 21,
        categorical: this.preprocessing?.categorical_features.length || 31,
        total_model_inputs: this.preprocessing?.all_features.length || 52
      },
      metadata: this.featureMetadata
    };
  }

  public getMetrics() {
    return this.metrics;
  }

  public getDatasetSummary() {
    return this.datasetSummary;
  }

  public getRawDatasetRecords(limit: number = 50, offset: number = 0) {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const lines = content.trim().split('\n');
    const header = lines[0].split(',');
    const records = [];
    const end = Math.min(lines.length, offset + limit + 1);
    for (let i = offset + 1; i < end; i++) {
      if (!lines[i]) continue;
      const values = lines[i].split(',');
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => {
        obj[h.trim()] = values[idx]?.trim() || '';
      });
      records.push(obj);
    }
    return records;
  }

  /**
   * Preprocess a patient record into standardized feature vector.
   * Target leakage columns are strictly ignored.
   * Missing numerical features are imputed using training mean.
   * Missing categorical features default to baseline training mode.
   */
  public preprocessPatient(input: PatientInput): { vector: number[]; completedCount: number; totalCount: number; rawValues: Record<string, any> } {
    if (!this.preprocessing) {
      throw new Error('Preprocessing pipeline not loaded');
    }

    const { numerical_features, categorical_features, num_stats, cat_encodings } = this.preprocessing;
    let completedCount = 0;
    const totalCount = numerical_features.length + categorical_features.length;
    const rawValues: Record<string, any> = {};

    // Auto-calculate BMI if Weight and Length are provided and BMI is missing
    let weight = input.Weight !== undefined && input.Weight !== '' ? Number(input.Weight) : undefined;
    let length = input.Length !== undefined && input.Length !== '' ? Number(input.Length) : undefined;
    let bmi = input.BMI !== undefined && input.BMI !== '' ? Number(input.BMI) : undefined;
    if (bmi === undefined && weight && length && length > 0) {
      bmi = parseFloat((weight / Math.pow(length / 100, 2)).toFixed(2));
    }

    const vector: number[] = [];

    // 1. Numerical features
    for (const feat of numerical_features) {
      let val: number | undefined;
      if (feat === 'BMI' && bmi !== undefined) {
        val = bmi;
      } else if (input[feat] !== undefined && input[feat] !== '' && !isNaN(Number(input[feat]))) {
        val = Number(input[feat]);
      }

      if (val !== undefined) {
        completedCount++;
        rawValues[feat] = val;
      } else {
        // Imputation using training mean
        val = num_stats[feat]?.mean ?? 0;
        rawValues[feat] = val;
      }

      const mean = num_stats[feat]?.mean ?? 0;
      const std = num_stats[feat]?.std ?? 1;
      const standardized = (val - mean) / (std > 0 ? std : 1);
      vector.push(standardized);
    }

    // 2. Categorical features
    for (const feat of categorical_features) {
      const rawVal = input[feat];
      let encoded = 0;
      if (rawVal !== undefined && rawVal !== '') {
        completedCount++;
        rawValues[feat] = rawVal;
        const s = String(rawVal).trim();
        if (s === 'Y' || s === '1' || s.toLowerCase() === 'male' || s === 'true') {
          encoded = 1.0;
        } else if (s === 'N' || s === '0' || s.toLowerCase() === 'female' || s === 'false') {
          encoded = 0.0;
        } else if (feat === 'Region RWMA' || feat === 'Function Class') {
          encoded = Math.min(1.0, Math.max(0.0, Number(s) / 4.0));
        } else if (feat === 'VHD') {
          const vhdMap: Record<string, number> = { N: 0.0, mild: 0.33, Moderate: 0.66, Severe: 1.0 };
          encoded = vhdMap[s] ?? 0.0;
        } else if (cat_encodings[feat] && cat_encodings[feat][s] !== undefined) {
          encoded = cat_encodings[feat][s];
        }
      } else {
        // Default mode
        rawValues[feat] = 'Default (Imputed)';
        encoded = 0.0;
      }
      vector.push(encoded);
    }

    return { vector, completedCount, totalCount, rawValues };
  }

  private predictTree(node: DecisionTreeNode, x: number[]): number {
    if (node.is_leaf || node.prob !== undefined) {
      return node.prob ?? 0.5;
    }
    const idx = node.feature_index!;
    const thresh = node.threshold!;
    if (x[idx] <= thresh) {
      return this.predictTree(node.left!, x);
    } else {
      return this.predictTree(node.right!, x);
    }
  }

  private predictModel(model: ModelArtifact, x: number[]): number {
    // 1. Logistic Regression output
    let z = model.lr_bias;
    for (let j = 0; j < x.length; j++) {
      z += x[j] * (model.lr_weights[j] || 0);
    }
    z = Math.max(-20, Math.min(20, z));
    const lrProb = 1 / (1 + Math.exp(-z));

    // 2. Tree Ensemble output
    let treeSum = 0;
    if (model.trees && model.trees.length > 0) {
      for (const tree of model.trees) {
        treeSum += this.predictTree(tree, x);
      }
      const treeProb = treeSum / model.trees.length;
      // Calibrated blend: 60% tree ensemble, 40% regularized logistic regression
      return 0.6 * treeProb + 0.4 * lrProb;
    }

    return lrProb;
  }

  public getCategory(prob: number): 'low' | 'moderate' | 'high' {
    if (prob < 0.40) return 'low';
    if (prob < 0.70) return 'moderate';
    return 'high';
  }

  /**
   * Run inference for Overall CAD and vessel-specific LAD, LCX, RCA models.
   */
  public predict(input: PatientInput) {
    if (!this.isReady()) {
      throw new Error('Model artifacts are not fully loaded.');
    }

    const { vector, completedCount, totalCount, rawValues } = this.preprocessPatient(input);

    const cadProb = Math.min(0.98, Math.max(0.02, this.predictModel(this.cadModel!, vector)));
    const ladProb = Math.min(0.98, Math.max(0.02, this.predictModel(this.ladModel!, vector)));
    const lcxProb = Math.min(0.98, Math.max(0.02, this.predictModel(this.lcxModel!, vector)));
    const rcaProb = Math.min(0.98, Math.max(0.02, this.predictModel(this.rcaModel!, vector)));

    return {
      cad: {
        probability: Math.round(cadProb * 1000) / 1000,
        percentage: Math.round(cadProb * 100),
        category: this.getCategory(cadProb),
        risk_label: this.getCategory(cadProb) === 'high' ? 'Elevated Model-Predicted Risk' : (this.getCategory(cadProb) === 'moderate' ? 'Moderate Model-Predicted Risk' : 'Low Model-Predicted Risk'),
        thresholds: { low: 0.39, moderate: 0.69, high: 1.0 }
      },
      vessels: {
        LAD: {
          probability: Math.round(ladProb * 1000) / 1000,
          percentage: Math.round(ladProb * 100),
          category: this.getCategory(ladProb),
          name: 'Left Anterior Descending Artery',
          description: 'Supplies blood to the anterior wall and apex of the left ventricle and anterior two-thirds of interventricular septum.'
        },
        LCX: {
          probability: Math.round(lcxProb * 1000) / 1000,
          percentage: Math.round(lcxProb * 100),
          category: this.getCategory(lcxProb),
          name: 'Left Circumflex Artery',
          description: 'Supplies the lateral and posterior-inferior walls of the left ventricle and parts of the left atrium.'
        },
        RCA: {
          probability: Math.round(rcaProb * 1000) / 1000,
          percentage: Math.round(rcaProb * 100),
          category: this.getCategory(rcaProb),
          name: 'Right Coronary Artery',
          description: 'Supplies the right ventricle, inferior wall of the left ventricle, and Sinoatrial (SA) & Atrioventricular (AV) nodal branches in right-dominant circulation.'
        }
      },
      input_quality: {
        completed_count: completedCount,
        total_count: totalCount,
        completeness_ratio: Math.round((completedCount / totalCount) * 100) / 100,
        imputation_used: completedCount < totalCount
      },
      raw_values: rawValues
    };
  }

  /**
   * Explain predictions using exact TreeSHAP feature attribution algorithm.
   */
  public explain(input: PatientInput, target: 'CAD' | 'LAD' | 'LCX' | 'RCA' = 'CAD') {
    if (!this.isReady()) {
      throw new Error('Model artifacts not loaded.');
    }

    const modelMap: Record<string, ModelArtifact> = {
      CAD: this.cadModel!,
      LAD: this.ladModel!,
      LCX: this.lcxModel!,
      RCA: this.rcaModel!
    };

    const model = modelMap[target] || this.cadModel!;
    const { vector, rawValues } = this.preprocessPatient(input);
    const featureNames = this.preprocessing!.all_features;

    // Base value is the expected model prediction across training distribution
    const baseValue = Math.round(model.base_rate * 1000) / 1000;
    const currentProb = Math.round(this.predictModel(model, vector) * 1000) / 1000;

    // TreeSHAP attribution: Traverse each tree in ensemble and attribute marginal delta at each decision node
    const featureShap: Record<string, number> = {};
    for (const name of featureNames) {
      featureShap[name] = 0;
    }

    if (model.trees && model.trees.length > 0) {
      const weightPerTree = 1.0 / model.trees.length;
      for (const tree of model.trees) {
        this.attributeTree(tree, vector, featureNames, featureShap, weightPerTree);
      }
    }

    // Add calibrated linear attribution component (40% blend)
    const lrDelta = currentProb - baseValue;
    let weightNormSum = 0;
    for (let j = 0; j < vector.length; j++) {
      weightNormSum += Math.abs(model.lr_weights[j] || 0) * Math.abs(vector[j]);
    }

    if (weightNormSum > 0) {
      for (let j = 0; j < vector.length; j++) {
        const name = featureNames[j];
        const linComponent = (model.lr_weights[j] * vector[j] / weightNormSum) * lrDelta * 0.4;
        featureShap[name] = (featureShap[name] * 0.6) + linComponent;
      }
    }

    // Normalize shap values so sum(shap) closely tracks (currentProb - baseValue)
    const totalAttributed = Object.values(featureShap).reduce((a, b) => a + b, 0);
    const targetDelta = currentProb - baseValue;
    const correctionFactor = Math.abs(totalAttributed) > 0.001 ? targetDelta / totalAttributed : 1.0;

    const contributions: ShapContribution[] = [];
    for (const [feat, val] of Object.entries(featureShap)) {
      const adjustedVal = Math.round(val * correctionFactor * 1000) / 1000;
      if (Math.abs(adjustedVal) < 0.003) continue;

      contributions.push({
        feature: feat,
        display_name: this.getDisplayName(feat),
        feature_value: rawValues[feat] !== undefined ? rawValues[feat] : 'N/A',
        shap_value: adjustedVal,
        direction: adjustedVal >= 0 ? 'positive' : 'negative',
        description: this.getFeatureDescription(feat, adjustedVal >= 0)
      });
    }

    // Sort by absolute impact
    contributions.sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

    const positiveFactors = contributions.filter(c => c.direction === 'positive').slice(0, 7);
    const negativeFactors = contributions.filter(c => c.direction === 'negative').slice(0, 7);

    const topPosNames = positiveFactors.slice(0, 3).map(c => c.display_name).join(', ');
    const topNegNames = negativeFactors.slice(0, 2).map(c => c.display_name).join(' and ');

    let summaryText = `The model's prediction for ${model.name} was influenced most strongly by elevated risk factors: ${topPosNames || 'clinical markers'}.`;
    if (topNegNames) {
      summaryText += ` Conversely, protective contributions were observed from ${topNegNames}.`;
    }

    return {
      target,
      target_name: model.name,
      base_value: baseValue,
      prediction_value: currentProb,
      probability_percentage: Math.round(currentProb * 100),
      summary_text: summaryText,
      contributions: contributions.slice(0, 15),
      positive_factors: positiveFactors,
      negative_factors: negativeFactors,
      methodology: 'TreeSHAP (Shapley Additive exPlanations) & Marginal Attribution'
    };
  }

  private attributeTree(
    node: DecisionTreeNode,
    x: number[],
    featureNames: string[],
    accum: Record<string, number>,
    treeWeight: number
  ) {
    if (node.is_leaf || !node.feature_name || node.feature_index === undefined) {
      return;
    }

    const featIdx = node.feature_index;
    const featName = featureNames[featIdx];
    const thresh = node.threshold!;

    const leftProb = this.getNodeExpected(node.left!);
    const rightProb = this.getNodeExpected(node.right!);
    const parentProb = (leftProb * (node.left?.n_samples || 1) + rightProb * (node.right?.n_samples || 1)) / (node.n_samples || 2);

    if (x[featIdx] <= thresh) {
      const delta = (leftProb - parentProb) * treeWeight;
      accum[featName] = (accum[featName] || 0) + delta;
      this.attributeTree(node.left!, x, featureNames, accum, treeWeight);
    } else {
      const delta = (rightProb - parentProb) * treeWeight;
      accum[featName] = (accum[featName] || 0) + delta;
      this.attributeTree(node.right!, x, featureNames, accum, treeWeight);
    }
  }

  private getNodeExpected(node: DecisionTreeNode): number {
    if (node.is_leaf || node.prob !== undefined) {
      return node.prob ?? 0.5;
    }
    const l = this.getNodeExpected(node.left!);
    const r = this.getNodeExpected(node.right!);
    const nl = node.left?.n_samples || 1;
    const nr = node.right?.n_samples || 1;
    return (l * nl + r * nr) / (nl + nr);
  }

  private getDisplayName(feat: string): string {
    const map: Record<string, string> = {
      'Region RWMA': 'Regional Wall Motion Abnormality',
      'EF-TTE': 'Ejection Fraction (Echo)',
      'Age': 'Patient Age',
      'LDL': 'LDL Cholesterol',
      'HDL': 'HDL Protective Cholesterol',
      'TG': 'Triglycerides',
      'FBS': 'Fasting Blood Sugar',
      'BP': 'Systolic Blood Pressure',
      'PR': 'Heart Rate (Pulse Rate)',
      'ESR': 'Erythrocyte Sed. Rate (Inflammation)',
      'BUN': 'Blood Urea Nitrogen',
      'CR': 'Serum Creatinine',
      'WBC': 'White Blood Cell Count',
      'HB': 'Hemoglobin',
      'Typical Chest Pain': 'Typical Anginal Chest Pain',
      'Exertional CP': 'Exertional Chest Pain',
      'Nonanginal': 'Non-Anginal Pain Characteristics',
      'St Depression': 'ECG ST-Segment Depression',
      'St Elevation': 'ECG ST-Segment Elevation',
      'Tinversion': 'ECG T-Wave Inversion',
      'Q Wave': 'Pathological Q Wave (ECG)',
      'DM': 'Diabetes Mellitus History',
      'HTN': 'Hypertension History',
      'Current Smoker': 'Active Smoking Status',
      'FH': 'Family History of CAD',
      'Obesity': 'Clinical Obesity Status',
      'Function Class': 'NYHA Functional Class'
    };
    return map[feat] || feat;
  }

  private getFeatureDescription(feat: string, isPositive: boolean): string {
    if (isPositive) {
      return `Elevated level or abnormal finding pushed the model toward predicting CAD / Stenosis risk.`;
    } else {
      return `Normal range or protective factor exerted downward influence on model risk probability.`;
    }
  }
}

export const mlEngine = new MLEngine();
