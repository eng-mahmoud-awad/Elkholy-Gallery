"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { optimizeUrl } from "../lib/cloudinary-url";
import { deleteImageFromCloudinary } from "@/app/dashboard/actions";

export type UploadedImage = { url: string; publicId: string };

const MAX_MB = 10;

async function uploadOne(file: File): Promise<UploadedImage> {
  const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("فشل توقيع الرفع");
  const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `فشل رفع الصورة (${res.status})`);
  }
  return { url: data.secure_url, publicId: data.public_id };
}

export default function ImageUploader({
  value,
  onChange,
  max = 8,
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;

    const files = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(max - value.length, 0));

    if (files.some((f) => f.size > MAX_MB * 1024 * 1024)) {
      toast.error(`حجم الصورة لازم يكون أقل من ${MAX_MB} ميجا`);
      return;
    }
    if (files.length === 0) {
      toast.error(value.length >= max ? `الحد الأقصى ${max} صور` : "اختار صور فقط");
      return;
    }

    setBusy(true);
    const t = toast.loading("جاري رفع الصور...");
    try {
      const uploaded = await Promise.all(files.map(uploadOne));
      onChange([...value, ...uploaded]);
      toast.success(uploaded.length > 1 ? "تم رفع الصور" : "تم رفع الصورة", { id: t });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حصل خطأ أثناء الرفع", { id: t });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const remove = async (i: number) => {
    const imageToDelete = value[i];
    onChange(value.filter((_, idx) => idx !== i));

    if (!imageToDelete.publicId || imageToDelete.publicId.startsWith("http")) {
      toast.success("تم حذف الصورة");
      return;
    }

    const t = toast.loading("جاري حذف الصورة...");
    try {
      await deleteImageFromCloudinary(imageToDelete.publicId);
      toast.success("تم حذف الصورة", { id: t });
    } catch {
      toast.error("تعذر حذف الصورة من Cloudinary", { id: t });
    }
  };

  const makeMain = (i: number) =>
    onChange([value[i], ...value.filter((_, idx) => idx !== i)]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 min-[560px]:grid-cols-4">
        {value.map((img, i) => (
          <div
            key={img.publicId}
            className="relative overflow-hidden rounded-xl border border-[#F0DDD1] bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={optimizeUrl(img.url, 300)}
              alt=""
              className="block aspect-[4/3] w-full object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1.5 right-1.5 rounded-full bg-[#C8532F] px-2 py-0.5 text-[12px] font-semibold text-white">
                الرئيسية
              </span>
            )}
            <div className="flex justify-between gap-1 p-1.5 text-[13px]">
              {i !== 0 ? (
                <button type="button" onClick={() => makeMain(i)} className="text-[#C8532F] hover:underline">
                  اجعلها رئيسية
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={() => remove(i)} className="text-[#7A2A2A] hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="grid aspect-[4/3] place-content-center rounded-xl border-2 border-dashed border-[#E8795A] bg-[#FBF4EE] text-[15px] font-semibold text-[#C8532F] transition hover:bg-white disabled:opacity-60"
          >
            {busy ? "جاري الرفع..." : "+ إضافة صور"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}