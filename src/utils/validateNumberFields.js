const ALLOWED_FIELDS = ["sumPrice", "sumBudget", "budgetUtility", "budgetMargin"];
const REQUIRED_FIELDS = ["sumPrice", "sumBudget"]; // Nuevo array para campos obligatorios
const ALLOWED_PROPERTIES = new Set(["value", "lastValue", "number", "lastNumber"]);
const FIELD_TYPES = {
  sumPrice: "number",
  sumBudget: "number",
  budgetUtility: "percent",
  budgetMargin: "percent",
};

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

  // Validar propiedades obligatorias solo para campos requeridos
  if (REQUIRED_FIELDS.includes(fieldName)) {
    if (typeof fieldData.value === "undefined") {
      errors.push(`El campo '${fieldName}.value' es obligatorio.`);
    }
    if (typeof fieldData.number === "undefined") {
      errors.push(`El campo '${fieldName}.number' es obligatorio.`);
    }
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

const validateNumberFields = (numbers) => {
  const errors = [];

  // Validar que 'numbers', si existe, sea un objeto no-array
  if (numbers && (typeof numbers !== "object" || Array.isArray(numbers))) {
    errors.push("El campo 'numbers' debe ser un objeto");
    return errors;
  }

  // Validar solo los campos requeridos
  REQUIRED_FIELDS.forEach((fieldName) => {
    if (!Object.prototype.hasOwnProperty.call(numbers, fieldName)) {
      errors.push(`El campo '${fieldName}' es obligatorio en 'numbers'`);
    } else {
      errors.push(...validateField(fieldName, numbers[fieldName]));
    }
  });

  // Validar campos opcionales si están presentes
  ALLOWED_FIELDS.forEach((fieldName) => {
    if (!REQUIRED_FIELDS.includes(fieldName) && 
        Object.prototype.hasOwnProperty.call(numbers, fieldName)) {
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