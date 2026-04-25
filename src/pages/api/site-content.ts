import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";
import { siteContentQuery } from "@/lib/content";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

    if (!projectId) {
      return res.status(500).json({ error: "Sanity project id is not configured" });
    }

    const client = createClient({
      projectId,
      dataset,
      token,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-01-01",
      useCdn: false,
    });

    const perspective = token ? "drafts" : "published";
    const data = await client.fetch(siteContentQuery, {}, { perspective });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch site content", error);
    return res.status(500).json({ error: "Failed to fetch site content" });
  }
}
