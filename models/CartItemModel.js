const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cartItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    totalQuantity: { type: Number },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartItemSchema);
