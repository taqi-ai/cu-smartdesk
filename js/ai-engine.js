const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; 

async function callGemini(sys, msg) {
    if (API_KEY.includes('REPLACE_ME')) {
        return "System: API Key not detected. Check GitHub Actions Secrets.";
    }

    // We are switching to the STABLE v1 endpoint which is more reliable for Flash
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `INSTRUCTION: ${sys}\n\nSTUDENT: ${msg}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // This will help us see the EXACT error in the console if it fails
            console.error("API Response Error:", data);
            return `AI Error: ${data.error ? data.error.message : 'Service Unavailable'}`;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (e) {
        console.error("Network Error:", e);
        return "System: Connection lost. Please check your internet.";
    }
}

// Anonymous Critic Logic
async function submitAnonymous() {
    const input = document.getElementById('anon-input').value;
    const feedback = document.getElementById('mod-feedback');
    if(!input) return;

    feedback.innerHTML = "<em>AI Moderation in progress...</em>";
    const sys = "You are an automated university moderator. If this is a valid campus complaint, reply 'CLEAN'. If it contains abuse or nonsense, reply 'REJECTED'.";
    
    const result = await callGemini(sys, input);

    if(result.toUpperCase().includes('CLEAN')) {
        feedback.style.color = "#28a745";
        feedback.innerText = "✅ Feedback submitted anonymously to the Registrar Office.";
        document.getElementById('anon-input').value = "";
    } else {
        feedback.style.color = "#dc3545";
        feedback.innerText = result;
    }
}
