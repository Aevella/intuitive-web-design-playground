import { useState, useEffect } from "react";
import { BgProvider } from "./context/BgContext";
import { CATEGORIES } from "./utils/constants";
import { hexToLum, lumToFg } from "./utils/color";
import BgControl from "./components/core/BgControl";
import { registry } from "./data/registry";


export default function DesignPlayground() {
  const [activeTab, setActiveTab] = useState("static");
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [bgHex, setBgHex] = useState("#0a0a0c");
  const [viewport, setViewport] = useState({ w: 1440, h: 900, scale: 1, dpr: 1 });
  const lum = hexToLum(bgHex);
  const fg = lumToFg(lum);
  const handleFocus = (idx) => setFocusedIdx(prev => prev === idx ? null : idx);
  const getFocused = (idx) => focusedIdx === null ? null : focusedIdx === idx;

  useEffect(() => {
    const updateViewport = () => {
      const vv = window.visualViewport;
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        scale: vv?.scale || 1,
        dpr: window.devicePixelRatio || 1,
      });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  const tabs = Object.fromEntries(
    Object.entries(registry).map(([cat, elements]) => [
      cat,
      elements.map(({ component: Comp, key }) =>
        (f, o) => <Comp key={key} focused={f} onFocus={o} />
      ),
    ])
  );
  const totalElements = Object.values(registry).reduce((sum, arr) => sum + arr.length, 0);

  const isCompactTabs = viewport.w < 760;

  return (
    <BgProvider bgHex={bgHex}>
      <div style={{
        minHeight: "100vh", background: bgHex,
        fontFamily: "'IBM Plex Mono', monospace", color: `${fg}0.7)`,
        transition: "background 0.4s ease",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
        <div style={{ padding: "40px 32px 0", maxWidth: 840, margin: "0 auto" }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 300, color: `${fg}0.5)`, letterSpacing: "-0.02em", transition: "color 0.4s" }}>设计参数游乐场</span>
          </div>
          <div style={{ fontSize: 9, color: `${fg}0.12)`, letterSpacing: "0.08em", transition: "color 0.4s" }}>
            DESIGN PARAMETER PLAYGROUND — v0.4 · 点击元素底部参数即复制CSS
          </div>
          <div style={{ fontSize: 9, color: `${fg}0.12)`, letterSpacing: "0.08em", marginTop: 4, transition: "color 0.4s" }}>
            参考护栏：CSS 数值 1:1；视觉感受会随容器/背景变化 · padding-x 为单侧值（左右同时生效）
          </div>
          <div style={{
            display: "inline-flex", gap: 10, alignItems: "center",
            marginTop: 8, marginBottom: 28, padding: "4px 8px",
            borderRadius: 6, border: `1px solid ${fg}0.08)`, background: `${fg}0.02)`,
            fontSize: 9, color: `${fg}0.22)`, letterSpacing: "0.04em",
          }}>
            <span>REF 1440×900 / 390×844</span>
            <span>ZOOM 100%</span>
            <span>BG {bgHex}</span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isCompactTabs ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
            columnGap: 0,
            rowGap: 0,
            marginBottom: 12,
            borderBottom: `1px solid ${fg}0.06)`,
          }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveTab(cat.id); setFocusedIdx(null); }}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "12px 10px", position: "relative", textAlign: "left",
                  color: activeTab === cat.id ? `${fg}0.7)` : `${fg}0.2)`,
                  fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", transition: "color 0.3s",
                  minWidth: 0,
                }}>
                <span>{cat.label}</span>
                <span style={{ fontSize: 9, marginLeft: 6, opacity: 0.5 }}>{cat.subtitle}</span>
                {activeTab === cat.id && <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 1, background: `${fg}0.3)` }} />}
              </button>
            ))}
          </div>
          <div style={{
            marginBottom: 16,
            fontSize: 9,
            color: `${fg}0.16)`,
            letterSpacing: "0.06em",
            fontFamily: "'IBM Plex Mono', monospace",
            border: `1px solid ${fg}0.05)`,
            borderRadius: 6,
            padding: "7px 10px",
          }}>
            参考环境 · viewport {viewport.w}×{viewport.h} · zoom×{viewport.scale.toFixed(2)} · dpr {viewport.dpr.toFixed(2)} · bg {bgHex}
          </div>
        </div>
        <div style={{ padding: "0 32px 60px", maxWidth: 840, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tabs[activeTab].map((render, i) => render(getFocused(i), () => handleFocus(i)))}
          </div>
        </div>
        <div style={{ padding: "20px 32px", maxWidth: 840, margin: "0 auto", borderTop: `1px solid ${fg}0.03)` }}>
          <div style={{ fontSize: 9, color: `${fg}0.1)`, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
            {totalElements} elements · 4 categories · inline CSS export · snap points · v0.4
          </div>
        </div>
        <BgControl bgHex={bgHex} onChange={setBgHex} />
      </div>
    </BgProvider>
  );
}
