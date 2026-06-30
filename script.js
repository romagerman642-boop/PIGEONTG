let currentUser = "User";
let currentLang = "en";
let activeChatId = null;
let customUserAvatar = ""; 

let chats = [
    { id: 1, name: "Saved Messages", avatar: "SM", isSaved: true, status: "cloud storage active", messages: [] }
];

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function wipeAllAccounts() {
    localStorage.clear();
    showToast("All accounts and matrix data wiped. Rebooting core...");
    setTimeout(() => {
        window.location.reload();
    }, 1200);
}

window.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К")) {
        e.preventDefault();
        wipeAllAccounts();
    }
});

function loadSavedAccounts() {
    const accounts = JSON.parse(localStorage.getItem("tg_cyber_accounts")) || [];
    const container = document.getElementById("accounts-list");
    const section = document.getElementById("saved-accounts-section");
    
    if (accounts.length === 0) {
        section.style.display = "none";
        return;
    }
    
    section.style.display = "block";
    container.innerHTML = "";
    
    accounts.forEach(acc => {
        const row = document.createElement("div");
        row.className = "account-selector-badge";
        row.innerHTML = `
            <span style="font-weight:bold; color:var(--neon-cyan);">${acc}</span>
            <span style="font-size:10px; color:var(--text-muted);">Click to Resume</span>
        `;
        row.onclick = () => loginAs(acc);
        container.appendChild(row);
    });
}

function saveAccountLocally(username) {
    let accounts = JSON.parse(localStorage.getItem("tg_cyber_accounts")) || [];
    if (!accounts.includes(username)) {
        accounts.push(username);
        localStorage.setItem("tg_cyber_accounts", JSON.stringify(accounts));
    }
}

function loginAs(username) {
    currentUser = username;
    saveAccountLocally(username);
    
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("app-main-container").style.display = "flex";
    
    document.getElementById("settings-display-name").innerText = currentUser;
    document.getElementById("menu-user-name").innerText = currentUser;
    
    customUserAvatar = localStorage.getItem(`avatar_${currentUser}`) || "";
    applyUserAvatar();
    
    showToast(`Session established: Welcome back, ${currentUser}`);
    renderChats();
}

function applyUserAvatar() {
    const menuLetter = document.getElementById("menu-avatar-letter");
    const settingsLetter = document.getElementById("settings-avatar-letter");
    
    if (customUserAvatar) {
        menuLetter.innerText = "";
        menuLetter.style.backgroundImage = `url('${customUserAvatar}')`;
        
        settingsLetter.innerText = "";
        settingsLetter.style.backgroundImage = `url('${customUserAvatar}')`;
    } else {
        const initial = currentUser.charAt(0).toUpperCase();
        menuLetter.innerText = initial;
        menuLetter.style.backgroundImage = "none";
        
        settingsLetter.innerText = initial;
        settingsLetter.style.backgroundImage = "none";
    }
}

function handleAvatarUrlChange() {
    const urlInput = document.getElementById("cyber-avatar-url-field");
    if(urlInput && urlInput.value.trim()) {
        customUserAvatar = urlInput.value.trim();
        localStorage.setItem(`avatar_${currentUser}`, customUserAvatar);
        applyUserAvatar();
        showToast("Avatar sync complete via remote link.");
        closeSubSettings();
    }
}

function handleAvatarFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            customUserAvatar = e.target.result;
            localStorage.setItem(`avatar_${currentUser}`, customUserAvatar);
            applyUserAvatar();
            showToast("Local avatar matrix updated.");
            closeSubSettings();
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById("auth-login-btn").addEventListener("click", () => {
    const input = document.getElementById("auth-username").value.trim();
    if(!input) {
        showToast("Access Denied: Node name cannot be empty");
        return;
    }
    loginAs(input);
});

document.getElementById("menu-logout-btn").addEventListener("click", () => {
    document.getElementById("app-main-container").style.display = "none";
    document.getElementById("auth-screen").style.display = "flex";
    document.getElementById("auth-username").value = "";
    activeChatId = null;
    document.getElementById("active-chat-viewport").style.display = "none";
    document.getElementById("chat-empty-state-view").style.display = "flex";
    loadSavedAccounts();
    showToast("Session terminated. Core locked.");
});

