import { Job } from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";
// create Jobs
export const createJob = async (req, res, next) => {
  const { position, company } = req.body;
  if (!(position && company)) {
    next("All fileds are Required!");
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(202).json({
    job,
  });
};

// Get all jobs
export const getAllJobs = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  // condition for searching
  const queryObject = {
    createdBy: req.user.userId,
  };
  // logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  let queryResult = Job.find(queryObject);

  // sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt"); //- sign shows latest
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  queryResult = queryResult.skip(skip).limit(limit);
  // jobs count
  const totalJobs = await Job.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;
  //const jobs = await Job.find({ createdBy: req.user.userId });

  res.status(200).json({
    totalJobs: totalJobs,
    numOfPage,
    jobs,
  });
};

// UPDATE JOBS

export const updateJob = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!(company && position)) {
    next("All fields are required!");
  }
  //   find job
  const job = await Job.findOne({ _id: id });
  if (!job) {
    next(`No job Found with this  id : ${id}`);
  }
  if (req.user.userId !== job.createdBy.toString()) {
    next("You are not Authorized to Update this job");
    return;
  }
  const update = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ update });
};

//---DELETE JOB CONTROLLER-----
export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });
  if (!job) {
    next(`Job not Found with this id ${id}`);
  }

  if (!(req.user.userId === job.createdBy.toString())) {
    next("You are not Authorized and can't delete Job");
    return;
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted Successfully",
  });
};

// --JOB STATS AND FILTER
export const jobStats = async (req, res, next) => {
  const stats = await Job.aggregate([
    // Serch by user job
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({
    totalJobs: stats.length,
    defaultStats,
    monthlyApplication,
  });
};
