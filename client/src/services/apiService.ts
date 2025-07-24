import { apiRequest } from "@/lib/queryClient";

export interface GenerateResponse {
  websiteIdea: {
    id: number;
    idea: string;
    createdAt: string;
  };
  sections: Array<{
    id: number;
    websiteIdeaId: number;
    title: string;
    type: string;
    description: string;
    features: string[];
    createdAt: string;
  }>;
}

export interface GenerateRequest {
  idea: string;
}

export class ApiService {
  static async generateSections(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await apiRequest("POST", "/api/generate-sections", request);
    return response.json();
  }

  static async getAllSections() {
    const response = await apiRequest("GET", "/api/sections");
    return response.json();
  }

  static async getSectionsByWebsiteId(websiteIdeaId: number) {
    const response = await apiRequest("GET", `/api/sections/${websiteIdeaId}`);
    return response.json();
  }
}