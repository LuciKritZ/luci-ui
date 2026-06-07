import mongoose from 'mongoose';

if (typeof window !== 'undefined') {
  throw new Error('dbConnect can only be used on the server.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: null | typeof mongoose;
  promise: null | Promise<typeof mongoose>;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Clears a specific model from the mongoose cache if running in local environment.
 * This is essential for Next.js hot reloading to pick up schema changes.
 */
export function clearModelIfLocal(modelName: string) {
  if (process.env.ENVIRONMENT === 'local' && mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(m => {
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
