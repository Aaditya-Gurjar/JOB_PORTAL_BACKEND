import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt, { compare } from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      validate: validator.isEmail,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters "],
      select: true,
    },

    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

//middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// JSON webtoken
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const User = mongoose.model("User", userSchema);
