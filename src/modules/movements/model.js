const mongoose = require('mongoose');
const {numberFieldsSchema,percentFieldsSchema} = require('../../schema/numberFiledsSchema');

const MovementSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
    required: true
  },
  numbers: {
    sumPrice: numberFieldsSchema,
    sumBudget: numberFieldsSchema,
    budgetUtility: percentFieldsSchema,
    budgetMargin: percentFieldsSchema
  }
}, { timestamps: true });

module.exports = mongoose.model('movements', MovementSchema);
