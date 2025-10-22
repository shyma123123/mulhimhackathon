/**
 * SmartShield Background Service Worker
 * 
 * This is the main service worker for the SmartShield Chrome extension.
 * It handles:
 * - Tab updates and content analysis requests
 * - Communication between content scripts and popup
 * - Storage management
 * - Analytics tracking
 * - Extension lifecycle events
 */

import { StorageService } from '@/services/storage';
import { AnalyticsService } from '@/services/analytics';
import { PhishingDetector } from '@/services/phishingDetector';
import { ConfigService } from '@/services/config';
import { logger } from '@/utils/logger';

// Extension lifecycle
chrome.runtime.onInstalled.addListener(async (details) => {
  logger.info('SmartShield extension installed/updated', { details });
  
  if (details.reason === 'install') {
    // First time installation
    await initializeExtension();
    await AnalyticsService.trackEvent('extension_install', {
      version: chrome.runtime.getManifest().version
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html') + '?welcome=true'
    });
  } else if (details.reason === 'update') {
    // Extension updated
    await handleExtensionUpdate(details.previousVersion);
    await AnalyticsService.trackEvent('extension_update', {
      from_version: details.previousVersion,
      to_version: chrome.runtime.getManifest().version
    });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  logger.info('SmartShield extension startup');
  await AnalyticsService.trackEvent('extension_startup');
});

// Tab management
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    logger.debug('Tab updated', { tabId, url: tab.url });
    
    // Skip chrome:// and extension pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }
    
    // Initialize analysis for the tab
    await initializeTabAnalysis(tabId, tab);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  logger.debug('Tab activated', { tabId: activeInfo.tabId });
  
  // Update badge for active tab
  await updateBadgeForTab(activeInfo.tabId);
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep message channel open for async response
});

// Storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  logger.debug('Storage changed', { namespace, changes });
  handleStorageChange(changes, namespace);
});

// Alarm handling for periodic tasks
chrome.alarms.onAlarm.addListener(async (alarm) => {
  logger.debug('Alarm triggered', { alarm });
  
  switch (alarm.name) {
    case 'analytics_sync':
      await AnalyticsService.syncPendingEvents();
      break;
    case 'cleanup_old_data':
      await cleanupOldData();
      break;
    case 'update_phishing_rules':
      await updatePhishingRules();
      break;
  }
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenus();
});

/**
 * Initialize extension on first install
 */
async function initializeExtension(): Promise<void> {
  try {
    // Set default configuration
    await ConfigService.setDefaults();
    
    // Initialize storage
    await StorageService.initialize();
    
    // Set up alarms for periodic tasks
    setupAlarms();
    
    logger.info('Extension initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize extension', { error });
  }
}

/**
 * Handle extension update
 */
async function handleExtensionUpdate(previousVersion: string): Promise<void> {
  try {
    logger.info('Handling extension update', { previousVersion });
    
    // Migrate settings if needed
    await migrateSettings(previousVersion);
    
    // Update phishing detection rules
    await updatePhishingRules();
    
    logger.info('Extension update completed');
  } catch (error) {
    logger.error('Failed to handle extension update', { error });
  }
}

/**
 * Initialize analysis for a tab
 */
async function initializeTabAnalysis(tabId: number, tab: chrome.tabs.Tab): Promise<void> {
  try {
    if (!tab.url || !tab.id) return;
    
    // Check if analysis is enabled
    const config = await ConfigService.getConfig();
    if (!config.enabled) {
      return;
    }
    
    // Send message to content script to start analysis
    chrome.tabs.sendMessage(tabId, {
      type: 'START_ANALYSIS',
      payload: {
        url: tab.url,
        timestamp: Date.now()
      }
    }).catch((error) => {
      // Content script might not be ready yet, this is normal
      logger.debug('Content script not ready', { tabId, error });
    });
    
  } catch (error) {
    logger.error('Failed to initialize tab analysis', { tabId, error });
  }
}

