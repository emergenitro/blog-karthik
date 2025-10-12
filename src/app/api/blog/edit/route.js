import { getSession } from '@/lib/session';
import { updateBlog } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const content = formData.get('content');

        if (!id || !title || !content) {
            return NextResponse.json(
                { success: false, message: 'ID, title and content are required' },
                { status: 400 }
            );
        }

        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const processedContent = content.replace(
            /\{([^|]+)\|([^}]+)\}/g,
            '<span class="tooltip-wrapper"><span class="tooltip-text">$1</span><span class="tooltip-content">$2</span></span>'
        );

        const blogData = {
            title,
            content: processedContent,
            excerpt: content.slice(0, 100),
            updatedAt: new Date()
        };

        await updateBlog(id, blogData);

        return NextResponse.json({
            success: true,
            message: 'Blog updated successfully'
        });

    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update blog' },
            { status: 500 }
        );
    }
}
