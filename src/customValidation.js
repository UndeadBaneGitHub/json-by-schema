/*
  Helpers for custom validations

  Contains definitions for:
    - CustomValidationError - class to use to produce validation errors. IMPORTANT: they are NOT exceptions
 */

function CustomValidationError({
  name, // VALIDATOR name
  propertyName, // property name
  message, // (optional) custom built error message
  value, // (optional) property value
  schema, // (optional) property schema
  propertyPath, // (optional) property path; path format is "/top_prop/other_prop/next-comes-array-index/0/someProp"
}) {
  if (propertyPath) {
    this.propertyPath = propertyPath;
  }
  if (message) {
    this.message = message;
  }
  if (schema) {
    this.schema = schema;
  }
  if (value) {
    this.value = value;
  }
  this.name = name;
  this.propertyName = propertyName;
  this.stack = this.toString();
}

CustomValidationError.prototype.toString = function toString() {
  return `${this.propertyPath} ${this.message}`;
};

function CustomValidationResult({
  name, // VALIDATOR name
  propertyPath, // (optional) property path from root
  value, // (optional) property value,
  schema, // (optional) property schema
}) {
  if (propertyPath) {
    this.propertyPath = propertyPath;
  }
  if (schema) {
    this.schema = schema;
  }
  if (value) {
    this.value = value;
  }

  this.name = name;

  this.errors = [];
}

CustomValidationResult.prototype.addError = function addError({
  message,
  propertyName,
  value, // (optional) property value, if not present, root one is taken
  schema, // (optional) property schema, if not present, root one is taken
  propertyPath, // (optional) property path, if not present, root one is taken; path format is "/top_prop/other_prop/next-comes-array-index/0/someProp"
}) {
  if (!message) throw new Error('Missing error message');

  const err = new CustomValidationError({
    message,
    propertyName,
    value: value || this.value,
    schema: schema || this.schema,
    propertyPath: propertyPath || this.propertyPath,
    name: this.name,
  });

  this.errors.push(err);
  return err;
};

function stringizer(v, i) {
  return `${i}: ${v.toString()}\n`;
}
CustomValidationResult.prototype.toString = function toString() {
  return this.errors.map(stringizer).join('');
};

Object.defineProperty(CustomValidationResult.prototype, 'valid', {
  get() {
    return !this.errors.length;
  },
});

export { CustomValidationError, CustomValidationResult };
