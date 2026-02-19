import { useContext } from "react";
import { BgContext } from "../../context/BgContext";
import { lumToFg } from "../../utils/color";

export default function Note({ children, style = {} }) {
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);

  return (
    <div style={{
      fontSize: 10, color: `${fg}0.18)`, fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: "0.05em", borderLeft: `1px solid ${fg}0.06)`,
      paddingLeft: 8, marginTop: 8, lineHeight: 1.5, ...style,
    }}>{children}</div>
  );
}
