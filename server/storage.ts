import { waitlist, type Waitlist, type InsertWaitlist, type Watch, type InsertWatch } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Waitlist methods
  getUser(id: number): Promise<Waitlist | undefined>;
  getUserByUsername(username: string): Promise<Waitlist | undefined>;
  createUser(user: InsertWaitlist): Promise<Waitlist>;
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;
  getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined>;

  // Watch methods
  getWatch(id: number): Promise<Watch | undefined>;
  getWatches(): Promise<Watch[]>;
  getWatchesByBrand(brand: string): Promise<Watch[]>;
  getWatchesByCategory(category: string): Promise<Watch[]>;
  createWatch(watch: InsertWatch): Promise<Watch>;
  updateWatch(id: number, watch: Partial<InsertWatch>): Promise<Watch | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, Waitlist>;
  private waitlistEntries: Map<number, Waitlist>;
  private watches: Map<number, Watch>;
  currentId: number;
  currentWaitlistId: number;
  currentWatchId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.watches = new Map();
    this.currentId = 1;
    this.currentWaitlistId = 1;
    this.currentWatchId = 1;
    
    // Initialize with sample watches
    this.initializeWatches();
  }

  // Initialize with sample watches for testing
  private async initializeWatches() {
    const sampleWatches: InsertWatch[] = [
      {
        name: "Chronos X1",
        description: "A sleek, modern timepiece with premium materials and excellent craftsmanship.",
        price: "299.99",
        imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
        modelUrl: "/models/chronos-x1.glb", 
        category: "luxury",
        brand: "Chronos",
        inStock: true,
        features: ["Water resistant", "Sapphire crystal", "Swiss movement"],
        dimensions: "42mm case diameter"
      },
      {
        name: "Aqua Diver",
        description: "Professional dive watch with 300m water resistance and unidirectional bezel.",
        price: "499.99",
        imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
        modelUrl: "/models/aqua-diver.glb",
        category: "sport",
        brand: "Divemaster",
        inStock: true,
        features: ["300m water resistance", "Rotating bezel", "Luminous markers"],
        dimensions: "44mm case diameter"
      },
      {
        name: "Minimal One",
        description: "Ultra-thin minimalist design for the modern professional.",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
        modelUrl: "/models/minimal-one.glb",
        category: "casual",
        brand: "Minima",
        inStock: true,
        features: ["Ultra-thin case", "Sapphire crystal", "Italian leather strap"],
        dimensions: "38mm case diameter"
      }
    ];

    for (const watch of sampleWatches) {
      await this.createWatch(watch);
    }
  }

  // Waitlist methods
  async getUser(id: number): Promise<Waitlist | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<Waitlist | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username,
    );
  }

  async createUser(insertUser: InsertWaitlist): Promise<Waitlist> {
    const id = this.currentId++;
    const createdAt = new Date().toISOString();
    // Ensure all required properties are present with proper types
    const user: Waitlist = { 
      id,
      createdAt, 
      fullName: insertUser.fullName, 
      email: insertUser.email,
      role: insertUser.role,
      company: insertUser.company || null,
      consentToMarketing: insertUser.consentToMarketing === undefined ? false : insertUser.consentToMarketing
    };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist> {
    const id = this.currentWaitlistId++;
    const createdAt = new Date().toISOString();
    // Ensure all required properties are present with proper types
    const waitlistEntry: Waitlist = { 
      id,
      createdAt, 
      fullName: entry.fullName, 
      email: entry.email,
      role: entry.role,
      company: entry.company || null,
      consentToMarketing: entry.consentToMarketing === undefined ? false : entry.consentToMarketing
    };
    
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<Waitlist[]> {
    return Array.from(this.waitlistEntries.values());
  }

  async getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined> {
    return Array.from(this.waitlistEntries.values()).find(
      (entry) => entry.email === email
    );
  }

  // Watch methods
  async getWatch(id: number): Promise<Watch | undefined> {
    return this.watches.get(id);
  }

  async getWatches(): Promise<Watch[]> {
    return Array.from(this.watches.values());
  }

  async getWatchesByBrand(brand: string): Promise<Watch[]> {
    return Array.from(this.watches.values()).filter(
      (watch) => watch.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  async getWatchesByCategory(category: string): Promise<Watch[]> {
    return Array.from(this.watches.values()).filter(
      (watch) => watch.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createWatch(watch: InsertWatch): Promise<Watch> {
    const id = this.currentWatchId++;
    const createdAt = new Date().toISOString();
    // Ensure all required properties are present with proper types
    const newWatch: Watch = { 
      id,
      createdAt, 
      name: watch.name,
      description: watch.description,
      price: watch.price,
      imageUrl: watch.imageUrl,
      modelUrl: watch.modelUrl,
      category: watch.category,
      brand: watch.brand,
      features: watch.features,
      dimensions: watch.dimensions,
      inStock: watch.inStock === undefined ? true : watch.inStock
    };
    
    this.watches.set(id, newWatch);
    return newWatch;
  }

  async updateWatch(id: number, watchUpdate: Partial<InsertWatch>): Promise<Watch | undefined> {
    const existingWatch = await this.getWatch(id);
    if (!existingWatch) {
      return undefined;
    }

    const updatedWatch: Watch = {
      ...existingWatch,
      ...watchUpdate,
    };

    this.watches.set(id, updatedWatch);
    return updatedWatch;
  }
}

export const storage = new MemStorage();
