/**
 * src/db/repository.ts
 *
 * Unified Data Access Repository for Salvo
 *
 * Supports dual-mode persistence:
 *  1. MongoDB Atlas when MONGODB_URI is provided.
 *  2. High-performance deterministic file-backed storage (data/*.json)
 *     when running in offline/local test environments.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  isMongoConfigured,
  getTransactionsCollection,
  getRecoveryActionsCollection,
  getAuditLogsCollection,
} from './mongo.js';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
} from '../types/index.js';

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
        // Create indexes for high query performance
        await col.createIndex({ transactionId: 1 }, { unique: true });
        await col.createIndex({ failureCategory: 1 });
        await col.createIndex({ status: 1 });
      }
      // Also write local mirror for instant evaluation runs
      fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
      return { count: transactions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(
        `[repository] MongoDB connection failed (${(err as Error).message}). Storing in local file data/transactions.json`
      );
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
        return docs.map((d) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...rest } = d as unknown as { _id?: unknown } & TransactionDocument;
          return rest as TransactionDocument;
        });
      }
    } catch (err) {
      console.warn(
        `[repository] MongoDB read failed (${(err as Error).message}). Falling back to local data/transactions.json`
      );
    }
  }

  if (fs.existsSync(TRANSACTIONS_FILE)) {
    const raw = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
    return JSON.parse(raw) as TransactionDocument[];
  }

  return [];
}

// ─────────────────────────────────────────────────────────────
// Recovery Actions Repository
// ─────────────────────────────────────────────────────────────

export async function saveRecoveryActions(
  actions: RecoveryActionDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  if (isMongoConfigured()) {
    try {
      const col = await getRecoveryActionsCollection();
      await col.deleteMany({});
      if (actions.length > 0) {
        await col.insertMany(actions);
        await col.createIndex({ actionId: 1 }, { unique: true });
        await col.createIndex({ transactionId: 1 });
      }
      fs.writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2), 'utf-8');
      return { count: actions.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save recovery actions failed: ${(err as Error).message}`);
    }
  }

  fs.writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2), 'utf-8');
  return { count: actions.length, source: 'file' };
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
// Audit Logs Repository
// ─────────────────────────────────────────────────────────────

export async function saveAuditLogs(
  logs: AuditLogDocument[]
): Promise<{ count: number; source: 'mongodb' | 'file' }> {
  ensureDataDir();

  if (isMongoConfigured()) {
    try {
      const col = await getAuditLogsCollection();
      await col.deleteMany({});
      if (logs.length > 0) {
        await col.insertMany(logs);
        await col.createIndex({ eventId: 1 }, { unique: true });
        await col.createIndex({ transactionId: 1 });
        await col.createIndex({ timestamp: -1 });
      }
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf-8');
      return { count: logs.length, source: 'mongodb' };
    } catch (err) {
      console.warn(`[repository] MongoDB save audit logs failed: ${(err as Error).message}`);
    }
  }

  fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  return { count: logs.length, source: 'file' };
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
