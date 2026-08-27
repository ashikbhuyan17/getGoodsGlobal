import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/account") ||
    pathname === "/wishlist" ||
    pathname === "/cart" ||
    pathname === "/checkout"
  );
}

type AuthStatus = "authenticated" | "unauthenticated" | "no_token" | "error";

async function getAuthStatus(request: NextRequest): Promise<AuthStatus> {
  const token = request.cookies.get("token")?.value;
  if (!token) return "no_token";

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return "error";

    const res = await fetch(`${apiUrl}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 401) return "unauthenticated";
    if (!res.ok) return "error";

    const profile = await res.json();
    const data = profile?.data;
    const hasId =
      data?.id !== undefined && data?.id !== null && `${data.id}` !== "";
    return hasId || data?.email || data?.phone
      ? "authenticated"
      : "unauthenticated";
  } catch (error) {
    console.error("Auth profile check failed:", error);
    return "error";
  }
}

function clearTokenCookie(response: NextResponse) {
  response.cookies.delete({ name: "token", path: "/" });
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const status = await getAuthStatus(request);

    if (status === "authenticated") {
      if (pathname === "/signin") {
        const redirect = request.nextUrl.searchParams.get("redirect");
        const returnUrl =
          redirect && redirect.startsWith("/") && !redirect.startsWith("//")
            ? redirect
            : "/account";
        return NextResponse.redirect(new URL(returnUrl, request.url));
      }
    }

    if (
      (status === "unauthenticated" || status === "no_token") &&
      isProtectedPath(pathname)
    ) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(signinUrl);
      if (status === "unauthenticated") {
        clearTokenCookie(response);
      }
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    if (isProtectedPath(pathname)) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }
}

export const config = {
  matcher: ["/account/:path*", "/wishlist", "/signin", "/cart", "/checkout"],
};
