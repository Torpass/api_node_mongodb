const MovementDao = require("./dao");
const MovementDto = require("./dto");

class ProjectController {
    static register = async (req, res) => {
        try {
            const userId = req.user._id;

            const [errorsDto, movementData] = MovementDto.register(req.body);
            if (errorsDto) return res.status(400).json({Errors: errorsDto});

            const [errorsDao, newMovement] = await MovementDao.createMovement(movementData, userId);
            if (errorsDao) return res.status(400).json({ Errors: errorsDao });

            res.status(200).json({
                message: "Movement created",
                data: newMovement
            });
        } catch (error) {
            console.error("Error in MovementController.register:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static getMovementByProject = async (req, res) => {
        try {
            const [errorDto, movementData] = MovementDto.getMovementByProject(req.body);
            if (errorDto) return res.status(400).json({ Errors: errorDto });

            
            const movements = await MovementDao.getMovementByProject(movementData);
            res.status(200).json(movements);
        } catch (error) {
            console.error("Error in ProjectController.getProjectsByUser:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static deleteMovements = async (req, res) => {
        try {
            const userId = req.user._id;
            const [errorsDto, projectIds]= await MovementDto.deleteMovements(req.body);
            if (errorsDto) return res.status(400).json({ Errors: errorsDto });

            const result = await MovementDao.deleteMovements(projectIds, userId);
            res.status(200).json(result);


        } catch (error) {
            console.error("Error in ProjectController.deleteProjects:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = ProjectController;
