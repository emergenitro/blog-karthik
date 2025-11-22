import { getBlogs, getBlogBySlug } from '@/lib/blog';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

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

    return {
        title: `${blog.title} | Karthik's Blog`,
        description: blog.description || `Read ${blog.title} on Karthik's blog`,
    };
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
                    <time className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </header>

                <div
                    className="blog-content prose prose-invert max-w-none leading-relaxed text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
}
