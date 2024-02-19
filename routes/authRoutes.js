import Router from "express";
import { loginController, userRegister } from "../controllers/authController.js";
// router Object
const router = Router();

// routes
router.route("/register").post( userRegister);
router.route("/login").post(loginController)

export default router;
