import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { handle, requireAdmin } from "@/lib/http";

async function getSettings() {
  await connectDB();
  // Create the singleton on first read, seeded from env.
  return Settings.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { whatsappNumber: normalizeWhatsAppNumber(process.env.WHATSAPP_NUMBER) } },
    { upsert: true, new: true }
  ).lean();
}

export const GET = handle(async () => Response.json(await getSettings()));

export const PUT = handle(async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const update: Record<string, string> = {};
  if (body.whatsappNumber !== undefined) update.whatsappNumber = normalizeWhatsAppNumber(body.whatsappNumber);
  if (body.aboutText !== undefined) update.aboutText = String(body.aboutText);
  if (body.logoUrl !== undefined) update.logoUrl = String(body.logoUrl);

  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    { key: "main" },
    { $set: update },
    { upsert: true, new: true }
  ).lean();
  return Response.json(settings);
});
