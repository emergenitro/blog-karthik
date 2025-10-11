'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
            })
            .catch(console.error);
    }, []);

    async function handleDelete(formData) {
        console.log('Deleting blog with ID:', formData);
        fetch('/api/blog/delete', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    setBlogs(blogs.filter(blog => blog._id !== formData.get('id')));
                } else {
                    console.error('Failed to delete blog:', data.message);
                }
            })
            .catch(console.error);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-3xl w-full">
                <h1 className="text-5xl font-bold mb-16 text-center">admin.</h1>

                <div className="mb-12 flex justify-center">
                    <Link
                        href="/create-blog"
                        className="px-6 py-3 border-2 border-dashed border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                    >
                        + create new post
                    </Link>
                </div>

                <div className="space-y-8">
                    {blogs.map(blog => (
                        <div
                            key={blog._id}
                            className="py-6 border-b border-gray-800 hover:border-gray-600 transition-all duration-300"
                        >
                            <div className="flex items-baseline justify-between gap-4">
                                <h2 className="text-2xl font-semibold">
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
                            <div className="mt-4 flex gap-4 text-sm">
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    view
                                </Link>
                                <form action={handleDelete} className="inline">
                                    <input type="hidden" name="id" value={blog._id} />
                                    <button
                                        type="submit"
                                        className="text-gray-500 hover:text-red-400 transition-colors duration-300"
                                    >
                                        delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}