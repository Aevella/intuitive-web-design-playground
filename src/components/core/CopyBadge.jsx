import { useState, useContext } from "react";
import { BgContext } from "../../context/BgContext";
import { lumToFg } from "../../utils/color";

export default function CopyBadge({ css, short }) {
  const [copied, setCopied] = useState(false);
  const { lum, bg } = useContext(BgContext);
  const fg = lumToFg(lum);

  const handleCopy = (e) => {
    e.stopPropagation();
    const annotatedCss = `/* Design Parameter Playground Reference\n * Viewport(desktop): 1440x900 @ 100% zoom\n * Viewport(mobile): 390x844 @ 100% zoom\n * Background: ${bg}\n * Note: numeric CSS values are 1:1; visual perception varies with container/context\n */\n${css}`;
    navigator.clipboard.writeText(annotatedCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  return (
    <div onClick={handleCopy} style={{
      display: "flex", alignItems: "center", gap: 6, marginTop: 10,
      cursor: "pointer", padding: "4px 8px", borderRadius: 6,
      background: copied ? `${fg}0.06)` : "transparent",
      border: `1px solid ${fg}${copied ? "0.12)" : "0.04)"}`,
      transition: "all 0.3s", userSelect: "none",
    }}>
      <span style={{
        fontSize: 9, color: `${fg}0.2)`, fontFamily: "'IBM Plex Mono', monospace",
        letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden",
        textOverflow: "ellipsis", maxWidth: 180,
      }}>{short}</span>
      <span style={{
        fontSize: 9, color: copied ? "rgba(100,220,160,0.7)" : `${fg}0.15)`,
        fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0,
        transition: "color 0.3s",
      }}>{copied ? "✓ copied" : "📋"}</span>
    </div>
  );
}
