document.addEventListener('DOMContentLoaded', () => {
    let balance = 150;
    let currentLang = 'en';
    let purchasedGifts = [];
    let activeChatId = 'ai';

    // База повідомлень (Тільки Збережене та Бот)
    const chatHistories = {
        ai: [
            { sender: 'bot', text: 'Welcome to PIGEONTG client! 🕊️' },
            { sender: 'bot', text: 'I am your inline assistant bot. Click the button to start the Telegram game process.', isGameLink: true }
        ],
        saved: [
            { sender: 'user', text: 'My personal encrypted notes and source codes inside PIGEONTG.' }
        ]
    };

    const aiResponses = [
        "Check out the new Telegram Gifts tab to send real collectible birds!",
        "Your WRC budget is secure inside the PIGEONTG application core.",
        "To open the mini-app game, click on the 🎮 Play Game menu button.",
        "This client design is perfectly optimized for swift communication."
    ];

    // Повний пакет локалізації для Telegram-налаштувань
    const localization = {
        en: {
            chatsTab: "💬 Chats", shopTab: "🎁 Gifts", profileTab: "👤 Profile", settingsTab: "⚙️ Settings",
            headingShop: "Telegram Gifts", headingSettings: "Settings",
            lblProfName: "Username", lblProfPhone: "Phone", lblProfInv: "My Received Gifts",
            lblSetLang: "Interface Language", lblSetTheme: "Chat Themes",
            setSecPrivacy: "Privacy and Security", setSecNotif: "Notifications and Sounds", 
            setSecData: "Data and Storage", setSecFolders: "Chat Folders",
            setIncognito: "Phone Number Privacy", setPasscode: "Passcode Lock", 
            setTwoStep: "Two-Step Verification", setNotifChats: "Private Chats", 
            setNotifGroups: "Group Notifications", setEco: "Auto-Download Media",
            setStorage: "Keep Media", setFolderActive: "Enable Folders",
            btnSend: "SEND", searchPlaceholder: "Search...", inputPlaceholder: "Type a message...", botPlayBtn: "🎮 Play Game"
        },
        ua: {
            chatsTab: "💬 Чати", shopTab: "🎁 Подарунки", profileTab: "👤 Профіль", settingsTab: "⚙️ Налаштування",
            headingShop: "Подарунки Telegram", headingSettings: "Налаштування",
            lblProfName: "Ім'я користувача", lblProfPhone: "Телефон", lblProfInv: "Мої отримані подарунки",
            lblSetLang: "Мова інтерфейсу", lblSetTheme: "Теми чатів",
            setSecPrivacy: "Приватність і безпека", setSecNotif: "Сповіщення та звуки", 
            setSecData: "Дані та сховище", setSecFolders: "Папки з чатами",
            setIncognito: "Конфіденційність телефону", setPasscode: "Код-пароль", 
            setTwoStep: "Двоетапна автентифікація", setNotifChats: "Особисті чати", 
            setNotifGroups: "Сповіщення груп", setEco: "Автозавантаження медіа",
            setStorage: "Зберігати медіа", setFolderActive: "Увімкнути папки",
            btnSend: "ВІДПРАВИТИ", searchPlaceholder: "Пошук...", inputPlaceholder: "Напишіть повідомлення...", botPlayBtn: "🎮 Грати"
        },
        pl: {
            chatsTab: "💬 Czaty", shopTab: "🎁 Prezenty", profileTab: "👤 Profil", settingsTab: "⚙️ Ustawienia",
            headingShop: "Prezenty Telegram", headingSettings: "Ustawienia",
            lblProfName: "Nazwa użytkownika", lblProfPhone: "Telefon", lblProfInv: "Moje Prezenty",
            lblSetLang: "Język interfejsu", lblSetTheme: "Motywy czatu",
            setSecPrivacy: "Prywatność i bezpieczeństwo", setSecNotif: "Powiadomienia i dźwięki", 
            setSecData: "Dane i pamięć", setSecFolders: "Foldery czatów",
            setIncognito: "Prywatność numeru", setPasscode: "Blokada kodem", 
            setTwoStep: "Weryfikacja dwuetapowa", setNotifChats: "Czaty prywatne", 
            setNotifGroups: "Powiadomienia z grup", setEco: "Auto-pobieranie mediów",
            setStorage: "Zachowaj media", setFolderActive: "Włącz foldery",
            btnSend: "WYŚLIJ", searchPlaceholder: "Szukaj...", inputPlaceholder: "Napisz wiadomość...", botPlayBtn: "🎮 Zagraj"
        },
        sk: {
            chatsTab: "💬 Chaty", shopTab: "🎁 Darčeky", profileTab: "👤 Profil", settingsTab: "⚙️ Nastavenia",
            headingShop: "Telegram Darčeky", headingSettings: "Nastavenia",
            lblProfName: "Používateľské meno", lblProfPhone: "Telefón", lblProfInv: "Moje Darčeky",
            lblSetLang: "Jazyk rozhrania", lblSetTheme: "Témy chatu",
            setSecPrivacy: "Súkromie a bezpečnosť", setSecNotif: "Upozornenia a zvuky", 
            setSecData: "Dáta a úložisko", setSecFolders: "Priečinky chatov",
            setIncognito: "Súkromie čísla", setPasscode: "Zámok kódom", 
            setTwoStep: "Dvojstupňové overenie", setNotifChats: "Súkromné chaty", 
            setNotifGroups: "Upozornenia skupín", setEco: "Automatické sťahovanie",
            setStorage: "Uchovať médiá", setFolderActive: "Zapnúť priečinky",
            btnSend: "ODOSLAŤ", searchPlaceholder: "Hľadať...", inputPlaceholder: "Napíšte správu...", botPlayBtn: "🎮 Hrať"
        }
    };

    const balanceDisplay = document.getElementById('balance-display');
    const mainContainer = document.getElementById('app-main-container');
    const authScreen = document.getElementById('auth-screen');

    // Логіка Екрану Авторизації
    const regSendBtn = document.getElementById('reg-send-btn');
    const regCompleteBtn = document.getElementById('reg-complete-btn');
    const phoneInputStep1 = document.getElementById('reg-phone-input');
    const codeBoxStep1 = document.getElementById('reg-code-box');
    const codeInputStep1 = document.getElementById('reg-code-input');
    const step1Container = document.getElementById('auth-step-phone');
    const step2Container = document.getElementById('auth-step-profile');

    if (regSendBtn) {
        regSendBtn.addEventListener('click', () => {
            const phoneVal = phoneInputStep1.value.trim();
            if (phoneVal === '') return;

            if (codeBoxStep1.style.display === 'none' || !codeBoxStep1.style.display) {
                codeBoxStep1.style.display = 'block';
                regSendBtn.innerText = 'Verify Code';
            } else {
                if (codeInputStep1.value.trim() === '') return;
                step1Container.style.display = 'none';
                step2Container.style.display = 'block';
            }
        });
    }

    if (regCompleteBtn) {
        regCompleteBtn.addEventListener('click', () => {
            const nicknameVal = document.getElementById('reg-name-input').value.trim();
            if (nicknameVal === '') return;

            if (document.getElementById('name-input')) document.getElementById('name-input').value = '@' + nicknameVal.toLowerCase();
            if (document.getElementById('phone-input')) document.getElementById('phone-input').value = phoneInputStep1.value;
            if (document.getElementById('chat-user-title')) document.getElementById('chat-user-title').innerText = nicknameVal;
            
            const firstLetter = nicknameVal.charAt(0).toUpperCase();
            const avatarBox = document.getElementById('prof-avatar-placeholder');
            if (avatarBox) avatarBox.innerText = firstLetter;

            if (authScreen) authScreen.style.display = 'none';
            if (mainContainer) mainContainer.style.display = 'flex';
            
            renderChats();
            loadMessages();
        });
    }

    // Перемикання вкладок нижньої навігації (Виправлено клікабельність)
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));

            item.classList.add('active');
            const target = item.getAttribute('data-target');
            const targetView = document.getElementById(target);
            if (targetView) targetView.classList.add('active');
        });
    });

    // Зміна тем (Кібер-підсвітки)
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            document.body.className = ''; 
            if (e.target.value !== 'default') {
                document.body.classList.add(e.target.value);
            }
        });
    }

    // Робота кліків по світчам (Toggle-switches)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-switch')) {
            e.target.classList.toggle('active');
        }
    });

    // Селектор мови (Запуск функції динамічного перекладу)
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            applyTranslations();
        });
    }

    function applyTranslations() {
        const ln = localization[currentLang];
        if (!ln) return;

        // Переклад назв самих кнопок вкладок
        document.getElementById('chats-tab-btn').innerText = ln.chatsTab.split(' ')[0] || "💬";
        document.getElementById('shop-tab-btn').innerText = ln.shopTab.split(' ')[0] || "🎁";
        document.getElementById('profile-tab-btn').innerText = ln.profileTab.split(' ')[0] || "👤";
        document.getElementById('settings-tab-btn').innerText = ln.settingsTab.split(' ')[0] || "⚙️";

        document.getElementById('chats-tab-btn').setAttribute('title', ln.chatsTab);
        document.getElementById('shop-tab-btn').setAttribute('title', ln.shopTab);
        document.getElementById('profile-tab-btn').setAttribute('title', ln.profileTab);
        document.getElementById('settings-tab-btn').setAttribute('title', ln.settingsTab);

        // Переклад заголовків секцій
        document.getElementById('heading-shop-title').innerText = ln.headingShop;
        document.getElementById('heading-settings-title').innerText = ln.headingSettings;

        // Переклад профілю
        document.getElementById('label-prof-name').innerText = ln.lblProfName;
        document.getElementById('label-prof-phone').innerText = ln.lblProfPhone;
        document.getElementById('label-prof-inv').innerText = ln.lblProfInv;

        // Переклад блоку налаштувань (Усі id тепер динамічно змінюються)
        document.getElementById('label-set-lang').innerText = ln.lblSetLang;
        document.getElementById('label-set-theme').innerText = ln.lblSetTheme;
        
        document.getElementById('set-sec-privacy').innerText = ln.setSecPrivacy;
        document.getElementById('set-incognito').innerText = ln.setIncognito;
        document.getElementById('set-passcode').innerText = ln.setPasscode;
        if(document.getElementById('set-twostep')) document.getElementById('set-twostep').innerText = ln.setTwoStep;

        document.getElementById('set-sec-notif').innerText = ln.setSecNotif;
        document.getElementById('set-notif-chats').innerText = ln.setNotifChats;
        if(document.getElementById('set-notif-groups')) document.getElementById('set-notif-groups').innerText = ln.setNotifGroups;

        document.getElementById('set-sec-data').innerText = ln.setSecData;
        document.getElementById('set-eco').innerText = ln.setEco;
        if(document.getElementById('set-storage')) document.getElementById('set-storage').innerText = ln.setStorage;

        if(document.getElementById('set-sec-folders')) document.getElementById('set-sec-folders').innerText = ln.setSecFolders;
        if(document.getElementById('set-folder-active')) document.getElementById('set-folder-active').innerText = ln.setFolderActive;

        // Інпути та чат
        document.getElementById('send-msg-btn').innerText = ln.btnSend;
        document.getElementById('bot-menu-game-btn').innerText = ln.botPlayBtn;
        document.querySelector('.search-bar').setAttribute('placeholder', ln.searchPlaceholder);
        document.getElementById('msg-input').setAttribute('placeholder', ln.inputPlaceholder);
        
        renderChats(); 
        loadMessages();
    }

    // Відрендерити тільки 2 чати (Бот та Збережене)
    function renderChats() {
        const chatListContainer = document.querySelector('.chat-list');
        if (!chatListContainer) return;

        const isUa = (currentLang === 'ua');
        const savedTitle = isUa ? "Збережене" : "Saved Messages";
        const savedSub = isUa ? "Нотатки" : "Personal cloud";

        chatListContainer.innerHTML = `
            <div class="chat-item ${activeChatId === 'saved' ? 'active' : ''}" data-chat="saved">
                <div class="chat-avatar tg-avatar-saved">🔖</div>
                <div class="chat-info">
                    <h4>${savedTitle}</h4>
                    <p>${savedSub}</p>
                </div>
            </div>
            <div class="chat-item ${activeChatId === 'ai' ? 'active' : ''}" data-chat="ai">
                <div class="chat-avatar">🤖</div>
                <div class="chat-info">
                    <h4>Pigeon AI</h4>
                    <p>bot</p>
                </div>
            </div>
        `;

        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                activeChatId = item.getAttribute('data-chat');
                renderChats();
                loadMessages();
            });
        });
    }

    function loadMessages() {
        const messageArea = document.querySelector('.chat-messages');
        const activeTitle = document.getElementById('active-chat-name');
        const activeStatus = document.getElementById('active-chat-status');
        const botMenuBtn = document.getElementById('bot-menu-game-btn');
        if (!messageArea) return;

        const isUa = (currentLang === 'ua');

        if (activeTitle && activeStatus) {
            if (activeChatId === 'ai') {
                activeTitle.innerText = 'Pigeon AI 🤖';
                activeStatus.innerText = 'bot';
            } else if (activeChatId === 'saved') {
                activeTitle.innerText = isUa ? "Збережене 🔖" : "Saved Messages 🔖";
                activeStatus.innerText = isUa ? "особистий хмарний архів" : "personal storage";
            }
        }

        if (botMenuBtn) {
            botMenuBtn.style.display = (activeChatId === 'ai') ? 'block' : 'none';
        }

        messageArea.innerHTML = '';
        const history = chatHistories[activeChatId] || [];
        history.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`;
            
            if (msg.isGameLink) {
                msgDiv.innerHTML = `
                    <div class="message-text" style="border-left: 3px solid var(--primary-glow); background: rgba(0, 240, 255, 0.05); box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);">
                        <strong>🎮 Pigeon Game Bot</strong><br>${msg.text}
                        <button class="game-chat-inline-btn" style="display:block; margin-top:8px; width:100%; padding:6px; background:var(--primary-glow); color:#0b141a; border:none; border-radius:4px; font-weight:bold; cursor:pointer; box-shadow: 0 0 8px var(--primary-glow);">Play</button>
                    </div>
                `;
            } else {
                msgDiv.innerHTML = `<div class="message-text">${msg.text}</div>`;
            }
            messageArea.appendChild(msgDiv);
        });
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    const sendMsgBtn = document.getElementById('send-msg-btn');
    const msgInput = document.getElementById('msg-input');

    function sendMessage() {
        if (!msgInput) return;
        const text = msgInput.value.trim();
        if (text === '') return;

        chatHistories[activeChatId].push({ sender: 'user', text: text });
        loadMessages();
        msgInput.value = '';

        if (activeChatId === 'ai') {
            setTimeout(() => {
                const randomReply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                chatHistories.ai.push({ sender: 'bot', text: randomReply });
                loadMessages();
            }, 1000);
        }
    }

    if (sendMsgBtn) sendMsgBtn.addEventListener('click', sendMessage);
    if (msgInput) {
        msgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    const gameOverlay = document.getElementById('game-overlay-box');
    const gameTitle = document.getElementById('active-game-title');
    const gameSandbox = document.getElementById('game-sandbox-body');
    const closeGameBtn = document.getElementById('close-game-btn');

    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', () => {
            if (gameOverlay) gameOverlay.className = 'game-overlay-hidden';
            if (gameSandbox) gameSandbox.innerHTML = ''; 
        });
    }

    function openBotGame() {
        if (gameOverlay) gameOverlay.className = 'game-overlay-visible';
        if (gameTitle) gameTitle.innerText = 'Pigeon Speed Flight';
        if (gameSandbox) {
            gameSandbox.innerHTML = `
                <div class="game-wrapper">
                    <p style="color: #fff; font-size:13px; margin-bottom:10px;">🚀 Bot Game: Quantum Bird Simulator</p>
                    <div style="border: 2px dashed var(--primary-glow); height: 80px; display:flex; align-items:center; justify-content:center; margin: 15px 0; background: #101924; overflow:hidden; border-radius:8px; box-shadow: inset 0 0 10px rgba(0,240,255,0.2);">
                        <span id="flying-pigeon" style="font-size:24px; position:relative; left:-40px; transition: 0.2s;">🕊️</span>
                    </div>
                    <button id="fly-boost-btn" class="game-btn" style="width:100%; padding:10px; background:var(--primary-glow); border:none; font-weight:bold; cursor:pointer; box-shadow: 0 0 15px var(--primary-glow); color: #000;">BOOST SPEED</button>
                </div>
            `;
            const bird = document.getElementById('flying-pigeon');
            let position = -40;
            document.getElementById('fly-boost-btn').addEventListener('click', () => {
                position += 20;
                if (position > 60) {
                    position = -40;
                    balance += 15;
                    updateBalanceDisplay();
                }
                bird.style.left = position + 'px';
            });
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'bot-menu-game-btn' || e.target.classList.contains('game-chat-inline-btn'))) {
            openBotGame();
        }
    });

    const quickEarnBtn = document.getElementById('btn-click-earn');
    if (quickEarnBtn) {
        quickEarnBtn.addEventListener('click', () => {
            if (gameOverlay) gameOverlay.className = 'game-overlay-visible';
            if (gameTitle) gameTitle.innerText = 'Buy WRC Pack';
            if (gameSandbox) {
                gameSandbox.innerHTML = `
                    <div class="game-wrapper">
                        <p style="color: #ffd700; font-size:14px; font-weight:bold; margin-bottom:15px;">🛒 Telegram Star Invoice</p>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <button class="game-btn buy-wrc-btn" data-amount="100" data-stars="50">⚡ 100 WRC — 50 Stars</button>
                            <button class="game-btn buy-wrc-btn" data-amount="500" data-stars="200" style="background: linear-gradient(135deg, #00f0ff, #7a00ff); color: white; box-shadow: 0 0 10px rgba(0,240,255,0.4);">🔥 500 WRC — 200 Stars</button>
                        </div>
                    </div>
                `;
                
                document.querySelectorAll('.buy-wrc-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const amount = parseInt(btn.getAttribute('data-amount'));
                        balance += amount;
                        updateBalanceDisplay();
                        if (gameOverlay) gameOverlay.className = 'game-overlay-hidden';
                    });
                });
            }
        });
    }

    function updateBalanceDisplay() {
        if (balanceDisplay) balanceDisplay.innerText = `${balance} WRC`;
    }

    document.querySelectorAll('.tg-gift-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.tg-gift-item');
            const cost = parseInt(card.getAttribute('data-cost'));
            const name = card.getAttribute('data-name');
            
            if (balance >= cost) {
                balance -= cost;
                updateBalanceDisplay();
                
                let emoji = "🕊️";
                if (name === "Cyber Pigeon") emoji = "🤖";
                if (name === "Golden Pigeon") emoji = "👑";

                purchasedGifts.push(`${emoji} ${name}`);
                
                const inv = document.getElementById('gifts-inventory');
                if (inv) {
                    inv.innerHTML = purchasedGifts.map(g => `<div class="tg-inv-badge" style="box-shadow: 0 0 8px rgba(0, 240, 255, 0.2); border: 1px solid var(--primary-glow);">${g}</div>`).join('');
                }
            }
        });
    });

    renderChats();
    loadMessages();
});
