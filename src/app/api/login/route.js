import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(request) {
    try {
        const { username, password } = await request.json();
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        if (username !== adminUsername || password !== adminPassword) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        await createSession(username);

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}