import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();

const openaiClient = provider === 'openai'
    ? new OpenAI({ apiKey: process.env.AI_API_KEY, baseURL: process.env.AI_BASE_URL })
    : null;

const anthropicClient = provider === 'anthropic'
    ? new Anthropic({ apiKey: process.env.AI_API_KEY })
    : null;

async function generateCompletion(systemPrompt, userMessage) {
    if (provider === 'anthropic') {
        const res = await anthropicClient.messages.create({
            model: process.env.AI_MODEL_NAME,
            max_tokens: 4096,
            temperature: 0.3,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
        });
        return res.content[0].text;
    }

    const res = await openaiClient.chat.completions.create({
        model: process.env.AI_MODEL_NAME,
        temperature: 0.3,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userMessage  },
        ],
    });
    return res.choices[0].message.content;
}

export default generateCompletion;
