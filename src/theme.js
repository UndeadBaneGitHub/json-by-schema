const TOKEN_TO_CSS_VAR = {
  bg: '--jbs-bg',
  bgSecondary: '--jbs-bg-secondary',
  bgHover: '--jbs-bg-hover',
  bgActive: '--jbs-bg-active',
  inputBg: '--jbs-input-bg',
  popoverBg: '--jbs-popover-bg',
  text: '--jbs-text',
  textSecondary: '--jbs-text-secondary',
  textMuted: '--jbs-text-muted',
  border: '--jbs-border',
  panelShadow: '--jbs-panel-shadow',
  accent: '--jbs-accent',
  accentContrast: '--jbs-accent-contrast',
  switchOn: '--jbs-switch-on',
  switchOff: '--jbs-switch-off',
  danger: '--jbs-danger',
  dangerBg: '--jbs-danger-bg',
  dangerBorder: '--jbs-danger-border',
  success: '--jbs-success',
  successBg: '--jbs-success-bg',
  warning: '--jbs-warning',
  radius: '--jbs-radius',
  radiusLg: '--jbs-radius-lg',
  fontFamily: '--jbs-font-family',
  scrollTrack: '--jbs-scroll-track',
  scrollThumb: '--jbs-scroll-thumb',
};

export const THEME_PRESETS = ['ios', 'nomad', 'github', 'kubernetes', 'swagger'];

export function resolveThemeProps(theme) {
  if (!theme) {
    return {};
  }

  if (typeof theme === 'string') {
    return { 'data-jbs-theme': theme };
  }

  const { preset, ...tokens } = theme;
  const style = {};

  Object.keys(tokens).forEach((key) => {
    const cssVar = TOKEN_TO_CSS_VAR[key] || (key.startsWith('--') ? key : null);
    if (cssVar && tokens[key] !== undefined) {
      style[cssVar] = tokens[key];
    }
  });

  return {
    ...(preset ? { 'data-jbs-theme': preset } : {}),
    ...(Object.keys(style).length ? { style } : {}),
  };
}
