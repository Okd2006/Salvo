/**
 * src/index.ts
 *
 * Salvo — Backend Server & API Entrypoint
 *
 * Provides:
 *  - HTTP API server with POST /api/diagnose
 *  - Health status checks
 *  - Pipeline telemetry
 */

import http from 'node:http';
import 'dotenv/config';
import { handleApiRequest } from './api/handler.js';
import { AI_CONFIG, isGeminiConfigured } from './lib/gemini.js';
import { isMongoConfigured } from './db/mongo.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = http.createServer((req, res) => {
  void handleApiRequest(req, res);
});

server.listen(PORT, () => {
  console.log('\n  ╔═════════════════════════════════════════════════════╗');
  console.log('  ║   SALVO — AI Revenue Recovery Intelligence Server   ║');
  console.log('  ║   Razorpay AI Buildathon                            ║');
  console.log('  ╚═════════════════════════════════════════════════════╝\n');
  console.log(`  • Server Listening:    http://localhost:${PORT}`);
  console.log(`  • Gemini Diagnosis:    ${AI_CONFIG.diagnosisModel} (${isGeminiConfigured() ? 'Ready' : 'No Key'})`);
  console.log(`  • Database Target:     ${isMongoConfigured() ? 'MongoDB Atlas' : 'Local Repository (data/*.json)'}`);
  console.log(`  • API Endpoint:        POST http://localhost:${PORT}/api/diagnose\n`);
});

export { server };
