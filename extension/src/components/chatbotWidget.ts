/**
 * Chatbot Widget Component
 * Provides interactive chat interface for phishing analysis
 */

export class ChatbotWidget {
  private static widgetElement: HTMLElement | null = null;
  private static isOpen = false;

  static showWidget(): void {
    if (this.widgetElement) {
      this.toggleWidget();
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'smartshield-chatbot';
    widget.className = 'smartshield-chatbot';
    
    widget.innerHTML = `
      <div class="smartshield-chatbot-header">
        <h3>SmartShield Assistant</h3>
        <button class="smartshield-chatbot-toggle" onclick="SmartShieldChatbot.toggleWidget()">
          <i class="fas fa-minus"></i>
        </button>
      </div>
      <div class="smartshield-chatbot-content">
        <div class="smartshield-chatbot-messages">
          <div class="smartshield-message assistant">
            <div class="smartshield-message-content">
              Hello! I'm SmartShield Assistant. I can help you analyze this page for potential phishing threats. What would you like to know?
            </div>
          </div>
        </div>
        <div class="smartshield-chatbot-input">
          <input type="text" placeholder="Ask about this page..." />
          <button onclick="SmartShieldChatbot.sendMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .smartshield-chatbot {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .smartshield-chatbot-header {
        background: #007bff;
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .smartshield-chatbot-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .smartshield-chatbot-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
      }
      
      .smartshield-chatbot-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .smartshield-chatbot-messages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: #f8f9fa;
      }
      
      .smartshield-message {
        margin-bottom: 15px;
      }
      
      .smartshield-message-content {
        padding: 10px 15px;
        border-radius: 18px;
        max-width: 80%;
        word-wrap: break-word;
      }
      
      .smartshield-message.user .smartshield-message-content {
        background: #007bff;
        color: white;
        margin-left: auto;
      }
      
      .smartshield-message.assistant .smartshield-message-content {
        background: white;
        color: #333;
        border: 1px solid #e9ecef;
      }
      
      .smartshield-chatbot-input {
        padding: 15px;
        background: white;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
      }
      
      .smartshield-chatbot-input input {
        flex: 1;
        padding: 10px 15px;
        border: 1px solid #e9ecef;
        border-radius: 20px;
        outline: none;
        font-size: 14px;
      }
      
      .smartshield-chatbot-input button {
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .smartshield-chatbot.collapsed {
        height: 60px;
      }
      
      .smartshield-chatbot.collapsed .smartshield-chatbot-content {
        display: none;
      }
      
      .smartshield-chatbot.collapsed .smartshield-chatbot-toggle i {
        transform: rotate(180deg);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(widget);
    this.widgetElement = widget;
    this.isOpen = true;

    // Make it globally accessible
    (window as any).SmartShieldChatbot = this;
  }

  static toggleWidget(): void {
    if (!this.widgetElement) return;
    
    this.isOpen = !this.isOpen;
    this.widgetElement.classList.toggle('collapsed', !this.isOpen);
    
    const icon = this.widgetElement.querySelector('.smartshield-chatbot-toggle i');
    if (icon) {
      icon.className = this.isOpen ? 'fas fa-minus' : 'fas fa-plus';
    }
  }

  static sendMessage(): void {
    const input = this.widgetElement?.querySelector('input');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    input.value = '';

    this.addMessage(message, 'user');
    
    // Simulate response
    setTimeout(() => {
      this.addMessage('This is a mock response. The chatbot is running in development mode.', 'assistant');
    }, 1000);
  }

  static addMessage(content: string, type: 'user' | 'assistant'): void {
    const messagesContainer = this.widgetElement?.querySelector('.smartshield-chatbot-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `smartshield-message ${type}`;
    messageDiv.innerHTML = `
      <div class="smartshield-message-content">${content}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  static hideWidget(): void {
    if (this.widgetElement) {
      this.widgetElement.remove();
      this.widgetElement = null;
      this.isOpen = false;
    }
  }
}