function setTheme(themeName) {
    document.body.className = '';
    document.body.classList.add('theme-' + themeName);
    
    document.querySelectorAll('.theme-preview-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('btn-theme-' + themeName);
    if(activeBtn) activeBtn.classList.add('active');
    showToast(`Theme changed to: ${themeName.toUpperCase()}`);
}

function updateFontSize(size) {
    document.getElementById('font-size-val').innerText = size + "px";
    document.querySelectorAll('.message-text').forEach(msg => {
        msg.style.fontSize = size + "px";
    });
}

const subSettingsData = {
    avatar_change: {
        title: "Modify Avatar Matrix",
        html: `
            <div class="sub-panel-section-title">Option 1: Image URL Link</div>
            <input type="text" id="cyber-avatar-url-field" placeholder="Paste direct image link..." class="cyber-input-style" style="width:100%; margin-bottom:10px;">
            <button class="cyber-btn-action" style="width:100%; margin-bottom:20px;" onclick="handleAvatarUrlChange()">Sync Link</button>
            
            <div class="sub-panel-section-title">Option 2: Local Storage File</div>
            <input type="file" id="cyber-avatar-file-field" accept="image/*" class="cyber-input-style" style="width:100%; margin-bottom:10px;" onchange="handleAvatarFileChange(event)">
            <p style="color:var(--text-muted); font-size:11px;">Upload PNG or JPG directly into local core memory.</p>
        `
    },
    notifications: {
        title: "Notifications and Sounds",
        html: `
            <div class="sub-panel-section-title">Message notifications</div>
            <div class="sub-option-row"><span>Private Chats</span><input type="checkbox" checked class="cyber-switch"></div>
            <div class="sub-option-row"><span>Group Notifications</span><input type="checkbox" checked class="cyber-switch"></div>
            
            <div class="sub-panel-section-title">Sound Settings</div>
            <div class="sub-option-row"><span>Notification Sound</span><select class="cyber-select"><option>Laser Pulse</option><option>Muted</option></select></div>
        `
    },
    data: {
        title: "Data and Storage",
        html: `
            <div class="sub-panel-section-title">Disk Usage</div>
            <div class="sub-option-row"><span>Auto-Download Media</span><input type="checkbox" checked class="cyber-switch"></div>
            <div class="sub-option-row"><span>Storage Cache</span><button class="cyber-btn-action" onclick="showToast('Cache cleared!')">Wipe 1.2 GB Cache</button></div>
        `
    },
    privacy: {
        title: "Privacy and Security",
        html: `
            <div class="sub-panel-section-title">Security Layers</div>
            <div class="sub-option-row"><span>Two-Step Verification</span><span style="color:var(--neon-cyan)">Active ✔</span></div>
            <div class="sub-option-row"><span>Passcode Lock</span><input type="checkbox" class="cyber-switch"></div>
        `
    },
    general: {
        title: "General Settings & Themes",
        html: `
            <div class="sub-panel-section-title">Select App Theme</div>
            <div class="theme-selector-box">
                <div class="theme-preview-btn active" id="btn-theme-dark-neon" onclick="setTheme('dark-neon')">Dark Neon</div>
                <div class="theme-preview-btn" id="btn-theme-ultra-black" onclick="setTheme('ultra-black')">Ultra Black</div>
                <div class="theme-preview-btn" id="btn-theme-light-cyber" onclick="setTheme('light-cyber')">Light Cyber</div>
            </div>

            <div class="sub-panel-section-title">Interface Customization</div>
            <div class="sub-option-row">
                <span>Message Font Size</span>
                <div class="cyber-range-wrapper">
                    <input type="range" min="12" max="22" value="14" oninput="updateFontSize(this.value)">
                    <span id="font-size-val" style="color:var(--neon-cyan); min-width:30px;">14px</span>
                </div>
            </div>
        `
    },
    folders: {
        title: "Chat Folders Settings",
        html: `
            <div class="sub-panel-section-title">Your Active Folders</div>
            <div class="folder-mock-item">📁 <span>Personal Archive</span></div>
            <div class="folder-mock-item">📁 <span>Dev & Coding Nodes</span></div>
            <button class="cyber-btn-action" style="margin-top:15px; width:100%" onclick="showToast('Feature locked in Alpha')">+ Create Custom Folder</button>
        `
    },
    stickers: {
        title: "Stickers and Emoji",
        html: `
            <div class="sub-panel-section-title">Emoji Settings</div>
            <div class="sub-option-row"><span>Suggest Animated Emoji</span><input type="checkbox" checked class="cyber-switch"></div>
            <div class="sub-option-row"><span>Cyberpunk Neon Pack V2</span><span style="color:var(--text-muted)">Installed</span></div>
        `
    },
    media: {
        title: "Speakers and Camera",
        html: `
            <div class="sub-panel-section-title">Hardware Routing</div>
            <div class="sub-option-row"><span>Input Microphone Device</span><select class="cyber-select"><option>System Default</option></select></div>
        `
    },
    devices: {
        title: "Active Devices & Terminals",
        html: `
            <div class="sub-panel-section-title">Current Main Session</div>
            <div class="device-card active">
                <strong>Web Client Terminal</strong><br>
                <span style="color:var(--neon-cyan)">Active (Online)</span><br>
                <span style="font-size:11px; color:var(--text-muted)">IP: 192.168.1.55 • Rivne, UA</span>
            </div>
            <button class="cyber-btn-action" style="margin-top:15px; width:100%; border-color:#ff0055; color:#ff0055;" onclick="showToast('Other sessions killed')">Terminate All Other Sessions</button>
        `
    },
    language: {
        title: "Language / Мова",
        html: `
            <div class="sub-panel-section-title">Select Core Language</div>
            <div class="sub-option-row" onclick="changeSystemLang('English', 'en')"><span>English</span><span style="color:var(--neon-cyan)">✔</span></div>
            <div class="sub-option-row" onclick="changeSystemLang('Ukrainian', 'uk')"><span>Українська</span></div>
        `
    },
    shortcuts: {
        title: "Keyboard Shortcuts",
        html: `
            <div class="sub-panel-section-title">Navigation keys</div>
            <div class="sub-option-row"><span>Search Chat Network</span><kbd>Ctrl + F</kbd></div>
            <div class="sub-option-row"><span>Open Core Settings</span><kbd>Ctrl + ,</kbd></div>
            <div class="sub-option-row"><span>Wipe All Node Data</span><kbd>Alt + R</kbd></div>
        `
    },
    vorkit_premium: {
        title: "Vorkit Premium Upgrades",
        html: `
            <div style="text-align:center; padding:15px 0;">
                <span style="font-size:40px; text-shadow:var(--cyan-glow)">🪙</span>
                <h4 style="margin-top:10px; color:#fff">Unlock Elite Status</h4>
                <p style="color:var(--text-muted); font-size:12px; margin-top:5px;">Gain access to neon glowing frames, priority servers, and mining multipliers.</p>
                <button class="cyber-btn-action" style="margin-top:20px; width:100%; background:var(--neon-cyan); color:#000; font-weight:bold;" onclick="showToast('Vorkit Premium Synced!')">ACTIVATE FOR 500 VRC</button>
            </div>
        `
    },
    gift: {
        title: "Send a VRC Gift Pack",
        html: `
            <div class="sub-panel-section-title">Target parameters</div>
            <input type="text" placeholder="Enter target Nickname..." class="cyber-input-style" style="margin-bottom:12px; width:100%;">
            <button class="cyber-btn-action" style="width:100%" onclick="showToast('VRC Gift Package Transferred!')">Transfer Vorkit Coins</button>
        `
    }
};

const menuTrigger = document.getElementById("main-menu-trigger");
const mainMenu = document.getElementById("tg-main-menu");

menuTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    mainMenu.classList.toggle("active");
});

