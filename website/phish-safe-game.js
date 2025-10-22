// ============================================
// Phish or Safe Game - Individual Page
// ============================================

class PhishSafeGame {
  constructor() {
    this.currentLanguage = 'en';
    this.score = 0;
    this.level = 1;
    this.timeLeft = 30;
    this.timer = null;
    this.currentScenario = 0;
    this.correctAnswers = [];
    this.scenarios = [];
    this.init();
  }

  init() {
    this.loadGameData();
    this.bindEvents();
    this.startGame();
  }

  bindEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === 'ArrowLeft') {
        this.makeChoice('phish');
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        this.makeChoice('safe');
      }
    });
  }

  loadGameData() {
    this.scenarios = [
      {
        id: 1,
        type: 'phish',
        subject: { en: 'URGENT: Verify Your Account Now!', ar: 'عاجل: تحقق من حسابك الآن!' },
        from: { en: 'security@bank-oman.com', ar: 'security@bank-oman.com' },
        body: { 
          en: 'Dear Customer,\n\nYour account has been compromised. Click the link below immediately to verify your identity and prevent unauthorized access.\n\nThis is your last warning before account suspension.\n\nVerify Account', 
          ar: 'عزيزي العميل،\n\nتم اختراق حسابك. انقر على الرابط أدناه فوراً للتحقق من هويتك ومنع الوصول غير المصرح به.\n\nهذا هو تحذيرك الأخير قبل تعليق الحساب.\n\nالتحقق من الحساب' 
        },
        links: ['https://bank-verification-oman.net'],
        attachments: [],
        explanation: {
          en: 'This is a phishing email! Red flags: urgent language, suspicious domain, threat of account suspension.',
          ar: 'هذا بريد تصيد! علامات حمراء: لغة عاجلة، نطاق مشبوه، تهديد بتعليق الحساب.'
        }
      },
      {
        id: 2,
        type: 'safe',
        subject: { en: 'Monthly Statement Available', ar: 'كشف شهري متاح' },
        from: { en: 'noreply@bankofoman.com', ar: 'noreply@bankofoman.com' },
        body: { 
          en: 'Dear Valued Customer,\n\nYour monthly account statement is now available in your online banking portal. Please log in to view your statement.\n\nThank you for banking with us.', 
          ar: 'عزيزي العميل المحترم،\n\nكشف حسابك الشهري متاح الآن في بوابة الخدمات المصرفية الإلكترونية. يرجى تسجيل الدخول لعرض كشفك.\n\nشكراً لتعاملك المصرفي معنا.' 
        },
        links: ['https://bankofoman.com/login'],
        attachments: [],
        explanation: {
          en: 'This is a legitimate email! No urgent language, official domain, professional tone.',
          ar: 'هذا بريد شرعي! لا توجد لغة عاجلة، نطاق رسمي، نبرة مهنية.'
        }
      },
      {
        id: 3,
        type: 'phish',
        subject: { en: 'You\'ve Won $10,000! Claim Now!', ar: 'لقد فزت بـ 10,000 دولار! اطلب الآن!' },
        from: { en: 'winner@lottery-oman.org', ar: 'winner@lottery-oman.org' },
        body: { 
          en: 'Congratulations! You have won $10,000 in our lottery. To claim your prize, please provide your personal information and bank details.\n\nClaim Prize', 
          ar: 'تهانينا! لقد فزت بـ 10,000 دولار في اليانصيب. لاستلام جائزتك، يرجى تقديم معلوماتك الشخصية وتفاصيل البنك.\n\nاستلام الجائزة' 
        },
        links: ['https://claim-prize-oman.net'],
        attachments: [],
        explanation: {
          en: 'This is a phishing email! Red flags: too good to be true, requests personal information, suspicious domain.',
          ar: 'هذا بريد تصيد! علامات حمراء: جيد جداً ليكون حقيقياً، يطلب معلومات شخصية، نطاق مشبوه.'
        }
      },
      {
        id: 4,
        type: 'safe',
        subject: { en: 'Password Reset Request', ar: 'طلب إعادة تعيين كلمة المرور' },
        from: { en: 'security@microsoft.com', ar: 'security@microsoft.com' },
        body: { 
          en: 'Hello,\n\nWe received a request to reset your password. If you made this request, click the link below. If not, please ignore this email.\n\nReset Password', 
          ar: 'مرحباً،\n\nتلقينا طلباً لإعادة تعيين كلمة مرورك. إذا قمت بهذا الطلب، انقر على الرابط أدناه. إذا لم تقم بذلك، يرجى تجاهل هذا البريد.' 
        },
        links: ['https://account.microsoft.com/reset'],
        attachments: [],
        explanation: {
          en: 'This is a legitimate email! Official Microsoft domain, clear instructions, no pressure.',
          ar: 'هذا بريد شرعي! نطاق مايكروسوفت الرسمي، تعليمات واضحة، لا يوجد ضغط.'
        }
      },
      {
        id: 5,
        type: 'phish',
        subject: { en: 'Your Package Delivery Failed', ar: 'فشل في تسليم طردك' },
        from: { en: 'delivery@dhl-oman.net', ar: 'delivery@dhl-oman.net' },
        body: { 
          en: 'Your package could not be delivered. Please click the link to reschedule delivery and pay the additional fee.\n\nReschedule Delivery', 
          ar: 'لا يمكن تسليم طردك. يرجى النقر على الرابط لإعادة جدولة التسليم ودفع الرسوم الإضافية.\n\nإعادة جدولة التسليم' 
        },
        links: ['https://dhl-delivery-reschedule.net'],
        attachments: [],
        explanation: {
          en: 'This is a phishing email! Red flags: suspicious domain (.net instead of .com), requests payment, urgent tone.',
          ar: 'هذا بريد تصيد! علامات حمراء: نطاق مشبوه (.net بدلاً من .com)، يطلب دفع، نبرة عاجلة.'
        }
      }
    ];
  }

  startGame() {
    this.score = 0;
    this.level = 1;
    this.timeLeft = 30;
    this.currentScenario = 0;
    this.correctAnswers = [];
    
    this.updateStats();
    this.loadScenario();
    this.startTimer();
  }

  loadScenario() {
    const scenario = this.scenarios[this.currentScenario];
    const container = document.getElementById('emailContainer');
    
    container.innerHTML = `
      <div class="email-header">
        <div class="email-subject">${scenario.subject[this.currentLanguage]}</div>
        <div class="email-from">From: ${scenario.from}</div>
      </div>
      <div class="email-body">
        <p>${scenario.body[this.currentLanguage].replace(/\n/g, '</p><p>')}</p>
      </div>
      ${scenario.links.length > 0 ? `
        <div class="email-links">
          ${scenario.links.map(link => `<span class="email-link">${link}</span>`).join('')}
        </div>
      ` : ''}
      ${scenario.attachments.length > 0 ? `
        <div class="email-attachments">
          ${scenario.attachments.map(att => `
            <div class="attachment-item">
              <i class="fas fa-paperclip"></i>
              <span>${att}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  makeChoice(choice) {
    const scenario = this.scenarios[this.currentScenario];
    const isCorrect = (choice === scenario.type);
    
    // Store the result for end-game summary
    this.correctAnswers.push({
      scenario: this.currentScenario + 1,
      userChoice: choice,
      correctAnswer: scenario.type,
      isCorrect: isCorrect,
      explanation: scenario.explanation[this.currentLanguage]
    });
    
    if (isCorrect) {
      this.score += 10;
    }
    
    this.updateStats();
    this.nextScenario();
  }

  nextScenario() {
    this.currentScenario++;
    
    if (this.currentScenario >= this.scenarios.length) {
      this.endGame();
    } else {
      setTimeout(() => {
        this.loadScenario();
        this.timeLeft = 30; // Reset timer for next scenario
      }, 1000);
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateStats();
      
      if (this.timeLeft <= 0) {
        // Time's up - mark as incorrect and move to next
        const scenario = this.scenarios[this.currentScenario];
        this.correctAnswers.push({
          scenario: this.currentScenario + 1,
          userChoice: 'timeout',
          correctAnswer: scenario.type,
          isCorrect: false,
          explanation: scenario.explanation[this.currentLanguage]
        });
        this.nextScenario();
      }
    }, 1000);
  }

  endGame() {
    clearInterval(this.timer);
    this.showGameEndModal();
  }

  showGameEndModal() {
    const modal = document.getElementById('gameEndModal');
    const messageDiv = document.getElementById('gameEndMessage');
    
    // Calculate results
    const correctCount = this.correctAnswers.filter(answer => answer.isCorrect).length;
    const totalCount = this.correctAnswers.length;
    const accuracy = Math.round((correctCount / totalCount) * 100);
    
    let message = '';
    if (this.currentLanguage === 'en') {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>Final Score:</strong> ${this.score} points
          </div>
          <div class="result-item">
            <strong>Accuracy:</strong> ${accuracy}% (${correctCount}/${totalCount})
          </div>
          <div class="result-item">
            <strong>Level:</strong> ${this.level}
          </div>
        </div>
        <div class="detailed-results">
          <h4>Detailed Results:</h4>
          ${this.correctAnswers.map((answer, index) => `
            <div class="result-detail ${answer.isCorrect ? 'correct' : 'incorrect'}">
              <strong>Question ${answer.scenario}:</strong> 
              You chose <strong>${answer.userChoice.toUpperCase()}</strong>, 
              correct answer was <strong>${answer.correctAnswer.toUpperCase()}</strong>
              <div class="explanation">${answer.explanation}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      message = `
        <div class="game-results">
          <div class="result-item">
            <strong>النقاط النهائية:</strong> ${this.score} نقطة
          </div>
          <div class="result-item">
            <strong>الدقة:</strong> ${accuracy}% (${correctCount}/${totalCount})
          </div>
          <div class="result-item">
            <strong>المستوى:</strong> ${this.level}
          </div>
        </div>
        <div class="detailed-results">
          <h4>النتائج التفصيلية:</h4>
          ${this.correctAnswers.map((answer, index) => `
            <div class="result-detail ${answer.isCorrect ? 'correct' : 'incorrect'}">
              <strong>السؤال ${answer.scenario}:</strong> 
              اخترت <strong>${answer.userChoice.toUpperCase()}</strong>، 
              الإجابة الصحيحة كانت <strong>${answer.correctAnswer.toUpperCase()}</strong>
              <div class="explanation">${answer.explanation}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    messageDiv.innerHTML = message;
    modal.classList.add('show');
  }

  updateStats() {
    document.getElementById('phishScore').textContent = this.score;
    document.getElementById('phishTime').textContent = this.timeLeft;
    document.getElementById('phishLevel').textContent = this.level;
    document.getElementById('phishProgress').textContent = `${this.currentScenario + 1}/${this.scenarios.length}`;
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

function makeChoice(choice) {
  game.makeChoice(choice);
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
  game = new PhishSafeGame();
});
