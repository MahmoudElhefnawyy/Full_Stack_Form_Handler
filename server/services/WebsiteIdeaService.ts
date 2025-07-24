import { Collection } from "mongodb";
import DatabaseConfig from "../config/database";
import { WebsiteIdeaDocument, WebsiteIdea, CreateWebsiteIdeaRequest, WebsiteIdeaModel } from "../models/WebsiteIdea";
import { FallbackStorageService } from "./FallbackStorageService";

export class WebsiteIdeaService {
  private collection: Collection<WebsiteIdeaDocument> | null = null;
  private currentId: number = 1;
  private useFallback: boolean = false;

  constructor() {
    try {
      const db = DatabaseConfig.getInstance().getDb();
      this.collection = db.collection<WebsiteIdeaDocument>("website_ideas");
      this.initializeCounter();
      this.useFallback = false;
    } catch (error) {
      console.warn("Using fallback storage for WebsiteIdeaService");
      this.useFallback = true;
    }
  }

  private async initializeCounter(): Promise<void> {
    try {
      if (this.collection) {
        const count = await this.collection.countDocuments();
        this.currentId = count + 1;
      }
    } catch (error) {
      console.warn("Could not initialize counter:", error);
    }
  }

  async create(request: CreateWebsiteIdeaRequest): Promise<WebsiteIdea> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().createWebsiteIdea(request);
    }

    try {
      const document = WebsiteIdeaModel.createDocumentFromRequest(request);
      await this.collection.insertOne(document);
      
      const id = this.currentId++;
      return WebsiteIdeaModel.documentToModel(document, id);
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().createWebsiteIdea(request);
    }
  }

  async findById(id: number): Promise<WebsiteIdea | null> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().findWebsiteIdeaById(id);
    }

    try {
      const documents = await this.collection.find({}).toArray();
      const document = documents[id - 1]; // Convert to 0-based index
      
      if (!document) return null;
      
      return WebsiteIdeaModel.documentToModel(document, id);
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().findWebsiteIdeaById(id);
    }
  }

  async findAll(): Promise<WebsiteIdea[]> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().findAllWebsiteIdeas();
    }

    try {
      const documents = await this.collection.find({}).toArray();
      return documents.map((doc, index) => 
        WebsiteIdeaModel.documentToModel(doc, index + 1)
      );
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().findAllWebsiteIdeas();
    }
  }
}