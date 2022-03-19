const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide a user id"],
  },

  rating: {
    type: Number,
    required: [true, "Please provide rating number"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  review_type: {
    type: String,
    default: "review",
  },
  book: {
    type: mongoose.Schema.ObjectId,
  },
  privateTeacher: {
    type: mongoose.Schema.ObjectId,
  },
  school: {
    type: mongoose.Schema.ObjectId,
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
