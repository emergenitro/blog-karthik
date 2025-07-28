import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { createBlog } from '@/lib/blog';

export default function CreateBlogPage() {
    async function handleCreateBlog(formData) {
        const title = formData.get('title');
        const content = formData.get('content');

        if (!title || !content) {
            throw new Error('Title and content are required');
        }

        const blogData = {
            title,
            content,
            excerpt: content.slice(0, 100),
            createdAt: new Date(),
            authorId: getSession().userId
        };
        try {
            const result = await createBlog(blogData);
            return result;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw new Error('Failed to create blog');
        }
    }

    if (!getSession() || !getSession().userId) {
        redirect('/login');
    }


    return (
        <Form action={handleCreateBlog} method="POST" className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Create a Blog Post</h1>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium mb-2">Content</label>
                <textarea
                    name="content"
                    id="content"
                    required
                    rows="10"
                    className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
                Create Blog Post
            </button>
        </Form>
    )
}