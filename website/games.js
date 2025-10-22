// ============================================
// SmartShield Phishing Awareness Games
// Complete Implementation with Bilingual Support
// ============================================

// Game State Management
class GameManager {
  constructor() {
    this.currentGame = null;
    this.currentLanguage = 'en';
    this.gameData = {
      'phish-safe': {
        title: { en: 'Phish or Safe?', ar: 'تصيد أم آمن؟' },
        score: 0,
        level: 1,
        timeLeft: 30,
        timer: null,
        currentScenario: 0,
        scenarios: []
      },
      'hotspot': {
        title: { en: 'Spot the Red Flag', ar: 'اكتشف العلم الأحمر' },
        found: 0,
        total: 5,
        mistakes: 0,
        currentScenario: 0,
        scenarios: []
      },
      'phishroom': {
        title: { en: 'Phishroom Escape', ar: 'هروب من غرفة التصيد' },
        clues: 0,
        safeActions: 0,
        riskLevel: 'Low',
        currentScene: 0,
        inventory: [],
        scenarios: []
      }
    };
    this.init();
  }

  init() {
    this.loadGameData();
    this.bindEvents();
  }

  bindEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.currentGame === 'phish-safe') {
        if (e.key === '1' || e.key === 'ArrowLeft') {
          makeChoice('phish');
        } else if (e.key === '2' || e.key === 'ArrowRight') {
          makeChoice('safe');
        }
      }
    });
  }

  loadGameData() {
    // Load Phish or Safe scenarios
    this.gameData['phish-safe'].scenarios = [
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

    // Load Hotspot scenarios
    this.gameData['hotspot'].scenarios = [
      {
        id: 1,
        hotspots: [
          { x: 20, y: 15, width: 30, height: 5, type: 'sender', explanation: { en: 'Suspicious sender domain', ar: 'نطاق المرسل المشبوه' } },
          { x: 10, y: 25, width: 40, height: 8, type: 'subject', explanation: { en: 'Urgent language in subject', ar: 'لغة عاجلة في الموضوع' } },
          { x: 15, y: 40, width: 25, height: 10, type: 'link', explanation: { en: 'Suspicious link', ar: 'رابط مشبوه' } },
          { x: 5, y: 60, width: 20, height: 8, type: 'attachment', explanation: { en: 'Unexpected attachment', ar: 'مرفق غير متوقع' } },
          { x: 10, y: 75, width: 35, height: 6, type: 'threat', explanation: { en: 'Threatening language', ar: 'لغة تهديدية' } }
        ],
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iMjAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5Gcm9tOiBzZWN1cml0eUBiYW5rLW9tYW4uY29tPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI1MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPlVSR0VOVDogVmVyaWZ5IFlvdXIgQWNjb3VudCBOb3chPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI4MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+WW91ciBhY2NvdW50IGhhcyBiZWVuIGNvbXByb21pc2VkLjwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5DbGljayB0aGUgbGluayBiZWxvdyBpbW1lZGlhdGVseS48L3RleHQ+PHRleHQgeD0iMjAiIHk9IjEyMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwNjZkZCI+aHR0cHM6Ly9iYW5rLXZlcmlmaWNhdGlvbi1vbWFuLm5ldDwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5UaGlzIGlzIHlvdXIgbGFzdCB3YXJuaW5nLjwvdGV4dD48dGV4dCB4PSIyMCIgeT0iMTYwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0Ij5BdHRhY2htZW50OiBzZWN1cml0eV9zY2FuLnBkZjwvdGV4dD48L3N2Zz4='
      }
    ];

    // Load Phishroom scenarios
    this.gameData['phishroom'].scenarios = [
      {
        id: 1,
        scene: 'inbox',
        narrative: {
          en: 'You receive an email claiming to be from your bank about suspicious activity. The email looks official but something feels off.',
          ar: 'تتلقى بريداً إلكترونياً يدعي أنه من بنكك حول نشاط مشبوه. البريد يبدو رسمياً لكن شيئاً ما يبدو غريباً.'
        },
        actions: [
          { id: 'check_sender', text: { en: 'Check sender details', ar: 'فحص تفاصيل المرسل' }, type: 'safe', clue: 'sender_domain' },
          { id: 'click_link', text: { en: 'Click the verification link', ar: 'انقر على رابط التحقق' }, type: 'dangerous', consequence: 'compromised' },
          { id: 'call_bank', text: { en: 'Call bank directly', ar: 'اتصل بالبنك مباشرة' }, type: 'safe', clue: 'bank_verification' },
          { id: 'delete_email', text: { en: 'Delete email', ar: 'احذف البريد' }, type: 'safe' }
        ],
        clues: {
          sender_domain: { en: 'Domain is bank-oman.com instead of bankofoman.com', ar: 'النطاق هو bank-oman.com بدلاً من bankofoman.com' },
          bank_verification: { en: 'Bank confirms no suspicious activity', ar: 'البنك يؤكد عدم وجود نشاط مشبوه' }
        }
      },
      {
        id: 2,
        scene: 'phone',
        narrative: {
          en: 'You receive a call from someone claiming to be from tech support. They want you to install remote access software.',
          ar: 'تتلقى مكالمة من شخص يدعي أنه من الدعم التقني. يريدون منك تثبيت برنامج الوصول عن بُعد.'
        },
        actions: [
          { id: 'verify_caller', text: { en: 'Ask for verification', ar: 'اطلب التحقق' }, type: 'safe', clue: 'caller_id' },
          { id: 'install_software', text: { en: 'Install the software', ar: 'ثبت البرنامج' }, type: 'dangerous', consequence: 'hacked' },
          { id: 'hang_up', text: { en: 'Hang up and call official support', ar: 'أغلق المكالمة واتصل بالدعم الرسمي' }, type: 'safe', clue: 'official_support' },
          { id: 'give_info', text: { en: 'Provide personal information', ar: 'قدم المعلومات الشخصية' }, type: 'dangerous', consequence: 'identity_theft' }
        ],
        clues: {
          caller_id: { en: 'Caller ID shows unknown number', ar: 'معرف المتصل يظهر رقم غير معروف' },
          official_support: { en: 'Official support confirms no active calls', ar: 'الدعم الرسمي يؤكد عدم وجود مكالمات نشطة' }
        }
      }
    ];
  }

  openGame(gameType) {
    this.currentGame = gameType;
    const gameTitle = this.gameData[gameType].title[this.currentLanguage];
    document.getElementById('gameTitle').textContent = gameTitle;
    document.getElementById('gameModal').classList.add('active');
    document.getElementById('gameBody').innerHTML = document.getElementById(gameType + 'Game').innerHTML;
    
    this.startGame(gameType);
  }

  startGame(gameType) {
    switch (gameType) {
      case 'phish-safe':
        this.startPhishSafeGame();
        break;
      case 'hotspot':
        this.startHotspotGame();
        break;
      case 'phishroom':
        this.startPhishroomGame();
        break;
    }
  }

  startPhishSafeGame() {
    const game = this.gameData['phish-safe'];
    game.score = 0;
    game.level = 1;
    game.timeLeft = 30;
    game.currentScenario = 0;
    
    this.updatePhishSafeStats();
    this.loadPhishSafeScenario();
    this.startTimer();
  }

  startHotspotGame() {
    const game = this.gameData['hotspot'];
    game.found = 0;
    game.total = 5;
    game.mistakes = 0;
    game.currentScenario = 0;
    
    this.updateHotspotStats();
    this.loadHotspotScenario();
  }

  startPhishroomGame() {
    const game = this.gameData['phishroom'];
    game.clues = 0;
    game.safeActions = 0;
    game.riskLevel = 'Low';
    game.currentScene = 0;
    game.inventory = [];
    
    this.updatePhishroomStats();
    this.loadPhishroomScenario();
  }

  // Phish or Safe Game Methods
  loadPhishSafeScenario() {
    const game = this.gameData['phish-safe'];
    const scenario = game.scenarios[game.currentScenario];
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
    const game = this.gameData['phish-safe'];
    const scenario = game.scenarios[game.currentScenario];
    const isCorrect = (choice === scenario.type);
    
    if (isCorrect) {
      game.score += 10;
      this.showFeedback(true, scenario.explanation[this.currentLanguage]);
    } else {
      this.showFeedback(false, scenario.explanation[this.currentLanguage]);
    }
    
    this.updatePhishSafeStats();
    this.nextScenario();
  }

  nextScenario() {
    const game = this.gameData['phish-safe'];
    game.currentScenario++;
    
    if (game.currentScenario >= game.scenarios.length) {
      this.endPhishSafeGame();
    } else {
      setTimeout(() => {
        this.loadPhishSafeScenario();
        this.hideFeedback();
      }, 2000);
    }
  }

  startTimer() {
    const game = this.gameData['phish-safe'];
    game.timer = setInterval(() => {
      game.timeLeft--;
      this.updatePhishSafeStats();
      
      if (game.timeLeft <= 0) {
        this.endPhishSafeGame();
      }
    }, 1000);
  }

  endPhishSafeGame() {
    const game = this.gameData['phish-safe'];
    clearInterval(game.timer);
    
    const message = this.currentLanguage === 'en' 
      ? `Game Over! Final Score: ${game.score}`
      : `انتهت اللعبة! النقاط النهائية: ${game.score}`;
    
    this.showGameEndModal(message);
  }

  // Hotspot Game Methods
  loadHotspotScenario() {
    const game = this.gameData['hotspot'];
    const scenario = game.scenarios[game.currentScenario];
    const container = document.getElementById('emailScreenshot');
    
    container.innerHTML = `
      <img src="${scenario.image}" alt="Email Screenshot" />
      ${scenario.hotspots.map((hotspot, index) => `
        <div class="hotspot" 
             style="left: ${hotspot.x}%; top: ${hotspot.y}%; width: ${hotspot.width}%; height: ${hotspot.height}%;"
             onclick="gameManager.clickHotspot(${index})"
             data-type="${hotspot.type}"
             data-explanation="${hotspot.explanation[gameManager.currentLanguage]}">
        </div>
      `).join('')}
    `;
  }

  clickHotspot(index) {
    const game = this.gameData['hotspot'];
    const scenario = game.scenarios[game.currentScenario];
    const hotspot = scenario.hotspots[index];
    const hotspotElement = document.querySelectorAll('.hotspot')[index];
    
    if (hotspotElement.classList.contains('found')) {
      return; // Already found
    }
    
    hotspotElement.classList.add('found');
    game.found++;
    this.updateHotspotStats();
    
    this.showHotspotFeedback(true, hotspot.explanation[this.currentLanguage]);
    
    if (game.found >= game.total) {
      setTimeout(() => this.endHotspotGame(), 2000);
    }
  }

  endHotspotGame() {
    const game = this.gameData['hotspot'];
    const message = this.currentLanguage === 'en' 
      ? `Congratulations! Found ${game.found}/${game.total} red flags!`
      : `تهانينا! تم العثور على ${game.found}/${game.total} أعلام حمراء!`;
    
    this.showGameEndModal(message);
  }

  // Phishroom Game Methods
  loadPhishroomScenario() {
    const game = this.gameData['phishroom'];
    const scenario = game.scenarios[game.currentScene];
    const narrativeContainer = document.getElementById('narrativeContainer');
    const actionPanel = document.getElementById('actionPanel');
    
    narrativeContainer.innerHTML = `
      <div class="narrative-text">
        ${scenario.narrative[this.currentLanguage]}
      </div>
    `;
    
    actionPanel.innerHTML = scenario.actions.map(action => `
      <button class="action-btn ${action.type}" onclick="gameManager.takeAction('${action.id}')">
        ${action.text[this.currentLanguage]}
      </button>
    `).join('');
    
    this.updateInventory();
  }

  takeAction(actionId) {
    const game = this.gameData['phishroom'];
    const scenario = game.scenarios[game.currentScene];
    const action = scenario.actions.find(a => a.id === actionId);
    
    if (action.type === 'safe') {
      game.safeActions++;
      if (action.clue) {
        game.inventory.push(action.clue);
        game.clues++;
      }
      this.showPhishroomFeedback(true, action.text[this.currentLanguage]);
    } else if (action.type === 'dangerous') {
      game.riskLevel = 'High';
      this.showPhishroomFeedback(false, `Risk: ${action.consequence}`);
    }
    
    this.updatePhishroomStats();
    this.updateInventory();
    
    // Move to next scene
    setTimeout(() => {
      game.currentScene++;
      if (game.currentScene < game.scenarios.length) {
        this.loadPhishroomScenario();
      } else {
        this.endPhishroomGame();
      }
    }, 2000);
  }

  endPhishroomGame() {
    const game = this.gameData['phishroom'];
    const message = this.currentLanguage === 'en' 
      ? `Escape Complete! Safe Actions: ${game.safeActions}, Clues Found: ${game.clues}`
      : `اكتمل الهروب! الإجراءات الآمنة: ${game.safeActions}، الأدلة الموجودة: ${game.clues}`;
    
    this.showGameEndModal(message);
  }

  // Utility Methods
  updatePhishSafeStats() {
    document.getElementById('phishScore').textContent = this.gameData['phish-safe'].score;
    document.getElementById('phishTime').textContent = this.gameData['phish-safe'].timeLeft;
    document.getElementById('phishLevel').textContent = this.gameData['phish-safe'].level;
  }

  updateHotspotStats() {
    document.getElementById('hotspotFound').textContent = this.gameData['hotspot'].found;
    document.getElementById('hotspotTotal').textContent = this.gameData['hotspot'].total;
    document.getElementById('hotspotMistakes').textContent = this.gameData['hotspot'].mistakes;
  }

  updatePhishroomStats() {
    document.getElementById('phishroomClues').textContent = this.gameData['phishroom'].clues;
    document.getElementById('phishroomSafe').textContent = this.gameData['phishroom'].safeActions;
    document.getElementById('phishroomRisk').textContent = this.gameData['phishroom'].riskLevel;
  }

  updateInventory() {
    const game = this.gameData['phishroom'];
    const inventoryPanel = document.getElementById('inventoryPanel');
    
    if (inventoryPanel) {
      inventoryPanel.innerHTML = `
        <div class="inventory-title">${this.currentLanguage === 'en' ? 'Clues Collected' : 'الأدلة المجمعة'}</div>
        <div class="inventory-items">
          ${game.inventory.map(clue => `
            <div class="inventory-item collected">
              ${game.scenarios[game.currentScene].clues[clue][this.currentLanguage]}
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  showFeedback(isCorrect, explanation) {
    const container = document.getElementById('feedbackContainer');
    container.className = `feedback-container show ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    
    const title = isCorrect 
      ? (this.currentLanguage === 'en' ? 'Correct!' : 'صحيح!')
      : (this.currentLanguage === 'en' ? 'Incorrect!' : 'خطأ!');
    
    container.innerHTML = `
      <div class="feedback-title">${title}</div>
      <div class="feedback-text">${explanation}</div>
    `;
  }

  showHotspotFeedback(isCorrect, explanation) {
    const container = document.getElementById('hotspotFeedback');
    container.className = `feedback-container show ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    
    const title = isCorrect 
      ? (this.currentLanguage === 'en' ? 'Red Flag Found!' : 'تم العثور على علم أحمر!')
      : (this.currentLanguage === 'en' ? 'Not a Red Flag' : 'ليس علماً أحمر');
    
    container.innerHTML = `
      <div class="feedback-title">${title}</div>
      <div class="feedback-text">${explanation}</div>
    `;
  }

  showPhishroomFeedback(isCorrect, message) {
    const container = document.getElementById('narrativeContainer');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-container show ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    feedbackDiv.innerHTML = `
      <div class="feedback-title">${isCorrect ? 'Safe Action!' : 'Risky Action!'}</div>
      <div class="feedback-text">${message}</div>
    `;
    container.appendChild(feedbackDiv);
  }

  hideFeedback() {
    const container = document.getElementById('feedbackContainer');
    if (container) {
      container.classList.remove('show');
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
    
    // Restart current game with new language
    if (this.currentGame) {
      this.startGame(this.currentGame);
    }
  }

  showGameEndModal(message) {
    // Create game end modal
    const modal = document.createElement('div');
    modal.className = 'game-end-modal';
    modal.innerHTML = `
      <div class="game-end-content">
        <div class="game-end-header">
          <i class="fas fa-trophy"></i>
          <h3>${this.currentLanguage === 'en' ? 'Game Complete!' : 'اكتملت اللعبة!'}</h3>
        </div>
        <div class="game-end-message">
          ${message}
        </div>
        <div class="game-end-actions">
          <button class="btn btn-primary" onclick="gameManager.playAgain()">
            <i class="fas fa-redo"></i>
            ${this.currentLanguage === 'en' ? 'Play Again' : 'العب مرة أخرى'}
          </button>
          <button class="btn btn-secondary" onclick="gameManager.closeGameEndModal()">
            <i class="fas fa-times"></i>
            ${this.currentLanguage === 'en' ? 'Close' : 'إغلاق'}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 100);
  }

  closeGameEndModal() {
    const modal = document.querySelector('.game-end-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
    this.closeGame();
  }

  playAgain() {
    this.closeGameEndModal();
    setTimeout(() => {
      this.startGame(this.currentGame);
    }, 500);
  }

  closeGame() {
    document.getElementById('gameModal').classList.remove('active');
    this.currentGame = null;
    
    // Clear any active timers
    if (this.gameData['phish-safe'].timer) {
      clearInterval(this.gameData['phish-safe'].timer);
    }
    
    // Close any open game end modals
    const existingModal = document.querySelector('.game-end-modal');
    if (existingModal) {
      existingModal.remove();
    }
  }
}

// Global functions for HTML onclick handlers
function openGame(gameType) {
  if (gameManager) {
    gameManager.openGame(gameType);
  } else {
    console.error('Game Manager not initialized');
  }
}

function makeChoice(choice) {
  if (gameManager) {
    gameManager.makeChoice(choice);
  } else {
    console.error('Game Manager not initialized');
  }
}

function toggleLanguage() {
  if (gameManager) {
    gameManager.toggleLanguage();
  } else {
    console.error('Game Manager not initialized');
  }
}

function closeGame() {
  if (gameManager) {
    gameManager.closeGame();
  } else {
    console.error('Game Manager not initialized');
  }
}

// Initialize game manager when DOM is loaded
let gameManager;
document.addEventListener('DOMContentLoaded', function() {
  gameManager = new GameManager();
  
  // Ensure games are properly initialized
  console.log('Game Manager initialized:', gameManager);
});

// Analytics and Scoring System
class GameAnalytics {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      gamesPlayed: [],
      totalScore: 0,
      language: 'en',
      device: this.getDeviceType()
    };
  }

  getDeviceType() {
    return /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';
  }

  recordGameResult(gameType, result) {
    this.sessionData.gamesPlayed.push({
      gameType,
      result,
      timestamp: Date.now(),
      duration: Date.now() - this.sessionData.startTime
    });
  }

  exportData() {
    const data = {
      ...this.sessionData,
      endTime: Date.now(),
      totalDuration: Date.now() - this.sessionData.startTime
    };
    
    // Create downloadable CSV
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, 'smartshield-game-analytics.csv');
  }

  convertToCSV(data) {
    const headers = ['Game Type', 'Score', 'Duration', 'Language', 'Device', 'Timestamp'];
    const rows = data.gamesPlayed.map(game => [
      game.gameType,
      game.result.score || 0,
      game.duration,
      data.language,
      data.device,
      new Date(game.timestamp).toISOString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Accessibility Features
class GameAccessibility {
  constructor() {
    this.init();
  }

  init() {
    this.addKeyboardNavigation();
    this.addScreenReaderSupport();
    this.addHighContrastMode();
  }

  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeGame();
      }
      
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  addScreenReaderSupport() {
    // Add ARIA labels and roles
    const gameModal = document.getElementById('gameModal');
    if (gameModal) {
      gameModal.setAttribute('role', 'dialog');
      gameModal.setAttribute('aria-labelledby', 'gameTitle');
      gameModal.setAttribute('aria-modal', 'true');
    }
  }

  addHighContrastMode() {
    // Add high contrast mode toggle
    const style = document.createElement('style');
    style.id = 'high-contrast';
    style.textContent = `
      .high-contrast {
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
        --bg-primary: #000000;
        --bg-secondary: #1a1a1a;
        --accent-primary: #00ff00;
        --accent-error: #ff0000;
      }
    `;
    document.head.appendChild(style);
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
  new GameAccessibility();
});

// Performance Monitoring
class GamePerformance {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0
    };
    this.startTime = performance.now();
  }

  recordLoadTime() {
    this.metrics.loadTime = performance.now() - this.startTime;
  }

  recordRenderTime() {
    this.metrics.renderTime = performance.now() - this.startTime;
  }

  recordInteractionTime() {
    this.metrics.interactionTime = performance.now() - this.startTime;
  }

  getMetrics() {
    return {
      ...this.metrics,
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
      fps: this.calculateFPS()
    };
  }

  calculateFPS() {
    // Simple FPS calculation
    return 60; // Placeholder
  }
}

// Initialize performance monitoring
const gamePerformance = new GamePerformance();
window.addEventListener('load', () => {
  gamePerformance.recordLoadTime();
});

// Console logging for debugging
console.log(`
🎮 SmartShield Games System Loaded
====================================

Games Available:
- Phish or Safe? (Email classification)
- Spot the Red Flag (Hotspot detection)  
- Phishroom Escape (Narrative puzzle)

Features:
- Bilingual support (English/Arabic)
- Accessibility features
- Analytics tracking
- Performance monitoring

Use openGame('phish-safe'), openGame('hotspot'), or openGame('phishroom') to start games.
`);
