export const THEME_PRESETS = ['ios', 'nomad', 'github', 'kubernetes', 'swagger'];

export function resolveThemeProps(theme) {
  if (!theme || typeof theme !== 'string') {
    return {};
  }

  return { 'data-jbs-theme': theme };
}
