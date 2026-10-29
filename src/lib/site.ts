// Public origin used for canonical URLs, the sitemap and social images.
// Set NEXT_PUBLIC_SITE_URL when a custom domain is attached.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://daniel-brooks-portfolio-zeta.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Daniel Brooks";
export const SITE_TITLE = "Daniel Brooks | Senior Software Engineer";
export const SITE_DESCRIPTION =
  "Senior software engineer with 8+ years in AI/ML and data engineering. Custom software, AI agents and automation, SaaS and API integration.";
