import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './db';
import { User, Product, Order } from './schemas';

// Define Interface
export interface IDatabaseRepository {
  // Products
  getProducts(filters?: { query?: string; category?: string }): Promise<any[]>;
  getProductById(id: string): Promise<any | null>;
  createProduct(data: any): Promise<any>;
  updateProduct(id: string, data: any): Promise<any | null>;
  deleteProduct(id: string): Promise<boolean>;

  // Users
  getUserByEmail(email: string): Promise<any | null>;
  getUserById(id: string): Promise<any | null>;
  createUser(data: any): Promise<any>;

  // Orders
  getOrders(userId?: string): Promise<any[]>;
  getOrderById(id: string): Promise<any | null>;
  createOrder(data: any): Promise<any>;
  updateOrderStatus(id: string, status: string): Promise<any | null>;
}

// -------------------------------------------------------------
// MongoDB Implementation
// -------------------------------------------------------------
class MongoRepository implements IDatabaseRepository {
  private async ensureConnected() {
    await connectToDatabase();
  }

  async getProducts(filters?: { query?: string; category?: string }): Promise<any[]> {
    await this.ensureConnected();
    const query: any = {};
    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    if (filters?.query) {
      query.$or = [
        { name: { $regex: filters.query, $options: 'i' } },
        { description: { $regex: filters.query, $options: 'i' } }
      ];
    }
    const docs = await Product.find(query).sort({ createdAt: -1 });
    return docs.map(doc => doc.toObject());
  }

  async getProductById(id: string): Promise<any | null> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const doc = await Product.findById(id);
    return doc ? doc.toObject() : null;
  }

  async createProduct(data: any): Promise<any> {
    await this.ensureConnected();
    const doc = await Product.create(data);
    return doc.toObject();
  }

  async updateProduct(id: string, data: any): Promise<any | null> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const doc = await Product.findByIdAndUpdate(id, data, { new: true });
    return doc ? doc.toObject() : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return false;
    const res = await Product.deleteOne({ _id: id });
    return res.deletedCount > 0;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    await this.ensureConnected();
    const doc = await User.findOne({ email: email.toLowerCase() });
    return doc ? doc.toObject() : null;
  }

  async getUserById(id: string): Promise<any | null> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const doc = await User.findById(id);
    return doc ? doc.toObject() : null;
  }

  async createUser(data: any): Promise<any> {
    await this.ensureConnected();
    const doc = await User.create({
      ...data,
      email: data.email.toLowerCase()
    });
    return doc.toObject();
  }

  async getOrders(userId?: string): Promise<any[]> {
    await this.ensureConnected();
    const query = userId ? { userId } : {};
    const docs = await Order.find(query).sort({ createdAt: -1 });
    return docs.map(doc => doc.toObject());
  }

  async getOrderById(id: string): Promise<any | null> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const doc = await Order.findById(id);
    return doc ? doc.toObject() : null;
  }

  async createOrder(data: any): Promise<any> {
    await this.ensureConnected();
    const doc = await Order.create(data);
    return doc.toObject();
  }

  async updateOrderStatus(id: string, status: string): Promise<any | null> {
    await this.ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    const doc = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return doc ? doc.toObject() : null;
  }
}

// -------------------------------------------------------------
// Persistent In-Memory (JSON File-Backed) Implementation
// -------------------------------------------------------------
interface InMemoryData {
  users: any[];
  products: any[];
  orders: any[];
}

const DEFAULT_PRODUCTS = [
  {
    _id: "p1",
    name: "Nebula Mechanical Keyboard",
    description: "Compact 75% mechanical keyboard featuring hot-swappable tactile switches, frosted polycarbonate body, and custom glowing RGB layouts.",
    price: 189,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    category: "peripherals",
    stock: 12,
    createdAt: new Date("2026-01-01T12:00:00Z").toISOString()
  },
  {
    _id: "p2",
    name: "Precision Ergonomic Mouse",
    description: "Wireless precision mouse with hyper-fast scrolling, adjustable 20K DPI sensor, and contoured ergonomic thumb rests.",
    price: 99,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600",
    category: "peripherals",
    stock: 25,
    createdAt: new Date("2026-01-02T12:00:00Z").toISOString()
  },
  {
    _id: "p3",
    name: "Cyberpunk Desk Mat",
    description: "Extra large water-resistant micro-woven mousepad with stitched glowing LED edges and neon futuristic detailing.",
    price: 39,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=600",
    category: "desk-setup",
    stock: 40,
    createdAt: new Date("2026-01-03T12:00:00Z").toISOString()
  },
  {
    _id: "p4",
    name: "SonicWave ANC Headphones",
    description: "Over-ear noise-cancelling headphones featuring studio-grade spatial audio, hi-res drivers, and up to 45 hours of playback time.",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "audio",
    stock: 8,
    createdAt: new Date("2026-01-04T12:00:00Z").toISOString()
  },
  {
    _id: "p5",
    name: "Aura Smart Ambient Lightbars",
    description: "Dual-pack smart RGB lightbars syncing dynamically with screen colors and audio output, controllable via mobile app.",
    price: 79,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600",
    category: "desk-setup",
    stock: 18,
    createdAt: new Date("2026-01-05T12:00:00Z").toISOString()
  },
  {
    _id: "p6",
    name: "Horizon Ultrawide Curved Monitor",
    description: "34-inch curved gaming display with 144Hz refresh rate, HDR10 capabilities, and a sleek modern bezel-less border.",
    price: 549,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600",
    category: "displays",
    stock: 5,
    createdAt: new Date("2026-01-06T12:00:00Z").toISOString()
  }
];

