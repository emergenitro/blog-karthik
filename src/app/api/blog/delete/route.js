import { deleteBlog } from '@/lib/blog';
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        console.log('Received delete request');
        const formData = await request.formData();

        const id = formData.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Blog id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const session = await getSession();
        if (!session?.userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const result = await deleteBlog(id);

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Blog not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Blog deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}