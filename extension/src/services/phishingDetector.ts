/**
 * Phishing Detector Service
 * 
 * Provides local phishing detection capabilities for the Chrome extension:
 * - URL analysis and domain reputation
 * - Content pattern matching
 * - Email header analysis
 * - Social engineering indicators
 * - Lightweight ML-based scoring
 */

import { ContentData } from '@/types/content';
import { logger } from '@/utils/logger';
import { generateHash, sanitizeContent } from '@/utils/sanitization';

export interface DetectionResult {
  score: number; // 0-1, where 1 is definitely phishing
  label: 'clean' | 'suspicious' | 'phishing';
  reasons: string[];
  confidence: number;
  localAnalysis: boolean;
  requiresCloudAnalysis: boolean;
  metadata: {
    urlScore?: number;
    contentScore?: number;
    headerScore?: number;
    socialEngineeringScore?: number;
  };
}

export interface PhishingRule {
  name: string;
  description: string;
  weight: number;
  check: (content: ContentData) => { matches: boolean; score: number; reason?: string };
}

/**
 * Local phishing detection service
 */
export class PhishingDetector {
  private rules: PhishingRule[] = [];
  private config: any = {};

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialize detection rules
   */
  private initializeRules(): void {
    // URL-based rules
    this.rules.push({
      name: 'suspicious_domain',
      description: 'Check for suspicious or newly registered domains',
      weight: 0.3,
      check: this.checkSuspiciousDomain
    });

    this.rules.push({
      name: 'url_shortener',
      description: 'Detect URL shorteners that may hide malicious links',
      weight: 0.2,
      check: this.checkUrlShortener
    });

    this.rules.push({
      name: 'subdomain_spoofing',
      description: 'Detect subdomain spoofing attempts',
      weight: 0.4,
      check: this.checkSubdomainSpoofing
    });

    this.rules.push({
      name: 'ip_address_url',
      description: 'Detect direct IP address URLs',
      weight: 0.3,
      check: this.checkIpAddressUrl
    });

    // Content-based rules
    this.rules.push({
      name: 'urgent_language',
      description: 'Detect urgent or threatening language',
      weight: 0.3,
      check: this.checkUrgentLanguage
    });

    this.rules.push({
      name: 'sensitive_info_request',
      description: 'Detect requests for sensitive information',
      weight: 0.5,
      check: this.checkSensitiveInfoRequest
    });

    this.rules.push({
      name: 'poor_grammar_spelling',
      description: 'Detect poor grammar and spelling',
      weight: 0.2,
      check: this.checkPoorGrammar
    });

    this.rules.push({
      name: 'impersonation_indicators',
      description: 'Detect brand impersonation attempts',
      weight: 0.4,
      check: this.checkImpersonation
    });

    this.rules.push({
      name: 'suspicious_attachments',
      description: 'Detect suspicious file attachments',
      weight: 0.3,
      check: this.checkSuspiciousAttachments
    });

    // Email-specific rules
    this.rules.push({
      name: 'suspicious_headers',
      description: 'Analyze email headers for spoofing indicators',
      weight: 0.3,
      check: this.checkSuspiciousHeaders
    });

    this.rules.push({
      name: 'reply_to_mismatch',
      description: 'Check for reply-to address mismatches',
      weight: 0.2,
      check: this.checkReplyToMismatch
    });

    logger.info(`Initialized ${this.rules.length} phishing detection rules`);
  }

  /**
   * Analyze content for phishing indicators
   */
  async analyzeContent(content: ContentData): Promise<DetectionResult> {
    const startTime = Date.now();
    
    try {
      logger.info('Starting phishing detection', {
        url: content.url,
        contentLength: content.text.length,
        hasForms: content.forms.length > 0,
        hasLinks: content.links.length > 0
      });

      // Run local analysis
      const localResult = this.runLocalAnalysis(content);
      
      // Determine if cloud analysis is needed
      const requiresCloudAnalysis = this.shouldUseCloudAnalysis(localResult);
      
      // For now, we only do local analysis in the extension
      // Cloud analysis would be handled by the background script
      const finalResult = {
        ...localResult,
        requiresCloudAnalysis,
        localAnalysis: true
      };

      const duration = Date.now() - startTime;
      logger.info('Phishing detection completed', {
        score: finalResult.score,
        label: finalResult.label,
        duration: `${duration}ms`,
        reasons: finalResult.reasons.length
      });

      return finalResult;
    } catch (error) {
      logger.error('Phishing detection failed', { error });
      
      // Return safe fallback
      return {
        score: 0.5,
        label: 'suspicious',
        reasons: ['Detection analysis failed'],
        confidence: 0.1,
        localAnalysis: true,
        requiresCloudAnalysis: false,
        metadata: {}
      };
    }
  }

