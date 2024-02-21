import Router from "express";
import {
  loginController,
  userRegister,
} from "../controllers/authController.js";
import { rateLimit } from "express-rate-limit";

// ip limitter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

// Apply the rate limiting middleware to all requests.
// router Object
const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user collection
 *         name:
 *           type: string
 *           description: User name
 *         lastName:
 *           type: string
 *           description: User last name
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password (should be at least 6 characters)
 *         location:
 *           type: string
 *           description: User location or country
 *       example:
 *         id: ASDNI86AD9
 *         name: John
 *         lastName: Doe
 *         email: johndoe@gmail.com
 *         password: john@123
 *         location: Mumbai
 */

/**
 * @swagger
 * tags:
 *     name: Auth
 *     description: Authentication APIs
 */
/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: register new user
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: user created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: internal serevr error
 */

// routes
router.route("/register").post(limiter, userRegister);


/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: login page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: login successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: something went wrong
 */
router.route("/login").post(limiter, loginController);

export default router;
