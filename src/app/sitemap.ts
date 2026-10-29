import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One public page. No lastModified/priority: they'd be invented, and Google ignores priority.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/` }];
}
