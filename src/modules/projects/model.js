const mongoose = require("mongoose");
const {numberFieldsSchema,percentFieldsSchema} = require('../../schema/numberFiledsSchema');

// Esquema de Proyecto
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
      sumPrice: numberFieldsSchema,
      sumBudget: numberFieldsSchema,
      budgetUtility: percentFieldsSchema,
      budgetMargin: percentFieldsSchema
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("projects", projectSchema);
