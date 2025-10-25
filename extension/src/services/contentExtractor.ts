/**
 * Content Extractor Service
 * 
 * Extracts and processes content from web pages for phishing analysis:
 * - DOM content extraction
 * - Form analysis
 * - Link extraction
 * - Email content detection
 * - Privacy-aware sanitization
 */

import { ContentData } from '../types/content';
import { logger } from '../utils/logger';
import { sanitizeContent } from '../utils/sanitization';

export interface FormData {
  action: string;
  method: string;
  inputs: Array<{
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
  }>;
}

export interface LinkData {
  href: string;
  text: string;
  title?: string;
  isExternal: boolean;
}

/**
 * Content extraction service
 */
export class ContentExtractor {
  private static instance: ContentExtractor;
  private config: any = {};

  constructor() {
    if (ContentExtractor.instance) {
      return ContentExtractor.instance;
    }
    ContentExtractor.instance = this;
  }

  /**
   * Extract all relevant content from the current page
   */
  static async extractContent(): Promise<ContentData> {
    const extractor = new ContentExtractor();
    return await extractor.extractPageContent();
  }

  /**
   * Extract content from the current page
   */
  async extractPageContent(): Promise<ContentData> {
    try {
      logger.info('Starting content extraction', {
        url: window.location.href,
        title: document.title
      });

      const content: ContentData = {
        url: window.location.href,
        title: document.title,
        text: '',
        forms: [],
        links: [],
        images: [],
        headers: [],
        timestamp: Date.now(),
        snapshotHash: ''
      };

      // Extract text content
      content.text = await this.extractTextContent();
      
      // Extract forms
      content.forms = this.extractForms();
      
      // Extract links
      content.links = this.extractLinks();
      
      // Extract images
      content.images = this.extractImages();
      
      // Extract headers and meta information
      content.headers = this.extractHeaders();
      
      // Generate snapshot hash
      content.snapshotHash = this.generateSnapshotHash(content);

      logger.info('Content extraction completed', {
        textLength: content.text.length,
        formsCount: content.forms.length,
        linksCount: content.links.length,
        imagesCount: content.images.length,
        snapshotHash: content.snapshotHash
      });

      return content;
    } catch (error) {
      logger.error('Failed to extract content', { error });
      throw error;
    }
  }

  /**
   * Extract text content from the page
   */
  private async extractTextContent(): Promise<string> {
    try {
      // Remove script and style elements
      const elementsToRemove = document.querySelectorAll('script, style, noscript, iframe');
      elementsToRemove.forEach(el => el.remove());

      // Get text content from main content areas
      const contentSelectors = [
        'main',
        '[role="main"]',
        'article',
        '.content',
        '.main-content',
        '#content',
        '#main',
        'body'
      ];

      let textContent = '';
      let mainElement: Element | null = null;

      // Find the main content element
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent && element.textContent.length > textContent.length) {
          mainElement = element;
          textContent = element.textContent;
        }
      }

      // If no main element found, use body
      if (!mainElement) {
        textContent = document.body.textContent || '';
      }

      // Clean up the text
      textContent = this.cleanTextContent(textContent);

      // Sanitize sensitive information if privacy mode is enabled
      if (this.config.privacyMode !== false) {
        textContent = sanitizeContent(textContent);
      }

