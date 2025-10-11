import { getSession } from '@/lib/session';
import { createBlog } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const content = formData.get('content');

        if (!title || !content) {
            return NextResponse.json(
                { success: false, message: 'Title and content are required' },
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
            createdAt: new Date(),
            authorId: session.userId
        };

        const result = await createBlog(blogData);

        if (process.env.SLACK_WEBHOOK_URL) {
            try {
                await fetch(process.env.SLACK_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        blog_name: title,
                        blog_excerpt: content.slice(0, 100).replace(/<[^>]*>/g, '').replace(/\{[^}]*\}/g, ''),
                        blog_date: new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        blog_url: `https://blog.karthik.lol/blog/${result.slug || ''}`
                    })
                });
            } catch (webhookError) {
                console.error('Failed to send Slack webhook:', webhookError);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Blog created successfully',
            blog: result
        });

    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create blog' },
            { status: 500 }
        );
    }
}