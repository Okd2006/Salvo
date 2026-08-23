/**
 * src/db/mongo.ts
 *
 * MongoDB Atlas Connection Abstraction for Salvo
 *
 * Provides connection pooling, lazy client instantiation, typed collection helpers,
 * and graceful fallback/check capabilities.
 */

import { MongoClient, type Db, type Collection } from 'mongodb';
import type {
  TransactionDocument,
  RecoveryActionDocument,
  AuditLogDocument,
} from '../types/index.js';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Check whether a valid MongoDB URI is provided in the environment.
 */
export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.trim() !== '' && !uri.includes('<username>'));
}

/**
 * Retrieve the active MongoClient instance, initializing it if necessary.
 */
export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<username>')) {
    throw new Error(
      'MONGODB_URI is not configured in .env. Please set a valid MongoDB Atlas connection string.'
    );
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  return cachedClient;
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
 * Typed helper for the `transactions` collection.
 */
export async function getTransactionsCollection(): Promise<Collection<TransactionDocument>> {
  const db = await getDb();
  return db.collection<TransactionDocument>('transactions');
}

/**
 * Typed helper for the `recovery_actions` collection.
 */
export async function getRecoveryActionsCollection(): Promise<Collection<RecoveryActionDocument>> {
  const db = await getDb();
  return db.collection<RecoveryActionDocument>('recovery_actions');
}

/**
 * Typed helper for the `audit_logs` collection.
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
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
