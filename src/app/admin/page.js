import { getBlogs, deleteBlog } from '@/lib/blog';


export default async function AdminPage() {
    const blogs = await getBlogs() || [];
    console.log('Fetched blogs for admin:', blogs);

    async function handleDelete(formData) {
        'use server';
        const id = formData.get('id');
        await deleteBlog(id);
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Blog Posts</h2>
            <ul>
                {blogs.map(blog => (
                    <li key={blog._id} className="mb-4">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                        <p>{blog.content.substring(0, 100)}...</p>
                        <div className="mt-2">
                            <a href={`/${blog.slug}`} className="text-blue-600 hover:underline">View</a>
                            <form action={handleDelete}>
                                <input type="hidden" name="id" value={blog._id} />
                                <button
                                    type="submit"
                                    className="ml-4 text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </form>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-6">
                <a href="/create-blog" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Create New Blog Post
                </a>
            </div>
        </div >
    );
}