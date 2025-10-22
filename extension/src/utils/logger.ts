/**
 * Logger utility for SmartShield Extension
 * 
 * Provides structured logging with different levels and privacy-aware logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  source: string;
}

class Logger {
  private isEnabled = true;
  private logLevel: LogLevel = 'info';

  constructor() {
    // Enable debug logging in development
    if (process.env.NODE_ENV === 'development') {
      this.logLevel = 'debug';
    }
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.isEnabled || !this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      source: this.getSource()
    };

    // Console logging
    this.logToConsole(entry);

    // Send to background script for storage if needed
    if (level === 'error' || level === 'warn') {
      this.sendToBackground(entry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'email', 'phone'];
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      
      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }

    return data;
  }

  private getSource(): string {
    // Determine the source of the log (content script, background, popup, etc.)
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      return 'extension';
    }
    return 'unknown';
  }

  private logToConsole(entry: LogEntry): void {
    const formattedMessage = `[SmartShield ${entry.level.toUpperCase()}] ${entry.message}`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(formattedMessage, entry.data);
        break;
      case 'info':
        console.info(formattedMessage, entry.data);
        break;
      case 'warn':
        console.warn(formattedMessage, entry.data);
        break;
      case 'error':
        console.error(formattedMessage, entry.data);
        break;
    }
  }

  private sendToBackground(entry: LogEntry): void {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'LOG_ENTRY',
          payload: entry
        }).catch(() => {
          // Background script might not be ready, ignore
        });
      }
    } catch (error) {
      // Ignore errors when sending to background
    }
  }

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }
}

export const logger = new Logger();
