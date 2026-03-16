const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; 

async function callGemini(sys, msg) {
    if (API_KEY.includes('REPLACE_ME')) {
        return "System: API Key not injected. Check GitHub Secrets.";
    }

    // Using the STABLE V1 Endpoint - this is the production version
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        // Merging system and user message is the safest way for free-tier keys
                        text: `[SYSTEM]: ${sys}\n\n[USER]: ${msg}` 
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // This will show exactly what Google is saying in your AI chat box
            console.error("DEBUG:", data);
            return `AI Error: ${data.error ? data.error.message : 'Check Console'}`;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (e) {
        console.error("NETWORK ERROR:", e);
        return "System: Connection error. Please try a different network/VPN.";
    }
}

// Keep your submitAnonymous function exactly as it was
