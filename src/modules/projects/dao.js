const ProjectModel = require("./model");
const MovementModel = require("../movements/model");

class ProjectDAO {
  /**
   * Crea un nuevo proyecto en la base de datos.
   * @param {Object} projectData - Datos del proyecto a crear.
   * @returns {Promise<Object>} - Proyecto creado.
   */
  static async createProject(projectData, userId) {
    try {
      const errors = [];
      const { name } = projectData;

      const existingProjectsCount = await ProjectModel.countDocuments({
        name: name,
        creator: userId,
      });

      if (existingProjectsCount >= 1) {
        errors.push("Ya tienes un proyecto con el mismo nombre.");
        return [errors, null];
      }

      const newProject = await ProjectModel.create({
          ...projectData,
          numbers: projectData.numbers,
          creator: userId,
      });
      return [undefined, newProject];
    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      throw new Error("No se pudo crear el proyecto.");
    }
  }

  /**
   * Obtiene todos los proyectos de un usuario.
   * @param {String} userId - ID del usuario.
   * @returns {Promise<Array>} - Lista de proyectos del usuario.
   */
  static async getProjectsByUser(userId) {
    try {
      const projects = await ProjectModel.find({ creator: userId }).select("-creator");
      return projects;
    } catch (error) {
      console.error("Error al obtener proyectos del usuario:", error);
      throw new Error("No se pudieron obtener los proyectos.");
    }
  }

  /**
   * Elimina uno o más proyectos por ID.
   * @param {Array<String>} projectIds - Lista de IDs de proyectos a eliminar.
   * @returns {Promise<Object>} - Resultado de la eliminación.
   */
  static async deleteProjects(projectIds, userId) {
    try {
      // Verificar qué proyectos existen en la base de datos
      const existingProjects = await ProjectModel.find({ 
          _id: { $in: projectIds },
          creator: userId 
        }, 
        { _id: 1 }
      );
      const existingProjectIds = existingProjects.map(proj => proj._id.toString());
  
      // Identificar los IDs que no existen en la BD y los que no le pertenecen al usuario
      const missingIds = projectIds.filter(id => !existingProjectIds.includes(id));
  
      if (missingIds.length > 0) {
        return { error: `Los siguientes IDs no existen en tu usuario: ${missingIds.join(", ")}` };
      }

      // Eliminar los movimientos asociados a los proyectos
      await MovementModel.deleteMany({ project: { $in: existingProjectIds } });
  
      // Proceder con la eliminación solo si todos los IDs existen y que pertenezcan al usuario
      const result = await ProjectModel.deleteMany({ 
        _id: { $in: projectIds },
        creator: userId
      });
  
      return { message: "Proyectos eliminados correctamente", deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error al eliminar proyectos:", error);
      throw new Error("No se pudieron eliminar los proyectos.");
    }
  }
  
}


module.exports = ProjectDAO;
