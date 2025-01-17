import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  recipe_name: {
    type: String,
    required: true,
  },
  ingredients_list: [
    {
      ingredient: String,
      quantity: String,
    },
  ],
  nutritional_information: {
    calories: Number,
    protein: Number,
    fat: Number,
    carbohydrates: Number,
  },
  cooking_steps: [
    {
      step: String,
      time: Number,
      utility: String,
    },
  ],
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      permissions: {
        type: String,
        enum: ["owner", "editor", "viewer"],
        default: "viewer",
      },
    },
  ],
  shareToken: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.index({ recipe_name: "text" });

export default mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
