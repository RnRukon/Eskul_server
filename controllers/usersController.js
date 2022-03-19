const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

const createUser = handlerFactory.createOne(User);
const updateUser = handlerFactory.updateOne(User);
const deleteUser = handlerFactory.deleteOne(User);
const getAllUsers = handlerFactory.getAll(User);

const getMe = catchAsync(async (req, res) => {
  console.log(req.params.email);
  const result = await User.findOne({ email: req.params.email });
  res.json(result);
});

const makeAdmin = async (req, res, next) => {
  const user = req.body;
  const filter = { email: user.email };
  const updateDoc = { $set: { role: "admin" } };
  const result = await User.updateOne(filter, updateDoc);
  if (result.modifiedCount === 0) {
    return next(new AppError("User not found", 404));
  }
  res.json(result);
};

const checkIsAdmin = catchAsync(async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  let isAdmin = false;
  if (user?.role === "admin") {
    isAdmin = true;
  }
  res.json({ admin: isAdmin });
});

const updateOrInsertUser = catchAsync(async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const options = { upsert: true };
  const updateDoc = { $set: user };
  const result = await User.updateOne(filter, updateDoc, options);
  res.json(result);
});

module.exports = {
  checkIsAdmin,
  createUser,
  updateOrInsertUser,
  makeAdmin,
  getMe,
  deleteUser,
  updateUser,
  getAllUsers,
};
