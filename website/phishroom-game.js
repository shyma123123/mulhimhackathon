// ============================================
// Phishroom Escape Game - Simple POC Version
// ============================================

class PhishroomGame {
  constructor() {
    this.currentLanguage = 'en';
    this.clues = 0;
    this.safeActions = 0;
    this.riskLevel = 'Low';
    this.currentRoom = 0;
    this.inventory = [];
    this.rooms = [];
    this.actionsTaken = [];
    this.init();
  }

  init() {
    this.loadGameData();
    this.bindEvents();
    this.startGame();
  }

  bindEvents() {
    // Add any specific event listeners here
  }

  loadGameData() {
    this.rooms = [
      {
        id: 1,
        name: 'Office',
        description: {
          en: 'You receive a suspicious email claiming to be from your bank. What do you do?',
          ar: 'تتلقى بريداً إلكترونياً مشبوهاً يدعي أنه من بنكك. ماذا تفعل؟'
        },
        actions: [
          { id: 'check_email', text: { en: 'Check email details', ar: 'فحص تفاصيل البريد' }, type: 'safe', clue: 'suspicious_domain' },
          { id: 'click_link', text: { en: 'Click verification link', ar: 'انقر على رابط التحقق' }, type: 'dangerous', consequence: 'compromised' },
          { id: 'call_bank', text: { en: 'Call bank directly', ar: 'اتصل بالبنك مباشرة' }, type: 'safe', clue: 'bank_confirmation' },
          { id: 'delete_email', text: { en: 'Delete email', ar: 'احذف البريد' }, type: 'safe' }
        ],
        clues: {
          suspicious_domain: { en: 'Domain is bank-oman.com instead of bankofoman.com', ar: 'النطاق هو bank-oman.com بدلاً من bankofoman.com' },
          bank_confirmation: { en: 'Bank confirms no suspicious activity on your account', ar: 'البنك يؤكد عدم وجود نشاط مشبوه في حسابك' }
        }
      },
      {
        id: 2,
        name: 'Phone Call',
        description: {
          en: 'You receive a call from someone claiming to be tech support. They want you to install remote access software.',
          ar: 'تتلقى مكالمة من شخص يدعي أنه من الدعم التقني. يريدون منك تثبيت برنامج الوصول عن بُعد.'
        },
        actions: [
          { id: 'verify_caller', text: { en: 'Ask for verification', ar: 'اطلب التحقق' }, type: 'safe', clue: 'unknown_caller' },
          { id: 'install_software', text: { en: 'Install the software', ar: 'ثبت البرنامج' }, type: 'dangerous', consequence: 'hacked' },
          { id: 'hang_up', text: { en: 'Hang up and call official support', ar: 'أغلق المكالمة واتصل بالدعم الرسمي' }, type: 'safe', clue: 'official_support' },
          { id: 'give_info', text: { en: 'Provide personal information', ar: 'قدم المعلومات الشخصية' }, type: 'dangerous', consequence: 'identity_theft' }
        ],
        clues: {
          unknown_caller: { en: 'Caller ID shows unknown number not from official support', ar: 'معرف المتصل يظهر رقم غير معروف ليس من الدعم الرسمي' },
          official_support: { en: 'Official support confirms no active calls to your number', ar: 'الدعم الرسمي يؤكد عدم وجود مكالمات نشطة لرقمك' }
        }
      },
      {
        id: 3,
        name: 'Suspicious Website',
        description: {
          en: 'You\'re investigating a suspicious website that appeared in your search results offering free security scans.',
          ar: 'أنت تحقق من موقع مشبوه ظهر في نتائج البحث يقدم فحوصات أمان مجانية.'
        },
        actions: [
          { id: 'check_url', text: { en: 'Check URL carefully', ar: 'فحص الرابط بعناية' }, type: 'safe', clue: 'fake_domain' },
          { id: 'run_scan', text: { en: 'Run the security scan', ar: 'تشغيل فحص الأمان' }, type: 'dangerous', consequence: 'malware' },
          { id: 'close_browser', text: { en: 'Close browser immediately', ar: 'أغلق المتصفح فوراً' }, type: 'safe' },
          { id: 'download_tool', text: { en: 'Download the security tool', ar: 'تحميل أداة الأمان' }, type: 'dangerous', consequence: 'infected' }
        ],
        clues: {
          fake_domain: { en: 'URL uses suspicious domain with typos and unusual characters', ar: 'الرابط يستخدم نطاقاً مشبوهاً مع أخطاء إملائية وأحرف غير عادية' }
        }
      },
      {
        id: 4,
        name: 'Email Attachments',
        description: {
          en: 'You receive an email with an urgent attachment claiming to be an invoice.',
          ar: 'تتلقى بريداً إلكترونياً مع مرفق عاجل يدعي أنه فاتورة.'
        },
        actions: [
          { id: 'scan_attachment', text: { en: 'Scan attachment with antivirus', ar: 'فحص المرفق بمضاد الفيروسات' }, type: 'safe', clue: 'attachment_safe' },
          { id: 'open_attachment', text: { en: 'Open attachment directly', ar: 'فتح المرفق مباشرة' }, type: 'dangerous', consequence: 'infected' },
          { id: 'verify_sender', text: { en: 'Verify sender identity', ar: 'التحقق من هوية المرسل' }, type: 'safe', clue: 'sender_verification' },
          { id: 'delete_attachment', text: { en: 'Delete email and attachment', ar: 'احذف البريد والمرفق' }, type: 'safe' }
        ],
        clues: {
          attachment_safe: { en: 'Antivirus scan shows attachment is clean', ar: 'فحص مضاد الفيروسات يظهر أن المرفق آمن' },
          sender_verification: { en: 'Sender email domain does not match company domain', ar: 'نطاق بريد المرسل لا يطابق نطاق الشركة' }
        }
      },
      {
        id: 5,
        name: 'Social Media',
        description: {
          en: 'You see a suspicious post on social media offering free gift cards.',
          ar: 'ترى منشوراً مشبوهاً على وسائل التواصل الاجتماعي يعرض بطاقات هدايا مجانية.'
        },
        actions: [
          { id: 'ignore_post', text: { en: 'Ignore the post', ar: 'تجاهل المنشور' }, type: 'safe' },
          { id: 'click_link', text: { en: 'Click the link to claim', ar: 'انقر على الرابط للمطالبة' }, type: 'dangerous', consequence: 'scammed' },
          { id: 'report_post', text: { en: 'Report suspicious post', ar: 'الإبلاغ عن المنشور المشبوه' }, type: 'safe', clue: 'post_reported' },
          { id: 'share_post', text: { en: 'Share with friends', ar: 'شارك مع الأصدقاء' }, type: 'dangerous', consequence: 'spread_malware' }
        ],
        clues: {
          post_reported: { en: 'Social media platform confirms post was removed for policy violation', ar: 'منصة التواصل الاجتماعي تؤكد إزالة المنشور لانتهاك السياسة' }
        }
      }
    ];
  }

