const LineDao = require("./dao");
const LineDto = require("./dto");

class LineController {
    static register = async (req, res) => {
        try {
            const userId = req.user._id;

            const [errorsDto, lineData] = LineDto.register(req.body);
            if (errorsDto) return res.status(400).json({Errors: errorsDto});

            const [errorsDao, newLine] = await LineDao.createLine(lineData, userId);
            if (errorsDao) return res.status(400).json({ Errors: errorsDao });

            res.status(200).json({
                message: "Line created",
                data: newLine
            });
        } catch (error) {
            console.error("Error in LineController.register:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    static getLineByMovement = async (req, res) => {
        try {
            const [errorDto, lineData] = LineDto.getLinesByMovement(req.body);
            if (errorDto) return res.status(400).json({ Errors: errorDto });

            
            const lines = await LineDao.getLineByMovement(lineData);
            res.status(200).json(lines);
        } catch (error) {
            console.error("Error in LineController.getLineByMovement:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static deleteLines = async (req, res) => {
        try {
            const userId = req.user._id;
            const [errorsDto, lineIds]= await LineDto.deleteLines(req.body);
            if (errorsDto) return res.status(400).json({ Errors: errorsDto });

            const result = await LineDao.deleteLines(lineIds, userId);
            res.status(200).json(result);


        } catch (error) {
            console.error("Error in LineController.deleteLines:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static updateLineField = async (req, res) => {
        try {
            const [errorsDto, data] = LineDto.updateLineField(req.body);
            if (errorsDto) return res.status(400).json({ Errors: errorsDto });

            const result = await LineDao.updateLineField(data);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error in LineController.updateLineField:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = LineController;
