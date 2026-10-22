import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// In dev, Next.js hot-reloads modules, which would open a new connection on
// every reload. Caching on `globalThis` keeps a single connection alive.
const g = globalThis as typeof globalThis & { _mongoose?: MongooseCache };
const cached: MongooseCache = (g._mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  // Checked lazily (not at import time) so `next build` works without env vars.
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
      cached.promise = null; // allow a retry on the next request
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
