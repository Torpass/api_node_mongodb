const ProjectModel = require("./model");

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
  static async deleteProjects(projectIds) {
    try {
      const result = await ProjectModel.deleteMany({ _id: { $in: projectIds } });
      return result;
    } catch (error) {
      console.error("Error al eliminar proyectos:", error);
      throw new Error("No se pudieron eliminar los proyectos.");
    }
  }
}

module.exports = ProjectDAO;
