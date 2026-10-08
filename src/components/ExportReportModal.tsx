import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { PredictionResponse, ExplainResponse, PatientFormValues } from '../types';
import { FileText, Download, X, ShieldAlert, HeartPulse, Printer, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResponse | null;
  explanation: ExplainResponse | null;
  patientValues: PatientFormValues;
  onAnalyze?: () => Promise<void>;
  isAnalyzing?: boolean;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  prediction,
  explanation,
  patientValues,
  onAnalyze,
  isAnalyzing = false
}) => {
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const timestamp = new Date().toLocaleString();
  const sessionAnonId = `ANON-${Math.abs(
    (patientValues.Age || 50) * 31 +
    (patientValues.BP || 120) * 17 +
    (patientValues['EF-TTE'] || 50) * 7
  ) % 9000 + 1000}`;

  // Generate plain text content for TXT download or clipboard
  const generateTextReport = () => {
    return `CARDIO3D AI — CLINICAL DECISION-SUPPORT ANALYSIS REPORT
================================================================================
Generated: ${timestamp}
Session ID: ${sessionAnonId} (Anonymous Non-Identifying Record)
Model Version: Cardio3D-v1.0 (UCI Z-Alizadeh Sani Architecture)
Validation: 80/20 Stratified Cross-Validation (Leakage Prevention Active)

--------------------------------------------------------------------------------
MANDATORY CLINICAL SAFETY NOTICE:
This report is generated for scientific research, educational benchmarking,
and clinical decision-support only. AI-generated probabilities are statistical
estimates and do NOT constitute a medical diagnosis. These results must never
replace clinical evaluation, physician judgment, ECG, or coronary angiography.
--------------------------------------------------------------------------------

1. MODEL PREDICTIONS & CORONARY ARTERY STENOSIS RISKS:
* Overall CAD Model Probability: ${prediction ? `${prediction.cad.percentage}% (${prediction.cad.category.toUpperCase()} RISK)` : 'Pending Analysis'}
* LAD (Left Anterior Descending):  ${prediction ? `${prediction.vessels.LAD.percentage}% (${prediction.vessels.LAD.category.toUpperCase()})` : 'Pending'}
* LCX (Left Circumflex Artery):    ${prediction ? `${prediction.vessels.LCX.percentage}% (${prediction.vessels.LCX.category.toUpperCase()})` : 'Pending'}
* RCA (Right Coronary Artery):     ${prediction ? `${prediction.vessels.RCA.percentage}% (${prediction.vessels.RCA.category.toUpperCase()})` : 'Pending'}

2. EXPLAINABLE AI — TOP FEATURE ATTRIBUTIONS (TreeSHAP):
${explanation ? explanation.contributions.slice(0, 8).map((c, i) => `  ${i + 1}. ${c.display_name} (val: ${c.feature_value}): ${c.shap_value > 0 ? '+' : ''}${Math.round(c.shap_value * 100)}% [${c.direction === 'positive' ? 'Increased Model Output' : 'Decreased Model Output'}]`).join('\n') : '  No SHAP explanation calculated yet.'}

3. NON-IDENTIFYING PATIENT CLINICAL INPUTS:
- Demographics: Age: ${patientValues.Age || 'N/A'} yrs | Sex: ${patientValues.Sex || 'N/A'} | BMI: ${patientValues.BMI || 'N/A'} kg/m²
- Vital Signs: Systolic BP: ${patientValues.BP || 'N/A'} mmHg | Pulse Rate: ${patientValues.PR || 'N/A'} bpm
- Echocardiography: Ejection Fraction (EF): ${patientValues['EF-TTE'] || 'N/A'}% | RWMA: ${patientValues['Region RWMA'] !== undefined ? patientValues['Region RWMA'] : 'N/A'}
- Laboratory: LDL: ${patientValues.LDL || 'N/A'} mg/dL | HDL: ${patientValues.HDL || 'N/A'} mg/dL | TG: ${patientValues.TG || 'N/A'} mg/dL | FBS: ${patientValues.FBS || 'N/A'} mg/dL | CR: ${patientValues.CR || 'N/A'} mg/dL
- ECG Findings: ST-Depression: ${patientValues['St Depression'] || '0'} | ST-Elevation: ${patientValues['St Elevation'] || '0'} | T-Inversion: ${patientValues.Tinversion || '0'} | Q-Wave: ${patientValues['Q Wave'] || '0'}
- Symptoms: Typical Angina: ${patientValues['Typical Chest Pain'] || 'N/A'} | Exertional Pain: ${patientValues['Exertional CP'] || 'N/A'} | Functional Class: ${patientValues['Function Class'] || 'N/A'}

================================================================================
Target Leakage Guarantee: LAD, LCX, RCA, and Cath strictly excluded from features.
Cardio3D AI Research Specification · https://cardio3d-ai.local
================================================================================`;
  };

  // 1. Download PDF using jsPDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Top Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('CARDIO3D AI — CLINICAL ANALYSIS REPORT', 14, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225); // slate-300
      doc.text(`Model: Cardio3D-v1.0 (UCI Z-Alizadeh Sani Architecture) | Session: ${sessionAnonId} | Date: ${timestamp}`, 14, 20);

      // Clinical Safety Warning Box
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(245, 158, 11); // amber-500
      doc.rect(14, 32, pageWidth - 28, 18, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9); // amber-700
      doc.text('MANDATORY CLINICAL SAFETY NOTICE (DECISION-SUPPORT ONLY):', 17, 37);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 53, 15);
      const noticeText = 'This report provides machine-learning probabilistic predictions for educational and decision-support research. It does NOT constitute a confirmed medical diagnosis or direct measurement of anatomical stenosis. Never replace physician judgment, ECG, or coronary angiography.';
      const splitNotice = doc.splitTextToSize(noticeText, pageWidth - 34);
      doc.text(splitNotice, 17, 42);

      let currentY = 56;

      // Section 1: Predictions Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Machine Learning Predictive Outcomes', 14, currentY);
      currentY += 6;

      const cadPct = prediction ? `${prediction.cad.percentage}%` : 'N/A';
      const ladPct = prediction ? `${prediction.vessels.LAD.percentage}%` : 'N/A';
      const lcxPct = prediction ? `${prediction.vessels.LCX.percentage}%` : 'N/A';
      const rcaPct = prediction ? `${prediction.vessels.RCA.percentage}%` : 'N/A';

      // Draw 4 Metric Boxes
      const boxW = (pageWidth - 28 - 9) / 4;
      const metricsArr = [
        { label: 'Overall CAD', val: cadPct, cat: prediction?.cad.category || 'pending', bg: [255, 241, 242], border: [244, 63, 94] },
        { label: 'LAD Artery', val: ladPct, cat: prediction?.vessels.LAD.category || 'pending', bg: [241, 245, 249], border: [203, 213, 225] },
        { label: 'LCX Artery', val: lcxPct, cat: prediction?.vessels.LCX.category || 'pending', bg: [241, 245, 249], border: [203, 213, 225] },
        { label: 'RCA Artery', val: rcaPct, cat: prediction?.vessels.RCA.category || 'pending', bg: [241, 245, 249], border: [203, 213, 225] },
      ];

      metricsArr.forEach((m, idx) => {
        const xPos = 14 + idx * (boxW + 3);
        doc.setFillColor(m.bg[0], m.bg[1], m.bg[2]);
        doc.setDrawColor(m.border[0], m.border[1], m.border[2]);
        doc.rect(xPos, currentY, boxW, 20, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, xPos + 4, currentY + 5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text(m.val, xPos + 4, currentY + 12);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`${m.cat.toUpperCase()} RISK`, xPos + 4, currentY + 17);
      });

      currentY += 27;

      // Section 2: TreeSHAP Feature Attributions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Top Influential Features (TreeSHAP Explainable AI)', 14, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Marginal contributions showing why the model produced this specific prediction (+ pushes risk higher, - protective):', 14, currentY);
      currentY += 5;

      if (explanation && explanation.contributions.length > 0) {
        const topShap = explanation.contributions.slice(0, 7);
        topShap.forEach((item, i) => {
          doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
          doc.rect(14, currentY - 3, pageWidth - 28, 6.5, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text(`${i + 1}. ${item.display_name}`, 16, currentY + 1.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`Patient Value: ${item.feature_value}`, 110, currentY + 1.5);

          const sign = item.shap_value > 0 ? '+' : '';
          const shapTxt = `${sign}${Math.round(item.shap_value * 100)}% (${item.direction})`;
          doc.setFont('helvetica', 'bold');
          if (item.direction === 'positive') {
            doc.setTextColor(225, 29, 72); // rose-600
          } else {
            doc.setTextColor(16, 185, 129); // emerald-600
          }
          doc.text(shapTxt, pageWidth - 16, currentY + 1.5, { align: 'right' });

          currentY += 6.5;
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('No prediction calculated yet. Complete patient analysis to view SHAP breakdown.', 14, currentY + 3);
        currentY += 8;
      }

      currentY += 6;

      // Section 3: Patient Input Parameters Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('3. De-Identified Patient Profile Summary', 14, currentY);
      currentY += 6;

      const profileRows = [
        ['Age / Sex', `${patientValues.Age || 'N/A'} yrs · ${patientValues.Sex || 'N/A'}`, 'Systolic BP / Pulse', `${patientValues.BP || 'N/A'} mmHg · ${patientValues.PR || 'N/A'} bpm`],
        ['Ejection Fraction (EF)', `${patientValues['EF-TTE'] || 'N/A'}%`, 'Region RWMA (0-4)', `${patientValues['Region RWMA'] !== undefined ? patientValues['Region RWMA'] : 'N/A'}`],
        ['LDL / HDL Cholesterol', `${patientValues.LDL || 'N/A'} / ${patientValues.HDL || 'N/A'} mg/dL`, 'Triglycerides / Fasting Sugar', `${patientValues.TG || 'N/A'} / ${patientValues.FBS || 'N/A'} mg/dL`],
        ['Chest Pain Presentation', `${patientValues['Typical Chest Pain'] === 'Y' ? 'Typical Angina' : 'Atypical / Non-anginal'}`, 'Functional NYHA Class', `Class ${patientValues['Function Class'] || '1'}`],
        ['ECG Findings', `ST-Depr: ${patientValues['St Depression'] || '0'} · T-Inv: ${patientValues.Tinversion || '0'} · Q-Wave: ${patientValues['Q Wave'] || '0'}`, 'Risk Factors', `HTN: ${patientValues.HTN || 'N'} · DM: ${patientValues.DM || 'N'} · Smoker: ${patientValues['Current Smoker'] || 'N'}`]
      ];

      profileRows.forEach((row, i) => {
        doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
        doc.rect(14, currentY - 3, pageWidth - 28, 6.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(row[0], 16, currentY + 1.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(row[1], 55, currentY + 1.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(row[2], 110, currentY + 1.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(row[3], 155, currentY + 1.5);

        currentY += 6.5;
      });

      // Bottom Footer Legal Notice
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 275, pageWidth - 14, 275);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('Cardio3D AI Research Platform · Target Leakage Exclusion: LAD, LCX, RCA, Cath strictly removed from model features.', 14, 281);
      doc.text('Page 1 of 1 · Non-Identifying Session Record', pageWidth - 14, 281, { align: 'right' });

      // Save PDF to user's device
      const fileName = `Cardio3D_Analysis_${sessionAnonId}_${Date.now()}.pdf`;
      doc.save(fileName);
      setStatusMsg(`Successfully exported PDF: ${fileName}`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      // Fallback to text download if PDF failed
      handleDownloadText();
    }
  };

  // 2. Download HTML Report
  const handleDownloadHTML = () => {
    try {
      const cadPct = prediction ? `${prediction.cad.percentage}%` : 'Pending';
      const ladPct = prediction ? `${prediction.vessels.LAD.percentage}%` : 'Pending';
      const lcxPct = prediction ? `${prediction.vessels.LCX.percentage}%` : 'Pending';
      const rcaPct = prediction ? `${prediction.vessels.RCA.percentage}%` : 'Pending';

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cardio3D AI Clinical Report - ${sessionAnonId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; background: #fff; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
    h1 { margin: 0 0 6px 0; font-size: 22px; color: #0f172a; }
    .meta { font-size: 12px; color: #64748b; }
    .notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 14px; border-radius: 8px; font-size: 12px; color: #92400e; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; text-align: center; }
    .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
    .card-val { font-size: 24px; font-weight: 700; color: #e11d48; margin-bottom: 2px; }
    .card-sub { font-size: 11px; color: #475569; text-transform: capitalize; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; }
    th { background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>CARDIO3D AI — CLINICAL DECISION-SUPPORT REPORT</h1>
    <div class="meta">Session ID: ${sessionAnonId} | Generated: ${timestamp} | Model: Cardio3D-v1.0</div>
  </div>

  <div class="notice">
    <strong>Mandatory Decision-Support Notice:</strong> This report is for scientific research and educational decision-support only. Probabilities represent statistical model estimates from the UCI Z-Alizadeh Sani cohort and do not constitute a medical diagnosis.
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Overall CAD</div>
      <div class="card-val">${cadPct}</div>
      <div class="card-sub">${prediction?.cad.category || 'Pending'} Risk</div>
    </div>
    <div class="card">
      <div class="card-title">LAD Stenosis</div>
      <div class="card-val" style="color: #0f172a;">${ladPct}</div>
      <div class="card-sub">${prediction?.vessels.LAD.category || 'Pending'}</div>
    </div>
    <div class="card">
      <div class="card-title">LCX Stenosis</div>
      <div class="card-val" style="color: #0f172a;">${lcxPct}</div>
      <div class="card-sub">${prediction?.vessels.LCX.category || 'Pending'}</div>
    </div>
    <div class="card">
      <div class="card-title">RCA Stenosis</div>
      <div class="card-val" style="color: #0f172a;">${rcaPct}</div>
      <div class="card-sub">${prediction?.vessels.RCA.category || 'Pending'}</div>
    </div>
  </div>

  <h3>TreeSHAP Feature Attributions</h3>
  <table>
    <thead>
      <tr><th>Feature Name</th><th>Patient Value</th><th>Marginal Contribution</th><th>Direction</th></tr>
    </thead>
    <tbody>
      ${explanation ? explanation.contributions.slice(0, 8).map(c => `
        <tr>
          <td><strong>${c.display_name}</strong></td>
          <td>${c.feature_value}</td>
          <td>${c.shap_value > 0 ? '+' : ''}${Math.round(c.shap_value * 100)}%</td>
          <td style="color: ${c.direction === 'positive' ? '#e11d48' : '#10b981'}; font-weight: 600;">${c.direction === 'positive' ? 'Increased Risk' : 'Protective'}</td>
        </tr>
      `).join('') : '<tr><td colspan="4">No prediction loaded yet.</td></tr>'}
    </tbody>
  </table>

  <h3>Patient Clinical Input Parameters</h3>
  <table>
    <tbody>
      <tr><td><strong>Age / Sex:</strong></td><td>${patientValues.Age || 'N/A'} yrs · ${patientValues.Sex || 'N/A'}</td><td><strong>Systolic BP / Pulse:</strong></td><td>${patientValues.BP || 'N/A'} mmHg · ${patientValues.PR || 'N/A'} bpm</td></tr>
      <tr><td><strong>Echo EF:</strong></td><td>${patientValues['EF-TTE'] || 'N/A'}%</td><td><strong>RWMA (0-4):</strong></td><td>${patientValues['Region RWMA'] !== undefined ? patientValues['Region RWMA'] : 'N/A'}</td></tr>
      <tr><td><strong>LDL / HDL:</strong></td><td>${patientValues.LDL || 'N/A'} / ${patientValues.HDL || 'N/A'} mg/dL</td><td><strong>TG / Sugar:</strong></td><td>${patientValues.TG || 'N/A'} / ${patientValues.FBS || 'N/A'} mg/dL</td></tr>
    </tbody>
  </table>

  <div class="footer">
    Cardio3D AI Research Engine · Target Leakage Exclusion Active · Anonymous Patient Record
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cardio3D_Clinical_Report_${sessionAnonId}.html`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      setStatusMsg('Downloaded standalone HTML report');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      console.error('HTML export error:', err);
      handleDownloadText();
    }
  };

  // 3. Download Plaintext
  const handleDownloadText = () => {
    try {
      const content = generateTextReport();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cardio3D_Analysis_${sessionAnonId}.txt`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      setStatusMsg('Downloaded plain text analysis report');
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      console.error('Text export error:', err);
    }
  };

  // 4. Copy to Clipboard
  const handleCopyClipboard = async () => {
    try {
      const content = generateTextReport();
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setStatusMsg('Copied report dossier to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setStatusMsg(null);
      }, 3000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // 5. Print Handler (with iframe sandbox fallback)
  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('window.print() not available in iframe sandbox; falling back to PDF download', err);
      handleDownloadPDF();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Clinical Analysis Export & Report Dossier</h2>
              <span className="text-xs text-slate-400 font-mono">Anonymous Session ID: {sessionAnonId}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status notification toast */}
        {statusMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Safety Disclaimer Callout */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mandatory Clinical Notice:</strong> This report reflects machine learning decision-support probabilities. It is not an invasive angiogram, cardiac CT, or diagnostic prescription. All decisions remain with licensed physicians.
          </p>
        </div>

        {/* If prediction is not calculated yet, offer a 1-click Analysis button */}
        {!prediction && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">No Patient Prediction Calculated Yet</h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-0.5">
                Calculate overall CAD risk, LAD/LCX/RCA probabilities, and TreeSHAP feature attributions from current patient inputs.
              </p>
            </div>
            {onAnalyze && (
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    <span>Computing Predictions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Analysis & Populate Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Report Preview Summary */}
        <div className="space-y-3 text-xs">
          {/* Patient Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl">
            <div>
              <span className="text-slate-400 block text-[11px]">Subject ID:</span>
              <span className="font-mono font-semibold text-slate-800">{sessionAnonId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Demographics:</span>
              <span className="font-semibold text-slate-800">{patientValues.Age || '—'} yrs · {patientValues.Sex || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Model Engine:</span>
              <span className="font-semibold text-slate-800">Cardio3D-v1.0</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Generated:</span>
              <span className="font-mono text-slate-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Model Predictions Preview */}
          {prediction && (
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Model Predictions Preview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">Overall CAD</span>
                  <span className="text-lg font-bold font-mono text-rose-600">{prediction.cad.percentage}%</span>
                  <span className="block text-[10px] text-slate-600 capitalize">{prediction.cad.category} Risk</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">LAD Stenosis</span>
                  <span className="text-lg font-bold font-mono text-slate-800">{prediction.vessels.LAD.percentage}%</span>
                  <span className="block text-[10px] text-slate-600 capitalize">{prediction.vessels.LAD.category}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">LCX Stenosis</span>
                  <span className="text-lg font-bold font-mono text-slate-800">{prediction.vessels.LCX.percentage}%</span>
                  <span className="block text-[10px] text-slate-600 capitalize">{prediction.vessels.LCX.category}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">RCA Stenosis</span>
                  <span className="text-lg font-bold font-mono text-slate-800">{prediction.vessels.RCA.percentage}%</span>
                  <span className="block text-[10px] text-slate-600 capitalize">{prediction.vessels.RCA.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Attributed Features Preview */}
          {explanation && (
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Top Explainability Features (TreeSHAP)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {explanation.contributions.slice(0, 6).map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded">
                    <span className="text-slate-700">{c.display_name}</span>
                    <span className={`font-mono font-bold ${c.direction === 'positive' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {c.shap_value > 0 ? '+' : ''}{Math.round(c.shap_value * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Multi-Format Export Options */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Export Options</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. PDF Download */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Download formal medical PDF report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            {/* 2. HTML Standalone */}
            <button
              type="button"
              onClick={handleDownloadHTML}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Download standalone HTML medical document"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>

            {/* 3. Plaintext */}
            <button
              type="button"
              onClick={handleDownloadText}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Download plain text analysis summary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            {/* 4. Copy to Clipboard */}
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Copy entire summary to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-slate-400">
              Zero PII stored or collected · Target leakage protection verified
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Printer className="w-3 h-3" />
              <span>Print view</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
