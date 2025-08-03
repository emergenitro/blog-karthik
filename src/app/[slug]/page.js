import { getBlogBySlug } from '@/lib/blog';

export default async function BlogPage({ params, searchParams }) {
    const { slug } = params;
    console.log('Fetching blog for slug:', slug);
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return (
            <div>
                <h1>Blog not found</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Title: {blog.title}</h1>
            <p>Contet: {blog.content}</p>
        </div>
    );
}