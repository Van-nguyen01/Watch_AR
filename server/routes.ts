import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { waitlistFormSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
