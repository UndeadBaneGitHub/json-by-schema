import YAML from 'yaml';

export const SUPPORTED_FORMATS = ['json', 'yaml'];

export function normalizeFormat(format) {
  if (typeof format === 'string') {
    const lower = format.trim().toLowerCase();
    if (lower === 'yaml' || lower === 'yml') {
      return 'yaml';
    }
  }
  return 'json';
}

export function parseStructuredValue(value, format = 'json') {
  if (typeof value !== 'string') {
    return value;
  }
  const normalized = normalizeFormat(format);
  if (normalized === 'yaml') {
    return YAML.parse(value);
  }
  return JSON.parse(value);
}

export function stringifyStructuredValue(value, format = 'json') {
  const normalized = normalizeFormat(format);
  if (normalized === 'yaml') {
    return YAML.stringify(value);
  }
  return JSON.stringify(value, null, 2);
}
