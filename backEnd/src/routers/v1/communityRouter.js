import { Router } from "express";
import { getHubData, getModule } from "../../controllers/communityController.js";

const router = Router();

/**
 * @route   GET /community-view/data
 * @desc    Fetch all community modules (ministries) for the portal
 * @access  Public
 */
router.get("/data", getHubData);

/**
 * @route   GET /community-view/:moduleId
 * @desc    Fetch detailed information for a specific ministry
 * @access  Public
 */
router.get("/:moduleId", getModule);

export default router;
