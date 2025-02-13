const ProjectDao = require("./dao");
const ProjectDto = require("./dto");

class ProjectController {
    static register = async (req, res) => {
        try {
            const [errorsDto, projectData] = ProjectDto.register(req.body);
            const userId = req.user._id;
            if (errorsDto) return res.status(400).json({Errors: errorsDto});

            // Llamar al DAO para crear el proyecto
            const [errorsDao, newProject] = await ProjectDao.createProject(projectData, userId);


            if (errorsDao) return res.status(400).json({ Errors: errorsDao });

            res.status(200).json({
                message: "Project created",
                data: newProject
            });
        } catch (error) {
            console.error("Error in ProjectController.register:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };


    static getProjectsByUser = async (req, res) => {
        try {
            const userId = req.user._id;
            const projects = await ProjectDao.getProjectsByUser(userId);
            res.status(200).json(projects);
        } catch (error) {
            console.error("Error in ProjectController.getProjectsByUser:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static deleteProjects = async (req, res) => {
        try {
            const [errorsDto, projectIds]= await ProjectDto.deleteProjects(req.body);
            if (errorsDto) return res.status(400).json({ Errors: errorsDto });

            

            const result = await ProjectDao.deleteProjects(projectIds);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in ProjectController.deleteProjects:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = ProjectController;
