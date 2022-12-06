const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        // image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        totalPrice: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: Number, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      ward: { type: String, required: true },
      district: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "Payment in Cash" },
    paymentResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    /**
     * status : Confirmed - 0 || Shipping -2 || Processing -1  || Delivered -3 || Cancelled -4
     */
    status: { type: Number },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalAmount: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    paidAt: { type: Date },
    cartTotalAmount: { type: Number, required: true, default: 0.0 },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
