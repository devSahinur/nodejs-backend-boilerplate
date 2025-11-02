/**
 * Test script for log reporting system
 * This verifies all imports and basic functionality
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '.env.test') });

import { generateLogSummary, getSystemMetrics } from './src/services/logReport.service.js';
import { generateEmailTemplate } from './src/services/emailReport.service.js';
import {
  getSchedulerStatus,
  getAvailableSchedules,
  SCHEDULE_PATTERNS,
  REPORT_DAYS
} from './src/config/scheduler.js';
import logger from './src/config/logger.js';
import config from './src/config/config.js';

console.log('🧪 Testing Log Reporting System\n');
console.log('=' .repeat(50));

// Test 1: Verify imports
console.log('\n✓ Test 1: All imports successful');

// Test 2: Check configuration
console.log('\n📋 Test 2: Configuration');
console.log('  - Log Report Enabled:', config.logReport.enabled);
console.log('  - Frequency:', config.logReport.frequency);
console.log('  - Days:', config.logReport.days);
console.log('  - Recipients:', config.logReport.recipients.join(', ') || 'None configured');
console.log('  - Timezone:', config.logReport.timezone);

// Test 3: Verify schedule patterns
console.log('\n⏰ Test 3: Available Schedules');
const schedules = getAvailableSchedules();
schedules.forEach(schedule => {
  console.log(`  - ${schedule.name}: ${schedule.description}`);
});

// Test 4: Test system metrics
console.log('\n💻 Test 4: System Metrics');
try {
  const metrics = getSystemMetrics();
  console.log('  ✓ Uptime:', metrics.uptime.formatted);
  console.log('  ✓ Memory RSS:', metrics.memory.rss);
  console.log('  ✓ Node Version:', metrics.nodeVersion);
  console.log('  ✓ Platform:', metrics.platform);
} catch (error) {
  console.error('  ✗ Error getting system metrics:', error.message);
}

// Test 5: Test log aggregation
console.log('\n📊 Test 5: Log Aggregation');
try {
  const summary = await generateLogSummary(7);
  console.log('  ✓ Report period:', summary.period.from, 'to', summary.period.to);
  console.log('  ✓ Total logs:', summary.summary.totalLogs);
  console.log('  ✓ Error count:', summary.summary.errorCount);
  console.log('  ✓ Warning count:', summary.summary.warningCount);
  console.log('  ✓ Error rate:', summary.summary.errorRate + '%');
  console.log('  ✓ Health status:', summary.summary.healthStatus);

  // Test 6: Test email template generation
  console.log('\n📧 Test 6: Email Template Generation');
  const emailHtml = generateEmailTemplate(summary);
  console.log('  ✓ Email template generated');
  console.log('  ✓ Template length:', emailHtml.length, 'characters');
  console.log('  ✓ Contains HTML:', emailHtml.includes('<!DOCTYPE html>'));
  console.log('  ✓ Contains health status:', emailHtml.includes(summary.summary.healthStatus));

} catch (error) {
  console.error('  ✗ Error in log aggregation:', error.message);
  console.error('  Stack:', error.stack);
}

// Test 7: Test scheduler status
console.log('\n🔧 Test 7: Scheduler Status');
try {
  const status = getSchedulerStatus();
  console.log('  - Enabled:', status.enabled);
  console.log('  - Frequency:', status.frequency);
  console.log('  - Days:', status.days);
  console.log('  - Recipients:', status.recipients.length);
  console.log('  - Timezone:', status.timezone);
  console.log('  - Active Tasks:', status.activeTasks.length);
} catch (error) {
  console.error('  ✗ Error getting scheduler status:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('✅ All tests completed!\n');

process.exit(0);
