import { env } from "cloudflare:workers";
import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { unifinLeads, unifinPageViews } from "@/db/schema";

async function digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function isAuthorized(request: Request) {
  const configured = (env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!configured || !supplied) return false;
  return (await digest(configured)) === (await digest(supplied));
}

export async function GET(request: Request) {
  if (!(await isAuthorized(request))) {
    return Response.json({ ok: false, error: "Senha inválida." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const db = getDb();
    const [leads, realLeadCount, testLeadCount, pageViewCount] = await Promise.all([
      db.select().from(unifinLeads).orderBy(desc(unifinLeads.createdAt)).limit(500),
      db.select({ value: count() }).from(unifinLeads).where(eq(unifinLeads.isTest, false)),
      db.select({ value: count() }).from(unifinLeads).where(eq(unifinLeads.isTest, true)),
      db.select({ value: count() }).from(unifinPageViews),
    ]);

    return Response.json({
      ok: true,
      counts: {
        leads: realLeadCount[0]?.value ?? 0,
        tests: testLeadCount[0]?.value ?? 0,
        pageViews: pageViewCount[0]?.value ?? 0,
      },
      leads,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("admin_leads_failed", error);
    return Response.json({ ok: false, error: "Não foi possível carregar os dados." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
