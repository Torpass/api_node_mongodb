const validateNumberField = require("../../utils/validateNumberFields");
const mongoose = require("mongoose");
class MovementstDto {
    /**
     * Valida y estructura los datos para la creación de un movimiento.
     * @param {Object} data - Datos de entrada del request.body.
     * @returns {[Object|null, Object|null]} - [Errores, Datos Validados]
     */
    static register(data) {
        const errors = [];
        
        const { name, numbers, projectId } = data;

        
        
        if (!name || typeof name !== "string") {
            errors.push("El nombre del movimiento es obligatorio y debe ser un string.");
            return errors;
        }
        if(name.length < 3 || name.length > 256) {
            errors.push("El nombre del movimiento debe tener al menos 3 caracteres y un máximo de 256.");
            return errors;
        }
        
        if (!projectId || typeof projectId !== "string") {
            errors.push("El campo projectId es obligatorio y debe ser un string.");
            return errors;
        }

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            errors.push(`El ID '${projectId}' no es un ObjectId válido.`);
            return errors;
        }


        // Validar estructura de `numbers`
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
            projectId,
            numbers
        };

        return [undefined, validatedData];
    }

    static deleteMovements(data) {
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
    

    static getMovementByProject(data) {
        const { projectId } = data;
        const errors = [];
        
        if (!projectId || typeof projectId !== "string") {
            errors.push("El campo projectId es obligatorio y debe ser un string.");
            return errors;
        }

        if(!mongoose.Types.ObjectId.isValid(projectId)){
            errors.push(`El ID '${projectId}' no es un ObjectId válido.`);
            return errors;
        }

        return [undefined, projectId];
    }
}

module.exports = MovementstDto;