import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company"),
  role: text("role").notNull(),
  consentToMarketing: boolean("consent_to_marketing").notNull().default(false),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  fullName: true,
  email: true,
  company: true,
  role: true,
  consentToMarketing: true,
});

export const waitlistFormSchema = insertWaitlistSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a role"),
  consentToMarketing: z.boolean().refine(val => val === true, {
    message: "You must agree to receive communications"
  })
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
