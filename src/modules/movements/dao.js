const MovementModel = require("./model");
const ProjectModel = require("../projects/model");

class MovementDAO {
  /**
   * Crea un nuevo movimiento en la base de datos.
   * @param {Object} movementData - Datos del movimiento a crear.
   * @returns {Promise<Object>} - Proyecto creado.
   */
  static async createMovement(movementData, userId) {
    try {
      const errors = [];

      // Verificar si el proyecto existe y pertenece al usuario
      const project = await ProjectModel.findOne({ 
        _id: movementData.projectId, 
        creator: userId 
      });
      if (!project) {
        errors.push("No puedes agregar movimientos a un proyecto que no te pertenece.");
        return errors;
      }

      const newMovement = await MovementModel.create({
          ...movementData,
          numbers: movementData.numbers,
          creator: userId,
          project: movementData.projectId,
      });
      return [undefined, newMovement];
    } catch (error) {
      console.error("Error al crear el movimiento:", error);
      throw new Error("No se pudo crear el movimiento.");
    }
  }

  /**
   * Obtiene todos los movimientos de un proyecto.
   * @param {String} projectId - ID del proyecto.
   * @returns {Promise<Array>} - Lista de movimientos del proyecto.
   */
  static async getMovementByProject(projectId) {
    try {
      const projects = await MovementModel.find({ project: projectId }).select("-creator -project");
      return projects;
    } catch (error) {
      console.error("Error al obtener los movimientos del proyecto:", error);
      throw new Error("No se pudieron obtener los movimientos.");
    }
  }

  /**
   * Elimina uno o más movimientos por ID.
   * @param {Array<String>} movementsIds - Lista de IDs de movimientos a eliminar.
   * @returns {Promise<Object>} - Resultado de la eliminación.
   */
  static async deleteMovements(movementIds) {
    try {
      // Verificar qué proyectos existen en la base de datos
      const existingMovements = await MovementModel.find({ _id: { $in: movementIds } }, { _id: 1 });
      const existingMovementsIds = existingMovements.map(proj => proj._id.toString());
  
      // Identificar los IDs que no existen en la BD
      const missingIds = movementIds.filter(id => !existingMovementsIds.includes(id));
  
      if (missingIds.length > 0) {
        return { error: `Los siguientes IDs no existen: ${missingIds.join(", ")}` };
      }
      
      // Proceder con la eliminación solo si todos los IDs existen
      const result = await MovementModel.deleteMany({ _id: { $in: movementIds } });
  
      return { message: "Movimientos eliminados correctamente", deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error al eliminar Movimientos:", error);
      throw new Error("No se pudieron eliminar los Movimientos.");
    }
  }
  
}

module.exports = MovementDAO;
