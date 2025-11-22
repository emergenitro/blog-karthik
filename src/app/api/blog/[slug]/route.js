import { getBlogBySlug } from '@/lib/blog';
import { NextResponse } from 'next/server';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const blog = await getBlogBySlug(slug);

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}