import { Router } from "express";
import websiteRoutes from "./websiteRoutes";

const router = Router();

// Mount route modules
router.use("/api", websiteRoutes);

export default router;