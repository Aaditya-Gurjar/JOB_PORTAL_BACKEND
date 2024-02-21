import { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { updateUser } from "../controllers/userController.js";

const router = Router();
// GET USER || GET

// UPDATE USER || PUT
router.route("/update-user").put(userAuth, updateUser);
export default router;
