const validateNumberField = require("../../utils/validateNumberFields");
const mongoose = require("mongoose");
class LinesDto {
    /**
     * Valida y estructura los datos para la creación de una linea.
     * @param {Object} data - Datos de entrada del request.body.
     * @returns {[Object|null, Object|null]} - [Errores, Datos Validados]
     */
    static register(data) {
        const errors = [];
        
        const { name, numbers, movementId } = data;

        
        
        if (!name || typeof name !== "string") {
            errors.push("El nombre de la linea es obligatorio y debe ser un string.");
            return errors;
        }
        if(name.length < 3 || name.length > 256) {
            errors.push("El nombre de la linea debe tener al menos 3 caracteres y un máximo de 256.");
            return errors;
        }
        
        if (!movementId || typeof movementId !== "string") {
            errors.push("El campo movementId es obligatorio y debe ser un string.");
            return errors;
        }

        if(!mongoose.Types.ObjectId.isValid(movementId)){
            errors.push(`El ID '${movementId}' no es un ObjectId válido.`);
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
            movementId: movementId,
            numbers
        };

        return [undefined, validatedData];
    }

    static deleteLines(data) {
        const { ids } = data;
        const errors = [];
        
        if (!Array.isArray(ids) || ids.length === 0) {
            errors.push("Se requiere una lista de IDs para eliminar las lineas.");
            return errors;
        }


        const invalidId = ids.find(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidId) {
          errors.push(`El ID '${invalidId}' no es un ObjectId válido.`);
          return errors;
        }
        

        return [undefined, ids];
    }
    

    static getLinesByMovement(data) {
        const { movementId } = data;
        const errors = [];
        
        if (!movementId || typeof movementId !== "string") {
            errors.push("El campo movementId es obligatorio y debe ser un string.");
            return errors;
        }

        if(!mongoose.Types.ObjectId.isValid(movementId)){
            errors.push(`El ID '${movementId}' no es un ObjectId válido.`);
            return errors;
        }

        return [undefined, movementId];
    }
}

module.exports = LinesDto;