// Warning display component for content script
export class WarningDisplay {
  private overlay: HTMLElement | null = null;
  private isVisible = false;

  show(threatLevel: 'high' | 'medium' | 'low', threats: string[], url: string): void {
    if (this.isVisible) {
      this.hide();
    }

    this.createOverlay(threatLevel, threats, url);
    this.isVisible = true;
  }

  hide(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.isVisible = false;
    }
  }

  private createOverlay(threatLevel: 'high' | 'medium' | 'low', threats: string[], url: string): void {
    this.overlay = document.createElement('div');
    this.overlay.id = 'smartshield-warning-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const warningHtml = this.generateWarningHTML(threatLevel, threats, url);
    this.overlay.innerHTML = warningHtml;

    document.body.appendChild(this.overlay);

    // Add event listeners
    this.addEventListeners();
  }

  private generateWarningHTML(threatLevel: string, threats: string[], url: string): string {
    const threatColor = this.getThreatColor(threatLevel);
    const threatIcon = this.getThreatIcon(threatLevel);

    return `
      <div style="
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        animation: slideIn 0.3s ease-out;
      ">
        <style>
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px; margin-bottom: 16px;">${threatIcon}</div>
          <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #dc2626;">
            Security Warning
          </h1>
          <div style="
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            background: ${threatColor};
          ">
            ${threatLevel.toUpperCase()} RISK
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 16px; line-height: 1.5;">
            SmartShield has detected potential security threats on this website:
          </p>
          
          <div style="
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            word-break: break-all;
            border-left: 4px solid #dc2626;
          ">
            <strong>URL:</strong> ${url}
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">Detected Threats:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${threats.map(threat => `<li style="margin-bottom: 4px; color: #dc2626; font-size: 14px;">${threat}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">Recommendations:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 4px; color: #6b7280; font-size: 14px;">Do not enter personal information</li>
              <li style="margin-bottom: 4px; color: #6b7280; font-size: 14px;">Do not download files from this site</li>
              <li style="margin-bottom: 4px; color: #6b7280; font-size: 14px;">Verify the site's authenticity through other means</li>
              <li style="margin-bottom: 4px; color: #6b7280; font-size: 14px;">Consider using a different website</li>
            </ul>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
          <button id="go-back-btn" style="
            flex: 1;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          ">
            Go Back
          </button>
          <button id="proceed-btn" style="
            flex: 1;
            padding: 12px 24px;
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          ">
            Proceed Anyway (Not Recommended)
          </button>
        </div>

        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This warning is provided by SmartShield to protect your security.
          </p>
        </div>
      </div>
    `;
  }

  private getThreatColor(threatLevel: string): string {
    switch (threatLevel) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  }

  private getThreatIcon(threatLevel: string): string {
    switch (threatLevel) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '❓';
    }
  }

  private addEventListeners(): void {
    if (!this.overlay) return;

    const goBackBtn = this.overlay.querySelector('#go-back-btn');
    const proceedBtn = this.overlay.querySelector('#proceed-btn');

    goBackBtn?.addEventListener('click', () => {
      window.history.back();
      this.hide();
    });

    proceedBtn?.addEventListener('click', () => {
      this.hide();
      // Send message to background script
      chrome.runtime.sendMessage({ action: 'proceedToSite' });
    });
  }
}
