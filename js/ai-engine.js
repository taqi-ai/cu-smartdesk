const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; // This is a placeholder

async function callGemini(sys, msg) {
    // Check if the key is still the placeholder
    if (API_KEY.includes('YOUR_API_KEY')) {
        return "System: API Key is not set correctly.";
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${sys}\n\nUser Message: ${msg}` }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error Detail:", errorData);
            return `System Error: ${errorData.error.message || "Connection Failed"}`;
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (e) {
        console.error("Fetch Error:", e);
        return "System: Connection to Gemini AI failed. Check your internet or API Key.";
    }
}

// ... keep your submitAnonymous function as is
