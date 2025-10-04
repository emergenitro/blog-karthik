import { getBlogBySlug } from '@/lib/blog';
import Link from 'next/link';

export default async function BlogPage({ params, searchParams }) {
    const { slug } = params;
    console.log('Fetching blog for slug:', slug);
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-500 mb-8">post not found</h1>
                    <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors duration-300">
                        ← back to posts
                    </Link>
                </div>
            </div>
        );
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
                    className="prose prose-invert max-w-none leading-relaxed text-gray-300"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
}