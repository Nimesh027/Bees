import React, { createContext, useContext } from 'react';
import { theme } from './theme';
import { useSelectedTheme } from './useSelectedTheme';

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }) => {

  const { selectedTheme, saveTheme } = useSelectedTheme()

  const newTheme = { ...theme, colors: { primary: selectedTheme.primary, secondary: selectedTheme.secondary, accent: selectedTheme.accent, background: selectedTheme.background } }
  return (
    <ThemeContext.Provider value={{ theme: newTheme, selectedTheme, saveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