/**
 * Update badge for a specific tab
 */
async function updateBadgeForTab(tabId: number): Promise<void> {
  try {
    const result = await StorageService.get(`tab_${tabId}_status`);
    
    if (result) {
      const status = result as any;
      
      if (status.score >= 0.8) {
        // High risk - red badge
        chrome.action.setBadgeText({ text: '!', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#dc3545', tabId });
      } else if (status.score >= 0.5) {
        // Medium risk - yellow badge
        chrome.action.setBadgeText({ text: '?', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#ffc107', tabId });
      } else {
        // Low risk or clean - no badge
        chrome.action.setBadgeText({ text: '', tabId });
      }
    } else {
      // No analysis yet - gray badge
      chrome.action.setBadgeText({ text: '•', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#6c757d', tabId });
    }
  } catch (error) {
    logger.error('Failed to update badge', { tabId, error });
  }
}

/**
 * Handle messages from content scripts and popup
 */
async function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): Promise<void> {
  try {
    logger.debug('Message received', { message, sender });
    
    switch (message.type) {
      case 'ANALYSIS_RESULT':
        await handleAnalysisResult(message.payload, sender.tab);
        sendResponse({ success: true });
        break;
        
      case 'SHOW_WARNING':
        await handleShowWarning(message.payload, sender.tab);
        sendResponse({ success: true });
        break;
        
      case 'GET_TAB_STATUS':
        const status = await getTabStatus(sender.tab?.id);
        sendResponse({ status });
        break;
        
      case 'GET_CONFIG':
        const config = await ConfigService.getConfig();
        sendResponse({ config });
        break;
        
      case 'UPDATE_CONFIG':
        await ConfigService.updateConfig(message.payload);
        sendResponse({ success: true });
        break;
        
      case 'ANALYTICS_EVENT':
        await AnalyticsService.trackEvent(message.payload.event, message.payload.data);
        sendResponse({ success: true });
        break;
        
      case 'OPEN_CHATBOT':
        await openChatbot(message.payload, sender.tab);
        sendResponse({ success: true });
        break;
        
      case 'GET_STATS':
        const stats = await getExtensionStats();
        sendResponse({ stats });
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
 * Handle analysis results from content script
 */
async function handleAnalysisResult(payload: any, tab?: chrome.tabs.Tab): Promise<void> {
  try {
    if (!tab?.id) return;
    
    const { score, label, reasons, snapshotHash } = payload;
    
    // Store analysis result
    await StorageService.set(`tab_${tab.id}_status`, {
      score,
      label,
      reasons,
      snapshotHash,
      timestamp: Date.now(),
      url: tab.url
    });
    
    // Update badge
    await updateBadgeForTab(tab.id);
    
    // Track analytics
    await AnalyticsService.trackEvent('scan', {
      score,
      label,
      url: tab.url,
      domain: new URL(tab.url).hostname,
      reasons_count: reasons.length
    });
    
    // Show warning if high risk
    if (score >= 0.8) {
      await showWarningNotification(tab, score, reasons);
    }
    
    logger.info('Analysis result processed', { tabId: tab.id, score, label });
  } catch (error) {
    logger.error('Failed to handle analysis result', { error });
  }
}

/**
 * Handle show warning request
 */
async function handleShowWarning(payload: any, tab?: chrome.tabs.Tab): Promise<void> {
  try {
    if (!tab?.id) return;
    
    const { score, reasons, snapshotHash } = payload;
    
    // Open warning popup
    const warningUrl = chrome.runtime.getURL(`warning.html?tabId=${tab.id}&score=${score}&hash=${snapshotHash}`);
    
    await chrome.windows.create({
      url: warningUrl,
      type: 'popup',
      width: 400,
      height: 500,
      focused: true
    });
    
    // Track warning shown
    await AnalyticsService.trackEvent('warning_shown', {
      score,
      url: tab.url,
      domain: new URL(tab.url).hostname
    });
    
  } catch (error) {
    logger.error('Failed to show warning', { error });
  }
}

/**
 * Get status for a specific tab
 */
async function getTabStatus(tabId?: number): Promise<any> {
  if (!tabId) return null;
  
  try {
    return await StorageService.get(`tab_${tabId}_status`);
  } catch (error) {
    logger.error('Failed to get tab status', { tabId, error });
    return null;
  }
}

/**
 * Open chatbot for a specific analysis
 */
async function openChatbot(payload: any, tab?: chrome.tabs.Tab): Promise<void> {
  try {
    if (!tab?.id) return;
    
    const { snapshotHash, score, reasons } = payload;
    
    // Open chatbot popup
    const chatbotUrl = chrome.runtime.getURL(`chatbot.html?tabId=${tab.id}&hash=${snapshotHash}&score=${score}`);
    
    await chrome.windows.create({
      url: chatbotUrl,
      type: 'popup',
      width: 350,
      height: 600,
      focused: true
    });
    
    // Track chatbot interaction
    await AnalyticsService.trackEvent('chatbot_opened', {
      score,
      url: tab.url,
      snapshot_hash: snapshotHash
    });
    
  } catch (error) {
    logger.error('Failed to open chatbot', { error });
  }
}

/**
 * Show warning notification
 */
async function showWarningNotification(tab: chrome.tabs.Tab, score: number, reasons: string[]): Promise<void> {
  try {
    const config = await ConfigService.getConfig();
    
    if (!config.notifications) {
      return;
    }
    
    const notificationOptions = {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('images/icon-48.png'),
      title: 'SmartShield Warning',
      message: `Potential phishing detected on ${new URL(tab.url).hostname}`,
      buttons: [
        { title: 'View Details' },
        { title: 'Dismiss' }
      ],
      requireInteraction: true
    };
    
    chrome.notifications.create(`warning_${tab.id}`, notificationOptions, (notificationId) => {
      if (notificationId) {
        logger.info('Warning notification created', { notificationId, tabId: tab.id });
      }
    });
    
  } catch (error) {
    logger.error('Failed to show warning notification', { error });
  }
}

/**
 * Handle notification clicks
 */
chrome.notifications.onClicked.addListener(async (notificationId) => {
  try {
    if (notificationId.startsWith('warning_')) {
      const tabId = parseInt(notificationId.replace('warning_', ''));
      
      // Get tab status and show warning
      const status = await getTabStatus(tabId);
      if (status) {
        await handleShowWarning(status, { id: tabId });
      }
    }
  } catch (error) {
    logger.error('Failed to handle notification click', { error });
  }
});

/**
 * Handle notification button clicks
 */
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  try {
    if (notificationId.startsWith('warning_')) {
      const tabId = parseInt(notificationId.replace('warning_', ''));
      
      if (buttonIndex === 0) {
        // View Details button
        const status = await getTabStatus(tabId);
        if (status) {
          await handleShowWarning(status, { id: tabId });
        }
      }
      // Dismiss button (buttonIndex === 1) - do nothing
      
      // Clear notification
      chrome.notifications.clear(notificationId);
    }
  } catch (error) {
    logger.error('Failed to handle notification button click', { error });
  }
});

/**
 * Setup context menus
 */
function setupContextMenus(): void {
  chrome.contextMenus.create({
    id: 'smartshield_scan',
    title: 'Scan with SmartShield',
    contexts: ['page', 'selection']
  });
  
  chrome.contextMenus.create({
    id: 'smartshield_report',
    title: 'Report as phishing',
    contexts: ['page']
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab) return;
    
    switch (info.menuItemId) {
      case 'smartshield_scan':
        await initializeTabAnalysis(tab.id, tab);
        break;
      case 'smartshield_report':
        await reportAsPhishing(tab);
        break;
    }
  });
}

/**
 * Report page as phishing
 */
async function reportAsPhishing(tab: chrome.tabs.Tab): Promise<void> {
  try {
    if (!tab.id || !tab.url) return;
    
    await AnalyticsService.trackEvent('user_report', {
      url: tab.url,
      domain: new URL(tab.url).hostname,
      user_action: 'manual_report'
    });
    
    // Show confirmation
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('images/icon-48.png'),
      title: 'SmartShield',
      message: 'Thank you for your report. We will analyze this page.'
    });
    
  } catch (error) {
    logger.error('Failed to report as phishing', { error });
  }
}

/**
 * Setup periodic alarms
 */
function setupAlarms(): void {
  // Analytics sync every 5 minutes
  chrome.alarms.create('analytics_sync', { periodInMinutes: 5 });
  
  // Cleanup old data daily
  chrome.alarms.create('cleanup_old_data', { periodInMinutes: 1440 });
  
  // Update phishing rules weekly
  chrome.alarms.create('update_phishing_rules', { periodInMinutes: 10080 });
}

/**
 * Handle storage changes
 */
function handleStorageChange(changes: { [key: string]: chrome.storage.StorageChange }, namespace: string): void {
  if (namespace === 'sync' || namespace === 'local') {
    // Handle configuration changes
    if (changes.config) {
      logger.info('Configuration updated', { config: changes.config.newValue });
    }
  }
}

/**
 * Migrate settings on update
 */
async function migrateSettings(previousVersion: string): Promise<void> {
  try {
    const currentVersion = chrome.runtime.getManifest().version;
    
    // Add migration logic here based on version changes
    if (previousVersion < '1.0.0') {
      // Example: migrate from old storage format
      logger.info('Migrating settings from previous version', { previousVersion, currentVersion });
    }
    
  } catch (error) {
    logger.error('Failed to migrate settings', { error });
  }
}

/**
 * Clean up old data
 */
async function cleanupOldData(): Promise<void> {
  try {
    const config = await ConfigService.getConfig();
    const retentionDays = config.dataRetentionDays || 30;
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    // Clean up old tab statuses
    const allData = await StorageService.getAll();
    for (const [key, value] of Object.entries(allData)) {
      if (key.startsWith('tab_') && key.endsWith('_status')) {
        const status = value as any;
        if (status.timestamp && status.timestamp < cutoffTime) {
          await StorageService.remove(key);
        }
      }
    }
    
    logger.info('Old data cleanup completed');
  } catch (error) {
    logger.error('Failed to cleanup old data', { error });
  }
}

/**
 * Update phishing detection rules
 */
async function updatePhishingRules(): Promise<void> {
  try {
    // This would fetch updated rules from a server
    // For now, just log the update
    logger.info('Phishing rules update requested');
    
    // In a real implementation, you would:
    // 1. Fetch updated rules from your backend
    // 2. Update the PhishingDetector service
    // 3. Store the new rules in storage
    
  } catch (error) {
    logger.error('Failed to update phishing rules', { error });
  }
}

/**
 * Get extension statistics
 */
async function getExtensionStats(): Promise<any> {
  try {
    const config = await ConfigService.getConfig();
    const allData = await StorageService.getAll();
    
    // Count active tabs
    const tabStatuses = Object.keys(allData).filter(key => key.startsWith('tab_') && key.endsWith('_status'));
    
    // Calculate stats
    const stats = {
      enabled: config.enabled,
      totalScans: tabStatuses.length,
      highRiskScans: 0,
      mediumRiskScans: 0,
      cleanScans: 0,
      version: chrome.runtime.getManifest().version
    };
    
    // Count risk levels
    for (const key of tabStatuses) {
      const status = allData[key] as any;
      if (status.score >= 0.8) {
        stats.highRiskScans++;
      } else if (status.score >= 0.5) {
        stats.mediumRiskScans++;
      } else {
        stats.cleanScans++;
      }
    }
    
    return stats;
  } catch (error) {
    logger.error('Failed to get extension stats', { error });
    return null;
  }
}

// Initialize extension
logger.info('SmartShield background service worker started');
