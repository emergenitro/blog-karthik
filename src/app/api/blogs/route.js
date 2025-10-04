import { getBlogs } from "@/lib/blog";

export async function GET() {
    try {
        const blogs = await getBlogs();
        return new Response(JSON.stringify(blogs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in GET /api/blogs:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}