import { createUploadSignature } from "@/lib/cloudinary";
import { handle, requireAdmin } from "@/lib/http";

// Admin-only: hands the dashboard a short-lived signature for direct upload.
export const POST = handle(async () => {
  const denied = await requireAdmin();
  if (denied) return denied;
  return Response.json(createUploadSignature());
});
