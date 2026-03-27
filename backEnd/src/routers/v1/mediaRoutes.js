

import express from "express"
import { createFile, deleteFile , getAllfiles} from "../../controllers/mediaController.js";
import {uploadMiddleware  } from "../../middleWares/uploadMiddleware.js"


const route = express.Router()

route.get("/" , getAllfiles)
route.post("/upload" , uploadMiddleware , createFile)
route.delete("/delete", deleteFile);






export default route;