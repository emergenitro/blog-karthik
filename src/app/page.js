import { getBlogs } from '@/lib/blog';

export default async function BlogsPage() {
  const blogs = await getBlogs() || [];
  console.log('Fetched blogs:', blogs);

  return (
    <div className="min-h-screen py-16">
      <div className="w-[80%] mx-auto">
        <div className="blog-list-container space-y-6 pt-16">
          {blogs.length === 0 ? (
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">No posts yet.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card group border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <a href={`/${blog.slug}`} className="block">
                  <h2 className="text-xl font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
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