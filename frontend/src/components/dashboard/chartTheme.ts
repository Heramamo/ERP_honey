import { getStoredTheme } from '../../utils/theme';

const isLight = () => getStoredTheme() === 'light';

export const chartTooltipStyle = (() => {
  const light = isLight();
  return {
    backgroundColor: light ? '#fffdf8' : '#141a26',
    border: light ? '1px solid rgba(90,80,55,0.18)' : '1px solid rgba(148,163,184,0.2)',
    borderRadius: '8px',
    fontSize: '12px',
    color: light ? '#201a12' : '#f3f4f6',
    boxShadow: light ? '0 10px 30px -18px rgba(60,50,25,0.25)' : '0 8px 24px -12px rgba(0,0,0,0.5)',
  };
})();

export const chartAxis = {
  stroke: isLight() ? '#8a7f63' : '#8b95a5',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const chartAxisTight = {
  stroke: isLight() ? '#8a7f63' : '#8b95a5',
  fontSize: 10,
  tickLine: false,
  axisLine: false,
} as const;

export const chartGridStroke = (() => {
  return isLight() ? 'rgba(90,80,55,0.14)' : 'rgba(148,163,184,0.12)';
})();
