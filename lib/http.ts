import mongoose from "mongoose";
import { isAdmin } from "@/lib/auth";

export type Image = { url: string; publicId: string };

// Context for dynamic routes like /api/products/[id] (params is a Promise in Next 15).
export type IdContext = { params: Promise<{ id: string }> };

export const fail = (message: string, status = 400) =>
  Response.json({ error: message }, { status });

export const validId = (id: unknown): id is string =>
  typeof id === "string" && mongoose.isValidObjectId(id);

// Returns an error Response if the caller is not an admin, otherwise null:
//   const denied = await requireAdmin(); if (denied) return denied;
export async function requireAdmin(): Promise<Response | null> {
  return (await isAdmin()) ? null : fail("Unauthorized", 401);
}

// Wraps a handler so unexpected errors become a clean 500 instead of a stack trace.
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error(err);
      const e = err as { code?: number; name?: string; message?: string };
      if (e?.code === 11000) return fail("Duplicate value", 409);
      if (e?.name === "ValidationError") return fail(e.message ?? "Invalid data", 400);
      return fail("Server error", 500);
    }
  };
}

// Accepts only well-formed { url, publicId } image objects.
export function cleanImages(images: unknown): Image[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter(
      (i): i is Image =>
        i && typeof i.url === "string" && typeof i.publicId === "string"
    )
    .map((i) => ({ url: i.url, publicId: i.publicId }));
}
