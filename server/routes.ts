import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  waitlistFormSchema, 
  insertWaitlistSignupSchema,
  loginFormSchema,
  registerFormSchema,
  insertWatchSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

// Helper function to handle errors
const handleError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({ 
      message: validationError.message || "Invalid form data"
    });
  }
  console.error("API Error:", error);
  return res.status(500).json({ message: "An unexpected error occurred" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // ----------------------
  // Watch endpoints
  // ----------------------
  
  // Get all watches (with optional category filter)
  app.get('/api/watches', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const watches = await storage.getWatches(category);
      return res.json(watches);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Get a specific watch by ID
  app.get('/api/watches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      const watch = await storage.getWatch(id);
      if (!watch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      return res.json(watch);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Create a new watch (admin only in real app)
  app.post('/api/watches', async (req, res) => {
    try {
      const watchData = insertWatchSchema.parse(req.body);
      const newWatch = await storage.createWatch(watchData);
      return res.status(201).json(newWatch);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Update a watch (admin only in real app)
  app.patch('/api/watches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      // Partial validation
      const updateData = insertWatchSchema.partial().parse(req.body);
      const updatedWatch = await storage.updateWatch(id, updateData);
      
      if (!updatedWatch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      return res.json(updatedWatch);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // ----------------------
  // Auth endpoints
  // ----------------------
  
  // Register a new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerFormSchema.parse(req.body);
      
      // Check if username is taken
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Check if email is taken
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      // Create user (don't store confirmPassword or terms)
      const { confirmPassword, terms, ...userDataToSave } = userData;
      const newUser = await storage.createUser(userDataToSave);
      
      // In a real app, you would handle sessions here
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name
        }
      });
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginData = loginFormSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(loginData.username);
      
      // In a real app, you would check passwords securely
      if (!user || user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real app, you would handle sessions here
      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // ----------------------
  // Order endpoints
  // ----------------------
  
  // Get user orders
  app.get('/api/orders', async (req, res) => {
    try {
      // In a real app, get the userId from the session
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getUserOrders(userId);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return {
          ...order,
          items
        };
      }));
      
      return res.json(ordersWithItems);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Create a new order
  app.post('/api/orders', async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      
      // Validate order data
      const validOrderData = insertOrderSchema.parse(orderData);
      
      // Create the order
      const newOrder = await storage.createOrder(validOrderData);
      
      // Create order items
      if (Array.isArray(items)) {
        for (const item of items) {
          const orderItem = insertOrderItemSchema.parse({
            ...item,
            orderId: newOrder.id
          });
          await storage.createOrderItem(orderItem);
        }
      }
      
      // Get the complete order with items
      const orderItems = await storage.getOrderItems(newOrder.id);
      
      return res.status(201).json({
        ...newOrder,
        items: orderItems
      });
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // ----------------------
  // Waitlist endpoints
  // ----------------------
  
  app.post('/api/waitlist', async (req, res) => {
    try {
      // Validate request data
      const validatedData = waitlistFormSchema.parse(req.body);
      
      // Check if email already exists
      const existingSignup = await storage.getWaitlistSignupByEmail(validatedData.email);
      if (existingSignup) {
        return res.status(409).json({ 
          message: "This email is already on our waitlist."
        });
      }
      
      // Create waitlist signup (remove terms field as it's not in the DB schema)
      const { terms, ...signupData } = validatedData;
      const newSignup = await storage.createWaitlistSignup(signupData);
      
      // Return success
      return res.status(201).json({
        message: "Successfully added to waitlist!",
        signup: newSignup
      });
    } catch (error) {
      return handleError(error, res);
    }
  });

  app.get('/api/waitlist/count', async (_req, res) => {
    try {
      const signups = await storage.getWaitlistSignups();
      return res.json({ count: signups.length });
    } catch (error) {
      return handleError(error, res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
