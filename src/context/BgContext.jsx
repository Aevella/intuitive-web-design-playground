/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import { hexToLum } from "../utils/color";

export const BgContext = createContext({ bg: "#0a0a0c", lum: 0.04 });

export function BgProvider({ bgHex, children }) {
  const lum = hexToLum(bgHex);
  return (
    <BgContext.Provider value={{ bg: bgHex, lum }}>
      {children}
    </BgContext.Provider>
  );
}
