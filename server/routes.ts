import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
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
import { 
  upload, 
  uploadSingleFile, 
  getAllAssets, 
  getAssetById,
  getAssetsByProduct,
  deleteAsset 
} from "./assets";
import express from 'express';
import fs from 'fs';

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

const router = express.Router();

// API endpoints cho watches
router.get('/api/watches', async (req, res) => {
    try {
        const watches = await db.getWatches();
        res.json(watches);
    } catch (error) {
        console.error('Error fetching watches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/watches/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const watch = await db.getARModelById(id);
        if (!watch) {
            return res.status(404).json({ error: 'Watch not found' });
        }

        // Thêm tiền tố URL nếu cần
        watch.model_url = `http://localhost:5000${watch.model_url}`;
        res.json(watch);
    } catch (error) {
        console.error('Error fetching watch:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoints cho AR models
router.get('/api/watches/models', async (req, res) => {
    try {
        const models = await db.getARModels();
        res.json(models);
    } catch (error) {
        console.error('Error fetching AR models:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/watches/models/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid model ID' });
        }
        const model = await db.getARModelById(id);
        if (!model) {
            res.status(404).json({ error: 'Model not found' });
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.json(model);
    } catch (error) {
        console.error('Error fetching AR model:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

import path from 'path';
router.get('/uploads/models/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads/models', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.setHeader('Content-Type', 'model/gltf+json'); // Đặt Content-Type cho file .gltf
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(404).json({ error: 'File not found' });
      }
  });
});

router.get('/models/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/models', req.params.filename);
  res.setHeader('Content-Type', 'model/gltf-binary');
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(404).json({ error: 'File not found' });
      }
  });
});

export default router;

export async function registerRoutes(app: Express): Promise<Server> {
  // ----------------------
  // Watch endpoints
  // ----------------------
  
  // Get all watches (with optional category filter)
  app.get('/api/watches', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const watches = await db.getWatches(category);
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
      
      const watch = await db.getWatchById(id);
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
      const newWatch = await db.createWatch(watchData);
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
      const updatedWatch = await db.updateWatch(id, updateData);
      
      if (!updatedWatch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      return res.json(updatedWatch);
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // Xóa sản phẩm
  app.delete('/api/watches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      // Xóa sản phẩm
      await db.deleteWatch(id);
      return res.json({ message: "Watch deleted successfully" });
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
      const existingUserByUsername = await db.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Check if email is taken
      const existingUserByEmail = await db.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      // Create user (don't store confirmPassword or terms)
      const { confirmPassword, terms, ...userDataToSave } = userData;
      const newUser = await db.createUser(userDataToSave);
      
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
      
      const user = await db.getUserByUsername(loginData.username);
      
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
      
      const orders = await db.getUserOrders(userId);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await db.getOrderItems(order.id);
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
      const newOrder = await db.createOrder(validOrderData);
      
      // Create order items
      if (Array.isArray(items)) {
        for (const item of items) {
          const orderItem = insertOrderItemSchema.parse({
            ...item,
            orderId: newOrder.id
          });
          await db.createOrderItem(orderItem);
        }
      }
      
      // Get the complete order with items
      const orderItems = await db.getOrderItems(newOrder.id);
      
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
      const existingSignup = await db.getWaitlistSignupByEmail(validatedData.email);
      if (existingSignup) {
        return res.status(409).json({ 
          message: "This email is already on our waitlist."
        });
      }
      
      // Create waitlist signup (remove terms field as it's not in the DB schema)
      const { terms, ...signupData } = validatedData;
      const newSignup = await db.createWaitlistSignup(signupData);
      
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
      const signups = await db.getWaitlistSignups();
      return res.json({ count: signups.length });
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // ----------------------
  // Asset management endpoints
  // ----------------------
  
  // Tải lên file đơn
  app.post('/api/assets/upload', upload.single('file'), uploadSingleFile);
  
  // Lấy tất cả assets
  app.get('/api/assets', getAllAssets);
  
  // Lấy asset theo ID
  app.get('/api/assets/:id', getAssetById);
  
  // Lấy assets theo product ID
  app.get('/api/products/:productId/assets', getAssetsByProduct);
  
  // Xoá asset
  app.delete('/api/assets/:id', deleteAsset);

  // Lấy danh sách user
  app.get('/api/users', async (_req, res) => {
    try {
      const users = await db.getUsers();
      return res.json(users);
    } catch (error) {
      return handleError(error, res);
    }
  });

  // Xóa user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      await db.deleteUser(id);
      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  });

  // (Tùy chọn) Sửa user
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      // Chỉ cho phép sửa một số trường nhất định
      const { name, email } = req.body;
      await db.updateUser(id, { name, email });
      return res.json({ message: "User updated successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}


// Import or define the pool variable
import { pool } from './db'; // Ensure this matches the actual location of your database connection

export async function getARModelById(id: number) {
    const [rows] = await pool.query('SELECT id, name, model_url FROM watches WHERE id = ?', [id]) as [Array<{ id: number; name: string; model_url: string }>, any];
    return rows[0];
}
