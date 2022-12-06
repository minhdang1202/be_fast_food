const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const paymentSchema = mongoose.Schema(
  {
    id: { type: String },
    status: { type: String, default: "unpaid" },
    updateTime: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
