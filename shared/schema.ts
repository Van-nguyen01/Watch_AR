import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const watches = pgTable("watches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  modelUrl: text("model_url"), // URL to 3D model for AR
  category: text("category").notNull(), // e.g., "luxury", "sport", "casual"
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: text("created_at").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull(), // e.g., "pending", "completed", "cancelled"
  createdAt: text("created_at").notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  watchId: integer("watch_id").notNull().references(() => watches.id),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const waitlistSignups = pgTable("waitlist_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company"),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertWatchSchema = createInsertSchema(watches).pick({
  name: true,
  brand: true,
  description: true,
  price: true,
  imageUrl: true,
  modelUrl: true,
  category: true,
  inStock: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  totalAmount: true,
  status: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  watchId: true,
  quantity: true,
  price: true,
});

export const insertWaitlistSignupSchema = createInsertSchema(waitlistSignups).pick({
  name: true,
  email: true,
  company: true,
});

// Form schemas
export const loginFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const waitlistFormSchema = insertWaitlistSignupSchema.extend({
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWatch = z.infer<typeof insertWatchSchema>;
export type Watch = typeof watches.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertWaitlistSignup = z.infer<typeof insertWaitlistSignupSchema>;
export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
