import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { getBlogs } from './blog.js';

let cachedSystemPrompt = null;
let cacheDate = null;

async function loadSystemPrompt() {
    let today = new Date().toDateString();
    if (cachedSystemPrompt && cacheDate === today) {
        return cachedSystemPrompt;
    }

    try {
        const response = await fetch(process.env.SYSTEM_PROMPT_URL);
        let systemPrompt = await response.text();

        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Singapore'
        });
        systemPrompt = systemPrompt.replace('{CURRENT_DATE}', currentDate);

        systemPrompt = await injectBlogContent(systemPrompt);

        cachedSystemPrompt = systemPrompt;
        cacheDate = today;

        return cachedSystemPrompt;
    } catch (error) {
        console.error('Error loading system prompt:', error);
        try {
            const fallbackPromptPath = path.join(process.cwd(), 'me_prompt.md');
            const fallbackPrompt = await fs.readFile(fallbackPromptPath, 'utf-8');
            return fallbackPrompt;
        } catch (fallbackError) {
            console.error('Error loading fallback prompt:', fallbackError);
        }
        return 'You are Karthik Sankar, an 18-year-old from Singapore serving National Service.';
    }
}

async function injectBlogContent(systemPrompt) {
    try {
        const blogs = await getBlogs();

        const blogContent = blogs.map(blog => `
### Blog: ${blog.title}
**Published:** ${blog.createdAt}
**Slug:** ${blog.slug}

**Content:**
${blog.content}

---
        `).join('\n');

        console.log(systemPrompt.replace(
            /\[BLOG_CONTENT_START\][\s\S]*?\[BLOG_CONTENT_END\]/,
            `[BLOG_CONTENT_START]\n${blogContent}\n[BLOG_CONTENT_END]`
        ));
        return systemPrompt.replace(
            /\[BLOG_CONTENT_START\][\s\S]*?\[BLOG_CONTENT_END\]/,
            `[BLOG_CONTENT_START]\n${blogContent}\n[BLOG_CONTENT_END]`
        );
    } catch (error) {
        console.error('Error injecting blog content:', error);
        return systemPrompt;
    }
}

export async function sendMessageToAI(message, conversationHistory = []) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_API_BASE_URL || undefined,
    });

    try {
        const systemPrompt = await loadSystemPrompt();

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message },
        ];

        console.log(messages);

        const completion = await openai.chat.completions.create({
            model: "deepseek-ai/deepseek-v3.1",
            messages: messages,
            temperature: 1,
            top_p: 1,
            max_tokens: 2048,
            stream: false,
            chat_template_kwargs: {"thinking":true}
        });

        console.log(completion);

        const reasoning = completion.choices[0]?.message?.reasoning_content;
        if (reasoning) console.log('Reasoning:', reasoning);
        
        console.log('AI Response:', completion.choices[0]?.message?.content);

        return completion.choices[0]?.message?.content;
    }
    catch (error) {
        console.error('Error communicating with OpenAI:', error);
        throw new Error('Failed to communicate with OpenAI');
    }
}

export function clearSystemPromptCache() {
    cachedSystemPrompt = null;
}