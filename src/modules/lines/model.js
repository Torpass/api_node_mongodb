const mongoose = require('mongoose');
const {numberFieldsSchema,percentFieldsSchema} = require('../../schema/numberFiledsSchema');

const LineSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require: true
  },
  movement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movements',
    required: true
  },
  numbers: {
    sumPrice: numberFieldsSchema,
    sumBudget: numberFieldsSchema,
    budgetUtility: percentFieldsSchema,
    budgetMargin: percentFieldsSchema
  }
}, { timestamps: true });

module.exports = mongoose.model('lines', LineSchema);
