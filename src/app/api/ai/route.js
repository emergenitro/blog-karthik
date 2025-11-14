import { NextResponse } from 'next/server';
import { sendMessageToAI } from '@/lib/ai';

export async function POST(request) {
    const { message, conversationHistory } = await request.json();
    const bearerToken = request.headers.get('Authorization')?.split(' ')[1];

    if (bearerToken !== process.env.HARDCODED_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const aiResponse = await sendMessageToAI(message, conversationHistory);
        return NextResponse.json({ message: aiResponse });
    } catch (error) {
        console.error('Error in AI route:', error);
        return NextResponse.json({ error: 'Failed to communicate with AI' }, { status: 500 });
    }
}