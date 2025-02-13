// Definiciones de constantes globales
const ALLOWED_FIELDS = ["sumPrice", "sumBudget", "budgetUtility", "budgetMargin"];
const ALLOWED_PROPERTIES = new Set(["value", "lastValue", "number", "lastNumber"]);
const FIELD_TYPES = {
  sumPrice: "number",       
  sumBudget: "number",       
  budgetUtility: "percent",  
  budgetMargin: "percent",   
};

/**
 * Obtiene el patrón de validación y mensaje de error según el tipo del campo.
 */
const getStringValidationConfig = (fieldName) => {
  const type = FIELD_TYPES[fieldName];
  const config = {
    pattern: type === "percent" ? /^\d+%$/ : /^\$ \d+(\.\d{1,2})?$/,
    message: `El campo '{field}.{prop}' tiene un formato inválido. Use ${
      type === "percent" ? "'número%'" : '"$ número"'
    }`,
  };
  return config;
};

/**
 * Valida la estructura y las propiedades de un campo individual.
 * @param {string} fieldName - Nombre del campo (ej. "sumPrice").
 * @param {object} fieldData - Objeto con las propiedades del campo.
 * @returns {string[]} Array de mensajes de error.
 */
const validateField = (fieldName, fieldData) => {
  const errors = [];

  // Validar que sea un objeto no nulo
  if (typeof fieldData !== "object" || fieldData === null) {
    errors.push(`El campo '${fieldName}' debe ser un objeto`);
    return errors;
  }

  // Validar propiedades permitidas
  Object.keys(fieldData).forEach((prop) => {
    if (!ALLOWED_PROPERTIES.has(prop)) {
      errors.push(`Propiedad no permitida en '${fieldName}': ${prop}`);
    }
  });

  // Validar propiedades obligatorias
  if (typeof fieldData.value === "undefined") {
    errors.push(`El campo '${fieldName}.value' es obligatorio.`);
  }
  if (typeof fieldData.number === "undefined") {
    errors.push(`El campo '${fieldName}.number' es obligatorio.`);
  }

  // Configuración de validación para campos de tipo string
  const { pattern, message } = getStringValidationConfig(fieldName);

  // Validar propiedades de tipo string
  ["value", "lastValue"].forEach((prop) => {
    if (typeof fieldData[prop] !== "undefined") {
      if (typeof fieldData[prop] !== "string") {
        errors.push(`El campo '${fieldName}.${prop}' debe ser string`);
      } else if (!pattern.test(fieldData[prop])) {
        errors.push(message.replace("{field}", fieldName).replace("{prop}", prop));
      }
    }
  });

  // Validar propiedades de tipo number
  ["number", "lastNumber"].forEach((prop) => {
    if (typeof fieldData[prop] !== "undefined" && typeof fieldData[prop] !== "number") {
      errors.push(`El campo '${fieldName}.${prop}' debe ser number`);
    }
  });

  return errors;
};

/**
 * Valida el objeto 'numbers' según la especificación requerida.
 * @param {object} numbers - Objeto que contiene los campos a validar.
 * @returns {true|string[]} true si la validación es exitosa, o un array de errores.
 */
const validateNumberFields = (numbers) => {
  const errors = [];

  // Validar que 'numbers', si existe, sea un objeto no-array
  if (numbers && (typeof numbers !== "object" || Array.isArray(numbers))) {
    errors.push("El campo 'numbers' debe ser un objeto");
    return errors;
  }

  // Validar cada campo permitido
  ALLOWED_FIELDS.forEach((fieldName) => {
    if (numbers && Object.prototype.hasOwnProperty.call(numbers, fieldName)) {
      errors.push(...validateField(fieldName, numbers[fieldName]));
    }
  });

  // Detectar campos extra no permitidos en 'numbers'
  if (numbers && typeof numbers === "object") {
    Object.keys(numbers).forEach((field) => {
      if (!ALLOWED_FIELDS.includes(field)) {
        errors.push(`Campo no permitido en 'numbers': ${field}`);
      }
    });
  }

  return errors.length ? errors : true;
};

module.exports = validateNumberFields;
