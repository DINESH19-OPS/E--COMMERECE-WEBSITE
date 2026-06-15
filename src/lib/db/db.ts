import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCached: GlobalMongoose;
}

let cached = globalThis.mongooseCached;

if (!cached) {
  cached = globalThis.mongooseCached = { conn: null, promise: null, isFallback: false };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return { conn: cached.conn, isFallback: cached.isFallback };
  }

  if (cached.isFallback) {
    return { conn: null, isFallback: true };
  }

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ No MONGODB_URI environment variable set. Falling back to InMemory database repository.');
    cached.isFallback = true;
    return { conn: null, isFallback: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fail quickly if mongo server is down
    };

    console.log(`🔌 Attempting to connect to MongoDB: ${MONGODB_URI.split('@').pop()}`);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Successfully connected to MongoDB.');
      cached.isFallback = false;
      return mongooseInstance;
    }).catch((err) => {
      console.warn('❌ MongoDB connection failed. Falling back to InMemory database repository.', err.message);
      cached.isFallback = true;
      // Resolve with null so future calls know we failed
      return null as unknown as typeof mongoose;
    });
  }

  try {
    const conn = await cached.promise;
    if (!conn) {
      cached.conn = null;
      cached.isFallback = true;
    } else {
      cached.conn = conn;
    }
  } catch (e) {
    console.error('Error awaiting db connection promise', e);
    cached.conn = null;
    cached.isFallback = true;
  }

  return { conn: cached.conn, isFallback: cached.isFallback };
}
