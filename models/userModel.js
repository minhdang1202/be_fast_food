const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = mongoose.Schema({
  address: { type: String },
  city: { type: String, default: "Hà Nội" },
  ward: { type: String },
  district: { type: String },
});

const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    phone: { type: "Number", default: 0 },
    pic: {
      type: "String",
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    role: {
      //0 : admin , 1 : customer , 2 : staff
      type: "Number",
      required: true,
      default: 1,
    },
    address: { addressSchema },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
