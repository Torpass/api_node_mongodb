const validateNumberField = require("../../utils/validateNumberFields");
const mongoose = require("mongoose");
class ProjectDto {
    /**
     * Valida y estructura los datos para la creación de un proyecto.
     * @param {Object} data - Datos de entrada del request.body.
     * @returns {[Object|null, Object|null]} - [Errores, Datos Validados]
     */
    static register(data) {
        const errors = [];
        const { name, numbers } = data;

        if (!name || typeof name !== "string") {
            errors.push("El nombre del proyecto es obligatorio y debe ser un string.");
            return errors;
        }
        if(name.length < 3 || name.length > 256) {
            errors.push("El nombre del proyecto debe tener al menos 3 caracteres y un máximo de 256.");
            return errors;
        }

        if (!numbers){
            errors.push("El campo 'numbers' es obligatorio");
            return errors;
        }

        const validationResult = validateNumberField(numbers);        

        if (validationResult !== true){
            errors.push(...validationResult);
            return errors;
        }

        const validatedData = {
            name,
            numbers
        };

        return [undefined, validatedData];
    }

    static deleteProjects(data) {
        const { ids } = data;
        const errors = [];
        
        if (!Array.isArray(ids) || ids.length === 0) {
            errors.push("Se requiere una lista de IDs para eliminar los proyectos.");
            return errors;
        }


        const invalidId = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidId) {
          errors.push(`El ID '${invalidId}' no es un ObjectId válido.`);
          return errors;
        }
        

        return [undefined, ids];
    }

    static searchProjects(data){
        console.log(data);    
        let { query, page = 1, limit = 10 } = data;
        page = parseInt(page);
        limit = parseInt(limit);

        if (!query) {
            return res.status(400).json({ error: "El parámetro 'query' es obligatorio." });
        }

        if (typeof query !== "string") {
            return res.status(400).json({ error: "El parámetro 'query' debe ser un string." });
        }



        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ error: "Los parámetros 'page' y 'limit' deben ser números." });
        }

        if (page < 1 || limit < 1) {
            return res.status(400).json({ error: "Los parámetros 'page' y 'limit' deben ser números positivos." });
        }

        return [undefined, { query, page, limit }];
    }
}

module.exports = ProjectDto;