import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { mlEngine } from './server/mlEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // REST API Routes
  const apiRouter = express.Router();

  // 1. Health check
  apiRouter.get('/health', (req: Request, res: Response) => {
    res.json({
      status: mlEngine.isReady() ? 'healthy' : 'initializing',
      service: 'Cardio3D AI Prediction & Stenosis Visualization API',
      version: 'Cardio3D-v1.0',
      timestamp: new Date().toISOString()
    });
  });

  // 2. Model information and leakage audit
  apiRouter.get('/model-info', (req: Request, res: Response) => {
    try {
      const info = mlEngine.getModelInfo();
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve model info', details: err.message });
    }
  });

  // 3. Model performance metrics
  apiRouter.get('/performance', (req: Request, res: Response) => {
    try {
      const metrics = mlEngine.getMetrics();
      if (!metrics) {
        return res.status(503).json({ error: 'Model metrics not loaded yet' });
      }
      res.json(metrics);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve metrics', details: err.message });
    }
  });

  // 4. Dataset summary and distribution stats
  apiRouter.get('/dataset/summary', (req: Request, res: Response) => {
    try {
      const summary = mlEngine.getDatasetSummary();
      if (!summary) {
        return res.status(503).json({ error: 'Dataset summary not loaded' });
      }
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load dataset summary', details: err.message });
    }
  });

  // 5. Raw dataset records (for dataset browser)
  apiRouter.get('/dataset/records', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const offset = parseInt(req.query.offset as string) || 0;
      const records = mlEngine.getRawDatasetRecords(limit, offset);
      res.json({ records, count: records.length, limit, offset });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load dataset records', details: err.message });
    }
  });

  // 6. CAD & Vessel Stenosis Prediction Endpoint
  apiRouter.post('/predict', (req: Request, res: Response) => {
    try {
      const patientData = req.body;
      if (!patientData || typeof patientData !== 'object') {
        return res.status(400).json({ error: 'Invalid patient input body' });
      }

      // Input validation on ranges if supplied
      if (patientData.Age !== undefined && (patientData.Age < 10 || patientData.Age > 120)) {
        return res.status(400).json({ error: 'Age must be between 10 and 120 years' });
      }
      if (patientData.BP !== undefined && (patientData.BP < 50 || patientData.BP > 260)) {
        return res.status(400).json({ error: 'Systolic BP must be between 50 and 260 mmHg' });
      }

      const prediction = mlEngine.predict(patientData);
      res.json(prediction);
    } catch (err: any) {
      console.error('Prediction error:', err);
      res.status(500).json({ error: 'Inference failed', details: err.message });
    }
  });

  // 7. Explainable AI (SHAP) Endpoint
  apiRouter.post('/explain', (req: Request, res: Response) => {
    try {
      const { patientData, target } = req.body;
      if (!patientData || typeof patientData !== 'object') {
        return res.status(400).json({ error: 'Missing patientData object' });
      }

      const selectedTarget = (target || 'CAD').toUpperCase() as 'CAD' | 'LAD' | 'LCX' | 'RCA';
      const explanation = mlEngine.explain(patientData, selectedTarget);
      res.json(explanation);
    } catch (err: any) {
      console.error('Explanation error:', err);
      res.status(500).json({ error: 'SHAP explanation failed', details: err.message });
    }
  });

  // 8. Structured Clinical Report Generation Endpoint
  apiRouter.post('/export-report', (req: Request, res: Response) => {
    try {
      const { patientData, target } = req.body;
      if (!patientData || typeof patientData !== 'object') {
        return res.status(400).json({ error: 'Missing patientData object' });
      }

      const prediction = mlEngine.predict(patientData);
      const selectedTarget = (target || 'CAD').toUpperCase() as 'CAD' | 'LAD' | 'LCX' | 'RCA';
      const explanation = mlEngine.explain(patientData, selectedTarget);

      const timestamp = new Date().toISOString();
      const reportText = `CARDIO3D AI — CLINICAL ANALYSIS REPORT\nGenerated: ${timestamp}\nOverall CAD Probability: ${prediction.cad.percentage}%\nLAD Stenosis Risk: ${prediction.vessels.LAD.percentage}%\nLCX Stenosis Risk: ${prediction.vessels.LCX.percentage}%\nRCA Stenosis Risk: ${prediction.vessels.RCA.percentage}%`;

      res.json({
        success: true,
        timestamp,
        prediction,
        explanation,
        reportText
      });
    } catch (err: any) {
      console.error('Export report error:', err);
      res.status(500).json({ error: 'Report generation failed', details: err.message });
    }
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Mount Vite or static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cardio3D AI server active on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