class InMemoryRepository implements IDatabaseRepository {
  private filePath: string;

  constructor() {
    // Save the DB state to a JSON file in the project folder to survive Next dev reloads
    this.filePath = path.join(process.cwd(), 'src/lib/db/mock-db-state.json');
  }

  private loadData(): InMemoryData {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Failed to read mock-db-state.json, recreating...', e);
    }

    const initialData: InMemoryData = {
      users: [],
      products: DEFAULT_PRODUCTS,
      orders: []
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: InMemoryData) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write mock-db-state.json', e);
    }
  }

  async getProducts(filters?: { query?: string; category?: string }): Promise<any[]> {
    const data = this.loadData();
    let list = [...data.products];

    if (filters?.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort by createdAt descending
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProductById(id: string): Promise<any | null> {
    const data = this.loadData();
    const product = data.products.find(p => p._id === id);
    return product || null;
  }

  async createProduct(data: any): Promise<any> {
    const store = this.loadData();
    const newProduct = {
      ...data,
      _id: 'p_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    store.products.push(newProduct);
    this.saveData(store);
    return newProduct;
  }

  async updateProduct(id: string, data: any): Promise<any | null> {
    const store = this.loadData();
    const idx = store.products.findIndex(p => p._id === id);
    if (idx === -1) return null;

    store.products[idx] = {
      ...store.products[idx],
      ...data
    };
    this.saveData(store);
    return store.products[idx];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const store = this.loadData();
    const idx = store.products.findIndex(p => p._id === id);
    if (idx === -1) return false;

    store.products.splice(idx, 1);
    this.saveData(store);
    return true;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const store = this.loadData();
    const emailLower = email.toLowerCase();
    const user = store.users.find(u => u.email === emailLower);
    return user || null;
  }

  async getUserById(id: string): Promise<any | null> {
    const store = this.loadData();
    const user = store.users.find(u => u._id === id);
    return user || null;
  }

  async createUser(data: any): Promise<any> {
    const store = this.loadData();
    const newUser = {
      ...data,
      _id: 'u_' + Math.random().toString(36).substr(2, 9),
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    this.saveData(store);
    return newUser;
  }

  async getOrders(userId?: string): Promise<any[]> {
    const store = this.loadData();
    let list = [...store.orders];
    if (userId) {
      list = list.filter(o => o.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(id: string): Promise<any | null> {
    const store = this.loadData();
    const order = store.orders.find(o => o._id === id);
    return order || null;
  }

  async createOrder(data: any): Promise<any> {
    const store = this.loadData();
    
    // Decrement stock for ordered items
    for (const item of data.items) {
      const pIdx = store.products.findIndex(p => p._id === item.productId);
      if (pIdx !== -1) {
        store.products[pIdx].stock = Math.max(0, store.products[pIdx].stock - item.quantity);
      }
    }

    const newOrder = {
      ...data,
      _id: 'o_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    store.orders.push(newOrder);
    this.saveData(store);
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<any | null> {
    const store = this.loadData();
    const idx = store.orders.findIndex(o => o._id === id);
    if (idx === -1) return null;

    store.orders[idx].status = status;
    this.saveData(store);
    return store.orders[idx];
  }
}

// -------------------------------------------------------------
// Singleton Getter
// -------------------------------------------------------------
let activeRepo: IDatabaseRepository | null = null;

export async function getRepository(): Promise<IDatabaseRepository> {
  if (activeRepo) return activeRepo;

  const { isFallback } = await connectToDatabase();
  
  if (isFallback) {
    activeRepo = new InMemoryRepository();
  } else {
    activeRepo = new MongoRepository();
  }
  
  return activeRepo;
}
