'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BlogPage({ params, searchParams }) {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = params;

    useEffect(() => {
        fetch(`/api/blog/${slug}`)
            .then(res => res.json())
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-gray-500">loading...</div>
            </div>
        );
    }

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
            <style jsx>{`
                .tooltip-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .tooltip-text {
                    border-bottom: 1px dotted #666;
                    cursor: help;
                }

                .tooltip-content {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #1a1a1a;
                    color: #e5e5e5;
                    text-align: center;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid #333;
                    white-space: nowrap;
                    z-index: 1;
                    transition: opacity 0.2s ease-in-out;
                    pointer-events: none;
                    font-size: 0.875rem;
                }

                .tooltip-content::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #333 transparent transparent transparent;
                }

                .tooltip-wrapper:hover .tooltip-content {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>
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
                    className="blog-content prose prose-invert max-w-none leading-relaxed text-gray-300"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
}