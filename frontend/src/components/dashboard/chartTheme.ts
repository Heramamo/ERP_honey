// Tonalité des graphiques — encres du registre miel
export const chartTooltipStyle = {
  backgroundColor: '#241910',
  border: '1px solid #8a5a14',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#f7eace',
  fontFamily:
    '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
};

const TICK_FILL = 'rgba(130, 90, 32, 0.85)';

export const chartAxis = {
  stroke: 'rgba(130, 90, 32, 0.5)',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
  tick: { fill: TICK_FILL, fontSize: 11 },
} as const;

export const chartAxisTight = {
  stroke: 'rgba(130, 90, 32, 0.5)',
  fontSize: 10,
  tickLine: false,
  axisLine: false,
  tick: { fill: TICK_FILL, fontSize: 10 },
} as const;

export const chartGridStroke = 'rgba(130, 90, 32, 0.16)';

// Palettes de séries — miel, sauge, lilas, azur, argile
export const chartSeries = {
  honey: '#E5A73A',
  honeyDeep: '#C9861F',
  sage: '#5CA493',
  lilac: '#9171B4',
  azure: '#6683A9',
  leaf: '#3E8E5A',
  clay: '#D85268',
};