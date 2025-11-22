import { getBlogs } from '@/lib/blog';
import Link from 'next/link';
import BlogsClientWrapper from './BlogsClientWrapper';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
    title: "Posts | Karthik's Blog",
    description: "Read all blog posts from Karthik",
};

export default async function BlogsPage() {
    const blogs = await getBlogs();

    return (
        <BlogsClientWrapper>
            <div className="max-w-3xl w-full">
                <h1 className="text-5xl font-bold mb-16 text-center">posts</h1>

                <div className="space-y-8">
                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            href={`/${blog.slug}`}
                            className="block group"
                        >
                            <div className="py-6 border-b border-gray-800 hover:border-gray-600 transition-all duration-300">
                                <div className="flex items-baseline justify-between gap-4">
                                    <h2 className="text-2xl font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                        {blog.title}
                                    </h2>
                                    <time className="text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                                {blog.description && (
                                    <p className="text-gray-400 mt-2 text-sm">{blog.description}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </BlogsClientWrapper>
    );
}
