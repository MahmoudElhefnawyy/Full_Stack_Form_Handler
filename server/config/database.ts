import { MongoClient, Db } from "mongodb";

class DatabaseConfig {
  private static instance: DatabaseConfig;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    const connectionString = process.env.MONGODB_URI;

    this.client = new MongoClient(connectionString, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    try {
      await this.client.connect();
      await this.client.db("admin").command({ ping: 1 });
      this.db = this.client.db("website_generator");
      console.log("✅ Connected to MongoDB successfully");
      return this.db;
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB:", (error as Error).message);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }
}

export default DatabaseConfig;
