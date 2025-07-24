import { ObjectId } from "mongodb";

export interface SectionDocument {
  _id?: ObjectId;
  websiteIdeaId: number;
  title: string;
  type: string;
  description: string;
  features: string[];
  createdAt: Date;
}

export interface Section {
  id: number;
  websiteIdeaId: number;
  title: string;
  type: string;
  description: string;
  features: string[];
  createdAt: Date;
}

export interface CreateSectionRequest {
  websiteIdeaId: number;
  title: string;
  type: string;
  description: string;
  features: string[];
}

export class SectionModel {
  static documentToModel(doc: SectionDocument, id: number): Section {
    return {
      id,
      websiteIdeaId: doc.websiteIdeaId,
      title: doc.title,
      type: doc.type,
      description: doc.description,
      features: doc.features,
      createdAt: doc.createdAt,
    };
  }

  static createDocumentFromRequest(request: CreateSectionRequest): SectionDocument {
    return {
      websiteIdeaId: request.websiteIdeaId,
      title: request.title,
      type: request.type,
      description: request.description,
      features: request.features,
      createdAt: new Date(),
    };
  }
}