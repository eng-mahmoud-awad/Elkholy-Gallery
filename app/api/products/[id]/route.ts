import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { destroyImages } from "@/lib/cloudinary";
import { cleanImages, fail, handle, requireAdmin, validId, type IdContext } from "@/lib/http";

// [id] accepts either a Mongo ObjectId or a slug, so the same endpoint can
// serve the dashboard (by id) and the public product link (by slug).
export const GET = handle(async (_req: Request, { params }: IdContext) => {
  const { id } = await params;
  await connectDB();
  const query = validId(id) ? { _id: id } : { slug: decodeURIComponent(id) };
  const product = await Product.findOne(query).populate("category", "name slug").lean();
  if (!product || !product.isActive) return fail("Not found", 404);
  return Response.json(product);
});

export const PUT = handle(async (req: Request, { params }: IdContext) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!validId(id)) return fail("Invalid id", 404);

  const body = await req.json().catch(() => ({}));
  await connectDB();
  const product = await Product.findById(id);
  if (!product) return fail("Not found", 404);

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return fail("name cannot be empty");
    product.name = name; // slug stays stable so shared WhatsApp links keep working
  }
  for (const field of ["description", "dimensions", "material"] as const) {
    if (body[field] !== undefined) product[field] = String(body[field]);
  }
  if (body.price !== undefined) {
    const price = body.price === "" || body.price === null ? null : Number(body.price);
    if (price !== null && !Number.isFinite(price)) return fail("price must be a number");
    product.price = price;
  }
  if (body.isActive !== undefined) product.isActive = Boolean(body.isActive);
  if (body.category !== undefined) {
    if (!validId(body.category) || !(await Category.exists({ _id: body.category }))) {
      return fail("Category not found", 404);
    }
    product.category = body.category;
  }
  if (body.images !== undefined) {
    const next = cleanImages(body.images);
    const keep = new Set(next.map((i) => i.publicId));
    const removed = product.images.map((i) => i.publicId).filter((p) => !keep.has(p));
    product.set("images", next);
    await destroyImages(removed); // don't leave unused files in Cloudinary
  }

  await product.save();
  return Response.json(product);
});

export const DELETE = handle(async (_req: Request, { params }: IdContext) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!validId(id)) return fail("Invalid id", 404);

  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return fail("Not found", 404);
  await destroyImages(product.images.map((i) => i.publicId));
  return Response.json({ ok: true });
});
