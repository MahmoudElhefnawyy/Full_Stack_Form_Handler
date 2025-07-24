import { Router } from "express";
import { WebsiteController } from "../controllers/WebsiteController";

const router = Router();
const websiteController = new WebsiteController();

// POST /api/generate-sections - Generate sections based on website idea
router.post("/generate-sections", websiteController.generateSections);

// GET /api/sections - Get all sections
router.get("/sections", websiteController.getAllSections);

// GET /api/sections/:websiteIdeaId - Get sections by website idea ID
router.get("/sections/:websiteIdeaId", websiteController.getSectionsByWebsiteId);

export default router;