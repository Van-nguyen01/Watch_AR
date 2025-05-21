import { mysqlTable, varchar, int, double, boolean, timestamp, text } from 'drizzle-orm/mysql-core';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const watches = mysqlTable("watches", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: double("price").notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  modelUrl: varchar("model_url", { length: 255 }), // URL to 3D model for AR
  category: varchar("category", { length: 255 }).notNull(), // e.g., "luxury", "sport", "casual"
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  totalAmount: double("total_amount").notNull(),
  status: varchar("status", { length: 255 }).notNull(), // e.g., "pending", "completed", "cancelled"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orders.id),
  watchId: int("watch_id").notNull().references(() => watches.id),
  quantity: int("quantity").notNull(),
  price: double("price").notNull(),
});

export const waitlistSignups = mysqlTable("waitlist_signups", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  company: varchar("company", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bảng quản lý assets (hình ảnh và models)
export const assets = mysqlTable("assets", {
  id: int("id").primaryKey().autoincrement(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileType: varchar("file_type", { length: 255 }).notNull(), // image/jpeg, image/png, model/gltf-binary, etc.
  fileSize: int("file_size").notNull(),
  fileUrl: varchar("file_url", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(), // product-image, model-3d, thumbnail, etc.
  relatedProductId: int("related_product_id").references(() => watches.id),
  publicUrl: varchar("public_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cart = mysqlTable("cart", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItems = mysqlTable("cart_items", {
  id: int("id").primaryKey().autoincrement(),
  cartId: int("cart_id").notNull().references(() => cart.id),
  watchId: int("watch_id").notNull().references(() => watches.id),
  quantity: int("quantity").notNull().default(1),
  addedAt: timestamp("added_at").notNull().defaultNow(),
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

export const insertAssetSchema = createInsertSchema(assets).pick({
  fileName: true,
  fileType: true,
  fileSize: true,
  fileUrl: true,
  originalName: true,
  mimeType: true,
  category: true,
  relatedProductId: true,
  publicUrl: true,
});

export const insertCartSchema = createInsertSchema(cart).pick({
  userId: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  watchId: true,
  quantity: true,
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
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof cart.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
