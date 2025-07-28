import { ObjectId } from 'mongodb';
import clientPromise from './mongo';

export async function getBlogs() {
    try {
        let client = await clientPromise;
        const db = client.db('portfolio-blog-db');
        const blogsCollection = db.collection('blogs');
        const blogs = await blogsCollection.find().sort({ createdAt: -1 }).toArray();
        return blogs.map(blog => ({
            ...blog,
            _id: blog._id.toString(),
            createdAt: blog.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw new Error('Failed to fetch blogs');
    } finally {
        await client.close();
    }
}

export async function getBlog(id) {
    try {
        let client = await clientPromise;
        const db = client.db('portfolio-blog-db');
        const blogsCollection = db.collection('blogs');
        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
        if (!blog) {
            throw new Error('Blog not found');
        }
        return {
            ...blog,
            _id: blog._id.toString(),
            createdAt: blog.createdAt.toISOString(),
        };
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        throw new Error('Failed to fetch blog');
    } finally {
        await client.close();
    }
}

function formatSlug(title) {
    return title.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-|-$/g, '');
}

export async function createBlog(blogData) {
    try {
        let client = await clientPromise;
        const db = client.db('portfolio-blog-db');
        const blogsCollection = db.collection('blogs');
        const result = blogsCollection.insertOne(blogData);
        return {
            ...result,
            _id: result.insertId,
            slug: formatSlug(blogData.title),
            createdAt: blogData.createdAt.toISOString(),
        };
    } catch (error) {
        console.error('Error creating blog:', error);
        throw new Error('Failed to create blog');
    }
}

export async function updateBlog(id, blogData) {
    try {
        let client = await clientPromise;
        const db = client.db('portfolio-blog-db');
        const blogsCollection = db.collection('blogs');
        const result = await blogsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: blogData }
        );
        if (result.modifiedCount === 0) {
            throw new Error('Blog not found or no changes made');
        }
        return result;
    } catch (error) {
        console.error('Error updating blog:', error);
        throw new Error('Failed to update blog');
    } finally {
        await client.close();
    }
}