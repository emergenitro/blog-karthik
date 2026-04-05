import { getBlogs, getBlogBySlug } from '@/lib/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import hljs from 'highlight.js';

export const revalidate = false;

// Generate static params for all blog posts
export async function generateStaticParams() {
    const blogs = await getBlogs();
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return {
            title: 'Post Not Found',
        };
    }

    const ogParams = new URLSearchParams({ title: blog.title });
    if (blog.description) ogParams.set('description', blog.description);

    return {
        title: `${blog.title} | Karthik's Blog`,
        description: blog.description || `Read ${blog.title} on Karthik's blog`,
        openGraph: {
            title: blog.title,
            description: blog.description || `Read ${blog.title} on Karthik's blog`,
            images: [`/og?${ogParams.toString()}`],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: blog.description || `Read ${blog.title} on Karthik's blog`,
            images: [`/og?${ogParams.toString()}`],
        },
    };
}

function renderCodeBlock(lang, code) {
    const trimmed = code.trimEnd();
    const highlighted = lang && hljs.getLanguage(lang)
        ? hljs.highlight(trimmed, { language: lang }).value
        : hljs.highlightAuto(trimmed).value;
    const header = lang
        ? `<div class="code-header"><span class="code-lang">${lang}</span></div>`
        : `<div class="code-header"></div>`;
    return `<div class="code-block">${header}<pre class="hljs-pre"><code class="hljs">${highlighted}</code></pre></div>`;
}

function parseLinks(text) {
    return text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function parseInlineCode(text) {
    return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}

function processContent(text) {
    const normalized = text.replace(/\r\n/g, '\n');
    const parts = normalized.split(/(```(?:\w+)?\n[\s\S]*?```)/g);
    return parts.map(part => {
        const codeMatch = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
        if (codeMatch) return renderCodeBlock(codeMatch[1], codeMatch[2]);
        return parseInlineCode(parseLinks(part)).replace(/\n/g, '<br>');
    }).join('');
}

export default async function BlogPage({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <article className="max-w-3xl w-full">
                <Link
                    href="/blogs"
                    className="inline-block text-sm text-gray-500 hover:text-gray-300 transition-colors duration-300 mb-8"
                >
                    ← back to posts
                </Link>

                <header className="mb-12 pb-8 border-b border-gray-800">
                    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <time>
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span>·</span>
                        <span>{Math.max(1, Math.round(blog.content.trim().split(/\s+/).length / 200))} min read</span>
                    </div>
                </header>

                <div
                    className="blog-content prose prose-invert max-w-none leading-relaxed text-gray-300"
                    dangerouslySetInnerHTML={{ __html: processContent(blog.content) }}
                />
            </article>
        </div>
    );
}
