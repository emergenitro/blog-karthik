import { getPublicBlogs } from '@/lib/blog';

const BASE_URL = 'https://blog.karthik.lol';

export default async function sitemap() {
    const blogs = await getPublicBlogs();

    const blogEntries = blogs.map((blog) => ({
        url: `${BASE_URL}/${blog.slug}`,
        lastModified: new Date(blog.createdAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...blogEntries,
    ];
}