      return textContent;
    } catch (error) {
      logger.error('Failed to extract text content', { error });
      return '';
    }
  }

  /**
   * Clean up extracted text content
   */
  private cleanTextContent(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()
      .substring(0, 50000); // Limit length to prevent memory issues
  }

  /**
   * Extract forms from the page
   */
  private extractForms(): FormData[] {
    try {
      const forms: FormData[] = [];
      const formElements = document.querySelectorAll('form');

      formElements.forEach(form => {
        const formData: FormData = {
          action: form.action || '',
          method: form.method.toLowerCase() || 'get',
          inputs: []
        };

        // Extract form inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          const element = input as HTMLInputElement;
          formData.inputs.push({
            type: element.type || 'text',
            name: element.name || '',
            placeholder: element.placeholder || undefined,
            required: element.required || false
          });
        });

        forms.push(formData);
      });

      return forms;
    } catch (error) {
      logger.error('Failed to extract forms', { error });
      return [];
    }
  }

  /**
   * Extract links from the page
   */
  private extractLinks(): LinkData[] {
    try {
      const links: LinkData[] = [];
      const linkElements = document.querySelectorAll('a[href]');

      linkElements.forEach(link => {
        const element = link as HTMLAnchorElement;
        const href = element.href;
        
        if (href && href !== '#') {
          const linkData: LinkData = {
            href: href,
            text: element.textContent?.trim() || '',
            title: element.title || undefined,
            isExternal: this.isExternalLink(href)
          };

          links.push(linkData);
        }
      });

      return links;
    } catch (error) {
      logger.error('Failed to extract links', { error });
      return [];
    }
  }

  /**
   * Extract images from the page
   */
  private extractImages(): Array<{ src: string; alt?: string; title?: string }> {
    try {
      const images: Array<{ src: string; alt?: string; title?: string }> = [];
      const imgElements = document.querySelectorAll('img[src]');

      imgElements.forEach(img => {
        const element = img as HTMLImageElement;
        if (element.src) {
          images.push({
            src: element.src,
            alt: element.alt || undefined,
            title: element.title || undefined
          });
        }
      });

      return images;
    } catch (error) {
      logger.error('Failed to extract images', { error });
      return [];
    }
  }

  /**
   * Extract headers and meta information
   */
  private extractHeaders(): string[] {
    try {
      const headers: string[] = [];
      
      // Extract meta tags
      const metaTags = document.querySelectorAll('meta');
      metaTags.forEach(meta => {
        const element = meta as HTMLMetaElement;
        if (element.name && element.content) {
          headers.push(`${element.name}: ${element.content}`);
        }
        if (element.getAttribute('property') && element.content) {
          headers.push(`${element.getAttribute('property')}: ${element.content}`);
        }
      });

      // Extract HTTP headers if available (for email content)
      const httpHeaders = this.extractHttpHeaders();
      headers.push(...httpHeaders);

      return headers;
    } catch (error) {
      logger.error('Failed to extract headers', { error });
      return [];
    }
  }

  /**
   * Extract HTTP headers (for email content)
   */
  private extractHttpHeaders(): string[] {
    try {
      // This would extract HTTP headers from email content
      // For web pages, we can check for specific patterns that might indicate email content
      const headers: string[] = [];
      
      // Check for email-like content patterns
      const emailPatterns = [
        /from:\s*(.+)/gi,
        /to:\s*(.+)/gi,
        /subject:\s*(.+)/gi,
        /date:\s*(.+)/gi,
        /reply-to:\s*(.+)/gi
      ];

      const textContent = document.body.textContent || '';
      
      emailPatterns.forEach(pattern => {
        const matches = textContent.match(pattern);
        if (matches) {
          headers.push(...matches);
        }
      });

      return headers;
    } catch (error) {
      logger.error('Failed to extract HTTP headers', { error });
      return [];
    }
  }

  /**
   * Check if a link is external
   */
  private isExternalLink(href: string): boolean {
    try {
      const linkUrl = new URL(href);
      const currentUrl = new URL(window.location.href);
      
      return linkUrl.hostname !== currentUrl.hostname;
    } catch {
      return false;
    }
  }

  /**
   * Generate snapshot hash for content
   */
  private generateSnapshotHash(content: ContentData): string {
    try {
      // Create a normalized version of the content for hashing
      const normalizedContent = {
        url: content.url,
        title: content.title,
        text: content.text.substring(0, 1000), // Use first 1000 chars for hash
        formsCount: content.forms.length,
        linksCount: content.links.length
      };

      const contentString = JSON.stringify(normalizedContent);
      
      // Simple hash function (in production, use crypto.subtle.digest)
      let hash = 0;
      for (let i = 0; i < contentString.length; i++) {
        const char = contentString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(36);
    } catch (error) {
      logger.error('Failed to generate snapshot hash', { error });
      return Date.now().toString(36);
    }
  }

  /**
   * Extract email content from the page
   */
  static async extractEmailContent(): Promise<ContentData | null> {
    try {
      // Check if this looks like an email page
      const isEmailPage = ContentExtractor.detectEmailPage();
      
      if (!isEmailPage) {
        return null;
      }

      const extractor = new ContentExtractor();
      const content = await extractor.extractPageContent();
      
      // Add email-specific extraction
      content.emailData = await extractor.extractEmailSpecificData();
      
      return content;
    } catch (error) {
      logger.error('Failed to extract email content', { error });
      return null;
    }
  }

  /**
   * Detect if the current page contains email content
   */
  private static detectEmailPage(): boolean {
    try {
      const indicators = [
        // Common email service domains
        /gmail\.com/i,
        /outlook\.com/i,
        /yahoo\.com/i,
        /hotmail\.com/i,
        
        // Email-like content patterns
        /from:\s*.+/i,
        /to:\s*.+/i,
        /subject:\s*.+/i,
        /date:\s*.+/i,
        
        // Email client indicators
        /mail/i,
        /inbox/i,
        /compose/i,
        /reply/i,
        /forward/i
      ];

      const url = window.location.href;
      const title = document.title;
      const content = document.body.textContent || '';

      return indicators.some(indicator => 
        indicator.test(url) || indicator.test(title) || indicator.test(content)
      );
    } catch (error) {
      logger.error('Failed to detect email page', { error });
      return false;
    }
  }

  /**
   * Extract email-specific data
   */
  private async extractEmailSpecificData(): Promise<any> {
    try {
      const emailData: any = {
        from: '',
        to: '',
        subject: '',
        date: '',
        replyTo: '',
        headers: []
      };

      // Extract email headers from content
      const content = document.body.textContent || '';
      
      // Extract from field
      const fromMatch = content.match(/from:\s*(.+)/i);
      if (fromMatch) {
        emailData.from = fromMatch[1].trim();
      }

      // Extract to field
      const toMatch = content.match(/to:\s*(.+)/i);
      if (toMatch) {
        emailData.to = toMatch[1].trim();
      }

      // Extract subject field
      const subjectMatch = content.match(/subject:\s*(.+)/i);
      if (subjectMatch) {
        emailData.subject = subjectMatch[1].trim();
      }

      // Extract date field
      const dateMatch = content.match(/date:\s*(.+)/i);
      if (dateMatch) {
        emailData.date = dateMatch[1].trim();
      }

      // Extract reply-to field
      const replyToMatch = content.match(/reply-to:\s*(.+)/i);
      if (replyToMatch) {
        emailData.replyTo = replyToMatch[1].trim();
      }

      return emailData;
    } catch (error) {
      logger.error('Failed to extract email-specific data', { error });
      return {};
    }
  }
}