document.addEventListener("click", () => {
    mainMenu.classList.remove("active");
    const optMenu = document.getElementById("chat-options-menu");
    if(optMenu) optMenu.classList.remove("active");
});

document.getElementById("menu-settings-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    mainMenu.classList.remove("active");
    document.getElementById("sidebar-default-view").style.display = "none";
    document.getElementById("sidebar-settings-view").style.display = "block";
});

document.getElementById("settings-back-btn").addEventListener("click", () => {
    closeSubSettings();
    document.getElementById("sidebar-settings-view").style.display = "none";
    document.getElementById("sidebar-default-view").style.display = "block";
});

document.getElementById("menu-saved-messages").addEventListener("click", () => {
    mainMenu.classList.remove("active");
    selectChat(1);
});

document.getElementById("tg-search-input").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    renderChats(query);
});

function openSubSettings(key) {
    const data = subSettingsData[key];
    if (!data) return;
    
    document.getElementById("sub-panel-title").innerText = data.title;
    document.getElementById("sub-panel-dynamic-content").innerHTML = data.html;
    document.getElementById("sub-settings-panel").classList.add("active");
}

function closeSubSettings() {
    const subPanel = document.getElementById("sub-settings-panel");
    if(subPanel) subPanel.classList.remove("active");
}

function changeSystemLang(name, langKey) {
    document.getElementById("current-lang-lbl").innerText = name;
    closeSubSettings();
    showToast(`Language swapped to ${name}`);
}

