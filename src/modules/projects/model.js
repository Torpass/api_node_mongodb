const mongoose = require("mongoose");
const { numberFieldsSchema, percentFieldsSchema } = require('../../schema/numberFiledsSchema');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    numbers: {
      type: {
        sumPrice: { type: numberFieldsSchema, default: () => ({}) },
        sumBudget: { type: numberFieldsSchema, default: () => ({}) },
        budgetUtility: { type: percentFieldsSchema, default: () => ({}) },
        budgetMargin: { type: percentFieldsSchema, default: () => ({}) }
      },
      _id: false,
      default: () => ({
        sumPrice: {},
        sumBudget: {},
        budgetUtility: {},
        budgetMargin: {}
      })
    }
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ name: 1 });
module.exports = mongoose.model("projects", projectSchema);