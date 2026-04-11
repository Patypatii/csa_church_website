

import {Router} from "express"
import { createNotification, deleteNotification, updateNotification , getNotification } from "../../controllers/events/index.js";
import verifyToken from "../../middlewares/Tokens.js";

const router = Router()

router.post("/", verifyToken, createNotification);
router.get("/", getNotification);
router.put("/", verifyToken, updateNotification);
router.delete("/", verifyToken, deleteNotification);


export default router;
