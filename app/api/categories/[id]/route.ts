import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { destroyImages } from "@/lib/cloudinary";
import { fail, handle, requireAdmin, validId, type IdContext } from "@/lib/http";

// The slug is intentionally NOT regenerated on rename, so existing links keep working.
export const PUT = handle(async (req: Request, { params }: IdContext) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!validId(id)) return fail("Invalid id", 404);

  const body = await req.json().catch(() => ({}));
  await connectDB();
  const category = await Category.findById(id);
  if (!category) return fail("Not found", 404);

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return fail("name cannot be empty");
    category.name = name;
  }
  if (body.order !== undefined && Number.isFinite(Number(body.order))) {
    category.order = Number(body.order);
  }
  if (body.coverImage !== undefined) {
    const oldId = category.coverImage?.publicId;
    if (body.coverImage?.url) {
      category.coverImage = { url: body.coverImage.url, publicId: body.coverImage.publicId };
      if (oldId && oldId !== body.coverImage.publicId) await destroyImages([oldId]);
    } else {
      category.set("coverImage", undefined);
      await destroyImages([oldId]);
    }
  }

  await category.save();
  return Response.json(category);
});

export const DELETE = handle(async (_req: Request, { params }: IdContext) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!validId(id)) return fail("Invalid id", 404);

  await connectDB();
  // Refuse instead of orphaning products that point at a missing category.
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return fail(`Category has ${productCount} product(s). Move or delete them first.`, 409);
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) return fail("Not found", 404);
  await destroyImages([category.coverImage?.publicId]);
  return Response.json({ ok: true });
});
