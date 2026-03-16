const API_KEY = 'AIzaSyB3lguT62uK2C48bolAnt06Gg1qE2tTUis'; // Replace with real key

async function callGemini(sys, msg) {
    if(API_KEY === 'AIzaSyB3lguT62uK2C48bolAnt06Gg1qE2tTUis') return "System: Please provide a valid Gemini API Key.";
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                system_instruction: { parts: [{ text: sys }] },
                contents: [{ parts: [{ text: msg }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch(e) { return "System: Connection to Gemini AI failed."; }
}

async function submitAnonymous() {
    const input = document.getElementById('anon-input').value;
    const feedback = document.getElementById('mod-feedback');
    if(!input) return;

    feedback.innerHTML = "AI Moderation in progress...";
    const sys = "Analyze if this university feedback is abusive or irrelevant. If clean, reply only with 'CLEAN'. If bad, reply 'REJECTED: [Reason]'.";
    const result = await callGemini(sys, input);

    if(result.includes('CLEAN')) {
        feedback.style.color = "green";
        feedback.innerText = "✅ Feedback submitted anonymously to Registrar Office.";
        document.getElementById('anon-input').value = "";
    } else {
        feedback.style.color = "red";
        feedback.innerText = result;
    }
}