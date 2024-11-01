import { createContext, useContext } from "react";

const BASE_UNIT = 8;
const REGULAR_FONT_SIZE = 16;

const ThemeContext = createContext({
  theme: {
    border: {
      width: {
        thin: 1.25,
        thick: 1.75,
      },
      radius: {
        extraLight: 5,
        light: 10,
        heavy: 20,
        rounded: 50,
      },
    },
    color: {
      primary: "#8874a3",
      onPrimary: "#3d1e6d",
      primaryContainer: "#e4dcf1",
      secondary: "tomato",
      onSecondary: "#e56b6f",
      success: "#E0F0D7",
      onSuccess: "#597D55",
      danger: "#F3CBCC",
      onDanger: "#F7514C",
      warning: "#FEF7E2",
      onWarning: "#E8A448",
      info: "#D7EEF8",
      onInfo: "#5B7D8B",
    },
    shadow: {
      shadowColor: "#111",
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.3,
    },
    spacing: {
      sm: BASE_UNIT,
      md: 2 * BASE_UNIT,
      lg: 3 * BASE_UNIT,
    },
    spinnerDot: {
      lg: 30,
      md: 15,
      sm: 10,
    },
    typography: {
      regular: REGULAR_FONT_SIZE,
      heading: 2 * REGULAR_FONT_SIZE,
    },
    width: {
      sm: 4 * BASE_UNIT,
      md: 6 * BASE_UNIT,
      lg: 8 * BASE_UNIT,
    },
  },
});
export default ThemeContext;

export const useGlobalTheme = () => useContext(ThemeContext);