  startGame() {
    this.clues = 0;
    this.safeActions = 0;
    this.riskLevel = 'Low';
    this.currentRoom = 0;
    this.currentStep = 0;
    this.maxSteps = 5;
    this.inventory = [];
    this.actionsTaken = [];
    
    this.updateStats();
    this.loadRoom();
  }

  loadRoom() {
    const room = this.rooms[this.currentRoom];
    const roomScene = document.getElementById('roomScene');
    const actionPanel = document.getElementById('actionPanel');
    
    // Create simple room visualization
    roomScene.innerHTML = `
      <div class="room-visual room-${room.id}">
        <div class="room-description">
          <h3>${room.name}</h3>
          <p>${room.description[this.currentLanguage]}</p>
        </div>
      </div>
    `;
    
    // Create action buttons without icons
    actionPanel.innerHTML = room.actions.map(action => `
      <button class="action-btn" onclick="game.takeAction('${action.id}')">
        <span>${action.text[this.currentLanguage]}</span>
      </button>
    `).join('');
    
    this.updateInventory();
    this.updateStats();
    this.updateProgress();
  }

  getRoomIcon(roomId) {
    const icons = {
      1: 'desktop',
      2: 'phone',
      3: 'globe'
    };
    return icons[roomId] || 'question';
  }

  getActionIcon(actionId) {
    const icons = {
      'check_email': 'envelope-open',
      'click_link': 'external-link-alt',
      'call_bank': 'phone',
      'delete_email': 'trash',
      'verify_caller': 'user-check',
      'install_software': 'download',
      'hang_up': 'phone-slash',
      'give_info': 'user-secret',
      'check_url': 'link',
      'run_scan': 'search',
      'close_browser': 'times',
      'download_tool': 'download'
    };
    return icons[actionId] || 'question';
  }

  takeAction(actionId) {
    const room = this.rooms[this.currentRoom];
    const action = room.actions.find(a => a.id === actionId);
    
    // Record the action taken
    this.actionsTaken.push({
      step: this.currentStep + 1,
      roomName: room.name,
      action: action.text[this.currentLanguage],
      type: action.type,
      consequence: action.consequence || null
    });
    
    if (action.type === 'safe') {
      this.safeActions++;
      if (action.clue) {
        this.inventory.push(action.clue);
        this.clues++;
      }
      this.showActionFeedback(true, action.text[this.currentLanguage]);
      
      // Only increment step for correct (safe) actions
      this.currentStep++;
      this.updateStats();
      this.updateInventory();
      this.updateProgress();
      
      // Check if game should end
      if (this.currentStep >= this.maxSteps) {
        setTimeout(() => {
          this.endGame();
        }, 2000);
      } else {
        // Move to next room after delay
        setTimeout(() => {
          this.currentRoom = (this.currentRoom + 1) % this.rooms.length;
          this.loadRoom();
        }, 2000);
      }
    } else if (action.type === 'dangerous') {
      this.riskLevel = 'High';
      this.showActionFeedback(false, action.text[this.currentLanguage], action.consequence);
      
      // Don't increment step for wrong actions - stay in same room
      this.updateStats();
      this.updateInventory();
    }
  }

