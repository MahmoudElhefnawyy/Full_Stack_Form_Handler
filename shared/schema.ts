import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const websiteIdeas = pgTable("website_ideas", {
  id: serial("id").primaryKey(),
  idea: text("idea").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  websiteIdeaId: integer("website_idea_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWebsiteIdeaSchema = createInsertSchema(websiteIdeas).pick({
  idea: true,
});

export const insertSectionSchema = createInsertSchema(sections).pick({
  websiteIdeaId: true,
  title: true,
  type: true,
  description: true,
  features: true,
});

export type InsertWebsiteIdea = z.infer<typeof insertWebsiteIdeaSchema>;
export type WebsiteIdea = typeof websiteIdeas.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;
