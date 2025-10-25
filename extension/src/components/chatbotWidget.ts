// Chatbot widget component for content script
export class ChatbotWidget {
  private widget: HTMLElement | null = null;
  private isVisible = false;
  private isMinimized = false;

  show(): void {
    if (this.isVisible) {
      this.toggle();
      return;
    }

    this.createWidget();
    this.isVisible = true;
  }

  hide(): void {
    if (this.widget) {
      this.widget.remove();
      this.widget = null;
      this.isVisible = false;
      this.isMinimized = false;
    }
  }

  toggle(): void {
    if (this.isMinimized) {
      this.expand();
    } else {
      this.minimize();
    }
  }

  private createWidget(): void {
    this.widget = document.createElement('div');
    this.widget.id = 'smartshield-chatbot-widget';
    this.widget.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    const widgetHtml = this.generateWidgetHTML();
    this.widget.innerHTML = widgetHtml;

    document.body.appendChild(this.widget);

    // Add event listeners
    this.addEventListeners();
  }

  private generateWidgetHTML(): string {
    return `
      <div style="
        padding: 16px 20px;
        background: #3b82f6;
        color: white;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      " id="chatbot-header">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">SmartShield Assistant</h3>
          <div style="display: flex; align-items: center; font-size: 12px;">
            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 6px;"></div>
            Online
          </div>
        </div>
        <button id="minimize-btn" style="
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
        ">−</button>
      </div>

      <div style="flex: 1; padding: 16px; overflow-y: auto; background: #f9fafb;" id="chatbot-messages">
        <div style="margin-bottom: 16px; display: flex; justify-content: flex-start;">
          <div style="max-width: 80%; padding: 12px 16px; background: white; color: #374151; border: 1px solid #e5e7eb; border-radius: 18px; border-bottom-left-radius: 4px;">
            <div style="font-size: 14px; line-height: 1.4; margin-bottom: 4px;">
              Hello! I'm SmartShield Assistant. I can help you understand phishing threats and security best practices. How can I assist you today?
            </div>
            <div style="font-size: 11px; opacity: 0.7;">${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      <div style="padding: 16px; background: white; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; align-items: flex-end;" id="chatbot-input">
        <textarea id="message-input" style="
          flex: 1;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          outline: none;
        " placeholder="Ask me about phishing protection..." rows="2"></textarea>
        <button id="send-btn" style="
          padding: 12px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Send</button>
      </div>
    `;
  }

  private addEventListeners(): void {
    if (!this.widget) return;

    const header = this.widget.querySelector('#chatbot-header');
    const minimizeBtn = this.widget.querySelector('#minimize-btn');
    const sendBtn = this.widget.querySelector('#send-btn');
    const messageInput = this.widget.querySelector('#message-input') as HTMLTextAreaElement;

    header?.addEventListener('click', () => {
      this.toggle();
    });

    minimizeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    sendBtn?.addEventListener('click', () => {
      this.sendMessage();
    });

    messageInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  private sendMessage(): void {
    const messageInput = this.widget?.querySelector('#message-input') as HTMLTextAreaElement;
    const messagesContainer = this.widget?.querySelector('#chatbot-messages');
    
    if (!messageInput || !messagesContainer) return;

    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, true);
    messageInput.value = '';

    // Simulate bot response
    setTimeout(() => {
      this.addMessage('I understand your question. Let me help you with that. This is a demo response from the SmartShield Assistant.', false);
    }, 1000);
  }

  private addMessage(text: string, isUser: boolean): void {
    const messagesContainer = this.widget?.querySelector('#chatbot-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'margin-bottom: 16px; display: flex;';
    
    if (isUser) {
      messageDiv.style.justifyContent = 'flex-end';
    } else {
      messageDiv.style.justifyContent = 'flex-start';
    }

    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
    `;

    if (isUser) {
      messageContent.style.cssText += `
        background: #3b82f6;
        color: white;
        border-bottom-right-radius: 4px;
      `;
    } else {
      messageContent.style.cssText += `
        background: white;
        color: #374151;
        border: 1px solid #e5e7eb;
        border-bottom-left-radius: 4px;
      `;
    }

    messageContent.innerHTML = `
      <div style="margin-bottom: 4px;">${text}</div>
      <div style="font-size: 11px; opacity: 0.7;">${new Date().toLocaleTimeString()}</div>
    `;

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  private minimize(): void {
    if (!this.widget) return;
    
    this.widget.style.height = '60px';
    this.widget.style.width = '200px';
    
    const messagesContainer = this.widget.querySelector('#chatbot-messages') as HTMLElement;
    const inputContainer = this.widget.querySelector('#chatbot-input') as HTMLElement;
    
    if (messagesContainer) messagesContainer.style.display = 'none';
    if (inputContainer) inputContainer.style.display = 'none';
    
    this.isMinimized = true;
  }

  private expand(): void {
    if (!this.widget) return;
    
    this.widget.style.height = '500px';
    this.widget.style.width = '350px';
    
    const messagesContainer = this.widget.querySelector('#chatbot-messages') as HTMLElement;
    const inputContainer = this.widget.querySelector('#chatbot-input') as HTMLElement;
    
    if (messagesContainer) messagesContainer.style.display = 'flex';
    if (inputContainer) inputContainer.style.display = 'flex';
    
    this.isMinimized = false;
  }
}
