"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

type ImageInput = { url: string; publicId: string };

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:.*?\/)?v\d+\/(.+)$/);
    const path = match ? match[1] : url.split("/upload/")[1];
    if (!path) return null;
    return path.replace(/\.[^./]+$/, "");
  } catch {
    return null;
  }
}

function normalizeImages(list: ImageInput[]): ImageInput[] {
  return list
    .filter((img) => img && typeof img.url === "string" && img.url.length > 0)
    .map((img) => ({
      url: img.url,
      publicId:
        !img.publicId || img.publicId.startsWith("http")
          ? extractPublicId(img.url) ?? ""
          : img.publicId,
    }));
}

function readImages(formData: FormData): ImageInput[] | null {
  const raw = formData.get("images");
  if (typeof raw === "string" && raw.length > 0) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeImages(parsed);
    } catch {
      return null;
    }
  }
  const single = formData.get("image");
  if (typeof single === "string" && single.length > 0) {
    return normalizeImages([{ url: single, publicId: "" }]);
  }
  return null;
}

function collectPublicIds(product: {
  image?: string | null;
  images?: { url: string; publicId: string }[];
}): string[] {
  const ids = new Set<string>();
  for (const img of product.images ?? []) {
    const id = img.publicId || extractPublicId(img.url);
    if (id) ids.add(id);
  }
  if (product.image) {
    const id = extractPublicId(product.image);
    if (id) ids.add(id);
  }
  return [...ids];
}

async function destroyMany(publicIds: string[]) {
  await Promise.all(
    publicIds.map(async (id) => {
      try {
        await cloudinary.uploader.destroy(id);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", id, error);
      }
    })
  );
}

export async function deleteImageFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
}

export async function addCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const kind = formData.get("kind") as string;

    if (!name) throw new Error("اسم القسم مطلوب");

    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: "desc" },
    });
    const newOrder = lastCategory ? lastCategory.order + 1 : 0;

   await prisma.category.create({
  data: { name, kind: kind || undefined, order: newOrder },
});

    revalidateAll();
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("فشل إضافة القسم");
  }
}

export async function editCategory(categoryId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const kind = formData.get("kind") as string;

    if (!name) throw new Error("اسم القسم مطلوب");

    await prisma.category.update({
  where: { id: categoryId },
  data: { name, kind: kind || undefined },
});

    revalidateAll();
  } catch (error) {
    console.error("Error editing category:", error);
    throw new Error("فشل تعديل القسم");
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId },
      select: { image: true, images: true },
    });

    await prisma.$transaction([
      prisma.product.deleteMany({ where: { categoryId } }),
      prisma.category.delete({ where: { id: categoryId } }),
    ]);

    await destroyMany([...new Set(products.flatMap(collectPublicIds))]);

    revalidateAll();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("فشل حذف القسم");
  }
}

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const material = formData.get("material") as string;
    const dimensions = formData.get("dimensions") as string;
    const color = formData.get("color") as string;
    const description = formData.get("description") as string;
    const images = readImages(formData) ?? [];

    if (!name || !categoryId) throw new Error("اسم المنتج والقسم مطلوبين");

    const lastProduct = await prisma.product.findFirst({
      where: { categoryId },
      orderBy: { order: "desc" },
    });
    const newOrder = lastProduct ? lastProduct.order + 1 : 0;

    await prisma.product.create({
      data: {
        name,
        categoryId,
        material: material || null,
        dimensions: dimensions || null,
        color: color || null,
        description: description || "",
        image: images[0]?.url ?? null,
        images,
        order: newOrder,
      },
    });

    revalidateAll();
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("فشل إضافة المنتج");
  }
}

export async function editProduct(productId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const material = formData.get("material") as string;
    const dimensions = formData.get("dimensions") as string;
    const color = formData.get("color") as string;
    const description = formData.get("description") as string;
    const images = readImages(formData);

    if (!name) throw new Error("اسم المنتج مطلوب");

    const existing = await prisma.product.findUnique({
      where: { id: productId },
      select: { image: true, images: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        material: material || null,
        dimensions: dimensions || null,
        color: color || null,
        description: description || "",
        ...(images !== null && {
          image: images[0]?.url ?? null,
          images: { set: images },
        }),
      },
    });

    if (existing && images !== null) {
      const keep = new Set(images.map((img) => img.publicId).filter(Boolean));
      const removed = collectPublicIds(existing).filter((id) => !keep.has(id));
      await destroyMany(removed);
    }

    revalidateAll();
  } catch (error) {
    console.error("Error editing product:", error);
    throw new Error("فشل تعديل المنتج");
  }
}

export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { image: true, images: true },
    });

    await prisma.product.delete({ where: { id: productId } });

    if (product) await destroyMany(collectPublicIds(product));

    revalidateAll();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("فشل حذف المنتج");
  }
}