import { deleteSession } from '@/lib/session';

export async function POST(request) {
    try {
        await deleteSession();
        return new Response(JSON.stringify({ message: 'Logout successful' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}