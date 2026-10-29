import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed; only the production environment is crawlable.
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
