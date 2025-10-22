/**
 * SmartShield Content Script
 * 
 * This content script runs on every web page and handles:
 * - DOM content extraction and analysis
 * - Local phishing detection
 * - Communication with background script
 * - Warning display and chatbot integration
 */

import { PhishingDetector } from '@/services/phishingDetector';
import { ContentExtractor } from '@/services/contentExtractor';
import { WarningDisplay } from '@/components/warningDisplay';
import { ChatbotWidget } from '@/components/chatbotWidget';
import { logger } from '@/utils/logger';
import { ConfigService } from '@/services/config';

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
      
      // Run local phishing detection
      const result = await PhishingDetector.analyzeContent(content);
      
      this.analysisResult = result;
      
      // Send result to background script
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_RESULT',
        payload: result
      });

      // Show warning if high risk
      if (result.score >= this.config.highThreshold) {
        await this.showWarning(result);
      }

      // Show chatbot widget if suspicious
      if (result.score >= this.config.lowThreshold) {
        await this.showChatbotWidget(result);
      }

      logger.info('Content analysis completed', {
        score: result.score,
        label: result.label,
        reasons: result.reasons.length
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
        this.warningDisplay.update(result);
        return;
      }

      this.warningDisplay = new WarningDisplay(result);
      await this.warningDisplay.show();

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
        this.chatbotWidget.update(result);
        return;
      }

      this.chatbotWidget = new ChatbotWidget(result);
      await this.chatbotWidget.show();

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
      sendResponse({ success: false, error: error.message });
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
