/**
 * tests/currency.test.ts
 *
 * Unit tests for currency formatting and financial computations.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPaise,
  formatPaiseDecimal,
  formatCompact,
  formatPercent,
  computeExpectedRecoveryPaise,
} from '../src/lib/currency.js';

test('formatPaise formats integer paise to Indian Rupee strings with Indian grouping', () => {
  assert.equal(formatPaise(48235000), '₹4,82,350');
  assert.equal(formatPaise(840000), '₹8,400');
  assert.equal(formatPaise(0), '₹0');
  assert.equal(formatPaise(1000000000), '₹1,00,00,000');
});

test('formatPaiseDecimal formats with exact decimals', () => {
  assert.equal(formatPaiseDecimal(840050), '₹8,400.50');
  assert.equal(formatPaiseDecimal(100), '₹1.00');
});

test('formatCompact creates clean Indian compact representations', () => {
  assert.equal(formatCompact(48235000), '₹4.82L');
  assert.equal(formatCompact(1000000000), '₹1.00Cr');
  assert.equal(formatCompact(10000000000), '₹10.00Cr');
  assert.equal(formatCompact(500000), '₹5.0K');
});

test('formatPercent formats ratios consistently', () => {
  assert.equal(formatPercent(0.731), '73.1%');
  assert.equal(formatPercent(0.5, 0), '50%');
});

test('computeExpectedRecoveryPaise safely computes expected recovery without float errors', () => {
  assert.equal(computeExpectedRecoveryPaise(100000, 0.85), 85000);
  assert.equal(computeExpectedRecoveryPaise(100000, 1.5), 100000); // Clamped
  assert.equal(computeExpectedRecoveryPaise(100000, -0.5), 0); // Clamped
});
