import { Request, Response } from "express";
import { WebsiteIdeaService } from "../services/WebsiteIdeaService";
import { SectionService } from "../services/SectionService";
import { insertWebsiteIdeaSchema } from "../../shared/schema";
import { z } from "zod";

export class WebsiteController {
  private websiteIdeaService: WebsiteIdeaService;
  private sectionService: SectionService;

  constructor() {
    this.websiteIdeaService = new WebsiteIdeaService();
    this.sectionService = new SectionService();
  }

  generateSections = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idea } = insertWebsiteIdeaSchema.parse(req.body);
      
      // Create website idea record
      const websiteIdea = await this.websiteIdeaService.create({ idea });
      
      // Generate contextual sections
      const generatedSections = this.generateSectionsForIdea(idea);
      
      // Store sections in MongoDB
      const storedSections = [];
      for (const section of generatedSections) {
        const storedSection = await this.sectionService.create({
          websiteIdeaId: websiteIdea.id,
          ...section
        });
        storedSections.push(storedSection);
      }
      
      res.json({
        websiteIdea,
        sections: storedSections
      });
    } catch (error) {
      console.error("Error generating sections:", error);
      res.status(400).json({ 
        message: error instanceof z.ZodError 
          ? "Invalid request data" 
          : "Failed to generate sections" 
      });
    }
  };

  getAllSections = async (req: Request, res: Response): Promise<void> => {
    try {
      const sections = await this.sectionService.findAll();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  };

  getSectionsByWebsiteId = async (req: Request, res: Response): Promise<void> => {
    try {
      const websiteIdeaId = parseInt(req.params.websiteIdeaId);
      if (isNaN(websiteIdeaId)) {
        res.status(400).json({ message: "Invalid website idea ID" });
        return;
      }
      
      const sections = await this.sectionService.findByWebsiteIdeaId(websiteIdeaId);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  };

  private generateSectionsForIdea(idea: string) {
    const lowerIdea = idea.toLowerCase();
    
    // Generate contextual sections based on the idea
    const sections = [];
    
    if (lowerIdea.includes('bakery') || lowerIdea.includes('food') || lowerIdea.includes('restaurant')) {
      sections.push(
        {
          title: "Hero Section",
          type: "Landing Page Component",
          description: "A compelling hero section featuring your bakery's signature breads and pastries. Includes a prominent call-to-action button directing visitors to your menu and ordering system.",
          features: ["Hero Image", "CTA Button", "Headline Text"]
        },
        {
          title: "Menu & Products",
          type: "Product Showcase",
          description: "Display your bakery's delicious offerings with high-quality images, descriptions, and pricing. Organized by categories like breads, pastries, and custom cakes.",
          features: ["Product Grid", "Category Filters", "Pricing Display"]
        },
        {
          title: "Contact & Location",
          type: "Contact Section",
          description: "Display your bakery's location, hours of operation, and contact information. Include an embedded map and easy ways for customers to reach you for orders.",
          features: ["Contact Form", "Map Integration", "Hours & Info"]
        }
      );
    } else if (lowerIdea.includes('portfolio') || lowerIdea.includes('photographer') || lowerIdea.includes('artist')) {
      sections.push(
        {
          title: "Hero Portfolio",
          type: "Visual Showcase",
          description: "A stunning hero section showcasing your best work with a dynamic image gallery and professional introduction to capture visitors' attention immediately.",
          features: ["Image Gallery", "Professional Bio", "Contact CTA"]
        },
        {
          title: "Work Gallery",
          type: "Portfolio Grid",
          description: "An organized display of your photography work, categorized by style or subject matter. Includes filtering options and lightbox viewing experience.",
          features: ["Filterable Grid", "Lightbox View", "Category Tags"]
        },
        {
          title: "About & Services",
          type: "Information Section",
          description: "Tell your story as a photographer and outline the services you offer. Include testimonials and your unique approach to photography.",
          features: ["Personal Story", "Service List", "Client Testimonials"]
        }
      );
    } else if (lowerIdea.includes('ecommerce') || lowerIdea.includes('shop') || lowerIdea.includes('store')) {
      sections.push(
        {
          title: "Hero Banner",
          type: "E-commerce Hero",
          description: "An eye-catching hero section featuring your best-selling products with promotional banners and clear navigation to your product catalog.",
          features: ["Product Showcase", "Promotional Banners", "Shop Now CTA"]
        },
        {
          title: "Featured Products",
          type: "Product Grid",
          description: "Highlight your most popular or newest products with high-quality images, pricing, and quick add-to-cart functionality for immediate purchases.",
          features: ["Product Cards", "Add to Cart", "Price Display"]
        },
        {
          title: "Customer Reviews",
          type: "Social Proof",
          description: "Build trust with potential customers by showcasing authentic reviews and testimonials from satisfied buyers of your products.",
          features: ["Review Cards", "Star Ratings", "Customer Photos"]
        }
      );
    } else {
      // Generic sections for any other type of website
      sections.push(
        {
          title: "Hero Section",
          type: "Landing Page Component",
          description: "A compelling introduction to your business or project with clear messaging about what you offer and why visitors should care.",
          features: ["Hero Image", "Value Proposition", "Call to Action"]
        },
        {
          title: "About Us",
          type: "Content Section",
          description: "Share your story, mission, and what makes your business unique. Build trust and connection with your audience through authentic storytelling.",
          features: ["Company Story", "Mission Statement", "Team Information"]
        },
        {
          title: "Contact",
          type: "Contact Section",
          description: "Make it easy for visitors to get in touch with you. Include multiple contact methods and clear information about how to reach you.",
          features: ["Contact Form", "Contact Details", "Location Info"]
        }
      );
    }
    
    return sections;
  }
}