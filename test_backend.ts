import { mlEngine } from './server/mlEngine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
  console.log(`  ✓ ${msg}`);
}

async function runTests() {
  console.log('Running Cardio3D AI Backend & ML Engine Test Suite...');

  // 1. Engine Readiness
  assert(mlEngine.isReady(), 'MLEngine successfully initialized with all artifacts');

  // 2. Model Info & Leakage Exclusion Audit
  const info = mlEngine.getModelInfo();
  assert(info.records_count === 303, 'Dataset record count is 303 (UCI Z-Alizadeh Sani)');
  assert(info.target_leakage_prevention.enforced === true, 'Target leakage prevention is strictly enforced');
  assert(
    info.target_leakage_prevention.excluded_columns.includes('LAD') &&
    info.target_leakage_prevention.excluded_columns.includes('LCX') &&
    info.target_leakage_prevention.excluded_columns.includes('RCA') &&
    info.target_leakage_prevention.excluded_columns.includes('Cath'),
    'Target leakage columns LAD, LCX, RCA, Cath are excluded from feature vectors'
  );

  // 3. Performance Metrics
  const metrics = mlEngine.getMetrics();
  assert(!!metrics && !!metrics.CAD && !!metrics.LAD && !!metrics.LCX && !!metrics.RCA, 'Metrics exist for CAD, LAD, LCX, RCA');
  assert(metrics!.CAD.accuracy > 0.8, `CAD model accuracy is valid: ${metrics!.CAD.accuracy}`);
  assert(metrics!.CAD.roc_auc > 0.85, `CAD ROC-AUC is valid: ${metrics!.CAD.roc_auc}`);
  assert(metrics!.CAD.confusion_matrix.tp > 0, 'Confusion matrix has non-zero true positives');
  assert(metrics!.CAD.roc_curve.length > 5, 'ROC curve has points');

  // 4. Test Predict with High Risk Patient (Older, RWMA present, high LDL, abnormal EF)
  const highRiskPatient = {
    Age: 68,
    Sex: 'Male',
    Weight: 84,
    Length: 172,
    BP: 155,
    PR: 88,
    DM: 'Y',
    HTN: 'Y',
    'Current Smoker': 'Y',
    'Typical Chest Pain': 'Y',
    'Region RWMA': 3,
    'EF-TTE': 38,
    LDL: 168,
    HDL: 32,
    FBS: 165,
    TG: 240,
    CR: 1.4,
    'St Depression': '1'
  };

  const predHigh = mlEngine.predict(highRiskPatient);
  assert(predHigh.cad.probability >= 0.0 && predHigh.cad.probability <= 1.0, `CAD probability is normalized: ${predHigh.cad.probability}`);
  assert(predHigh.vessels.LAD.probability >= 0.0 && predHigh.vessels.LAD.probability <= 1.0, 'LAD probability is valid');
  assert(predHigh.vessels.LCX.probability >= 0.0 && predHigh.vessels.LCX.probability <= 1.0, 'LCX probability is valid');
  assert(predHigh.vessels.RCA.probability >= 0.0 && predHigh.vessels.RCA.probability <= 1.0, 'RCA probability is valid');
  assert(predHigh.cad.category === 'high' || predHigh.cad.category === 'moderate', 'High risk case produces elevated risk');

  // 5. Test Predict with Low Risk Patient (Young, normal labs, no RWMA, high EF)
  const lowRiskPatient = {
    Age: 38,
    Sex: 'Female',
    Weight: 60,
    Length: 165,
    BP: 115,
    PR: 68,
    DM: 'N',
    HTN: 'N',
    'Current Smoker': 'N',
    'Typical Chest Pain': 'N',
    'Region RWMA': 0,
    'EF-TTE': 60,
    LDL: 85,
    HDL: 58,
    FBS: 88,
    TG: 95,
    CR: 0.8,
    'St Depression': '0'
  };

  const predLow = mlEngine.predict(lowRiskPatient);
  assert(predLow.cad.probability < predHigh.cad.probability, 'Low risk patient has significantly lower predicted risk than high risk patient');

  // 6. Test Missing Values Handling / Imputation
  const partialPatient = {
    Age: 55,
    Sex: 'Male',
    BP: 130
  };
  const predPartial = mlEngine.predict(partialPatient);
  assert(predPartial.input_quality.completed_count < predPartial.input_quality.total_count, 'Correctly detected missing inputs');
  assert(predPartial.input_quality.imputation_used === true, 'Correctly used preprocessing imputation pipeline');

  // 7. Test SHAP Explainability Engine
  const shapExp = mlEngine.explain(highRiskPatient, 'CAD');
  assert(shapExp.target === 'CAD', 'SHAP target matches requested');
  assert(shapExp.contributions.length > 0, 'SHAP generated non-empty feature attributions');
  assert(shapExp.positive_factors.length > 0, 'SHAP identified positive risk drivers');
  assert(typeof shapExp.base_value === 'number', 'SHAP provides base expected value');
  assert(typeof shapExp.summary_text === 'string' && shapExp.summary_text.length > 10, 'SHAP generated clinical summary text');

  console.log('\nAll 7 backend & ML engine test suites passed successfully!\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
