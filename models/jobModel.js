import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Company Name is required!"],
    },

    position: {
      type: String,
      required: [true, "Job Positioni required"],
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["Pending", "Reject", "Interview"],
      default: "Pending",
    },

    workType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },

    workLocatioin: {
      type: String,
      default: "Mumbai",
      required: [true, "Work location is required!"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
