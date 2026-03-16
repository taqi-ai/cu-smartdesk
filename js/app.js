// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function printGrievance() {
    const content = document.getElementById('grv-result').innerText;
    if (!content) {
        alert("Please generate a letter first!");
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Official Grievance - CU SmartDesk</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 50px; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #CC0000; padding-bottom: 10px; }
                    .date { text-align: right; margin-bottom: 20px; }
                    .content { white-space: pre-wrap; margin-top: 30px; }
                    .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 style="color:#CC0000; margin:0;">CHANDIGARH UNIVERSITY</h1>
                    <p>UP Campus Student Grievance Cell</p>
                </div>
                <div class="date">Date: ${new Date().toLocaleDateString()}</div>
                <p><strong>To:</strong> The Office of the Registrar / PVC</p>
                <div class="content">${content}</div>
                <div class="footer">
                    <p><strong>Submitted by:</strong> Shadab Haider (21BCS10XXX)</p>
                    <p style="font-size:10px; color:#888;">Generated via CU SmartDesk AI Resolution Ecosystem</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
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