import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistFormSchema, watchFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = waitlistFormSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Check if email already exists in waitlist
      const existingEntry = await storage.getWaitlistEntryByEmail(validatedData.data.email);
      if (existingEntry) {
        return res.status(409).json({ 
          message: "This email is already on our waitlist." 
        });
      }
      
      // Create the waitlist entry
      const waitlistEntry = await storage.createWaitlistEntry(validatedData.data);
      
      // Return the created entry without the ID for security
      const { id, ...safeEntry } = waitlistEntry;
      
      return res.status(201).json({ 
        message: "Successfully added to waitlist!",
        data: safeEntry 
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Get waitlist count (for displaying stats)
  app.get("/api/waitlist/count", async (_req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      return res.status(200).json({ count: entries.length });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Watch API endpoints
  // Get all watches
  app.get("/api/watches", async (_req, res) => {
    try {
      const watches = await storage.getWatches();
      return res.status(200).json(watches);
    } catch (error) {
      console.error("Error fetching watches:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Get a single watch by ID
  app.get("/api/watches/:id", async (req, res) => {
    try {
      const watchId = parseInt(req.params.id);
      
      if (isNaN(watchId)) {
        return res.status(400).json({ message: "Invalid watch ID format" });
      }
      
      const watch = await storage.getWatch(watchId);
      
      if (!watch) {
        return res.status(404).json({ message: "Watch not found" });
      }
      
      return res.status(200).json(watch);
    } catch (error) {
      console.error("Error fetching watch:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Get watches by brand
  app.get("/api/watches/brand/:brand", async (req, res) => {
    try {
      const brand = req.params.brand;
      const watches = await storage.getWatchesByBrand(brand);
      
      return res.status(200).json(watches);
    } catch (error) {
      console.error("Error fetching watches by brand:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Get watches by category
  app.get("/api/watches/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const watches = await storage.getWatchesByCategory(category);
      
      return res.status(200).json(watches);
    } catch (error) {
      console.error("Error fetching watches by category:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Create a new watch (admin function)
  app.post("/api/watches", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = watchFormSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Create the watch
      const watch = await storage.createWatch(validatedData.data);
      
      return res.status(201).json({ 
        message: "Watch created successfully!",
        data: watch 
      });
    } catch (error) {
      console.error("Error creating watch:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  // Serve 3D model files
  app.get("/models/:modelName", (req, res) => {
    try {
      const modelName = req.params.modelName;
      const modelPath = path.join(__dirname, "../public/models", modelName);
      
      // Check if the model exists
      if (!fs.existsSync(modelPath)) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      // Serve the model file
      return res.sendFile(modelPath);
    } catch (error) {
      console.error("Error serving model file:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