  /**
   * Run local heuristic analysis
   */
  private runLocalAnalysis(content: ContentData): DetectionResult {
    let totalScore = 0;
    let totalWeight = 0;
    const reasons: string[] = [];
    const metadata: DetectionResult['metadata'] = {};

    // Run each rule
    for (const rule of this.rules) {
      try {
        const result = rule.check(content);
        if (result.matches) {
          const weightedScore = result.score * rule.weight;
          totalScore += weightedScore;
          totalWeight += rule.weight;
          
          if (result.reason) {
            reasons.push(result.reason);
          }

          // Categorize scores for metadata
          this.categorizeScore(rule.name, result.score, metadata);
        }
      } catch (error) {
        logger.warn(`Rule ${rule.name} failed:`, error);
      }
    }

    // Calculate final score
    const finalScore = totalWeight > 0 ? Math.min(1, totalScore / totalWeight) : 0;
    
    // Determine label based on thresholds
    let label: 'clean' | 'suspicious' | 'phishing';
    if (finalScore >= 0.8) {
      label = 'phishing';
    } else if (finalScore >= 0.5) {
      label = 'suspicious';
    } else {
      label = 'clean';
    }

    // Calculate confidence based on number of matching rules
    const confidence = Math.min(0.9, 0.3 + (reasons.length * 0.1));

    return {
      score: finalScore,
      label,
      reasons,
      confidence,
      localAnalysis: true,
      requiresCloudAnalysis: false,
      metadata
    };
  }

  /**
   * Determine if cloud analysis should be used
   */
  private shouldUseCloudAnalysis(result: DetectionResult): boolean {
    // Use cloud analysis if score is in uncertain range
    return (
      result.score >= 0.3 &&
      result.score <= 0.7 &&
      result.confidence < 0.7
    );
  }

  /**
   * Categorize scores by rule type
   */
  private categorizeScore(ruleName: string, score: number, metadata: DetectionResult['metadata']): void {
    if (ruleName.includes('url') || ruleName.includes('domain')) {
      metadata.urlScore = (metadata.urlScore || 0) + score;
    } else if (ruleName.includes('content') || ruleName.includes('language') || ruleName.includes('grammar')) {
      metadata.contentScore = (metadata.contentScore || 0) + score;
    } else if (ruleName.includes('header') || ruleName.includes('email')) {
      metadata.headerScore = (metadata.headerScore || 0) + score;
    } else {
      metadata.socialEngineeringScore = (metadata.socialEngineeringScore || 0) + score;
    }
  }

  // Rule implementations
  private checkSuspiciousDomain = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const url = content.url;
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check for suspicious TLDs
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download', '.exe'];
      const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
      
      if (hasSuspiciousTld) {
        return { matches: true, score: 0.8, reason: `Suspicious top-level domain: ${domain}` };
      }

      // Check for typosquatting patterns
      const commonDomains = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com'];
      const isTyposquatting = commonDomains.some(common => {
        const distance = this.levenshteinDistance(domain, common);
        return distance <= 2 && distance > 0;
      });

      if (isTyposquatting) {
        return { matches: true, score: 0.9, reason: `Potential typosquatting: ${domain}` };
      }

