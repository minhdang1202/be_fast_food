const { default: mongoose } = require("mongoose");

const ingredientSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    mass: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);