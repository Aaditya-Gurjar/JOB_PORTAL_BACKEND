import { Router } from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  jobStats,
  updateJob,
} from "../controllers/jobsController.js";
const router = Router();

// CREATE JOB || POST
router.route("/create-job").post(userAuth, createJob);
// GET JOBS || GET
router.route("/get-job").get(userAuth, getAllJobs);
// UPDATE JOB || PATCH
router.route("/update-job/:id").patch(userAuth, updateJob);
// DELETE JOB || DELETE
router.route("/delete-job/:id").delete(userAuth, deleteJob);
// JOB STATS FILTER || GET
router.route("/job-stats").get(userAuth, jobStats);

export default router;
