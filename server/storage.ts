import { 
  websiteIdeas, 
  sections,
  type WebsiteIdea, 
  type InsertWebsiteIdea,
  type Section,
  type InsertSection
} from "@shared/schema";
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

export interface IStorage {
  // Website Ideas
  createWebsiteIdea(idea: InsertWebsiteIdea): Promise<WebsiteIdea>;
  getWebsiteIdea(id: number): Promise<WebsiteIdea | undefined>;
  
  // Sections
  createSection(section: InsertSection): Promise<Section>;
  getSectionsByWebsiteIdeaId(websiteIdeaId: number): Promise<Section[]>;
  getAllSections(): Promise<Section[]>;
}

// MongoDB document interfaces
interface WebsiteIdeaDoc {
  _id?: ObjectId;
  idea: string;
  createdAt: Date;
}

interface SectionDoc {
  _id?: ObjectId;
  websiteIdeaId: number;
  title: string;
  type: string;
  description: string;
  features: string[];
  createdAt: Date;
}

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db: Db;
  private websiteIdeasCollection: Collection<WebsiteIdeaDoc>;
  private sectionsCollection: Collection<SectionDoc>;
  private currentWebsiteIdeaId: number = 1;
  private currentSectionId: number = 1;

  constructor() {
    // Use the updated MongoDB Atlas connection string
    const connectionString = process.env.MONGODB_URI || "mongodb+srv://mahmouddevy:qpgks4URWJsNEqkX@cluster0.jtrckpp.mongodb.net/website_generator?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log("Using direct MongoDB connection string");
    console.log("Connection string valid format:", connectionString.startsWith("mongodb+srv://"));
    
    this.client = new MongoClient(connectionString, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    this.db = this.client.db("website_generator");
    this.websiteIdeasCollection = this.db.collection<WebsiteIdeaDoc>("website_ideas");
    this.sectionsCollection = this.db.collection<SectionDoc>("sections");
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      
      // Test the connection
      await this.client.db("admin").command({ ping: 1 });
      console.log("✅ Connected to MongoDB successfully");
      
      // Initialize counters by checking existing documents
      const lastIdea = await this.websiteIdeasCollection.findOne({}, { sort: { _id: -1 } });
      const lastSection = await this.sectionsCollection.findOne({}, { sort: { _id: -1 } });
      
      if (lastIdea) {
        // Extract counter from existing documents if any
        const existingIdeas = await this.websiteIdeasCollection.find({}).toArray();
        this.currentWebsiteIdeaId = existingIdeas.length + 1;
      }
      
      if (lastSection) {
        const existingSections = await this.sectionsCollection.find({}).toArray();
        this.currentSectionId = existingSections.length + 1;
      }
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", (error as Error).message);
      throw error;
    }
  }

  async createWebsiteIdea(insertIdea: InsertWebsiteIdea): Promise<WebsiteIdea> {
    const doc: WebsiteIdeaDoc = {
      idea: insertIdea.idea,
      createdAt: new Date(),
    };
    
    const result = await this.websiteIdeasCollection.insertOne(doc);
    const id = this.currentWebsiteIdeaId++;
    
    return {
      id,
      idea: insertIdea.idea,
      createdAt: doc.createdAt,
    };
  }

  async getWebsiteIdea(id: number): Promise<WebsiteIdea | undefined> {
    // For simplicity, we'll use a counter-based approach
    // In a real app, you might want to store the numeric ID in MongoDB
    const ideas = await this.websiteIdeasCollection.find({}).toArray();
    const idea = ideas[id - 1]; // Convert to 0-based index
    
    if (!idea) return undefined;
    
    return {
      id,
      idea: idea.idea,
      createdAt: idea.createdAt,
    };
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const doc: SectionDoc = {
      websiteIdeaId: insertSection.websiteIdeaId,
      title: insertSection.title,
      type: insertSection.type,
      description: insertSection.description,
      features: insertSection.features,
      createdAt: new Date(),
    };
    
    const result = await this.sectionsCollection.insertOne(doc);
    const id = this.currentSectionId++;
    
    return {
      id,
      websiteIdeaId: insertSection.websiteIdeaId,
      title: insertSection.title,
      type: insertSection.type,
      description: insertSection.description,
      features: insertSection.features,
      createdAt: doc.createdAt,
    };
  }

  async getSectionsByWebsiteIdeaId(websiteIdeaId: number): Promise<Section[]> {
    const docs = await this.sectionsCollection.find({ websiteIdeaId }).toArray();
    
    return docs.map((doc, index) => ({
      id: index + 1, // Simple ID assignment
      websiteIdeaId: doc.websiteIdeaId,
      title: doc.title,
      type: doc.type,
      description: doc.description,
      features: doc.features,
      createdAt: doc.createdAt,
    }));
  }

  async getAllSections(): Promise<Section[]> {
    const docs = await this.sectionsCollection.find({}).toArray();
    
    return docs.map((doc, index) => ({
      id: index + 1, // Simple ID assignment
      websiteIdeaId: doc.websiteIdeaId,
      title: doc.title,
      type: doc.type,
      description: doc.description,
      features: doc.features,
      createdAt: doc.createdAt,
    }));
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}

// In-memory fallback for development if MongoDB is not available
export class MemStorage implements IStorage {
  private websiteIdeas: Map<number, WebsiteIdea>;
  private sections: Map<number, Section>;
  currentWebsiteIdeaId: number;
  currentSectionId: number;

  constructor() {
    this.websiteIdeas = new Map();
    this.sections = new Map();
    this.currentWebsiteIdeaId = 1;
    this.currentSectionId = 1;
  }

  async createWebsiteIdea(insertIdea: InsertWebsiteIdea): Promise<WebsiteIdea> {
    const id = this.currentWebsiteIdeaId++;
    const websiteIdea: WebsiteIdea = {
      ...insertIdea,
      id,
      createdAt: new Date(),
    };
    this.websiteIdeas.set(id, websiteIdea);
    return websiteIdea;
  }

  async getWebsiteIdea(id: number): Promise<WebsiteIdea | undefined> {
    return this.websiteIdeas.get(id);
  }

  async createSection(insertSection: InsertSection): Promise<Section> {
    const id = this.currentSectionId++;
    const section: Section = {
      ...insertSection,
      id,
      createdAt: new Date(),
    };
    this.sections.set(id, section);
    return section;
  }

  async getSectionsByWebsiteIdeaId(websiteIdeaId: number): Promise<Section[]> {
    return Array.from(this.sections.values()).filter(
      (section) => section.websiteIdeaId === websiteIdeaId
    );
  }

  async getAllSections(): Promise<Section[]> {
    return Array.from(this.sections.values());
  }
}

// Create storage instance with MongoDB support
let storageInstance: IStorage | null = null;

async function initializeStorage(): Promise<IStorage> {
  if (storageInstance) {
    return storageInstance;
  }

  const mongoStorage = new MongoStorage();
  
  try {
    await mongoStorage.connect();
    console.log("Using MongoDB storage");
    storageInstance = mongoStorage;
    return mongoStorage;
  } catch (error) {
    console.warn("MongoDB connection failed, falling back to memory storage:", error);
    storageInstance = new MemStorage();
    return storageInstance;
  }
}

export async function getStorage(): Promise<IStorage> {
  if (!storageInstance) {
    storageInstance = await initializeStorage();
  }
  return storageInstance;
}
