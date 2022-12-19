const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  mass: { type: Number, required: true },
});

const productSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    images: [{ type: String }],
    description: { type: "String", required: true },
    rating: { type: Number, default: 0 },
    category: { type: "String", required: true },
    numReview: { type: Number, default: 0 },
    price: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    ingredients: [ingredientSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
