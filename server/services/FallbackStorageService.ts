import { WebsiteIdea, CreateWebsiteIdeaRequest } from "../models/WebsiteIdea";
import { Section, CreateSectionRequest } from "../models/Section";

export class FallbackStorageService {
  private static instance: FallbackStorageService;
  private websiteIdeas: Map<number, WebsiteIdea> = new Map();
  private sections: Map<number, Section> = new Map();
  private currentWebsiteIdeaId: number = 1;
  private currentSectionId: number = 1;

  private constructor() {}

  public static getInstance(): FallbackStorageService {
    if (!FallbackStorageService.instance) {
      FallbackStorageService.instance = new FallbackStorageService();
    }
    return FallbackStorageService.instance;
  }

  // Website Ideas
  createWebsiteIdea(request: CreateWebsiteIdeaRequest): WebsiteIdea {
    const id = this.currentWebsiteIdeaId++;
    const websiteIdea: WebsiteIdea = {
      id,
      idea: request.idea,
      createdAt: new Date(),
    };
    this.websiteIdeas.set(id, websiteIdea);
    return websiteIdea;
  }

  findWebsiteIdeaById(id: number): WebsiteIdea | null {
    return this.websiteIdeas.get(id) || null;
  }

  findAllWebsiteIdeas(): WebsiteIdea[] {
    return Array.from(this.websiteIdeas.values());
  }

  // Sections
  createSection(request: CreateSectionRequest): Section {
    const id = this.currentSectionId++;
    const section: Section = {
      id,
      websiteIdeaId: request.websiteIdeaId,
      title: request.title,
      type: request.type,
      description: request.description,
      features: request.features,
      createdAt: new Date(),
    };
    this.sections.set(id, section);
    return section;
  }

  findSectionsByWebsiteIdeaId(websiteIdeaId: number): Section[] {
    return Array.from(this.sections.values()).filter(
      (section) => section.websiteIdeaId === websiteIdeaId
    );
  }

  findAllSections(): Section[] {
    return Array.from(this.sections.values());
  }
}