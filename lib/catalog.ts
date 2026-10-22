import { prisma } from "./prisma";
import { optimizeUrl } from "./cloudinary-url";
import { placeholder, type CatalogCategory, type Kind, type Product } from "./data";

const KINDS = ["bed", "dining", "sofa", "kids"];

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

  const withProducts = rows.filter((c) => c.products.length > 0);

  const categories: CatalogCategory[] = withProducts.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const products: Product[] = withProducts.flatMap((c) => {
    const kind = (KINDS.includes(c.kind ?? "") ? c.kind : "sofa") as Kind;

    return c.products.map((p, i) => {
      const fromImages = p.images.map((img) => img.url);
      const sources =
        fromImages.length > 0 ? fromImages : p.image ? [p.image] : [];
      const urls = sources.map((url) => optimizeUrl(url, 900));
      const fallback = placeholder(kind, i);

      return {
        id: p.id,
        category: c.name,
        name: p.name,
        material: p.material ?? "",
        dimensions: p.dimensions ?? "",
        color: p.color ?? "",
        description: p.description ?? "",
        image: urls[0] ?? fallback,
        images: urls.length > 0 ? urls : [fallback],
      };
    });
  });

  return { categories, products };
}