function openNewContactModal() {
    mainMenu.classList.remove("active");
    document.getElementById("contact-modal").classList.add("active");
    document.getElementById("modal-contact-name").focus();
}

document.getElementById("modal-cancel-btn").addEventListener("click", () => {
    document.getElementById("contact-modal").classList.remove("active");
    document.getElementById("modal-contact-name").value = "";
});

document.getElementById("modal-confirm-btn").addEventListener("click", () => {
    const nameInput = document.getElementById("modal-contact-name").value.trim();
    if (!nameInput) return;

    const newId = chats.length > 0 ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    let fallbackAvatar = nameInput.substring(0, 2).toUpperCase();
    
    chats.push({
        id: newId,
        name: nameInput,
        avatar: fallbackAvatar,
        status: "node link established",
        messages: []
    });

    document.getElementById("contact-modal").classList.remove("active");
    document.getElementById("modal-contact-name").value = "";
    
    showToast(`Node connection created: ${nameInput}`);
    renderChats();
    selectChat(newId);
});

function renderChats(filterQuery = "") {
    const container = document.getElementById("chat-list-container");
    container.innerHTML = "";
    
    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(filterQuery)
    );

    filteredChats.forEach(chat => {
        const item = document.createElement("div");
        item.className = `chat-item ${chat.id === activeChatId ? 'active' : ''}`;
        item.onclick = () => selectChat(chat.id);
        
        const avatarClass = chat.isSaved ? "chat-avatar tg-avatar-saved" : "chat-avatar";
        const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Buffer empty";
        
        item.innerHTML = `
            <div class="${avatarClass}">${chat.avatar}</div>
            <div class="chat-info">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <h4>${chat.name}</h4>
                    <span class="chat-timestamp">SYNCED</span>
                </div>
                <p>${lastMsg.substring(0, 35)}${lastMsg.length > 35 ? '...' : ''}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

function selectChat(id) {
    activeChatId = id;
    renderChats();
    
    document.getElementById("chat-empty-state-view").style.display = "none";
    document.getElementById("active-chat-viewport").style.display = "flex";
    
    const chat = chats.find(c => c.id === id);
    document.getElementById("active-chat-title").innerText = chat.name;
    document.getElementById("active-chat-status").innerText = chat.status.toUpperCase();
    
    renderMessages();
}

function renderMessages() {
    const container = document.getElementById("chat-messages-container");
    container.innerHTML = "";
    if (activeChatId === null) return;
    
    const chat = chats.find(c => c.id === activeChatId);
    chat.messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${msg.type}`;
        msgDiv.innerHTML = `<div class="message-text">${msg.text}</div>`;
        container.appendChild(msgDiv);
    });
    container.scrollTop = container.scrollHeight;
}

document.getElementById("send-msg-btn").addEventListener("click", sendMessage);
document.getElementById("chat-input-field").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const input = document.getElementById("chat-input-field");
    const text = input.value.trim();
    if (!text || activeChatId === null) return;
    
    const chat = chats.find(c => c.id === activeChatId);
    chat.messages.push({ type: "outgoing", text: text });
    input.value = "";
    renderMessages();
    renderChats();
}

const chatOptTrigger = document.getElementById("chat-options-trigger");
if(chatOptTrigger) {
    chatOptTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("chat-options-menu").classList.toggle("active");
    });
}

document.getElementById("opt-clear-history").addEventListener("click", () => {
    if (activeChatId === null) return;
    const chat = chats.find(c => c.id === activeChatId);
    if (chat) {
        chat.messages = [];
        renderMessages();
        renderChats();
        showToast("Chat buffer wiped completely.");
    }
});

document.getElementById("opt-delete-chat").addEventListener("click", () => {
    if (activeChatId === null) return;
    chats = chats.filter(c => c.id !== activeChatId);
    activeChatId = null;
    document.getElementById("active-chat-viewport").style.display = "none";
    document.getElementById("chat-empty-state-view").style.display = "flex";
    renderChats();
    showToast("Chat node destroyed permanently.");
});

window.onload = () => {
    loadSavedAccounts();
};
