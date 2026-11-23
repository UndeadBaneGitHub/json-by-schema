import * as React from 'react';

export type ThemePreset =
  | 'ios'
  | 'material'
  | 'antd'
  | 'fluent'
  | 'bootstrap'
  | 'linear'
  | 'kubernetes'
  | 'swagger'
  | 'nomad'
  | 'github';

export type StructuredFormat = 'json' | 'yaml';

export interface ThemeTokens {
  preset?: ThemePreset | string;
  bg?: string;
  bgSecondary?: string;
  bgHover?: string;
  bgActive?: string;
  inputBg?: string;
  popoverBg?: string;
  text?: string;
  textSecondary?: string;
  textMuted?: string;
  border?: string;
  panelShadow?: string;
  accent?: string;
  accentContrast?: string;
  switchOn?: string;
  switchOff?: string;
  danger?: string;
  dangerBg?: string;
  dangerBorder?: string;
  success?: string;
  successBg?: string;
  warning?: string;
  radius?: string;
  radiusLg?: string;
  fontFamily?: string;
  scrollTrack?: string;
  scrollThumb?: string;
  [cssVariable: `--${string}`]: string | undefined;
}

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
   * Theme preset name or custom CSS token overrides.
   */
  theme?: ThemePreset | ThemeTokens | string;
  /**
   * Controlled dark mode state. If omitted, an internal dark mode toggle is rendered.
   */
  darkMode?: boolean;
  /**
   * Input/output structured format ('json' | 'yaml'). Defaults to 'json'.
   */
  format?: StructuredFormat;
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
