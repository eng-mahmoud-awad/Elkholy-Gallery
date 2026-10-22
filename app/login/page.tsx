// app/login/page.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  // useActionState بيتعامل مع حالة الـ Form (البيانات، الخطأ، وهل بيحمل ولا لأ)
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#FBF4EE] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#F0DDD1] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#C8532F]">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-[#7A2A2A]">
            برجاء إدخال بيانات لوحة التحكم
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-[14px] font-medium text-[#7A2A2A]"
            >
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full rounded-xl border border-[#F0DDD1] bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-[#E8795A] focus:ring-1 focus:ring-[#E8795A]"
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[14px] font-medium text-[#7A2A2A]"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full rounded-xl border border-[#F0DDD1] bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-[#E8795A] focus:ring-1 focus:ring-[#E8795A]"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {/* عرض رسالة الخطأ لو موجودة */}
          {state?.error && (
            <p className="rounded-lg bg-[#fdf0ef] p-3 text-center text-[14px] text-[#B42318]">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-4 w-full rounded-xl bg-[#C8532F] py-3 text-[15px] font-semibold text-white transition hover:bg-[#a64223] disabled:opacity-60"
          >
            {isPending ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}