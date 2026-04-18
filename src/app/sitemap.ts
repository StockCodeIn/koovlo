import { MetadataRoute } from "next";
import { categories, tools } from "@/lib/siteData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.koovlo.com";
  const lastModified = new Date();

  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/tools", priority: 0.9, changeFrequency: "weekly" as const },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}${category.path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
