import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/systems", "/branches", "/news", "/gallery", "/gallery/1", "/gallery/2", "/gallery/3", "/contact", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "/news" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/news" ? 0.8 : 0.6,
  }));
}
