import moment from 'moment';
import { sendEmail } from './email.service.js';
import { generateLogSummary } from './logReport.service.js';
import logger from '../config/logger.js';
import config from '../config/config.js';

/**
 * Generate HTML email template for log report
 * @param {Object} data - Log summary data
 * @returns {string}
 */
const generateEmailTemplate = (data) => {
  const { period, summary, combined, system } = data;

  // Determine status color
  const statusColors = {
    HEALTHY: '#10b981',
    ATTENTION: '#f59e0b',
    WARNING: '#f97316',
    CRITICAL: '#ef4444',
  };

  const statusColor = statusColors[summary.healthStatus] || '#6b7280';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log Report - ${config.name || 'Application'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 20px;
      color: #1f2937;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 30px;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      color: white;
      background-color: ${statusColor};
      margin-bottom: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      text-align: center;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 5px 0;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .log-entry {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      font-size: 13px;
    }
    .log-entry.warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }
    .log-timestamp {
      color: #6b7280;
      font-size: 11px;
      margin-bottom: 5px;
    }
    .log-message {
      color: #1f2937;
      word-break: break-word;
    }
    .system-info {
      background-color: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 15px;
      font-size: 13px;
    }
    .system-info-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #e0f2fe;
    }
    .system-info-row:last-child {
      border-bottom: none;
    }
    .system-info-label {
      color: #0369a1;
      font-weight: 500;
    }
    .system-info-value {
      color: #1f2937;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .no-data {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-style: italic;
    }
    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 System Log Report</h1>
      <p>${config.name || 'Node.js Backend Boilerplate'}</p>
      <p>Period: ${period.from} to ${period.to} (${period.days} days)</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Health Status -->
      <div style="text-align: center;">
        <span class="status-badge">Status: ${summary.healthStatus}</span>
      </div>

      <!-- Statistics Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Logs</div>
          <div class="stat-value">${summary.totalLogs.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Errors</div>
          <div class="stat-value" style="color: #ef4444;">${summary.errorCount.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Warnings</div>
          <div class="stat-value" style="color: #f59e0b;">${summary.warningCount.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Error Rate</div>
          <div class="stat-value" style="font-size: 24px;">${summary.errorRate}%</div>
        </div>
      </div>

      <!-- Recent Errors -->
      ${
        combined.errors && combined.errors.length > 0
          ? `
      <div class="section">
        <div class="section-title">🚨 Recent Errors (Top ${Math.min(10, combined.errors.length)})</div>
        ${combined.errors
          .slice(0, 10)
          .map(
            (error) => `
        <div class="log-entry">
          <div class="log-timestamp">${moment(error.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div class="log-message">${error.message || 'No message'}</div>
          ${error.stack ? `<div style="margin-top: 5px; font-size: 11px; color: #991b1b; font-family: monospace;">${error.stack.substring(0, 200)}...</div>` : ''}
        </div>
        `
          )
          .join('')}
      </div>
      `
          : '<div class="section"><div class="no-data">✅ No errors in this period</div></div>'
      }

      <!-- Recent Warnings -->
      ${
        combined.warnings && combined.warnings.length > 0
          ? `
      <div class="section">
        <div class="section-title">⚠️ Recent Warnings (Top ${Math.min(10, combined.warnings.length)})</div>
        ${combined.warnings
          .slice(0, 10)
          .map(
            (warning) => `
        <div class="log-entry warning">
          <div class="log-timestamp">${moment(warning.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div class="log-message">${warning.message || 'No message'}</div>
        </div>
        `
          )
          .join('')}
      </div>
      `
          : ''
      }

      <!-- System Metrics -->
      <div class="section">
        <div class="section-title">💻 System Metrics</div>
        <div class="system-info">
          <div class="system-info-row">
            <span class="system-info-label">Uptime</span>
            <span class="system-info-value">${system.uptime.formatted}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Memory (RSS)</span>
            <span class="system-info-value">${system.memory.rss}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Memory (Heap Used)</span>
            <span class="system-info-value">${system.memory.heapUsed}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Node Version</span>
            <span class="system-info-value">${system.nodeVersion}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Platform</span>
            <span class="system-info-value">${system.platform}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Report Generated</span>
            <span class="system-info-value">${system.timestamp}</span>
          </div>
        </div>
      </div>

      <!-- Log Distribution -->
      <div class="section">
        <div class="section-title">📈 Log Distribution</div>
        <div class="system-info">
          <div class="system-info-row">
            <span class="system-info-label">Info</span>
            <span class="system-info-value">${combined.info.toLocaleString()}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">HTTP</span>
            <span class="system-info-value">${combined.http.toLocaleString()}</span>
          </div>
          <div class="system-info-row">
            <span class="system-info-label">Debug</span>
            <span class="system-info-value">${combined.debug.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated report from your application monitoring system.</p>
      <p>Generated on ${moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send log report email
 * @param {string} recipient - Email recipient
 * @param {number} days - Number of days to report
 * @returns {Promise<void>}
 */
const sendLogReport = async (recipient, days = 7) => {
  try {
    logger.info(`Generating log report for ${days} days`);

    // Generate log summary
    const logData = await generateLogSummary(days);

    // Generate email HTML
    const emailHTML = generateEmailTemplate(logData);

    // Determine subject based on health status
    const statusEmojis = {
      HEALTHY: '✅',
      ATTENTION: '⚠️',
      WARNING: '⚠️',
      CRITICAL: '🚨',
    };

    const subject = `${statusEmojis[logData.summary.healthStatus]} Log Report - ${logData.summary.healthStatus} - ${moment().format('YYYY-MM-DD')}`;

    // Send email
    await sendEmail(recipient, subject, emailHTML);

    logger.info(`Log report sent successfully to ${recipient}`);
  } catch (error) {
    logger.error(`Failed to send log report: ${error.message}`);
    throw error;
  }
};

/**
 * Send log report to multiple recipients
 * @param {string[]} recipients - Array of email recipients
 * @param {number} days - Number of days to report
 * @returns {Promise<void>}
 */
const sendBulkLogReports = async (recipients, days = 7) => {
  const results = await Promise.allSettled(recipients.map((recipient) => sendLogReport(recipient, days)));

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  logger.info(`Bulk log reports sent: ${successful} successful, ${failed} failed`);

  return { successful, failed, total: recipients.length };
};

export { sendLogReport, sendBulkLogReports, generateEmailTemplate };
