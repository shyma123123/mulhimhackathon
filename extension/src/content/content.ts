/**
 * SmartShield Content Script
 * 
 * This content script runs on every web page and handles:
 * - DOM content extraction and analysis
 * - Local phishing detection
 * - Communication with background script
 * - Warning display and chatbot integration
 */

import { PhishingDetector } from '../services/phishingDetector';
import { ContentExtractor } from '../services/contentExtractor';
import { WarningDisplay } from '../components/warningDisplay';
import { ChatbotWidget } from '../components/chatbotWidget';
import { logger } from '../utils/logger';
import { ConfigService } from '../services/config';

class SmartShieldContentScript {
  private isAnalyzing = false;
  private analysisResult: any = null;
  private warningDisplay: WarningDisplay | null = null;
  private chatbotWidget: ChatbotWidget | null = null;
  private config: any = null;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the content script
   */
  private async initialize(): Promise<void> {
    try {
      logger.info('SmartShield content script initializing', {
        url: window.location.href,
        domain: window.location.hostname
      });

      // Wait for page to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onPageReady());
      } else {
        this.onPageReady();
      }

      // Listen for messages from background script
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handleMessage(message, sender, sendResponse);
        return true; // Keep message channel open
      });

      // Listen for page changes (SPA navigation)
      this.observePageChanges();

    } catch (error) {
      logger.error('Failed to initialize content script', { error });
    }
  }

  /**
   * Handle page ready event
   */
  private async onPageReady(): Promise<void> {
    try {
      // Get configuration
      this.config = await this.getConfig();
      
      if (!this.config.enabled) {
        logger.info('SmartShield is disabled, skipping analysis');
        return;
      }

      // Skip analysis for certain page types
      if (this.shouldSkipAnalysis()) {
        logger.info('Skipping analysis for this page type');
        return;
      }

      // Wait a bit for page to fully load
      setTimeout(() => {
        this.startAnalysis();
      }, 1000);

    } catch (error) {
      logger.error('Failed to handle page ready', { error });
    }
  }

  /**
   * Check if analysis should be skipped for this page
   */
  private shouldSkipAnalysis(): boolean {
    const url = window.location.href;
    
    // Skip chrome:// and extension pages
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return true;
    }

    // Skip file:// URLs
    if (url.startsWith('file://')) {
      return true;
    }

    // Skip pages with specific content types
    const contentType = document.contentType;
    if (contentType && !contentType.includes('text/html')) {
      return true;
    }

    // Skip if page is too small (likely not a real page)
    if (document.body && document.body.scrollHeight < 100) {
      return true;
    }

    return false;
  }

  /**
   * Start content analysis
   */
  private async startAnalysis(): Promise<void> {
    if (this.isAnalyzing) {
      logger.debug('Analysis already in progress, skipping');
      return;
    }

    try {
      this.isAnalyzing = true;
      logger.info('Starting content analysis', { url: window.location.href });

      // Extract content from the page
      const content = await ContentExtractor.extractContent();
      
      // Run local phishing detection first
      const detector = new PhishingDetector();
      const localResult = await detector.analyzeContent(content);
      
      // If local analysis is uncertain, send to backend for Gemini analysis
      let finalResult = localResult;
      
      if (localResult.score >= 0.3 && localResult.score <= 0.7) {
        try {
          const backendResult = await this.sendToBackendForAnalysis(content);
          if (backendResult) {
            finalResult = backendResult;
          }
        } catch (error) {
          logger.warn('Backend analysis failed, using local result', { error });
        }
      }
      
      this.analysisResult = finalResult;
      
      // Send result to background script
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_RESULT',
        payload: {
          score: finalResult.score,
          label: finalResult.label,
          reasons: finalResult.reasons,
          url: window.location.href,
          timestamp: Date.now(),
          model: finalResult.model || 'local',
          provider: finalResult.provider || 'local'
        }
      });

      // Show warning if high risk
      if (finalResult.score >= this.config.highThreshold) {
        await this.showWarning(finalResult);
      }

      // Show chatbot widget if suspicious
      if (finalResult.score >= this.config.lowThreshold) {
        await this.showChatbotWidget(finalResult);
      }

      logger.info('Content analysis completed', {
        score: finalResult.score,
        label: finalResult.label,
        reasons: finalResult.reasons.length,
        model: finalResult.model || 'local',
        provider: finalResult.provider || 'local'
      });

    } catch (error) {
      logger.error('Failed to analyze content', { error });
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Show warning for high-risk content
   */
  private async showWarning(result: any): Promise<void> {
    try {
      if (this.warningDisplay) {
        this.warningDisplay.hide();
      }

      this.warningDisplay = new WarningDisplay();
      this.warningDisplay.show(
        result.score >= 0.8 ? 'high' : result.score >= 0.5 ? 'medium' : 'low',
        result.reasons || ['Suspicious content detected'],
        window.location.href
      );

      // Track warning shown
      chrome.runtime.sendMessage({
        type: 'ANALYTICS_EVENT',
        payload: {
          event: 'warning_shown',
          data: {
            score: result.score,
            url: window.location.href,
            domain: window.location.hostname
          }
        }
      });

    } catch (error) {
      logger.error('Failed to show warning', { error });
    }
  }

  /**
   * Show chatbot widget for suspicious content
   */
  private async showChatbotWidget(result: any): Promise<void> {
    try {
      if (this.chatbotWidget) {
        this.chatbotWidget.hide();
      }

      this.chatbotWidget = new ChatbotWidget();
      this.chatbotWidget.show();

    } catch (error) {
      logger.error('Failed to show chatbot widget', { error });
    }
  }

  /**
   * Handle messages from background script
   */
  private handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): void {
    try {
      logger.debug('Content script message received', { message });

      switch (message.type) {
        case 'START_ANALYSIS':
          this.startAnalysis();
          sendResponse({ success: true });
          break;

        case 'GET_ANALYSIS_RESULT':
          sendResponse({ result: this.analysisResult });
          break;

        case 'SHOW_WARNING':
          if (this.analysisResult) {
            this.showWarning(this.analysisResult);
          }
          sendResponse({ success: true });
          break;

        case 'HIDE_WARNING':
          this.hideWarning();
          sendResponse({ success: true });
          break;

        case 'TOGGLE_CHATBOT':
          this.toggleChatbot();
          sendResponse({ success: true });
          break;

        default:
          logger.warn('Unknown message type', { type: message.type });
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      logger.error('Failed to handle message', { error });
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  /**
   * Hide warning display
   */
  private hideWarning(): void {
    if (this.warningDisplay) {
      this.warningDisplay.hide();
    }
  }

  /**
   * Toggle chatbot widget
   */
  private toggleChatbot(): void {
    if (this.chatbotWidget) {
      this.chatbotWidget.toggle();
    } else if (this.analysisResult) {
      this.showChatbotWidget(this.analysisResult);
    }
  }

  /**
   * Observe page changes for SPA navigation
   */
  private observePageChanges(): void {
    // Listen for URL changes (SPA navigation)
    let currentUrl = window.location.href;
    
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        logger.info('Page navigation detected', { url: currentUrl });
        
        // Reset state for new page
        this.resetState();
        
        // Start analysis for new page
        setTimeout(() => {
          this.startAnalysis();
        }, 1000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also listen for popstate events
    window.addEventListener('popstate', () => {
      logger.info('Browser navigation detected', { url: window.location.href });
      this.resetState();
      setTimeout(() => {
        this.startAnalysis();
      }, 1000);
    });
  }

  /**
   * Send content to backend for Gemini analysis
   */
  private async sendToBackendForAnalysis(content: any): Promise<any> {
    try {
      const response = await fetch('http://localhost:4000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snapshot_hash: this.generateContentHash(content.text),
          sanitized_text: content.text.substring(0, 2000), // Limit content size
          metadata: {
            url: window.location.href,
            timestamp: Date.now(),
            domain: window.location.hostname,
            title: document.title
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const result = await response.json();
      
      logger.info('Backend analysis completed', {
        score: result.score,
        label: result.label,
        model: result.model,
        provider: result.provider
      });

      return {
        score: result.score,
        label: result.label,
        reasons: result.reasons || [],
        explanation: result.explain || '',
        confidence: result.confidence || 0.5,
        model: result.model,
        provider: result.provider
      };
    } catch (error) {
      logger.error('Backend analysis failed', { error });
      throw error;
    }
  }

  /**
   * Generate content hash for identification
   */
  private generateContentHash(text: string): string {
    // Simple hash function for content identification
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Reset state for new page
   */
  private resetState(): void {
    this.isAnalyzing = false;
    this.analysisResult = null;
    
    if (this.warningDisplay) {
      this.warningDisplay.hide();
      this.warningDisplay = null;
    }
    
    if (this.chatbotWidget) {
      this.chatbotWidget.hide();
      this.chatbotWidget = null;
    }
  }

  /**
   * Get configuration from background script
   */
  private async getConfig(): Promise<any> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
        if (chrome.runtime.lastError) {
          logger.error('Failed to get config', { error: chrome.runtime.lastError });
          resolve(this.getDefaultConfig());
        } else {
          resolve(response.config || this.getDefaultConfig());
        }
      });
    });
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): any {
    return {
      enabled: true,
      lowThreshold: 0.3,
      highThreshold: 0.7,
      reportThreshold: 0.8,
      privacyMode: true,
      notifications: true
    };
  }
}

// Initialize content script
const smartShield = new SmartShieldContentScript();

// Export for debugging
(window as any).smartShield = smartShield;
