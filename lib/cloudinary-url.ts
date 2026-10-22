/**
 * بيضيف تحسينات Cloudinary على لينك الصورة:
 * f_auto = أفضل صيغة للمتصفح (WebP/AVIF)، q_auto = جودة تلقائية، w_ = عرض أقصى.
 * ملف آمن للاستخدام في الـ client (مفيهوش أي أسرار).
 */
export function optimizeUrl(url: string, width = 800): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
}
