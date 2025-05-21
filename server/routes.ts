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
import { authMiddleware } from "./middleware/auth";
import { isAdmin } from "./middleware/isAdmin";
import jwt from "jsonwebtoken";


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


        watch.model_url = `http://localhost:5000${watch.model_url}`;
        res.json(watch);
    } catch (error) {
        console.error('Error fetching watch:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


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
  res.setHeader('Content-Type', 'model/gltf+json'); 
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
  

  app.get('/api/watches', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const watches = await db.getWatches(category);
      return res.json(watches);
    } catch (error) {
      return handleError(error, res);
    }
  });
  

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
  
  app.post('/api/watches', authMiddleware, isAdmin, async (req, res) => {
    try {
      const watchData = insertWatchSchema.parse(req.body);
      const newWatch = await db.createWatch(watchData);
      return res.status(201).json(newWatch);
    } catch (error) {
      return handleError(error, res);
    }
  });
  

  app.patch('/api/watches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      

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
  

  app.delete('/api/watches/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid watch ID" });
      }
      
      await db.deleteWatch(id);
      return res.json({ message: "Watch deleted successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  });
  
  // ----------------------
  // Auth endpoints
  // ----------------------

  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerFormSchema.parse(req.body);
      
      
      const existingUserByUsername = await db.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      
      const existingUserByEmail = await db.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      
      const { confirmPassword, terms, ...userDataToSave } = userData;
      const userToInsert = {
        ...userDataToSave,
        created_at: new Date(),
      };
      
      const newUser = await db.createUser(userToInsert);
      
   
      
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
  

  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginData = loginFormSchema.parse(req.body);
      
      const user = await db.getUserByUsername(loginData.username);
      

      if (!user || user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.id === 0 ? "admin" : "user" },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1d" }
      );
      
      return res.json({
        message: "Login successful",
        token,
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
  
  app.get('/api/orders', authMiddleware,  async (req, res) => {
    try {

      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await db.getUserOrders(userId);
      

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
  
  app.post('/api/orders', authMiddleware,  async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      

      const validOrderData = insertOrderSchema.parse(orderData);
      

      const newOrder = await db.createOrder(validOrderData);
      
      
      if (Array.isArray(items)) {
        for (const item of items) {
          const orderItem = insertOrderItemSchema.parse({
            ...item,
            orderId: newOrder.id
          });
          await db.createOrderItem(orderItem);
        }
      }
      

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

      const validatedData = waitlistFormSchema.parse(req.body);
      

      const existingSignup = await db.getWaitlistSignupByEmail(validatedData.email);
      if (existingSignup) {
        return res.status(409).json({ 
          message: "This email is already on our waitlist."
        });
      }
      

      const { terms, ...signupData } = validatedData;
      const newSignup = await db.createWaitlistSignup(signupData);
      

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

  app.post('/api/assets/upload', upload.single('file'), uploadSingleFile);
  

  app.get('/api/assets', getAllAssets);

  app.get('/api/assets/:id', getAssetById);
  

  app.get('/api/products/:productId/assets', getAssetsByProduct);
  
  
  app.delete('/api/assets/:id', deleteAsset);

  app.get('/api/users',  authMiddleware, isAdmin, async (req, res) => {
    try {
      const users = await db.getUsers();
      return res.json(users);
    } catch (error) {
      return handleError(error, res);
    }
  });

  app.delete('/api/users/:id',  authMiddleware, isAdmin, async (req, res) => {
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


  app.patch('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { name, email } = req.body;
      await db.updateUser(id, { name, email });
      return res.json({ message: "User updated successfully" });
    } catch (error) {
      return handleError(error, res);
    }
  });

  app.post('/api/cart', authMiddleware, async (req, res) => {
    try {
      console.log('POST /api/cart body:', req.body);
      const { userId, watchId, quantity } = req.body;

      if (!userId || !watchId) {
        return res.status(400).json({ error: 'Missing userId or watchId' });
      }
      await db.addToCart(userId, watchId, quantity || 1);
      res.json({ message: 'Added to cart' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/cart', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
      }
      const cartItems = await db.getCartItemsByUserId(userId);
      if (cartItems.length === 0) return res.json([]);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}


import { pool } from './db'; 

export async function getARModelById(id: number) {
    const [rows] = await pool.query('SELECT id, name, model_url FROM watches WHERE id = ?', [id]) as [Array<{ id: number; name: string; model_url: string }>, any];
    return rows[0];
}
