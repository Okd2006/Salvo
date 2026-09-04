/**
 * src/db/mongo.ts
 *
 * MongoDB Atlas Connection Abstraction for Salvo
 *
 * Provides connection pooling, lazy client instantiation, typed collection helpers,
 * and graceful circuit-breaker fallback for deterministic offline execution.
 */

import { MongoClient, type Db, type Collection } from 'mongodb';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
} from '../types/index.js';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let mongoFailureCooldownUntil = 0;
const MONGO_COOLDOWN_MS = 60_000; // 1 minute circuit breaker cooldown on connection failure

/**
 * Check whether a valid MongoDB URI is provided in the environment.
 */
export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.trim() !== '' && !uri.includes('<') && !uri.includes('>'));
}

/**
 * Check whether MongoDB is configured AND currently healthy (circuit breaker open).
 */
export function isMongoAvailable(): boolean {
  if (!isMongoConfigured()) return false;
  if (Date.now() < mongoFailureCooldownUntil) return false;
  return true;
}

/**
 * Retrieve the active MongoClient instance, initializing it if necessary.
 */
export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<') || uri.includes('>')) {
    throw new Error(
      'MONGODB_URI is not configured in .env. Please set a valid MongoDB Atlas connection string.'
    );
  }

  if (Date.now() < mongoFailureCooldownUntil) {
    throw new Error('MongoDB is temporarily in failure cooldown. Using local repository.');
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 2000,
    connectTimeoutMS: 2500,
    socketTimeoutMS: 5000,
  });

  try {
    await client.connect();
    cachedClient = client;
    mongoFailureCooldownUntil = 0;
    return cachedClient;
  } catch (err) {
    mongoFailureCooldownUntil = Date.now() + MONGO_COOLDOWN_MS;
    try { await client.close(); } catch { /* ignore cleanup error */ }
    throw err;
  }
}

/**
 * Retrieve the active MongoDB database instance.
 */
export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME || 'salvo';
  cachedDb = client.db(dbName);
  return cachedDb;
}

/**
 * Typed helper for the \	ransactions\ collection.
 */
export async function getTransactionsCollection(): Promise<Collection<TransactionDocument>> {
  const db = await getDb();
  return db.collection<TransactionDocument>('transactions');
}

/**
 * Typed helper for the ecovery_actions\ collection.
 */
export async function getRecoveryActionsCollection(): Promise<Collection<RecoveryActionDocument>> {
  const db = await getDb();
  return db.collection<RecoveryActionDocument>('recovery_actions');
}

/**
 * Typed helper for the \udit_logs\ collection.
 */
export async function getAuditLogsCollection(): Promise<Collection<AuditLogDocument>> {
  const db = await getDb();
  return db.collection<AuditLogDocument>('audit_logs');
}

/**
 * Close MongoDB connection gracefully.
 */
export async function closeMongoClient(): Promise<void> {
  if (cachedClient) {
    try {
      await cachedClient.close();
    } catch {
      // ignore
    } finally {
      cachedClient = null;
      cachedDb = null;
    }
  }
}
