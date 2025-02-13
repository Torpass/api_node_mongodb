const validateNumberField = require("../../utils/validateNumberFields");

class ProjectDto {
    /**
     * Valida y estructura los datos para la creación de un proyecto.
     * @param {Object} data - Datos de entrada del request.body.
     * @returns {[Object|null, Object|null]} - [Errores, Datos Validados]
     */
    static register(data) {
        const errors = [];
        const { name, numbers } = data;
        const { sumPrice, sumBudget, budgetUtility, budgetMargin } = numbers;

        // Validaciones básicas
        if (!name || typeof name !== "string") {
            errors.push("El nombre del proyecto es obligatorio y debe ser un string.");
        }
        if(name.length < 3 || name.length > 256) {
            errors.push("El nombre del proyecto debe tener al menos 3 caracteres y un máximo de 256.");
            return errors;
        }

        // Validar estructura de `numbers`
        if (!numbers || typeof numbers !== "object"){
            errors.push("El campo 'numbers' es obligatorio y debe ser un objeto.");
            return errors;
        }

        const validationResult = validateNumberField(numbers);        

        console.log("validationResult", validationResult);

        if (validationResult !== true){
            errors.push(...validationResult);
            return errors;
        }


        // Datos validados
        const validatedData = {
            name,
            numbers
        };

        return [undefined, validatedData];
    }
}

module.exports = ProjectDto;