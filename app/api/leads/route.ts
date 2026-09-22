import { z } from "zod";
import { getDb } from "@/db";
import { unifinLeads } from "@/db/schema";

const leadSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  modality: z.enum(["presencial", "ead", "hibrida"]),
  mainChallenge: z.enum(["controlar_gastos", "saber_disponivel", "despesas_faculdade", "guardar_dinheiro", "renda_variavel", "outro"]),
  consent: z.literal(true),
  company: z.string().max(200).optional().default(""),
  formStartedAt: z.number().int().positive(),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(120).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
});

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ ok: false, error: "Origem não permitida." }, { status: 403 });
  try {
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ ok: false, error: "Revise os campos e tente novamente." }, { status: 400 });
    const data = parsed.data;
    const elapsed = Date.now() - data.formStartedAt;
    if (data.company || elapsed < 1200 || elapsed > 86_400_000) return Response.json({ ok: true });
    const email = data.email.toLowerCase();
    await getDb().insert(unifinLeads).values({
      firstName: data.firstName,
      email,
      modality: data.modality,
      mainChallenge: data.mainChallenge,
      consent: true,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      referrer: data.referrer || null,
      isTest: email.endsWith("@example.invalid"),
    }).onConflictDoNothing({ target: unifinLeads.email });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("lead_insert_failed", error);
    return Response.json({ ok: false, error: "Não foi possível enviar agora. Tente novamente em instantes." }, { status: 500 });
  }
}
