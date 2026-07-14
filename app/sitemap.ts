import type { MetadataRoute } from "next";
import { getNotices } from "@/lib/notices";

const BASE = "https://tomatok.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notices = await getNotices();
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/notice`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...notices.map((n) => ({
      url: `${BASE}/notice/${n.id}`,
      lastModified: n.date ? new Date(n.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
