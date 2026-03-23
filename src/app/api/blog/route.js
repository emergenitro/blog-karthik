import { getBlog } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        const blog = await getBlog(id);

        if (!blog) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch blog' }, { status: 500 });
    }
}
