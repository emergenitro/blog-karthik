import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let client;

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global;

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri);
}

export default client;