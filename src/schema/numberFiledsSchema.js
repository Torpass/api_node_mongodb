const mongoose = require("mongoose");

// Esquema auxiliar para los campos numéricos
const numberFieldsSchema = new mongoose.Schema({
  value:      { type: String, default: "$0" },
  lastValue:  { type: String, default: "$0" },
  number:     {type: Number, default: 0},
  lastNumber: { type: Number, default: 0 }
},{
  _id: false
});

const percentFieldsSchema = new mongoose.Schema({
  value:      { type: String, default: "0%" },
  lastValue:  { type: String, default: "0%" },
  number:     {type: Number, default: 0},
  lastNumber: { type: Number, default: 0 }
},{
  _id: false
})

module.exports = {
  numberFieldsSchema,
  percentFieldsSchema
};
