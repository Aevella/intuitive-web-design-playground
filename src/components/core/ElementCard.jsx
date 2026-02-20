import { memo, useContext, Children, useEffect, useState } from "react";
import { BgContext } from "../../context/BgContext";
import { createFg } from "../../utils/color";
import CopyBadge from "./CopyBadge";
import { UI_TOKENS } from "../../utils/uiTokens";

function ElementCard({ title, subtitle, children, controls, copyData, focused, onFocus, layout = "split" }) {
  const { lum } = useContext(BgContext);
  const fg = createFg(lum);
  const isDark = lum <= 0.5;
  const childList = Children.toArray(children);
  const previewContent = childList[0] ?? null;
  const controlContent = controls ?? childList[1] ?? null;
  const [compactSplit, setCompactSplit] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 620 : false));

  useEffect(() => {
    const onResize = () => setCompactSplit(window.innerWidth < 620);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const useSplit = layout === "split" && !compactSplit;

  return (
    <div onClick={onFocus} style={{
      background: isDark ? (focused ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)") : (focused ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.02)"),
      border: `1px solid ${fg(focused ? 0.1 : 0.04)}`,
      borderRadius: 12, padding: 24, cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      opacity: focused === null ? 1 : focused ? 1 : 0.3,
      transform: focused === null ? "none" : focused ? "none" : "scale(0.97)",
      filter: focused === null ? "none" : focused ? "none" : "blur(1px)",
    }}>
      <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: fg(0.5), fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: 10, color: fg(0.15), fontFamily: "'IBM Plex Mono', monospace" }}>{subtitle}</span>
      </div>
      <div style={useSplit
        ? { display: "flex", gap: UI_TOKENS.split.gap, alignItems: "stretch" }
        : { display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column",
          background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)",
          borderRadius: 8, padding: 24, border: `1px solid ${fg(0.03)}`,
          flex: useSplit ? "1 1 auto" : undefined,
          minWidth: 0,
        }}>
          {previewContent}
          {copyData && <CopyBadge css={copyData.css} short={copyData.short} />}
        </div>
        <div style={useSplit ? { width: UI_TOKENS.split.controlWidth, flexShrink: 0 } : undefined}>{controlContent}</div>
      </div>
    </div>
  );
}

export default memo(ElementCard);
