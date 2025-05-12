import { 
  users, type User, type InsertUser, 
  waitlistSignups, type WaitlistSignup, type InsertWaitlistSignup,
  watches, type Watch, type InsertWatch,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem
} from "@shared/schema";
      
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Watch methods
  getWatch(id: number): Promise<Watch | undefined>;
  getWatches(category?: string): Promise<Watch[]>;
  getWatchesByBrand(brand: string): Promise<Watch[]>;
  createWatch(watch: InsertWatch): Promise<Watch>;
  updateWatch(id: number, watch: Partial<InsertWatch>): Promise<Watch | undefined>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Waitlist methods
  createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup>;
  getWaitlistSignups(): Promise<WaitlistSignup[]>;
  getWaitlistSignupByEmail(email: string): Promise<WaitlistSignup | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private watches: Map<number, Watch>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private waitlist: Map<number, WaitlistSignup>;
  
  currentUserId: number;
  currentWatchId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentWaitlistId: number;

  constructor() {
    this.users = new Map();
    this.watches = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.waitlist = new Map();
    
    this.currentUserId = 1;
    this.currentWatchId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWaitlistId = 1;
    
    // Add some demo watches
    this.initializeWatches();
  }

  private initializeWatches() {
    const demoWatches: InsertWatch[] = [
      {
        name: "Apple Watch",
        brand: "LuxWatch",
        description: "Phù hợp với mọi lứa tuổi, thiết kế hiện đại và sang trọng.",
        price: 260.000,
        imageUrl: "/uploads/images/Screenshot 2025-05-11 073110.png",
        modelUrl: "uploads/models/watches/classic-elegance.glb",
        category: "luxury",
        inStock: true
      },
      
    ];

    demoWatches.forEach(watch => {
      this.createWatch(watch);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  // Watch methods
  async getWatch(id: number): Promise<Watch | undefined> {
    return this.watches.get(id);
  }

  async getWatches(category?: string): Promise<Watch[]> {
    const watches = Array.from(this.watches.values());
    if (category) {
      return watches.filter(watch => watch.category === category);
    }
    return watches;
  }

  async getWatchesByBrand(brand: string): Promise<Watch[]> {
    return Array.from(this.watches.values()).filter(
      (watch) => watch.brand === brand,
    );
  }

  async createWatch(insertWatch: InsertWatch): Promise<Watch> {
    const id = this.currentWatchId++;
    const watch: Watch = { 
      ...insertWatch, 
      id,
      modelUrl: insertWatch.modelUrl || null,
      inStock: insertWatch.inStock ?? true,
      createdAt: new Date().toISOString()
    };
    this.watches.set(id, watch);
    return watch;
  }

  async updateWatch(id: number, watchUpdate: Partial<InsertWatch>): Promise<Watch | undefined> {
    const existingWatch = this.watches.get(id);
    if (!existingWatch) return undefined;
    
    const updatedWatch: Watch = { 
      ...existingWatch, 
      ...watchUpdate 
    };
    this.watches.set(id, updatedWatch);
    return updatedWatch;
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: new Date().toISOString()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder: Order = { 
      ...existingOrder, 
      status 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId,
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id 
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Waitlist methods
  async createWaitlistSignup(insertSignup: InsertWaitlistSignup): Promise<WaitlistSignup> {
    const id = this.currentWaitlistId++;
    const signup: WaitlistSignup = { 
      ...insertSignup, 
      id,
      company: insertSignup.company || null,
      createdAt: new Date().toISOString()
    };
    this.waitlist.set(id, signup);
    return signup;
  }

  async getWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlist.values());
  }

  async getWaitlistSignupByEmail(email: string): Promise<WaitlistSignup | undefined> {
    return Array.from(this.waitlist.values()).find(
      (signup) => signup.email === email,
    );
  }
}

export const storage = new MemStorage();
