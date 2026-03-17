// =============================================
// CU SmartDesk | AI Engine (Gemini 1.5 Flash)
// =============================================

const API_KEY = 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI'; // Injected securely via GitHub Actions

async function callGemini(systemPrompt, userMessage) {
    if (!API_KEY || API_KEY === 'AIzaSyDXLjpTOGymRAg-JWWtdP2V2AWsY7P70sI') {
        return "⚠️ System: API Key not configured. Please set up your Gemini API key.";
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            }
        );

        if (!response.ok) {
            const err = await response.json();
            console.error('Gemini API Error:', err);
            return `⚠️ API Error: ${err.error?.message || 'Unknown error'}`;
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";

    } catch (e) {
        console.error('Network error:', e);
        return "⚠️ Connection to Gemini AI failed. Check your internet connection.";
    }
}

// -----------------------------------------------
// Anonymous Feedback Moderation
// -----------------------------------------------
async function submitAnonymous() {
    const input = document.getElementById('anon-input');
    const feedback = document.getElementById('mod-feedback');
    const btn = document.getElementById('anon-btn');

    if (!input.value.trim()) {
        feedback.className = 'mod-msg mod-error';
        feedback.innerText = '⚠️ Please enter your feedback before submitting.';
        return;
    }

    btn.disabled = true;
    feedback.className = 'mod-msg mod-loading';
    feedback.innerText = '🔍 AI Moderation in progress...';

    const sys = `You are a content moderator for a university student portal in India.
Analyze if the student feedback is abusive, personally targeted, or completely irrelevant.
- If the content is constructive criticism about university services, food, labs, teaching quality, or facilities: reply ONLY with the word CLEAN.
- If the content contains personal attacks, slurs, threats, or is completely off-topic: reply with REJECTED: followed by a brief, helpful reason.
Do not add any other text.`;

    const result = await callGemini(sys, input.value.trim());

    if (result.startsWith('CLEAN')) {
        feedback.className = 'mod-msg mod-success';
        feedback.innerText = '✅ Feedback submitted anonymously to the Registrar Office.';
        input.value = '';
    } else if (result.startsWith('REJECTED')) {
        feedback.className = 'mod-msg mod-error';
        feedback.innerText = result;
    } else {
        feedback.className = 'mod-msg mod-error';
        feedback.innerText = result; // Shows API errors too
    }

    btn.disabled = false;
}

// -----------------------------------------------
// Grievance Letter Generator
// -----------------------------------------------
async function generateGrievance() {
    const desc = document.getElementById('grv-desc').value.trim();
    const result = document.getElementById('grv-result');
    const btn = document.getElementById('grv-btn');

    if (!desc) {
        result.className = 'letter-result letter-error';
        result.innerText = '⚠️ Please describe your grievance before generating a letter.';
        return;
    }

    btn.disabled = true;
    btn.innerText = '⏳ Generating Letter...';
    result.className = 'letter-result letter-loading';
    result.innerText = '✍️ AI is drafting your formal letter...';

    const sys = `You are a formal letter drafting assistant for Indian university students.
Draft a professional, firm, and legally-aware grievance letter based on the student's issue.
- Address it to: The Office of the Registrar / PVC, Chandigarh University UP Campus
- Reference the RTI Act 2005 and UGC grievance redressal guidelines where relevant
- Keep a formal but assertive tone
- Include: Subject line, formal salutation, body (3-4 paragraphs), closing
- Do NOT include date, student name, or enrollment number (they will be added separately)
- Output ONLY the letter content, no extra explanation`;

    const letter = await callGemini(sys, `My grievance: ${desc}`);

    result.className = 'letter-result letter-success';
    result.innerText = letter;
    btn.disabled = false;
    btn.innerText = '📄 Generate Formal Letter';
}
