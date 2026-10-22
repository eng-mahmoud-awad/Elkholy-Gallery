import { NextResponse } from "next/server";
import { cloudinary, UPLOAD_FOLDER } from "../../../../lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * بيرجع توقيع صالح لرفع صورة واحدة مباشرة من المتصفح لـ Cloudinary.
 * ⚠️ مهم: لازم نحمي الـ route ده بتسجيل دخول الأدمن في خطوة الـ Auth،
 * وإلا أي حد يقدر يرفع صور على حسابك.
 */
export async function POST() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary env vars are missing" }, { status: 500 });
  }

  // TODO(auth): تحقق إن المستخدم أدمن قبل ما نكمل

  const timestamp = Math.round(Date.now() / 1000);
  const folder = UPLOAD_FOLDER;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
  });
}
