// =============================================
// CU SmartDesk | App Logic
// =============================================

// -----------------------------------------------
// Tab Switching (fixed: no implicit global event)
// -----------------------------------------------
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
}

// -----------------------------------------------
// Print / Save Grievance Letter
// -----------------------------------------------
function printGrievance() {
    const content = document.getElementById('grv-result').innerText;
    if (!content || document.getElementById('grv-result').classList.contains('letter-loading')) {
        alert('Please generate a letter first!');
        return;
    }

    const studentName = document.getElementById('student-name')?.value || 'Student Name';
    const enrollment = document.getElementById('enrollment')?.value || 'Enrollment Number';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Official Grievance - CU SmartDesk</title>
            <style>
                body { font-family: 'Times New Roman', serif; padding: 50px; line-height: 1.8; color: #111; }
                .header { text-align: center; border-bottom: 3px solid #CC0000; padding-bottom: 15px; margin-bottom: 30px; }
                .header h1 { color: #CC0000; margin: 0; font-size: 22px; letter-spacing: 2px; }
                .header p { margin: 4px 0; font-size: 13px; color: #555; }
                .date-line { text-align: right; margin-bottom: 20px; font-size: 13px; }
                .to-line { margin-bottom: 20px; font-size: 14px; }
                .content { white-space: pre-wrap; font-size: 14px; margin-top: 20px; }
                .footer { margin-top: 60px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 13px; }
                .watermark { text-align: center; font-size: 10px; color: #aaa; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>CHANDIGARH UNIVERSITY — UP CAMPUS</h1>
                <p>Student Grievance Cell | Official Communication</p>
                <p>CU SmartDesk Resolution Portal</p>
            </div>
            <div class="date-line"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div class="to-line"><strong>To:</strong> The Office of the Registrar / PVC<br>Chandigarh University, UP Campus</div>
            <div class="content">${content}</div>
            <div class="footer">
                <p><strong>Submitted by:</strong> ${studentName}</p>
                <p><strong>Enrollment No.:</strong> ${enrollment}</p>
                <p><strong>Signature:</strong> ______________________</p>
            </div>
            <div class="watermark">Generated via CU SmartDesk AI Resolution Ecosystem | Hackophobia</div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// -----------------------------------------------
// CUIMS Sync Simulation
// -----------------------------------------------
function simulateSync() {
    const btn = document.getElementById('sync-btn');
    const status = document.getElementById('sync-status');
    btn.disabled = true;
    btn.innerText = '🛰️ Connecting...';

    // Simulate fetching real data
    setTimeout(() => {
        const mockPresent = Math.floor(Math.random() * 15) + 85; // 85–100
        const mockTotal = 120;
        setAttendance(mockPresent, mockTotal);
        btn.innerText = '✅ Synced!';
        status.innerText = `Last synced: ${new Date().toLocaleTimeString('en-IN')}`;
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = '🔄 Sync CUIMS';
        }, 3000);
    }, 2000);
}

// -----------------------------------------------
// Officials Directory
// -----------------------------------------------
const officials = [
    { name: 'Dr. Amit Verma', role: 'HOD — Computer Science & Engineering', email: 'hod.cse@cuup.in' },
    { name: 'Accounts Office', role: 'Scholarship & Fee Section', email: 'accounts@cuup.in' },
    { name: 'Registrar Cell', role: 'Official Verification & RTI', email: 'registrar@cuup.in' },
    { name: 'Student Welfare', role: 'Hostel, Mess & Infrastructure', email: 'welfare@cuup.in' },
    { name: 'Examination Cell', role: 'Debarment & Attendance Appeals', email: 'exam@cuup.in' },
];

function loadDirectory() {
    const list = document.getElementById('directory-list');
    if (!list) return;
    list.innerHTML = officials.map((o, i) => `
        <div class="directory-item">
            <div class="dir-info">
                <div class="dir-avatar">${o.name.charAt(0)}</div>
                <div>
                    <strong>${o.name}</strong>
                    <div class="dir-role">${o.role}</div>
                    <div class="dir-email">${o.email}</div>
                </div>
            </div>
            <button class="btn-outline" onclick="sendDirectMessage(${i})">✉️ Message</button>
        </div>
    `).join('');
}

function sendDirectMessage(index) {
    const official = officials[index];
    const msg = prompt(`Message to ${official.name}:\n(Your identity will be attached)`);
    if (msg) {
        alert(`✅ Message sent to ${official.name}.\nYou will receive a response within 48 hours.\n\nIf no response, SmartDesk will auto-escalate to the Registrar.`);
    }
}

// -----------------------------------------------
// AI Chat (with Enter key support)
// -----------------------------------------------
async function sendAIQuery() {
    const input = document.getElementById('ai-input');
    const box = document.getElementById('chat-box');
    const btn = document.getElementById('ai-send-btn');
    if (!input.value.trim()) return;

    const userMsg = input.value.trim();
    box.innerHTML += `
        <div class="chat-bubble user-bubble">
            <strong>You</strong>
            <p>${userMsg}</p>
        </div>`;
    input.value = '';
    btn.disabled = true;

    box.innerHTML += `<div class="chat-bubble ai-bubble" id="ai-typing"><strong>SmartDesk AI</strong><p>⏳ Thinking...</p></div>`;
    box.scrollTop = box.scrollHeight;

    const sys = `You are CU SmartDesk, an AI assistant for students at Chandigarh University UP Campus.
You help with: attendance calculations, scholarship issues, grievance procedures, university rules, and RTI queries.
Be concise, empathetic, and actionable. Always suggest next steps. Reference UGC guidelines and RTI Act 2005 when relevant.`;

    const response = await callClaude(sys, userMsg);

    document.getElementById('ai-typing').outerHTML = `
        <div class="chat-bubble ai-bubble">
            <strong>SmartDesk AI</strong>
            <p>${response.replace(/\n/g, '<br>')}</p>
        </div>`;

    btn.disabled = false;
    box.scrollTop = box.scrollHeight;
}

// Enter key to send chat
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIQuery();
            }
        });
    }
    loadDirectory();
});
