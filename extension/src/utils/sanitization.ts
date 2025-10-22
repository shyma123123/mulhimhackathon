/**
 * Sanitization utilities for SmartShield Extension
 * 
 * Provides privacy-aware data sanitization and hashing
 */

/**
 * Sanitize text content by removing or replacing PII
 */
export function sanitizeContent(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  // Email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');

  // Phone numbers
  sanitized = sanitized.replace(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g, '[PHONE_REDACTED]');
  sanitized = sanitized.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[PHONE_REDACTED]');

  // Credit card numbers
  sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_REDACTED]');
  sanitized = sanitized.replace(/\b\d{13,19}\b/g, '[CARD_REDACTED]');

  // SSN
  sanitized = sanitized.replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '[SSN_REDACTED]');

  // Bank account numbers
  sanitized = sanitized.replace(/\b\d{8,17}\b/g, (match) => {
    return match.length >= 8 && match.length <= 17 ? '[ACCOUNT_REDACTED]' : match;
  });

  // IP addresses
  sanitized = sanitized.replace(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, '[IP_REDACTED]');

  return sanitized;
}

/**
 * Generate a simple hash for content tracking
 */
export function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if content contains sensitive information
 */
export function containsSensitiveInfo(text: string): boolean {
  if (!text) return false;

  const sensitivePatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
    /\b\d{3}-?\d{2}-?\d{4}\b/,
    /\b\d{8,17}\b/
  ];

  return sensitivePatterns.some(pattern => pattern.test(text));
}
