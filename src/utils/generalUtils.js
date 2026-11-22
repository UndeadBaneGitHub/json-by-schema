export function genId() {
  return generateRandomNumberString(12);
}

export function generateRandomNumberString(length) {
  const minPow = length - 1;
  // eslint-disable-next-line no-mixed-operators
  const randomNumber = Math.floor(Math.random() * 10 ** length + 10 ** minPow);

  return randomNumber.toString();
}

export function stopPropagation(evt) {
  if (evt !== undefined) {
    if (evt.preventDefault) evt.preventDefault();
    if (evt.stopPropagation) evt.stopPropagation();
  }

  return !!evt;
}

export function getAbsoluteHeight(el) {
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

  return Math.ceil(el.offsetHeight + margin);
}

// The following functions were extracted from lodash to not be dependent on the entire library

export function isObject(value) {
  if (!value) {
    return false;
  }
  const type = typeof value;
  return type === 'object' || type === 'function';
}

export function isFunction(value) {
  if (!value) {
    return false;
  }
  const type = typeof value;
  return type === 'function';
}

export function isNumber(val) {
  return +val === +val;
}

export function isString(value) {
  return (value || value === '') && (typeof value === 'string' || value instanceof String);
}

export function identity(value) {
  return value;
}
