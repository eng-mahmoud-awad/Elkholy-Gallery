import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const UPLOAD_FOLDER = "al-asmar";

export type UploadSignature = {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string | undefined;
  cloudName: string | undefined;
};

// Signed upload: the browser uploads straight to Cloudinary using this
// signature, so image bytes never pass through our server (Vercel has a
// ~4.5MB request body limit that multi-photo uploads would hit quickly).
export function createUploadSignature(): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    process.env.CLOUDINARY_API_SECRET as string
  );
  return {
    signature,
    timestamp,
    folder: UPLOAD_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

// Best-effort cleanup: a failed delete must never block the DB operation,
// so we use allSettled and ignore individual failures.
export async function destroyImages(publicIds: (string | null | undefined)[] = []) {
  const ids = publicIds.filter((id): id is string => Boolean(id));
  if (!ids.length) return;
  await Promise.allSettled(ids.map((id) => cloudinary.uploader.destroy(id)));
}

export default cloudinary;
