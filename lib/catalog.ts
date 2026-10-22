// import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";
import { placeholder, type CatalogCategory, type Kind, type Product } from "./data";

/**
 * بيجيب الكاتيجوريز والمنتجات الفعّالة من Mongo.
 * "use cache" بيخلي النتيجة تتخزن، والداشبورد هيمسحها بالـ tag "catalog" بعد أي تعديل.
 */
export async function getCatalog(): Promise<{
  categories: CatalogCategory[];
  products: Product[];
}> {
 

  const rows = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  // نخفي الكاتيجوري الفاضية
  const withProducts = rows.filter((c) => c.products.length > 0);

  const categories: CatalogCategory[] = withProducts.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const products: Product[] = withProducts.flatMap((c) =>
    c.products.map((p, i) => ({
      id: p.id,
      category: c.name,
      name: p.name,
      material: p.material ?? "",
      dimensions: p.dimensions ?? "",
      color: p.color ?? "",
      description: p.description,
      // أول صورة من Cloudinary، وإلا الصورة البديلة
      image: p.images[0]?.url ?? placeholder(c.kind as Kind, i),
    }))
  );

  return { categories, products };
}
