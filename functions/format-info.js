export async function onRequestPost(context) {
    const { request, env } = context;
    const { rawText } = await request.json();

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.GROQ_API_KEY}` // මෙහිදී Secret එක කෙලින්ම ගනී
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Extract customer Name, Address, and Phone from the message. Return ONLY JSON: { \"name\": \"\", \"address\": \"\", \"phone\": \"\", \"phone2\": \"\", \"product\": \"\" }"
                    },
                    { role: "user", content: rawText }
                ],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}