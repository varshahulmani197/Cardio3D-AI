# Cardio3D AI — Interactive Coronary Artery Disease Risk & Stenosis Visualization

[![Status](https://img.shields.io/badge/Status-Research%20Prototype-blue.svg)](#)
[![Model Version](https://img.shields.io/badge/Model-Cardio3D--v1.0-emerald.svg)](#)
[![Dataset](https://img.shields.io/badge/Dataset-UCI%20Z--Alizadeh%20Sani-rose.svg)](#)
[![Explainability](https://img.shields.io/badge/XAI-TreeSHAP%20Enabled-purple.svg)](#)

> **Mandatory Clinical Safety Notice**  
> This application is intended for research, educational, and clinical decision-support benchmarking only. AI-generated predictions are probabilistic model estimates and do **NOT** constitute medical diagnoses. AI predictions must never replace clinical evaluation, physician judgment, resting ECG interpretation, laboratory assessment, coronary CT angiography (CCTA), or invasive coronary angiography (ICA).

---

## 1. Project Overview

**Cardio3D AI** is an end-to-end full-stack research prototype that bridges clinical cardiology, machine learning classification, explainable artificial intelligence (XAI), and real-time 3D spatial anatomy.

Given a patient's multi-modal clinical profile (demographics, vital signs, standard laboratory biomarkers, 12-lead ECG findings, and echocardiography), Cardio3D AI computes:
1. **Overall CAD Probability Score (0–100%)**
2. **Vessel-Specific Stenosis Risks:**
   - **LAD** — Left Anterior Descending Artery
   - **LCX** — Left Circumflex Artery
   - **RCA** — Right Coronary Artery
3. **Dynamic 3D Anatomy Mapping:** Projects model probabilities onto an interactive 3D coronary anatomy model (Green = Low, Amber = Moderate, Red = High Risk) with realistic coronary branch geometry and heartbeat motion.
4. **Game-Theoretic Explainability (TreeSHAP):** Decomposes every individual patient prediction into positive (risk-increasing) and negative (protective) marginal feature attributions.

---

## 2. Key Features

- **Empirically Trained on Real Clinical Data:** Trained on the 303-patient UCI Z-Alizadeh Sani Coronary Artery Disease benchmark from Shaheed Rajaei Heart Center.
- **Strict Target Leakage Prevention:** Outcome and direct diagnostic endpoints (`LAD`, `LCX`, `RCA`, `Cath`) are strictly excluded from predictive feature vectors.
- **Interactive Three.js 3D Coronary Anatomy:**
  - Separately identifiable coronary branches: LAD (with Diagonals D1/D2), LCX (with Obtuse Marginals OM1/OM2), and RCA (with Acute Marginal & Posterior Descending Artery).
  - OrbitControls: 360° mouse/touch rotation, zoom, pan, camera reset, and preset anatomical views (Anterior, Posterior, Left, Right).
  - Raycasting hover tooltips and interactive vessel inspection panels.
  - Heartbeat cardiac micro-animation (72 bpm) and emissive risk glow.
- **Explainable AI (TreeSHAP):** Full additive feature attribution showing factors increasing model risk vs. factors decreasing risk.
- **Multi-Page Research Suite:**
  - **Dashboard:** Unified clinical input console, 3D heart, risk gauge cards, and SHAP chart.
  - **3D Anatomy Theater:** Expanded coronary anatomy inspection with perfusion territory dossiers.
  - **Model Performance:** Cross-validated metrics (Accuracy, Precision, Recall, F1, ROC-AUC), confusion matrices, and interactive ROC curves for CAD, LAD, LCX, and RCA.
  - **Explainability:** In-depth XAI mathematical framework, feature rankings, and ethical boundaries.
  - **Dataset Insights:** 303-patient cohort distributions, age histograms, sex breakdowns, and raw record browser.
  - **6-Page Project Document:** Formal academic technical dossier suitable for hackathons, paper reviews, or portfolio evaluations.
  - **About & Safety:** Comprehensive disease background, scope boundaries, and future roadmap.
- **Anonymous Session Export:** Non-identifying summary generation with printable layout and text download.

---

## 3. System Architecture

```text
                 PATIENT CLINICAL INPUT (52 Features)
                                │
                                ▼
                       React 19 Frontend
                   (Tailwind CSS + Three.js)
                                │
                                ▼ [POST /api/predict]
                       Express Backend Server
                                │
                                ▼
                   Standardization & Imputation
                  (Z-Score Normalization + Mode)
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
    Overall CAD Model                   Vessel Models (LAD, LCX, RCA)
    (Ensemble Blend)                    (Decision Trees + L2 Logistic)
            │                                       │
            └───────────────────┬───────────────────┘
                                ▼
                         Prediction Engine
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
           TreeSHAP Engine             3D WebGL Shader
       (Marginal Attribution)       (Coronary Tube Meshes)
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                     Interactive State Update
             (Glow, Risk Cards, Explanation Chart)
```

---

## 4. Dataset & Target Leakage Prevention

- **Dataset:** UCI Z-Alizadeh Sani Coronary Artery Disease Dataset
- **Records:** 303 consecutive patients undergoing catheter angiography
- **CAD Prevalence:** 216 CAD-positive (71.3%), 87 Normal (28.7%)
- **Coronary Outcomes:** LAD Stenotic (54.5%), RCA Stenotic (37.0%), LCX Stenotic (31.0%)
- **Leakage Exclusion Audit:**
  ```python
  TARGET_LEAKAGE_COLUMNS = ["LAD", "LCX", "RCA", "Cath"]
  ```
  The pipeline guarantees that neither diagnostic angiography results nor inter-vessel labels are fed back into model feature spaces.

---

## 5. Model Evaluation Metrics (Test Partition)

| Model Target | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Overall CAD** | **95.1%** | **97.9%** | **95.8%** | **0.968** | **0.957** |
| **LAD Stenosis** | **78.7%** | **81.4%** | **87.5%** | **0.843** | **0.747** |
| **LCX Stenosis** | **75.4%** | **50.0%** | **13.3%** | **0.211** | **0.668** |
| **RCA Stenosis** | **72.1%** | **66.7%** | **30.0%** | **0.414** | **0.725** |

*All metrics are calculated on the 20% holdout test partition ($n=61$) using seed 42.*

---

## 6. Installation & Quick Start

### Prerequisites
- Node.js 18+ / 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/example/cardio3d-ai.git
cd cardio3d-ai

# Install dependencies
npm install

# Run the full-stack application (starts Express server on port 3000 with Vite middleware)
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 7. Model Training Pipeline

To retrain the models and generate new artifacts from raw CSV data:
```bash
python3 backend/training/train_models.py
python3 backend/training/generate_summary.py
```
This produces the verified artifacts in `model_artifacts/`:
- `cad_model.json`
- `lad_model.json`
- `lcx_model.json`
- `rca_model.json`
- `preprocessing.json`
- `metrics.json`
- `feature_metadata.json`
- `dataset_summary.json`

---

## 8. REST API Documentation

### `GET /api/health`
Returns system status, service name, and version.

### `GET /api/model-info`
Returns training metadata, feature specifications, and target leakage exclusion confirmation.

### `GET /api/performance`
Returns comprehensive evaluation metrics (accuracy, precision, recall, f1, roc-auc, confusion matrix, ROC curves) for all 4 models.

### `POST /api/predict`
Calculates overall CAD probability and vessel stenosis probabilities.
```json
{
  "Age": 68,
  "Sex": "Male",
  "BP": 155,
  "PR": 88,
  "Region RWMA": 3,
  "EF-TTE": 38,
  "LDL": 168,
  "HDL": 32
}
```

### `POST /api/explain`
Calculates exact TreeSHAP feature attributions for a selected target (`CAD`, `LAD`, `LCX`, `RCA`).

---

## 9. Limitations & Clinical Safety

1. **Investigational Prototype:** Developed strictly for research and academic demonstration.
2. **Single-Center Cohort:** External multicenter validation across varied clinical demographics is required.
3. **Illustrative Geometry:** 3D coronary anatomy is an interactive anatomical schematic, not patient-specific volume segmentation.

---

## 10. Future Research Directions

- **Direct DICOM CCTA Reconstruction:** Mesh extraction from patient CT angiography.
- **Fractional Flow Reserve (FFR-CT):** CFD hemodynamic significance calculation.
- **Multi-Center Federated Learning:** Multi-hospital privacy-preserving training.
