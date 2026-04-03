import { Router } from "express";
import { GenerateQuestion } from "../../controllers/questionGenerator.js/GenerateQuestion.js";

const route = Router();

route.post("/", GenerateQuestion);

export default route;
