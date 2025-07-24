import { Collection } from "mongodb";
import DatabaseConfig from "../config/database";
import { SectionDocument, Section, CreateSectionRequest, SectionModel } from "../models/Section";
import { FallbackStorageService } from "./FallbackStorageService";

export class SectionService {
  private collection: Collection<SectionDocument> | null = null;
  private currentId: number = 1;
  private useFallback: boolean = false;

  constructor() {
    try {
      const db = DatabaseConfig.getInstance().getDb();
      this.collection = db.collection<SectionDocument>("sections");
      this.initializeCounter();
      this.useFallback = false;
    } catch (error) {
      console.warn("Using fallback storage for SectionService");
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

  async create(request: CreateSectionRequest): Promise<Section> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().createSection(request);
    }

    try {
      const document = SectionModel.createDocumentFromRequest(request);
      await this.collection.insertOne(document);
      
      const id = this.currentId++;
      return SectionModel.documentToModel(document, id);
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().createSection(request);
    }
  }

  async findByWebsiteIdeaId(websiteIdeaId: number): Promise<Section[]> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().findSectionsByWebsiteIdeaId(websiteIdeaId);
    }

    try {
      const documents = await this.collection.find({ websiteIdeaId }).toArray();
      return documents.map((doc, index) => 
        SectionModel.documentToModel(doc, index + 1)
      );
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().findSectionsByWebsiteIdeaId(websiteIdeaId);
    }
  }

  async findAll(): Promise<Section[]> {
    if (this.useFallback || !this.collection) {
      return FallbackStorageService.getInstance().findAllSections();
    }

    try {
      const documents = await this.collection.find({}).toArray();
      return documents.map((doc, index) => 
        SectionModel.documentToModel(doc, index + 1)
      );
    } catch (error) {
      console.warn("MongoDB operation failed, using fallback:", error);
      return FallbackStorageService.getInstance().findAllSections();
    }
  }
}