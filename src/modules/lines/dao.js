const LineModel = require("./model");
const MovementModel = require("../movements/model");
const mongoose = require("mongoose");
const {formatCurrency,
      formatPercentage,
      recalcLineNumbers,
      recalcMovementNumbers,
      recalcProjectNumbers} = require("./utils");

class LineDAO {
  /**
   * Crea una nueva linea en la base de datos.
   * @param {Object} lineData - Datos de la linea a crear.
   * @returns {Promise<Object>} - Linea creado.
   */
  static async createLine(lineData, userId) {
    try {
      const errors = [];
      console.log("lineData", lineData, userId);

      // Verificar si el proyecto existe y pertenece al usuario
      const line = await MovementModel.findOne({ 
        _id: lineData.movementId, 
        creator: userId
      });

      if (!line) {
        errors.push("El movimiento no existe o no pertenece al usuario.");
        return errors;
      }

      const newLine = await LineModel.create({
          ...lineData,
          numbers: lineData.numbers,
          creator: userId,
          movement: lineData.movementId,
      });
      return [undefined, newLine];
    } catch (error) {
      console.error("Error al crear la linea:", error);
      throw new Error("No se pudo crear la linea.");
    }
  }

  /**
   * Obtiene todos los movimientos de una linea.
   * @param {String} lineId - ID de la linea.
   * @returns {Promise<Array>} - Lista de movimientos del proyecto.
   */
  static async getLineByMovement(movementId) {
    try {
      const projects = await LineModel.find({ movement: movementId }).select("-creator -movement");
      return projects;
    } catch (error) {
      console.error("Error al obtener las lineas del proyecto:", error);
      throw new Error("No se pudieron obtener las lineas del movimiento.");
    }
  }

  /**
   * Elimina uno o más movimientos por ID.
   * @param {Array<String>} lineIds - Lista de IDs de movimientos a eliminar.
   * @returns {Promise<Object>} - Resultado de la eliminación.
   */
  static async deleteLines(lineIds) {
    try {
      // Verificar que las lineas existen en la base de datos
      const existingLines = await LineModel.find({ _id: { $in: lineIds } }, { _id: 1 });
      const existingLinesIds = existingLines.map(proj => proj._id.toString());
  
      // Identificar los IDs que no existen en la BD
      const missingIds = lineIds.filter(id => !existingLinesIds.includes(id));
  
      if (missingIds.length > 0) {
        return { error: `Los siguientes IDs no existen: ${missingIds.join(", ")}` };
      }
      
      // Proceder con la eliminación solo si todos los IDs existen
      const result = await LineModel.deleteMany({ _id: { $in: lineIds } });
  
      return { message: "Lineas eliminadas correctamente", deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error al eliminar las lineas:", error);
      throw new Error("No se pudieron eliminar las lineas.");
    }
  }

  static async updateLineField (data){
    const {lineId, field, newNumber} = data; 

    const errors = [];
    
  
    // Iniciar una transacción
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

      //Obtener la línea
      const line = await LineModel.findById(lineId).session(session);
      if (!line){
        errors.push("Línea no encontrada.");
        return errors;
      }
  
      // Actualizar el campo de la línea
      line.numbers[field].number = newNumber;
      line.numbers[field].value = formatCurrency(newNumber);
  
      // Recalcular los valores derivados en la línea
      recalcLineNumbers(line);
      await line.save({ session });
  
      // Actualizar el movimiento asociado (sumando los totales de sus líneas)
      const movementId = line.movement;
      const movement = await recalcMovementNumbers(movementId, session);
  
      // Actualizar el proyecto asociado (sumando los totales de sus movimientos)
      const projectId = movement.project;
      const project = await recalcProjectNumbers(projectId, session);
  
      await session.commitTransaction();
      session.endSession();
  
      return { line, movement, project };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };
  
}

module.exports = LineDAO;
