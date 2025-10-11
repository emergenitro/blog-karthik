import { getBlogBySlug } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { slug } = params;
        const blog = await getBlogBySlug(slug);

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}