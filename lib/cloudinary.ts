import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** فولدر الصور على Cloudinary */
export const UPLOAD_FOLDER = "furniture";

/** حذف صورة من Cloudinary (هنستخدمها في الداشبورد عند حذف منتج أو صورة) */
export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

type ImageRef =
  | string
  | { publicId?: string | null; public_id?: string | null };

export async function destroyImages(images?: ImageRef[] | null) {
  const ids = (images ?? [])
    .map((img) =>
      typeof img === "string" ? img : img?.publicId ?? img?.public_id
    )
    .filter((id): id is string => Boolean(id));

  await Promise.all(
    ids.map((id) =>
      cloudinary.uploader.destroy(id).catch((error) => {
        console.error("Error deleting from Cloudinary:", id, error);
      })
    )
  );
}