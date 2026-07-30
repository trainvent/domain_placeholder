import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const supported = new Set(["en", "de"]);

export function proxy(request: NextRequest) {
  const saved = request.cookies.get("trainvent-locale")?.value;
  const accepted = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const detected = accepted
    .split(",")
    .map((part) => part.trim().split(";")[0]?.split("-")[0])
    .find((locale) => locale && supported.has(locale));
  const locale = saved && supported.has(saved) ? saved : detected ?? "en";

  return NextResponse.redirect(new URL(`/${locale}/`, request.url));
}

export const config = {
  matcher: "/",
};
