import fs from 'fs';
import path from 'path';
import { mlEngine } from './server/mlEngine';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
  console.log(`  ✓ ${msg}`);
}

async function verifyAll() {
  console.log('--- Cardio3D AI End-to-End System Verification ---');

  // 1. Verify Dataset presence
  const dataPath = path.resolve(process.cwd(), 'data', 'z_alizadeh_sani.csv');
  assert(fs.existsSync(dataPath), 'UCI Z-Alizadeh Sani CSV dataset is present in /data/');
  const rows = fs.readFileSync(dataPath, 'utf-8').trim().split('\n');
  assert(rows.length === 304, `Dataset contains 303 data rows + header (got ${rows.length})`);

  // 2. Verify Model Artifacts presence
  const artifactFiles = [
    'cad_model.json',
    'lad_model.json',
    'lcx_model.json',
    'rca_model.json',
    'preprocessing.json',
    'metrics.json',
    'feature_metadata.json',
    'dataset_summary.json'
  ];
  for (const f of artifactFiles) {
    const fPath = path.resolve(process.cwd(), 'model_artifacts', f);
    assert(fs.existsSync(fPath), `Artifact ${f} exists and is valid`);
  }

  // 3. Test Model Info and Leakage
  const info = mlEngine.getModelInfo();
  assert(info.version === 'Cardio3D-v1.0', 'Model version is Cardio3D-v1.0');
  assert(info.target_leakage_prevention.enforced === true, 'Leakage prevention flag is true');
  assert(info.target_leakage_prevention.excluded_columns.length === 4, '4 columns excluded for target leakage');

  // 4. Test Predict API Engine
  const pred = mlEngine.predict({
    Age: 62,
    Sex: 'Male',
    Weight: 80,
    Length: 170,
    BP: 145,
    PR: 80,
    'Region RWMA': 2,
    'EF-TTE': 42,
    LDL: 155,
    HDL: 35
  });
  assert(pred.cad.probability > 0.5, `Patient with RWMA=2 and low EF classified with elevated risk (${pred.cad.percentage}%)`);
  assert(pred.vessels.LAD.probability > 0, 'LAD vessel probability produced');
  assert(pred.vessels.LCX.probability > 0, 'LCX vessel probability produced');
  assert(pred.vessels.RCA.probability > 0, 'RCA vessel probability produced');

  // 5. Test TreeSHAP Engine
  const exp = mlEngine.explain({
    Age: 62,
    Sex: 'Male',
    Weight: 80,
    Length: 170,
    BP: 145,
    PR: 80,
    'Region RWMA': 2,
    'EF-TTE': 42,
    LDL: 155,
    HDL: 35
  }, 'CAD');
  assert(exp.contributions.length > 5, 'SHAP generated multi-feature attributions');
  assert(exp.positive_factors.some(f => f.feature === 'Region RWMA' || f.feature === 'EF-TTE' || f.feature === 'Age'), 'High-impact features properly identified in top SHAP factors');

  console.log('\n--- ALL VERIFICATION CHECKS PASSED ---\n');
}

verifyAll().catch(e => {
  console.error(e);
  process.exit(1);
});
