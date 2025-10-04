import { getBlogs } from "@/lib/blog";

const blogs = await getBlogs() || [];
console.log('Fetched blogs:', blogs);

export default async function ThingPage() {
    return (
        <div className="min-h-screen py-16">
            <h1 className="text-4xl font-bold mb-8 text-center">Thing Page</h1>
            <p className="text-center text-gray-600">This is the Thing page content.</p>
            <div className="w-[80%] mx-auto">
                <div className="blog-list-container space-y-6 pt-16">
                    {blogs.length === 0 ? (
                        <div className="bg-white rounded-lg p-6">
                            <p className="text-gray-600">No posts yet.</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className="blog-card group border border-[rgba(255, 0, 0, 0.86)] rounded-md p-4 shadow-lg hover:bg-[rgba(255,255,255,0.13)] hover:border-gray-300 transition-all duration-200 bg-[rgba(255,255,255,0.1)] backdrop-blur-md hover:shadow-xl">
                                <a href={`/${blog.slug}`} className="block">
                                    <h2 className="text-xl font-medium mb-2 text-gray-800">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-900 leading-relaxed">
                                        {blog.excerpt}
                                    </p>
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
