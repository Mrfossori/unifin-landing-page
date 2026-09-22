import { z } from "zod";
import { getDb } from "@/db";
import { unifinPageViews } from "@/db/schema";

const viewSchema = z.object({
  sessionId: z.string().uuid(),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(120).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
});

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return new Response(null, { status: 403 });
  try {
    const parsed = viewSchema.safeParse(await request.json());
    if (!parsed.success) return new Response(null, { status: 400 });
    const data = parsed.data;
    await getDb().insert(unifinPageViews).values({
      sessionId: data.sessionId,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      referrer: data.referrer || null,
    }).onConflictDoNothing({ target: unifinPageViews.sessionId });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("page_view_insert_failed", error);
    return new Response(null, { status: 503 });
  }
}
