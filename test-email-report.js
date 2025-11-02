/**
 * Test script to generate email report with sample logs
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '.env.test') });

import { generateLogSummary } from './src/services/logReport.service.js';
import { generateEmailTemplate } from './src/services/emailReport.service.js';

console.log('📧 Testing Email Report Generation with Sample Logs\n');
console.log('='.repeat(60));

// Copy test log to actual log location
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const testLogPath = path.join(logsDir, 'test-combined.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

if (fs.existsSync(testLogPath)) {
  fs.copyFileSync(testLogPath, combinedLogPath);
  console.log('✓ Copied test logs to combined.log');
}

try {
  // Generate log summary
  console.log('\n📊 Generating Log Summary...');
  const summary = await generateLogSummary(7);

  console.log('\nLog Summary:');
  console.log('  - Period:', summary.period.from, 'to', summary.period.to);
  console.log('  - Total Logs:', summary.summary.totalLogs);
  console.log('  - Errors:', summary.summary.errorCount);
  console.log('  - Warnings:', summary.summary.warningCount);
  console.log('  - Error Rate:', summary.summary.errorRate + '%');
  console.log('  - Health Status:', summary.summary.healthStatus);

  // Generate email template
  console.log('\n📧 Generating Email Template...');
  const emailHtml = generateEmailTemplate(summary);

  // Save email HTML to file for preview
  const outputPath = path.join(__dirname, 'test-email-output.html');
  fs.writeFileSync(outputPath, emailHtml);

  console.log('\n✅ Email template generated successfully!');
  console.log('  - File saved to:', outputPath);
  console.log('  - Template size:', emailHtml.length, 'characters');
  console.log('\n💡 Open test-email-output.html in your browser to preview the email');

  // Show error details
  if (summary.combined.errors && summary.combined.errors.length > 0) {
    console.log('\n🚨 Errors Found (' + summary.combined.errors.length + ' total):');
    summary.combined.errors.slice(0, 3).forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.message}`);
      console.log(`     Time: ${error.timestamp}`);
    });
  }

  // Show warning details
  if (summary.combined.warnings && summary.combined.warnings.length > 0) {
    console.log('\n⚠️  Warnings Found (' + summary.combined.warnings.length + ' total):');
    summary.combined.warnings.slice(0, 3).forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning.message}`);
      console.log(`     Time: ${warning.timestamp}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test completed successfully!\n');

} catch (error) {
  console.error('\n❌ Error during test:', error.message);
  console.error(error.stack);
  process.exit(1);
}
