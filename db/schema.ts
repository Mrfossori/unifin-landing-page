import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const unifinLeads = sqliteTable("unifin_leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  firstName: text("first_name").notNull(),
  email: text("email").notNull(),
  modality: text("modality", { enum: ["presencial", "ead", "hibrida"] }).notNull(),
  mainChallenge: text("main_challenge", { enum: ["controlar_gastos", "saber_disponivel", "despesas_faculdade", "guardar_dinheiro", "renda_variavel", "outro"] }).notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  referrer: text("referrer"),
  isTest: integer("is_test", { mode: "boolean" }).notNull().default(false),
}, (table) => [uniqueIndex("unifin_leads_email_unique").on(table.email)]);

export const unifinPageViews = sqliteTable("unifin_page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  sessionId: text("session_id").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  referrer: text("referrer"),
}, (table) => [uniqueIndex("unifin_page_views_session_unique").on(table.sessionId)]);
