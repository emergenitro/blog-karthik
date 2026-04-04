export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/create-blog', '/edit-blog/', '/login', '/test-ai'],
        },
        sitemap: 'https://blog.karthik.lol/sitemap.xml',
    };
}
