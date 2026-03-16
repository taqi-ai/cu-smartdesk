// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Simulated Sync Logic
function simulateSync() {
    const btn = document.getElementById('sync-btn');
    btn.disabled = true;
    btn.innerText = "🛰️ Connecting CUIMS...";
    
    setTimeout(() => {
        setAttendance(98, 120); // Simulate new data fetch
        btn.innerText = "✅ Synced";
        document.getElementById('sync-status').innerText = "Last synced: Just now (" + new Date().toLocaleTimeString() + ")";
        setTimeout(() => { btn.disabled = false; btn.innerText = "🔄 Sync CUIMS"; }, 3000);
    }, 2000);
}

// Directory Loading
const officials = [
    { name: "Dr. Amit Verma", role: "HOD Computer Science" },
    { name: "Accounts Office", role: "Scholarship Section" },
    { name: "Registrar Cell", role: "Official Verification" }
];

function loadDirectory() {
    const list = document.getElementById('directory-list');
    list.innerHTML = officials.map(o => `
        <div class="directory-item">
            <div><strong>${o.name}</strong><br><small>${o.role}</small></div>
            <button class="sync-btn" onclick="alert('Message Sent')">Message</button>
        </div>
    `).join('');
}

// AI Chat
async function sendAIQuery() {
    const input = document.getElementById('ai-input');
    const box = document.getElementById('chat-box');
    if(!input.value) return;

    box.innerHTML += `<p><strong>You:</strong> ${input.value}</p>`;
    const response = await callGemini("You are CU SmartDesk. Help students with attendance, scholarships, and rules.", input.value);
    box.innerHTML += `<p><strong>AI:</strong> ${response}</p>`;
    input.value = "";
    box.scrollTop = box.scrollHeight;
}

window.addEventListener('load', loadDirectory);