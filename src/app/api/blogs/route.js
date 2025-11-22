import { getBlogs } from "@/lib/blog";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET() {
    try {
        const blogs = await getBlogs();
        return new Response(JSON.stringify(blogs), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error in GET /api/blogs:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}