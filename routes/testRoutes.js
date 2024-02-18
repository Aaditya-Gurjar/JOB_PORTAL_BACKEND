import { Router } from "express";
import { testPostController } from "../controllers/testController.js";

const router = Router();

router.route('/test-post').post(testPostController)

export default router