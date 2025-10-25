// ============================================
// Spot the Red Flag Game - Individual Page
// ============================================

class HotspotGame {
  constructor() {
    this.currentLanguage = 'en';
    this.found = 0;
    this.total = 5;
    this.mistakes = 0;
    this.currentScenario = 0;
    this.scenarios = [];
    this.clickedHotspots = [];
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
    this.scenarios = [
      {
        id: 1,
        hotspots: [
          { x: 5, y: 8, width: 50, height: 3, type: 'sender', explanation: { en: 'Suspicious sender domain', ar: 'نطاق المرسل المشبوه' } },
          { x: 5, y: 15, width: 60, height: 4, type: 'subject', explanation: { en: 'Urgent language in subject', ar: 'لغة عاجلة في الموضوع' } },
          { x: 5, y: 35, width: 40, height: 3, type: 'link', explanation: { en: 'Suspicious link', ar: 'رابط مشبوه' } },
          { x: 5, y: 45, width: 30, height: 3, type: 'attachment', explanation: { en: 'Unexpected attachment', ar: 'مرفق غير متوقع' } },
          { x: 5, y: 25, width: 50, height: 3, type: 'threat', explanation: { en: 'Threatening language', ar: 'لغة تهديدية' } }
        ]
      }
    ];
  }

  startGame() {
    this.found = 0;
    this.total = 5;
    this.mistakes = 0;
    this.currentScenario = 0;
    this.clickedHotspots = [];
    
    this.updateStats();
    this.loadScenario();
  }

  loadScenario() {
    const scenario = this.scenarios[this.currentScenario];
    const container = document.getElementById('emailScreenshot');
    
    // Create a realistic email mockup with proper styling
    container.innerHTML = `
      <div class="email-mockup">
        <div class="email-header-mockup">
          <div class="email-from-mockup">From: security@bank-oman.com</div>
          <div class="email-subject-mockup">URGENT: Verify Your Account Now!</div>
        </div>
        <div class="email-body-mockup">
          <p>Dear Customer,</p>
          <p>Your account has been compromised. Click the link below immediately to verify your identity and prevent unauthorized access.</p>
          <p>This is your last warning before account suspension.</p>
          <p><a href="#" class="suspicious-link">https://bank-verification-oman.net</a></p>
          <p>Attachment: security_scan.pdf</p>
        </div>
      </div>
      ${scenario.hotspots.map((hotspot, index) => `
        <div class="hotspot" 
             style="left: ${hotspot.x}%; top: ${hotspot.y}%; width: ${hotspot.width}%; height: ${hotspot.height}%;"
             onclick="game.clickHotspot(${index})"
             data-type="${hotspot.type}"
             data-explanation="${hotspot.explanation[game.currentLanguage]}"
             title="Click to identify this red flag">
        </div>
      `).join('')}
    `;
  }

  clickHotspot(index) {
    const scenario = this.scenarios[this.currentScenario];
    const hotspot = scenario.hotspots[index];
    const hotspotElement = document.querySelectorAll('.hotspot')[index];
    
    if (hotspotElement.classList.contains('found')) {
      return; // Already found
    }
    
    // Mark as found
    hotspotElement.classList.add('found');
    this.found++;
    this.clickedHotspots.push({
      hotspot: hotspot,
      found: true,
      explanation: hotspot.explanation[this.currentLanguage]
    });
    
    // Show feedback
    this.showFeedback(true, hotspot.explanation[this.currentLanguage]);
    
    this.updateStats();
    
    // Check if all hotspots found
    if (this.found >= this.total) {
      setTimeout(() => this.endGame(), 1000);
    }
  }

  showFeedback(isCorrect, explanation) {
    const container = document.getElementById('emailScreenshot');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'hotspot-feedback';
    feedbackDiv.innerHTML = `
      <div class="feedback-content">
        <i class="fas fa-${isCorrect ? 'check-circle' : 'times-circle'}"></i>
        <span>${explanation}</span>
      </div>
    `;
    
    container.appendChild(feedbackDiv);
    
    // Remove feedback after 3 seconds
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
    
    const accuracy = Math.round((this.found / this.total) * 100);
    
    let message = '';
    if (this.currentLanguage === 'en') {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>Hotspots Found:</strong> ${this.found}/${this.total}
          </div>
          <div class="result-item">
            <strong>Accuracy:</strong> ${accuracy}%
          </div>
          <div class="result-item">
            <strong>Mistakes:</strong> ${this.mistakes}
          </div>
        </div>
        <div class="detailed-results">
          <h4>Red Flags You Found:</h4>
          ${this.clickedHotspots.map((click, index) => `
            <div class="result-detail correct">
              <strong>Red Flag ${index + 1}:</strong> ${click.hotspot.type}
              <div class="explanation">${click.explanation}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>الأعلام الحمراء الموجودة:</strong> ${this.found}/${this.total}
          </div>
          <div class="result-item">
            <strong>الدقة:</strong> ${accuracy}%
          </div>
          <div class="result-item">
            <strong>الأخطاء:</strong> ${this.mistakes}
          </div>
        </div>
        <div class="detailed-results">
          <h4>الأعلام الحمراء التي وجدتها:</h4>
          ${this.clickedHotspots.map((click, index) => `
            <div class="result-detail correct">
              <strong>العلم الأحمر ${index + 1}:</strong> ${click.hotspot.type}
              <div class="explanation">${click.explanation}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    messageDiv.innerHTML = message;
    modal.classList.add('show');
  }

  updateStats() {
    document.getElementById('hotspotFound').textContent = this.found;
    document.getElementById('hotspotTotal').textContent = this.total;
    document.getElementById('hotspotMistakes').textContent = this.mistakes;
    document.getElementById('hotspotAccuracy').textContent = Math.round((this.found / this.total) * 100) + '%';
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    const languageBtn = document.getElementById('languageBtn');
    languageBtn.querySelector('span').textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
    
    // Update all text elements
    document.querySelectorAll('[data-en]').forEach(element => {
      element.textContent = element.getAttribute(`data-${this.currentLanguage}`);
    });
    
    // Reload current scenario with new language
    this.loadScenario();
  }

  playAgain() {
    const modal = document.getElementById('gameEndModal');
    modal.classList.remove('show');
    setTimeout(() => {
      this.startGame();
    }, 300);
  }
}

// Global functions
function goBack() {
  window.location.href = 'index.html#games';
}

function toggleLanguage() {
  game.toggleLanguage();
}

function playAgain() {
  game.playAgain();
}

// Initialize game when DOM is loaded
let game;
document.addEventListener('DOMContentLoaded', function() {
  game = new HotspotGame();
});
