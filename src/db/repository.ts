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
import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
} from '../types/index.js';
import {
  isMongoConfigured,
  getTransactionsCollection,
  getRecoveryActionsCollection,
  getAuditLogsCollection,
} from './mongo.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const ACTIONS_FILE = path.join(DATA_DIR, 'recovery_actions.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_logs.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────
// Transactions Repository
// ─────────────────────────────────────────────────────────────

export async function saveTransactions(
  transactions: TransactionDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  if (isMongoConfigured()) {
    try {
      const col = await getTransactionsCollection();
      await col.deleteMany({});
      if (transactions.length > 0) {
        await col.insertMany(transactions);
        await col.createIndex({ transactionId: 1 }, { unique: true });
        await col.createIndex({ status: 1 });
        await col.createIndex({ failureCategory: 1 });
      }
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
      return { count: transactions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save transactions failed: ${(err as Error).message}`);
    }
  }

  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
  return { count: transactions.length, source: 'file' };
}

export async function getAllTransactions(): Promise<TransactionDocument[]> {
  if (isMongoConfigured()) {
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

  if (fs.existsSync(TRANSACTIONS_FILE)) {
    const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(raw) as TransactionDocument[];
  }

  return [];
}

// ─────────────────────────────────────────────────────────────
// Recovery Actions Repository (Upsert/Merge Behavior)
// ─────────────────────────────────────────────────────────────

export async function saveRecoveryActions(
  actions: RecoveryActionDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  // Read existing actions
  let existingActions: RecoveryActionDocument[] = [];
  if (fs.existsSync(ACTIONS_FILE)) {
    try {
      const raw = fs.readFileSync(ACTIONS_FILE, 'utf-8');
      existingActions = JSON.parse(raw) as RecoveryActionDocument[];
    } catch {
      existingActions = [];
    }
  }

  // Merge/upsert by actionId
  const actionMap = new Map<string, RecoveryActionDocument>();
  for (const a of existingActions) {
    actionMap.set(a.actionId, a);
  }
  for (const a of actions) {
    actionMap.set(a.actionId, a);
  }
  const mergedActions = Array.from(actionMap.values());

  if (isMongoConfigured()) {
    try {
      const col = await getRecoveryActionsCollection();
      for (const act of actions) {
        await col.updateOne({ actionId: act.actionId }, { $set: act }, { upsert: true });
      }
      fs.writeFileSync(ACTIONS_FILE, JSON.stringify(mergedActions, null, 2), 'utf-8');
      return { count: mergedActions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save recovery actions failed: ${(err as Error).message}`);
    }
  }

  fs.writeFileSync(ACTIONS_FILE, JSON.stringify(mergedActions, null, 2), 'utf-8');
  return { count: mergedActions.length, source: 'file' };
}

export async function getAllRecoveryActions(): Promise<RecoveryActionDocument[]> {
  if (isMongoConfigured()) {
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

  if (fs.existsSync(ACTIONS_FILE)) {
    const raw = fs.readFileSync(ACTIONS_FILE, 'utf-8');
    return JSON.parse(raw) as RecoveryActionDocument[];
  }

  return [];
}

// ─────────────────────────────────────────────────────────────
// Audit Logs Repository (Append/Merge Behavior)
// ─────────────────────────────────────────────────────────────

export async function saveAuditLogs(
  logs: AuditLogDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  // Read existing logs
  let existingLogs: AuditLogDocument[] = [];
  if (fs.existsSync(AUDIT_FILE)) {
    try {
      const raw = fs.readFileSync(AUDIT_FILE, 'utf-8');
      existingLogs = JSON.parse(raw) as AuditLogDocument[];
    } catch {
      existingLogs = [];
    }
  }

  // Merge/append by eventId
  const logMap = new Map<string, AuditLogDocument>();
  for (const l of existingLogs) {
    logMap.set(l.eventId, l);
  }
  for (const l of logs) {
    logMap.set(l.eventId, l);
  }
  const mergedLogs = Array.from(logMap.values());

  if (isMongoConfigured()) {
    try {
      const col = await getAuditLogsCollection();
      for (const log of logs) {
        await col.updateOne({ eventId: log.eventId }, { $set: log }, { upsert: true });
      }
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(mergedLogs, null, 2), 'utf-8');
      return { count: mergedLogs.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save audit logs failed: ${(err as Error).message}`);
    }
  }

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(mergedLogs, null, 2), 'utf-8');
  return { count: mergedLogs.length, source: 'file' };
}

export async function getAllAuditLogs(): Promise<AuditLogDocument[]> {
  if (isMongoConfigured()) {
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

  if (fs.existsSync(AUDIT_FILE)) {
    const raw = fs.readFileSync(AUDIT_FILE, 'utf-8');
    return JSON.parse(raw) as AuditLogDocument[];
  }

  return [];
}
