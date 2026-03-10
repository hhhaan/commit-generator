export async function complete(config, systemPrompt, userContent) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent },
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens,
            stream: false,
        }),
    });
    const data = await res.json(); // 이게 없었음

    if (!res.ok) {
        const err = await res.json();
        throw new Error(`OpenRouter ${res.status}: ${JSON.stringify(err)}`);
    }

    return data.choices?.[0]?.message?.content?.trim() ?? '';
}
