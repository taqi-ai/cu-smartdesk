function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function simulateSync() {
    const btn = document.getElementById('sync-btn');
    btn.disabled = true;
    btn.innerText = "🛰️ Connecting CUIMS...";
    setTimeout(() => {
        setAttendance(98, 120);
        btn.innerText = "✅ Synced";
        setTimeout(() => { btn.disabled = false; btn.innerText = "🔄 Sync CUIMS"; }, 3000);
    }, 2000);
}

async function sendAIQuery() {
    const input = document.getElementById('ai-input');
    const box = document.getElementById('chat-box');
    if(!input.value) return;

    box.innerHTML += `<div class='user-msg'><strong>You:</strong> ${input.value}</div>`;
    const response = await callGemini("You are CU SmartDesk. Help with attendance (min 75%) and scholarship errors.", input.value);
    box.innerHTML += `<div class='bot-msg'><strong>AI:</strong> ${response}</div>`;
    input.value = "";
    box.scrollTop = box.scrollHeight;
}

function printGrievance() {
    const content = document.getElementById('grv-result').innerText;
    if (!content) return alert("Generate a letter first!");
    const win = window.open('', '_blank');
    win.document.write(`<html><body><h1 style='color:red'>CHANDIGARH UNIVERSITY</h1><hr><pre>${content}</pre></body></html>`);
    win.document.close();
    win.print();
}