      return { matches: false, score: 0 };
    } catch {
      return { matches: true, score: 0.6, reason: 'Invalid URL format' };
    }
  };

  private checkUrlShortener = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const url = content.url;
    
    const shorteners = [
      'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
      'short.link', 'cutt.ly', 'rebrand.ly', 'linktr.ee'
    ];

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      const isShortener = shorteners.some(shortener => domain.includes(shortener));
      if (isShortener) {
        return { matches: true, score: 0.3, reason: `URL shortener detected: ${domain}` };
      }

      return { matches: false, score: 0 };
    } catch {
      return { matches: false, score: 0 };
    }
  };

  private checkSubdomainSpoofing = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const url = content.url;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check for suspicious subdomain patterns
      const suspiciousPatterns = [
        /security-/, /verify-/, /account-/, /login-/, /support-/,
        /microsoft-/, /google-/, /apple-/, /amazon-/, /paypal-/
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(hostname)) {
          return { matches: true, score: 0.7, reason: `Suspicious subdomain pattern: ${hostname}` };
        }
      }

      return { matches: false, score: 0 };
    } catch {
      return { matches: false, score: 0 };
    }
  };

  private checkIpAddressUrl = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const url = content.url;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Check if hostname is an IP address
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(hostname)) {
        return { matches: true, score: 0.6, reason: `Direct IP address URL: ${hostname}` };
      }

      return { matches: false, score: 0 };
    } catch {
      return { matches: false, score: 0 };
    }
  };

  private checkUrgentLanguage = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const text = content.text.toLowerCase();
    
    const urgentPhrases = [
      'urgent', 'immediate action required', 'act now', 'limited time',
      'expires soon', 'last chance', 'final notice', 'account suspended',
      'verify immediately', 'confirm now', 'security alert', 'unauthorized access'
    ];

    const matches = urgentPhrases.filter(phrase => text.includes(phrase));
    
    if (matches.length > 0) {
      return { 
        matches: true, 
        score: Math.min(0.8, matches.length * 0.2), 
        reason: `Urgent language detected: ${matches.join(', ')}` 
      };
    }

    return { matches: false, score: 0 };
  };

  private checkSensitiveInfoRequest = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const text = content.text.toLowerCase();
    
    const sensitivePhrases = [
      'password', 'credit card', 'social security', 'ssn', 'bank account',
      'routing number', 'pin', 'cvv', 'security code', 'login credentials',
      'username', 'account number', 'date of birth', 'mother maiden name'
    ];

    const matches = sensitivePhrases.filter(phrase => text.includes(phrase));
    
    if (matches.length > 0) {
      return { 
        matches: true, 
        score: Math.min(0.9, matches.length * 0.3), 
        reason: `Request for sensitive information: ${matches.join(', ')}` 
      };
    }

    return { matches: false, score: 0 };
  };

  private checkPoorGrammar = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const text = content.text;
    
    // Simple grammar checks
    const grammarErrors = [
      /youre\b/g, // missing apostrophe
      /dont\b/g,  // missing apostrophe
      /wont\b/g,  // missing apostrophe
      /cant\b/g,  // missing apostrophe
      /\b([A-Z][a-z]+)\s+\1\b/g, // repeated words
    ];

    let errorCount = 0;
    for (const pattern of grammarErrors) {
      const matches = text.match(pattern);
      if (matches) {
        errorCount += matches.length;
      }
    }

    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.3) {
      errorCount += 3;
    }

    if (errorCount > 2) {
      return { matches: true, score: Math.min(0.4, errorCount * 0.1), reason: `Poor grammar/spelling detected` };
    }

    return { matches: false, score: 0 };
  };

  private checkImpersonation = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const brands = [
      'microsoft', 'google', 'apple', 'amazon', 'paypal', 'netflix',
      'facebook', 'instagram', 'twitter', 'linkedin', 'dropbox'
    ];

    const text = content.text.toLowerCase();
    const url = content.url.toLowerCase();
    
    const brandMatches = brands.filter(brand => text.includes(brand));
    
    if (brandMatches.length > 0) {
      // Check if URL domain doesn't match the brand
      const brandInUrl = brandMatches.some(brand => url.includes(brand));
      if (!brandInUrl) {
        return { 
          matches: true, 
          score: 0.8, 
          reason: `Brand impersonation detected: ${brandMatches.join(', ')}` 
        };
      }
    }

    return { matches: false, score: 0 };
  };

  private checkSuspiciousAttachments = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    const suspiciousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js'];
    const text = content.text.toLowerCase();
    
    const matches = suspiciousExtensions.filter(ext => text.includes(ext));
    
    if (matches.length > 0) {
      return { 
        matches: true, 
        score: 0.9, 
        reason: `Suspicious file attachments: ${matches.join(', ')}` 
      };
    }

    return { matches: false, score: 0 };
  };

  private checkSuspiciousHeaders = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    // This would analyze email headers if available
    // For web pages, we can check for suspicious meta tags or headers
    
    const suspiciousHeaders = [
      'x-priority: 1',
      'x-msmail-priority: high',
      'x-mailer:',
      'x-originating-ip:'
    ];

    const headerString = content.headers.join('\n').toLowerCase();
    const matches = suspiciousHeaders.filter(header => headerString.includes(header));
    
    if (matches.length > 0) {
      return { 
        matches: true, 
        score: 0.4, 
        reason: `Suspicious headers: ${matches.join(', ')}` 
      };
    }

    return { matches: false, score: 0 };
  };

  private checkReplyToMismatch = (content: ContentData): { matches: boolean; score: number; reason?: string } => {
    // This would check email reply-to headers
    // For web pages, this is not applicable
    return { matches: false, score: 0 };
  };

  /**
   * Calculate Levenshtein distance for typosquatting detection
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// Export singleton instance
export const phishingDetector = new PhishingDetector();
