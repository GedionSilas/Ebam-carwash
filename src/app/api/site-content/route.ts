import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";
import { siteContentQuery } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

    if (!projectId) {
      return NextResponse.json({ error: "Sanity project id is not configured" }, { status: 500 });
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

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch site content", error);
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 });
  }
}
