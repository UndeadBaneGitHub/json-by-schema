import * as React from 'react';

export type ThemePreset =
  | 'ios'
  | 'nomad'
  | 'github'
  | 'kubernetes'
  | 'swagger';

export type StructuredFormat = 'json' | 'yaml';

export interface CustomValidationErrorOptions {
  name: string;
  propertyName: string;
  message?: string;
  value?: unknown;
  schema?: Record<string, unknown>;
  propertyPath?: string;
}

export declare class CustomValidationError {
  name: string;
  propertyName: string;
  message?: string;
  value?: unknown;
  schema?: Record<string, unknown>;
  propertyPath?: string;
  stack: string;
  constructor(options: CustomValidationErrorOptions);
  toString(): string;
}

export interface CustomValidationResultOptions {
  name: string;
  propertyPath?: string;
  value?: unknown;
  schema?: Record<string, unknown>;
}

export declare class CustomValidationResult {
  name: string;
  propertyPath?: string;
  value?: unknown;
  schema?: Record<string, unknown>;
  errors: CustomValidationError[];
  readonly valid: boolean;
  constructor(options: CustomValidationResultOptions);
  addError(options: {
    message: string;
    propertyName: string;
    value?: unknown;
    schema?: Record<string, unknown>;
    propertyPath?: string;
  }): CustomValidationError;
  toString(): string;
}

export type CustomValidatorFn = (context: {
  propertyPath: string;
  propertyName: string;
  value: unknown;
  schema: Record<string, unknown>;
  rootSchema: Record<string, unknown>;
  rootValue: unknown;
}) => CustomValidationResult | { errors?: CustomValidationError[] };

export interface JsonBySchemaProps {
  /**
   * JSON Schema object or formatted JSON/YAML schema string.
   */
  schema: Record<string, unknown> | string;
  /**
   * Configuration value (object, array, or formatted JSON/YAML string).
   */
  config?: Record<string, unknown> | unknown[] | string;
  /**
   * Callback invoked whenever a configuration value is saved or updated.
   */
  onChange?: (
    value: any,
    delta: Record<string, unknown> | boolean,
    secondaryValue?: any,
  ) => void;
  /**
   * Current active property path (e.g. "database/host").
   */
  path?: string;
  /**
   * Callback invoked when the active navigation path changes.
   */
  onPathChange?: (path: string) => void;
  /**
   * Array of custom validation functions.
   */
  customValidators?: CustomValidatorFn[];
  /**
   * Depth for delta calculation.
   */
  deltaDepth?: number;
  /**
   * Theme preset name ('ios' | 'nomad' | 'github' | 'kubernetes' | 'swagger').
   */
  theme?: ThemePreset | string;
  /**
   * Controlled dark mode state. If omitted, an internal dark mode toggle is rendered.
   */
  darkMode?: boolean;
  /**
   * Input/output structured format ('json' | 'yaml'). Defaults to 'json'.
   */
  format?: StructuredFormat;
  /**
   * Additional CSS class name applied to the root `.json-by-schema` container.
   */
  className?: string;
}

export declare const JsonBySchema: React.ComponentType<JsonBySchemaProps>;
export declare const THEME_PRESETS: readonly ThemePreset[];
export declare const SUPPORTED_FORMATS: readonly StructuredFormat[];
export declare function parseStructuredValue(
  value: unknown,
  format?: StructuredFormat,
): any;
export declare function stringifyStructuredValue(
  value: unknown,
  format?: StructuredFormat,
): string;
