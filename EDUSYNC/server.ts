import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock endpoint for Neural Network Efficiency metrics
  app.get("/api/research/metrics", (req, res) => {
    res.json({
      originalModel: {
        parameters: 5400000,
        size: "22.5MB",
        inferenceTime: "45ms",
        accuracy: "94.2%"
      },
      optimizedModel: {
        parameters: 1200000,
        size: "5.1MB",
        inferenceTime: "12ms",
        accuracy: "93.8%"
      },
      pruningTechnique: "Iterative Magnitude Pruning (IMP)",
      improvement: {
        compression: "4.4x",
        speedup: "3.75x"
      },
      layers: [
        { name: "Conv1", nodes: 64, pruned: 20 },
        { name: "Conv2", nodes: 128, pruned: 80 },
        { name: "FC1", nodes: 512, pruned: 400 },
        { name: "FC2", nodes: 10, pruned: 0 }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduSync Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
