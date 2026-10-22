import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { isAdmin } from "@/lib/auth";
import { cleanImages, fail, handle, requireAdmin, validId } from "@/lib/http";
import { makeSlug } from "@/lib/slug";

// Public: active products only. Admin can pass ?all=1 to include hidden ones.
// Optional filter: ?category=<categoryId>
export const GET = handle(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const filter: Record<string, unknown> = {};

  const category = searchParams.get("category");
  if (category) {
    if (!validId(category)) return fail("Invalid category", 400);
    filter.category = category;
  }
  if (!(searchParams.get("all") === "1" && (await isAdmin()))) {
    filter.isActive = true;
  }

  await connectDB();
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .populate("category", "name slug")
    .lean();
  return Response.json(products);
});

export const POST = handle(async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  if (!name) return fail("name is required");
  if (!validId(body.category)) return fail("valid category is required");

  await connectDB();
  if (!(await Category.exists({ _id: body.category }))) return fail("Category not found", 404);

  const price = body.price === "" || body.price == null ? null : Number(body.price);
  if (price !== null && !Number.isFinite(price)) return fail("price must be a number");

  const product = await Product.create({
    name,
    slug: makeSlug(name),
    description: body.description || "",
    dimensions: body.dimensions || "",
    material: body.material || "",
    price,
    images: cleanImages(body.images),
    category: body.category,
    isActive: body.isActive !== false,
  });
  return Response.json(product, { status: 201 });
});
