import { cookies } from "next/headers";
import { createSessionToken, passwordMatches, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { fail, handle } from "@/lib/http";

export const POST = handle(async (req: Request) => {
  const { password } = await req.json().catch(() => ({}));
  if (!passwordMatches(password)) return fail("Wrong password", 401);

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return Response.json({ ok: true });
});
