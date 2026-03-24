import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["de", "en"],
  defaultLocale: "de",
});

export const config = {
  // Match all pathnames except API routes, _next, and static files
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
