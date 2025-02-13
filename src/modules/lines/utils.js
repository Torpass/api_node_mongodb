const LineModel = require("./model");
const MovementModel = require("../movements/model");
const ProjectModel = require("../projects/model");

// Convierte un número a un formato monetario, por ejemplo: 1234.56 -> "$ 1,234.56"
const formatCurrency = (num) => {
  return `$ ${Number(num).toFixed(2)}`;
};

// Convierte un número a formato porcentual, por ejemplo: 20 -> "20%"
const formatPercentage = (num) => {
  return `${Number(num).toFixed(0)}%`;
};

/**
 * Recalcula los valores derivados de una línea (utilidad y margen) y actualiza los campos lastValue y lastNumber.
 * @param {Object} line - Documento de la línea
 * @returns {Object} La línea actualizada
 */
const recalcLineNumbers = (line) => {
  const sumPrice = line.numbers.sumPrice.number || 0;
  const sumBudget = line.numbers.sumBudget.number || 0;
  const utility = sumPrice - sumBudget;

  // Actualiza budgetUtility: asigna los valores anteriores y luego los nuevos
  line.numbers.budgetUtility.lastNumber = line.numbers.budgetUtility.number;
  line.numbers.budgetUtility.lastValue = line.numbers.budgetUtility.value;
  line.numbers.budgetUtility.number = utility;
  line.numbers.budgetUtility.value = formatCurrency(utility);

  // Calcula y actualiza budgetMargin
  const margin = sumPrice > 0 ? (utility / sumPrice) * 100 : 0;
  line.numbers.budgetMargin.lastNumber = line.numbers.budgetMargin.number;
  line.numbers.budgetMargin.lastValue = line.numbers.budgetMargin.value;
  line.numbers.budgetMargin.number = margin;
  line.numbers.budgetMargin.value = formatPercentage(margin);

  return line;
};

/**
 * Recalcula los totales para un movimiento a partir de todas sus líneas,
 * actualizando los campos lastValue y lastNumber en cada propiedad.
 * @param {string} movementId 
 * @param {mongoose.ClientSession} session 
 * @returns {Object} El movimiento actualizado
 */
const recalcMovementNumbers = async (movementId, session = null) => {
  // Obtener todas las líneas del movimiento
  const lines = await LineModel.find({ movement: movementId }).session(session);
  const totalSumPrice = lines.reduce((acc, line) => acc + (line.numbers.sumPrice.number || 0), 0);
  const totalSumBudget = lines.reduce((acc, line) => acc + (line.numbers.sumBudget.number || 0), 0);
  const utility = totalSumPrice - totalSumBudget;
  const margin = totalSumPrice > 0 ? (utility / totalSumPrice) * 100 : 0;

  const movement = await MovementModel.findById(movementId).session(session);
  if (!movement) throw new Error("Movimiento no encontrado");

  // Actualiza sumPrice
  movement.numbers.sumPrice.lastNumber = movement.numbers.sumPrice.number;
  movement.numbers.sumPrice.lastValue = movement.numbers.sumPrice.value;
  movement.numbers.sumPrice.number = totalSumPrice;
  movement.numbers.sumPrice.value = formatCurrency(totalSumPrice);

  // Actualiza sumBudget
  movement.numbers.sumBudget.lastNumber = movement.numbers.sumBudget.number;
  movement.numbers.sumBudget.lastValue = movement.numbers.sumBudget.value;
  movement.numbers.sumBudget.number = totalSumBudget;
  movement.numbers.sumBudget.value = formatCurrency(totalSumBudget);

  // Actualiza budgetUtility
  movement.numbers.budgetUtility.lastNumber = movement.numbers.budgetUtility.number;
  movement.numbers.budgetUtility.lastValue = movement.numbers.budgetUtility.value;
  movement.numbers.budgetUtility.number = utility;
  movement.numbers.budgetUtility.value = formatCurrency(utility);

  // Actualiza budgetMargin
  movement.numbers.budgetMargin.lastNumber = movement.numbers.budgetMargin.number;
  movement.numbers.budgetMargin.lastValue = movement.numbers.budgetMargin.value;
  movement.numbers.budgetMargin.number = margin;
  movement.numbers.budgetMargin.value = formatPercentage(margin);

  await movement.save({ session });
  return movement;
};

/**
 * Recalcula los totales para un proyecto a partir de todos sus movimientos,
 * actualizando los campos lastValue y lastNumber en cada propiedad.
 * @param {string} projectId 
 * @param {mongoose.ClientSession} session 
 * @returns {Object} El proyecto actualizado
 */
const recalcProjectNumbers = async (projectId, session = null) => {
  const movements = await MovementModel.find({ project: projectId }).session(session);
  const totalSumPrice = movements.reduce((acc, m) => acc + (m.numbers.sumPrice.number || 0), 0);
  const totalSumBudget = movements.reduce((acc, m) => acc + (m.numbers.sumBudget.number || 0), 0);
  const utility = totalSumPrice - totalSumBudget;
  const margin = totalSumPrice > 0 ? (utility / totalSumPrice) * 100 : 0;

  const project = await ProjectModel.findById(projectId).session(session);
  if (!project) throw new Error("Proyecto no encontrado");

  // Actualiza sumPrice
  project.numbers.sumPrice.lastNumber = project.numbers.sumPrice.number;
  project.numbers.sumPrice.lastValue = project.numbers.sumPrice.value;
  project.numbers.sumPrice.number = totalSumPrice;
  project.numbers.sumPrice.value = formatCurrency(totalSumPrice);

  // Actualiza sumBudget
  project.numbers.sumBudget.lastNumber = project.numbers.sumBudget.number;
  project.numbers.sumBudget.lastValue = project.numbers.sumBudget.value;
  project.numbers.sumBudget.number = totalSumBudget;
  project.numbers.sumBudget.value = formatCurrency(totalSumBudget);

  // Actualiza budgetUtility
  project.numbers.budgetUtility.lastNumber = project.numbers.budgetUtility.number;
  project.numbers.budgetUtility.lastValue = project.numbers.budgetUtility.value;
  project.numbers.budgetUtility.number = utility;
  project.numbers.budgetUtility.value = formatCurrency(utility);

  // Actualiza budgetMargin
  project.numbers.budgetMargin.lastNumber = project.numbers.budgetMargin.number;
  project.numbers.budgetMargin.lastValue = project.numbers.budgetMargin.value;
  project.numbers.budgetMargin.number = margin;
  project.numbers.budgetMargin.value = formatPercentage(margin);

  await project.save({ session });
  return project;
};

module.exports = {
  formatCurrency,
  formatPercentage,
  recalcLineNumbers,
  recalcMovementNumbers,
  recalcProjectNumbers
};
