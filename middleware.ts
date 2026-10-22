import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. حدد المسارات اللي محتاجة حماية (الداشبورد + الـ API الخاص برفع الصور)
  const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/dashboard") || path.startsWith("/api/cloudinary");

  // 2. اقرأ التوكن أو الجلسة من الكوكيز (غيّر 'admin-token' حسب اسم الكوكي في نظامك)
  const token = request.cookies.get("admin-token")?.value; 

  // 3. لو المسار محمي والمستخدم مش معاه التوكن (غير مسجل دخول)
  if (isProtectedRoute && !token) {
    // لو الطلب رايح لـ API بنرجع خطأ 401 بدل التحويل لصفحة
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - برجاء تسجيل الدخول كأدمن" },
        { status: 401 }
      );
    }
    
    // لو الطلب لصفحة عادية، بنحوله لصفحة تسجيل الدخول
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. لو المستخدم معاه صلاحية أو المسار مش محمي، يكمل عادي
  return NextResponse.next();
}

// 5. الـ Matcher بيحدد الملفات اللي الـ Middleware يشتغل عليها (لتحسين الأداء)
export const config = {
  matcher: [
    /*
     * تطبيق الـ Middleware على كل المسارات باستثناء:
     * - _next/static (ملفات الجافاسكربت والـ CSS الثابتة)
     * - _next/image (مسار تحسين الصور في Next.js)
     * - favicon.ico (أيقونة الموقع)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};