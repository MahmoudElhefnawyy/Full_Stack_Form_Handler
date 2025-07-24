import { ObjectId } from "mongodb";

export interface WebsiteIdeaDocument {
  _id?: ObjectId;
  idea: string;
  createdAt: Date;
}

export interface WebsiteIdea {
  id: number;
  idea: string;
  createdAt: Date;
}

export interface CreateWebsiteIdeaRequest {
  idea: string;
}

export class WebsiteIdeaModel {
  static documentToModel(doc: WebsiteIdeaDocument, id: number): WebsiteIdea {
    return {
      id,
      idea: doc.idea,
      createdAt: doc.createdAt,
    };
  }

  static createDocumentFromRequest(request: CreateWebsiteIdeaRequest): WebsiteIdeaDocument {
    return {
      idea: request.idea,
      createdAt: new Date(),
    };
  }
}