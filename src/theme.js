export const THEME_PRESETS = ['ios', 'nomad', 'github', 'kubernetes', 'swagger'];

export function resolveThemeProps(theme) {
  if (!theme || typeof theme !== 'string') {
    return { className: 'jbs-theme-ios', 'data-jbs-theme': 'ios' };
  }

  return {
    className: `jbs-theme-${theme}`,
    'data-jbs-theme': theme,
  };
}
