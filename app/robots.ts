import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/profile", "/dashboard"],
      },
    ],
    sitemap: "https://hamroh.uz/sitemap.xml",
    host: "https://hamroh.uz",
  };
}
