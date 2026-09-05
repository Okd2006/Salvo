/**
 * src/db/repository.ts
 *
 * Salvo Unified Data Repository
 *
 * Manages persistence for:
 *  - transactions
 *  - recovery_actions
 *  - audit_logs
 *
 * Implements fallback strategy:
 *  1. Uses MongoDB Atlas if MONGODB_URI is provided.
 *  2. Transparently falls back to local JSON files in data/ directory for deterministic offline benchmarking.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __repo_dir = path.dirname(fileURLToPath(import.meta.url));
const __repo_project_data = path.resolve(__repo_dir, '../../data');
import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
} from '../types/index.js';
import {
  isMongoConfigured,
  isMongoAvailable,
  getTransactionsCollection,
  getRecoveryActionsCollection,
  getAuditLogsCollection,
} from './mongo.js';

const DATA_DIR = process.env.SALVO_DATA_DIR
  ? path.resolve(process.env.SALVO_DATA_DIR)
  : (fs.existsSync(__repo_project_data)
      ? __repo_project_data
      : path.resolve(process.cwd(), 'data'));
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const ACTIONS_FILE = path.join(DATA_DIR, 'recovery_actions.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_logs.json');

function safeWriteFile(filePath: string, data: string): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, data, 'utf-8');
    return true;
  } catch (err) {
    // Graceful handling for read-only filesystems in serverless runtimes (Vercel, AWS Lambda)
    return false;
  }
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

let inMemoryTransactions: TransactionDocument[] | null = null;
let inMemoryActions: Map<string, RecoveryActionDocument> | null = null;
let inMemoryLogs: Map<string, AuditLogDocument> | null = null;

function loadActionsMap(): Map<string, RecoveryActionDocument> {
  if (inMemoryActions) return inMemoryActions;
  const map = new Map<string, RecoveryActionDocument>();
  if (fs.existsSync(ACTIONS_FILE)) {
    try {
      const raw = fs.readFileSync(ACTIONS_FILE, 'utf-8');
      const list = JSON.parse(raw) as RecoveryActionDocument[];
      for (const a of list) map.set(a.actionId, a);
    } catch {
      // ignore
    }
  }
  inMemoryActions = map;
  return map;
}

function loadLogsMap(): Map<string, AuditLogDocument> {
  if (inMemoryLogs) return inMemoryLogs;
  const map = new Map<string, AuditLogDocument>();
  if (fs.existsSync(AUDIT_FILE)) {
    try {
      const raw = fs.readFileSync(AUDIT_FILE, 'utf-8');
      const list = JSON.parse(raw) as AuditLogDocument[];
      for (const l of list) map.set(l.eventId, l);
    } catch {
      // ignore
    }
  }
  inMemoryLogs = map;
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// Transactions Repository
// ─────────────────────────────────────────────────────────────────────────────

export async function saveTransactions(
  transactions: TransactionDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();
  inMemoryTransactions = transactions;

  if (isMongoAvailable()) {
    try {
      const col = await getTransactionsCollection();
      await col.deleteMany({});
      if (transactions.length > 0) {
        await col.insertMany(transactions);
        await col.createIndex({ transactionId: 1 }, { unique: true });
        await col.createIndex({ status: 1 });
        await col.createIndex({ failureCategory: 1 });
      }
      safeWriteFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
      return { count: transactions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save transactions failed: ${(err as Error).message}`);
    }
  }

  safeWriteFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
  return { count: transactions.length, source: 'file' };
}

export async function getAllTransactions(): Promise<TransactionDocument[]> {
  if (isMongoAvailable()) {
    try {
      const col = await getTransactionsCollection();
      const docs = await col.find({}).toArray();
      if (docs.length > 0) {
        return docs as unknown as TransactionDocument[];
      }
    } catch (err) {
      console.warn(`[repository] MongoDB read transactions failed: ${(err as Error).message}`);
    }
  }

  if (inMemoryTransactions) {
    return inMemoryTransactions;
  }

  if (fs.existsSync(TRANSACTIONS_FILE)) {
    const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    inMemoryTransactions = JSON.parse(raw) as TransactionDocument[];
    return inMemoryTransactions;
  }

  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Recovery Actions Repository (Upsert/Merge Behavior)
// ─────────────────────────────────────────────────────────────────────────────

export async function saveRecoveryActions(
  actions: RecoveryActionDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  const actionMap = loadActionsMap();
  for (const a of actions) {
    actionMap.set(a.actionId, a);
  }
  const mergedActions = Array.from(actionMap.values());

  if (isMongoConfigured() && actions.length > 0) {
    try {
      const col = await getRecoveryActionsCollection();
      const ops = actions.map((act) => ({
        updateOne: {
          filter: { actionId: act.actionId },
          update: { $set: act },
          upsert: true,
        },
      }));
      await col.bulkWrite(ops, { ordered: false });
      safeWriteFile(ACTIONS_FILE, JSON.stringify(mergedActions, null, 2));
      return { count: mergedActions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save recovery actions failed: ${(err as Error).message}`);
    }
  }

  safeWriteFile(ACTIONS_FILE, JSON.stringify(mergedActions, null, 2));
  return { count: mergedActions.length, source: 'file' };
}

export async function getAllRecoveryActions(): Promise<RecoveryActionDocument[]> {
  if (isMongoAvailable()) {
    try {
      const col = await getRecoveryActionsCollection();
      const docs = await col.find({}).toArray();
      if (docs.length > 0) {
        return docs as unknown as RecoveryActionDocument[];
      }
    } catch (err) {
      console.warn(`[repository] MongoDB read recovery actions failed: ${(err as Error).message}`);
    }
  }

  const actionMap = loadActionsMap();
  return Array.from(actionMap.values());
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Logs Repository (Append/Merge Behavior)
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAuditLogs(
  logs: AuditLogDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  const logMap = loadLogsMap();
  for (const l of logs) {
    logMap.set(l.eventId, l);
  }
  const mergedLogs = Array.from(logMap.values());

  if (isMongoConfigured() && logs.length > 0) {
    try {
      const col = await getAuditLogsCollection();
      const ops = logs.map((log) => ({
        updateOne: {
          filter: { eventId: log.eventId },
          update: { $set: log },
          upsert: true,
        },
      }));
      await col.bulkWrite(ops, { ordered: false });
      safeWriteFile(AUDIT_FILE, JSON.stringify(mergedLogs, null, 2));
      return { count: mergedLogs.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save audit logs failed: ${(err as Error).message}`);
    }
  }

  safeWriteFile(AUDIT_FILE, JSON.stringify(mergedLogs, null, 2));
  return { count: mergedLogs.length, source: 'file' };
}

export async function getAllAuditLogs(): Promise<AuditLogDocument[]> {
  if (isMongoAvailable()) {
    try {
      const col = await getAuditLogsCollection();
      const docs = await col.find({}).sort({ timestamp: -1 }).toArray();
      if (docs.length > 0) {
        return docs as unknown as AuditLogDocument[];
      }
    } catch (err) {
      console.warn(`[repository] MongoDB read audit logs failed: ${(err as Error).message}`);
    }
  }

  const logMap = loadLogsMap();
  return Array.from(logMap.values());
}
