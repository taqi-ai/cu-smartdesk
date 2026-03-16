const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; 

async function callGemini(sys, msg) {
    // 1. Safety check for the injection
    if (API_KEY.includes('REPLACE_ME')) {
        return "System: API Key not injected. Check GitHub Actions.";
    }

    try {
        // 2. We use the most direct URL format
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        // 3. We merge instructions and message to avoid "System Instruction" errors
                        text: `CONTEXT: ${sys}\n\nUSER INPUT: ${msg}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        // 4. If the model still 'isn't found', we log the full error to see why
        if (!response.ok) {
            console.error("DEBUG - API ERROR:", data);
            return `AI Error: ${data.error ? data.error.message : 'Unknown Error'}`;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (e) {
        console.error("DEBUG - FETCH FAILED:", e);
        return "System: Network Error. Check your connection.";
    }
}

// Keep your submitAnonymous function below as it was
async function submitAnonymous() {
    const input = document.getElementById('anon-input').value;
    const feedback = document.getElementById('mod-feedback');
    if(!input) return;

    feedback.innerHTML = "Processing...";
    const sys = "Verify if this is constructive feedback. Reply 'CLEAN' or 'REJECTED'.";
    const result = await callGemini(sys, input);

    if(result.includes('CLEAN')) {
        feedback.style.color = "green";
        feedback.innerText = "✅ Feedback submitted.";
        document.getElementById('anon-input').value = "";
    } else {
        feedback.style.color = "red";
        feedback.innerText = result;
    }
}
