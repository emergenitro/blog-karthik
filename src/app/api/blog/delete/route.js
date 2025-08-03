import { deleteBlog } from '@/lib/blog';

export async function POST(request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ error: 'Blog id is required' }), {
                status: 400,
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