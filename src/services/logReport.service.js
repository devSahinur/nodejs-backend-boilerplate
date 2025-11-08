import fs from 'fs';
import path from 'path';
import moment from 'moment';
import logger from '../config/logger.js';

/**
 * Read log file and return its content
 * @param {string} logPath - Path to log file
 * @returns {Promise<string>}
 */
const readLogFile = async (logPath) => {
  try {
    if (!fs.existsSync(logPath)) {
      return '';
    }
    return fs.readFileSync(logPath, 'utf-8');
  } catch (error) {
    logger.error(`Error reading log file: ${error.message}`);
    return '';
  }
};

/**
 * Parse log entries and categorize by level
 * @param {string} logContent - Raw log content
 * @returns {Object}
 */
const parseLogContent = (logContent) => {
  const lines = logContent.split('\n').filter((line) => line.trim());

  const stats = {
    total: lines.length,
    error: 0,
    warn: 0,
    info: 0,
    http: 0,
    debug: 0,
    errors: [],
    warnings: [],
    recentLogs: [],
  };

  lines.forEach((line) => {
    try {
      // Try to parse as JSON (Winston format)
      const parsed = JSON.parse(line);
      const level = parsed.level?.toLowerCase();

      if (level === 'error') {
        stats.error += 1;
        if (stats.errors.length < 10) {
          stats.errors.push({
            timestamp: parsed.timestamp,
            message: parsed.message,
            stack: parsed.stack,
          });
        }
      } else if (level === 'warn') {
        stats.warn += 1;
        if (stats.warnings.length < 10) {
          stats.warnings.push({
            timestamp: parsed.timestamp,
            message: parsed.message,
          });
        }
      } else if (level === 'info') {
        stats.info += 1;
      } else if (level === 'http') {
        stats.http += 1;
      } else if (level === 'debug') {
        stats.debug += 1;
      }
    } catch (e) {
      // If not JSON, treat as plain text
      if (line.includes('error') || line.includes('ERROR')) {
        stats.error += 1;
      } else if (line.includes('warn') || line.includes('WARN')) {
        stats.warn += 1;
      } else {
        stats.info += 1;
      }
    }
  });

  return stats;
};

/**
 * Aggregate logs from specified date range
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>}
 */
const aggregateLogs = async (days = 7) => {
  const logsDir = path.join(process.cwd(), 'logs');
  const aggregatedStats = {
    period: {
      from: moment().subtract(days, 'days').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD'),
      days,
    },
    combined: {
      total: 0,
      error: 0,
      warn: 0,
      info: 0,
      http: 0,
      debug: 0,
      errors: [],
      warnings: [],
      recentLogs: [],
    },
    errorLog: null,
    combinedLog: null,
  };

  try {
    // Read error log
    const errorLogPath = path.join(logsDir, 'error.log');
    const errorContent = await readLogFile(errorLogPath);
    if (errorContent) {
      aggregatedStats.errorLog = parseLogContent(errorContent);
    }

    // Read combined log
    const combinedLogPath = path.join(logsDir, 'combined.log');
    const combinedContent = await readLogFile(combinedLogPath);
    if (combinedContent) {
      aggregatedStats.combinedLog = parseLogContent(combinedContent);
      aggregatedStats.combined = aggregatedStats.combinedLog;
    }

    return aggregatedStats;
  } catch (error) {
    logger.error(`Error aggregating logs: ${error.message}`);
    throw error;
  }
};

/**
 * Get system health metrics
 * @returns {Object}
 */
const getSystemMetrics = () => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return {
    uptime: {
      seconds: uptime,
      formatted: moment.duration(uptime, 'seconds').humanize(),
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
    },
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
  };
};

/**
 * Generate summary statistics for email
 * @param {number} days - Number of days to report
 * @returns {Promise<Object>}
 */
const generateLogSummary = async (days = 7) => {
  const logs = await aggregateLogs(days);
  const metrics = getSystemMetrics();

  return {
    ...logs,
    system: metrics,
    summary: {
      totalLogs: logs.combined.total,
      errorCount: logs.combined.error,
      warningCount: logs.combined.warn,
      errorRate: logs.combined.total > 0 ? ((logs.combined.error / logs.combined.total) * 100).toFixed(2) : 0,
      healthStatus: (() => {
        if (logs.combined.error > 100) return 'CRITICAL';
        if (logs.combined.error > 50) return 'WARNING';
        if (logs.combined.error > 10) return 'ATTENTION';
        return 'HEALTHY';
      })(),
    },
  };
};

export { aggregateLogs, generateLogSummary, getSystemMetrics, parseLogContent };
