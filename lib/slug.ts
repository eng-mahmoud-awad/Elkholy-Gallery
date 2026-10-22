import crypto from "crypto";

// Keeps Arabic letters (\p{L}) so slugs stay readable, and appends a short
// random suffix so two products with the same name never collide.
export function makeSlug(name: string): string {
  const base = String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = crypto.randomBytes(2).toString("hex");
  return base ? `${base}-${suffix}` : suffix;
}
