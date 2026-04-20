import { MetadataRoute } from "next";
import { locales } from "@/lib/routing";

const BASE_URL = "https://hamroh.uz";

const STATIC_ROUTES = [
  "",
  "/dashboard",
  "/petitions",
  "/petitions/new",
  "/ai-assistant",
  "/news",
  "/content",
  "/translator",
  "/voice",
  "/maps/legal",
  "/maps/security",
  "/about",
  "/faq",
  "/emergency",
  "/contact",
  "/rights",
  "/privacy",
  "/terms",
  "/profile",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : route === "/dashboard" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${route}`])
          ),
        },
      });
    }
  }

  return entries;
}
