'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BlogsContent() {
    const [blogs, setBlogs] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const searchParams = useSearchParams();
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(console.error);

        fetch('/api/auth/check')
            .then(res => res.json())
            .then(data => setIsLoggedIn(data.isLoggedIn))
            .catch(() => setIsLoggedIn(false));

        if (searchParams.get('from') === 'home') {
            setTimeout(() => setIsAnimating(true), 600);
        } else {
            setOpacity(1);
        }
    }, [searchParams]);

    return (
        <div className={`min-h-screen flex items-center justify-center p-8 transition-all duration-1000 opacity-${opacity} ${isAnimating ? 'opacity-100 scale-100' : ''
            }`}
            style={isAnimating ? { animation: 'popIn 0.8s ease-out' } : {}}>
            <style jsx>{`
                @keyframes popIn {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
            <div className="max-w-3xl w-full">
                {isLoggedIn && (
                    <Link
                        href="/admin"
                        className="absolute top-8 right-8 px-4 py-2 border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300 text-sm"
                    >
                        admin
                    </Link>
                )}
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
        </div>
    );
}

export default function BlogsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BlogsContent />
        </Suspense>
    );
}
