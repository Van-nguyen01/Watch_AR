import { waitlist, type Waitlist, type InsertWaitlist } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<Waitlist | undefined>;
  getUserByUsername(username: string): Promise<Waitlist | undefined>;
  createUser(user: InsertWaitlist): Promise<Waitlist>;
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistEntries(): Promise<Waitlist[]>;
  getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, Waitlist>;
  private waitlistEntries: Map<number, Waitlist>;
  currentId: number;
  currentWaitlistId: number;

  constructor() {
    this.users = new Map();
    this.waitlistEntries = new Map();
    this.currentId = 1;
    this.currentWaitlistId = 1;
  }

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
    const user: Waitlist = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist> {
    const id = this.currentWaitlistId++;
    const createdAt = new Date().toISOString();
    const waitlistEntry: Waitlist = { ...entry, id, createdAt };
    
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
}

export const storage = new MemStorage();
