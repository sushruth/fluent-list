// @ts-ignore
import { ThemeContext } from "react-fela";
import { useContext } from "react";
import { ThemePrepared } from "@stardust-ui/react";

export const useTheme = () =>
  useContext<{ theme: ThemePrepared }>(ThemeContext);
