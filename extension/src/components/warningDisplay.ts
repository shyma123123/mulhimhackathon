/**
 * Warning Display Component
 * Shows phishing warnings to users
 */

export class WarningDisplay {
  private static warningElement: HTMLElement | null = null;

  static showWarning(message: string, severity: 'low' | 'medium' | 'high' = 'medium'): void {
    this.hideWarning(); // Remove any existing warning

    const warning = document.createElement('div');
    warning.id = 'smartshield-warning';
    warning.className = `smartshield-warning smartshield-warning-${severity}`;
    
    warning.innerHTML = `
      <div class="smartshield-warning-content">
        <div class="smartshield-warning-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="smartshield-warning-text">
          <h3>SmartShield Alert</h3>
          <p>${message}</p>
        </div>
        <button class="smartshield-warning-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .smartshield-warning {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.3s ease-out;
      }
      
      .smartshield-warning-low {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        color: #856404;
      }
      
      .smartshield-warning-medium {
        background: #f8d7da;
        border-left: 4px solid #dc3545;
        color: #721c24;
      }
      
      .smartshield-warning-high {
        background: #d1ecf1;
        border-left: 4px solid #0c5460;
        color: #0c5460;
      }
      
      .smartshield-warning-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      
      .smartshield-warning-icon {
        font-size: 20px;
        margin-top: 2px;
      }
      
      .smartshield-warning-text h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .smartshield-warning-text p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .smartshield-warning-close {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .smartshield-warning-close:hover {
        opacity: 1;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(warning);
    this.warningElement = warning;

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideWarning();
    }, 10000);
  }

  static hideWarning(): void {
    if (this.warningElement) {
      this.warningElement.remove();
      this.warningElement = null;
    }
  }
}

