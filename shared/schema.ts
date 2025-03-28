import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
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

export const watch = pgTable("watch", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // Store as text for proper formatting
  imageUrl: text("image_url").notNull(),
  modelUrl: text("model_url").notNull(), // 3D model URL for AR
  category: text("category").notNull(),
  brand: text("brand").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  features: text("features").array().notNull(),
  dimensions: text("dimensions").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  fullName: true,
  email: true,
  company: true,
  role: true,
  consentToMarketing: true,
});

export const insertWatchSchema = createInsertSchema(watch).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  modelUrl: true,
  category: true,
  brand: true,
  inStock: true,
  features: true,
  dimensions: true,
});

export const waitlistFormSchema = insertWaitlistSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a role"),
  consentToMarketing: z.boolean().refine(val => val === true, {
    message: "You must agree to receive communications"
  })
});

export const watchFormSchema = insertWatchSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price must be provided"), // Changed to string
  imageUrl: z.string().url("Must be a valid URL"),
  modelUrl: z.string().url("Must be a valid URL for the 3D model"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  inStock: z.boolean().default(true),
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWatch = z.infer<typeof insertWatchSchema>;
export type Watch = typeof watch.$inferSelect;
