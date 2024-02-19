import { User } from "../models/userModel.js";

export const userRegister = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(name && email && password)) {
    next("All Fields are Required!");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    next("Email Already Exists, Please Login!");
  }

  const user = await User.create({ name, email, password });
  user.password = undefined;
  //   token
  const token = user.createJWT();
  res
    .status(200)
    .send({ success: true, message: "User Created Successfully", user, token });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    next("All filed are Requried");
  }

  //   find userBy email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid UserName and Password!");
  }

  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid Credentials!");
  }
  user.password = undefined;
  //   token
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
