const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; // Placeholder for GitHub Action

async function callGemini(sys, msg) {
    if (API_KEY.includes('REPLACE_ME')) {
        return "System: API Key is missing. Ensure GitHub Secrets are configured.";
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `SYSTEM INSTRUCTIONS: ${sys}\n\nSTUDENT MESSAGE: ${msg}` 
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Gemini Error:", data);
            return `AI Error: ${data.error.message}`;
        }

        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("Connection Error:", e);
        return "System: Connection to Gemini failed. Check your internet/API status.";
    }
}

async function submitAnonymous() {
    const input = document.getElementById('anon-input').value;
    const feedback = document.getElementById('mod-feedback');
    if(!input) return;

    feedback.innerHTML = "AI Moderating content...";
    const sys = "Act as a university moderator. If the message is constructive campus feedback, reply ONLY with 'CLEAN'. If it's abusive, reply 'REJECTED: [Reason]'.";
    const result = await callGemini(sys, input);

    if(result.includes('CLEAN')) {
        feedback.style.color = "green";
        feedback.innerText = "✅ Feedback sent anonymously to PVC Office.";
        document.getElementById('anon-input').value = "";
    } else {
        feedback.style.color = "red";
        feedback.innerText = result;
    }
}