  showActionFeedback(isCorrect, actionText, consequence = null) {
    const roomScene = document.getElementById('roomScene');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `action-feedback ${isCorrect ? 'safe' : 'dangerous'}`;
    
    let message = '';
    if (isCorrect) {
      message = this.currentLanguage === 'en' 
        ? `✓ Safe Action: ${actionText}` 
        : `✓ إجراء آمن: ${actionText}`;
    } else {
      message = this.currentLanguage === 'en' 
        ? `⚠ Risky Action: ${actionText}${consequence ? ` - ${consequence}` : ''}` 
        : `⚠ إجراء خطير: ${actionText}${consequence ? ` - ${consequence}` : ''}`;
    }
    
    feedbackDiv.innerHTML = `
      <div class="feedback-content">
        <i class="fas fa-${isCorrect ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    roomScene.appendChild(feedbackDiv);
    
    // Remove feedback after animation
    setTimeout(() => {
      feedbackDiv.remove();
    }, 3000);
  }

  endGame() {
    this.showGameEndModal();
  }

  showGameEndModal() {
    const modal = document.getElementById('gameEndModal');
    const messageDiv = document.getElementById('gameEndMessage');
    
    let message = '';
    if (this.currentLanguage === 'en') {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>Safe Actions:</strong> ${this.safeActions}
          </div>
          <div class="result-item">
            <strong>Clues Found:</strong> ${this.clues}
          </div>
          <div class="result-item">
            <strong>Final Risk Level:</strong> ${this.riskLevel}
          </div>
        </div>
        <div class="detailed-results">
          <h4>Your Journey:</h4>
          ${this.actionsTaken.map((action, index) => `
            <div class="result-detail ${action.type === 'safe' ? 'correct' : 'incorrect'}">
              <strong>${action.roomName}:</strong> ${action.action}
              ${action.consequence ? `<div class="consequence">Consequence: ${action.consequence}</div>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="clues-found">
          <h4>Clues Collected:</h4>
          ${this.inventory.map((clue, index) => `
            <div class="clue-item">
              <strong>Clue ${index + 1}:</strong> ${this.rooms[this.currentRoom - 1].clues[clue][this.currentLanguage]}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>الإجراءات الآمنة:</strong> ${this.safeActions}
          </div>
          <div class="result-item">
            <strong>الأدلة الموجودة:</strong> ${this.clues}
          </div>
          <div class="result-item">
            <strong>مستوى الخطر النهائي:</strong> ${this.riskLevel}
          </div>
        </div>
        <div class="detailed-results">
          <h4>رحلتك:</h4>
          ${this.actionsTaken.map((action, index) => `
            <div class="result-detail ${action.type === 'safe' ? 'correct' : 'incorrect'}">
              <strong>${action.roomName}:</strong> ${action.action}
              ${action.consequence ? `<div class="consequence">النتيجة: ${action.consequence}</div>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="clues-found">
          <h4>الأدلة المجمعة:</h4>
          ${this.inventory.map((clue, index) => `
            <div class="clue-item">
              <strong>الدليل ${index + 1}:</strong> ${this.rooms[this.currentRoom - 1].clues[clue][this.currentLanguage]}
            </div>
          `).join('')}
        </div>
      `;
    }
    
    messageDiv.innerHTML = message;
    modal.classList.add('show');
  }

  updateStats() {
    document.getElementById('phishroomClues').textContent = this.clues;
    document.getElementById('phishroomSafe').textContent = this.safeActions;
    document.getElementById('phishroomRisk').textContent = this.riskLevel;
  }

  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const percentage = (this.currentStep / this.maxSteps) * 100;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Step ${this.currentStep + 1} of ${this.maxSteps}`;
  }

  updateInventory() {
    const inventoryPanel = document.getElementById('inventoryPanel');
    
    if (inventoryPanel) {
      inventoryPanel.innerHTML = `
        <div class="inventory-title">${this.currentLanguage === 'en' ? 'Clues Collected' : 'الأدلة المجمعة'}</div>
        <div class="inventory-items">
          ${this.inventory.map(clue => `
            <div class="inventory-item collected">
              <i class="fas fa-lightbulb"></i>
              <span>${this.rooms[this.currentRoom].clues[clue][this.currentLanguage]}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    const languageBtn = document.getElementById('languageBtn');
    languageBtn.querySelector('span').textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
    
    // Update all text elements
    document.querySelectorAll('[data-en]').forEach(element => {
      element.textContent = element.getAttribute(`data-${this.currentLanguage}`);
    });
    
    // Reload current room with new language
    this.loadRoom();
  }

  playAgain() {
    const modal = document.getElementById('gameEndModal');
    modal.classList.remove('show');
    setTimeout(() => {
      this.startGame();
    }, 300);
  }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
  game = new PhishroomGame();
});

// Global functions
function goBack() {
  window.location.href = 'index.html#games';
}

function toggleLanguage() {
  game.toggleLanguage();
}

function takeAction(actionId) {
  game.takeAction(actionId);
}

function playAgain() {
  game.playAgain();
}

function closeGameEndModal() {
  const modal = document.getElementById('gameEndModal');
  modal.classList.remove('show');
}