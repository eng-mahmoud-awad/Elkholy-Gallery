import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { fail, handle, requireAdmin } from "@/lib/http";
import { makeSlug } from "@/lib/slug";

export const GET = handle(async () => {
  await connectDB();
  const categories = await Category.find().sort({ order: 1, createdAt: 1 }).lean();
  return Response.json(categories);
});

export const POST = handle(async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return fail("name is required");

  await connectDB();
  const category = await Category.create({
    name,
    slug: makeSlug(name),
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
    coverImage: body.coverImage?.url
      ? { url: body.coverImage.url, publicId: body.coverImage.publicId }
      : undefined,
  });
  return Response.json(category, { status: 201 });
});
