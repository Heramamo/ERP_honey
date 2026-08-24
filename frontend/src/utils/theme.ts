export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

export const getStoredTheme = (): Theme =>
  localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';

export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('light', theme === 'light');
};

export const setTheme = (theme: Theme) => {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
};

export const initTheme = () => applyTheme(getStoredTheme());
