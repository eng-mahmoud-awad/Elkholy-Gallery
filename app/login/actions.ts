// app/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;

  // التحقق من أن المتغيرات موجودة في السيرفر
  if (!envUser || !envPass) {
    return { error: "بيانات الدخول غير مجهزة في الخادم." };
  }

  // التحقق من صحة البيانات
  if (username === envUser && password === envPass) {
    const cookieStore = await cookies();
    
    // إنشاء الكوكي (نفس الاسم اللي استخدمناه في الـ middleware)
    cookieStore.set("admin-token", "authenticated", {
      httpOnly: true, // أمان عشان الجافاسكربت في المتصفح متقدرش تقرأه
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // صالح لمدة أسبوع
      path: "/",
    });

    // لو البيانات صح، بنحوله للداشبورد (أو /admin حسب مسارك)
    redirect("/dashboard"); 
  } else {
    // لو البيانات غلط
    return { error: "اسم المستخدم أو كلمة المرور غير صحيحة." };
  }
}