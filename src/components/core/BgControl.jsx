import { useState } from "react";
import { hexToLum, hslToHex } from "../../utils/color";

const TEXTURE_PRESETS = {
  clean: { noise: 0, bloom: 0.06, specular: 0.08 },
  soft: { noise: 0.04, bloom: 0.18, specular: 0.14 },
  glass: { noise: 0.02, bloom: 0.26, specular: 0.32 },
  grain: { noise: 0.12, bloom: 0.08, specular: 0.1 },
  neon: { noise: 0.06, bloom: 0.42, specular: 0.3 },
};

export default function BgControl({ bgHex, onChange, texture, onTextureChange }) {
  const lum = hexToLum(bgHex);
  const [expanded, setExpanded] = useState(false);
  const r = parseInt(bgHex.slice(1, 3), 16) / 255;
  const g = parseInt(bgHex.slice(3, 5), 16) / 255;
  const b = parseInt(bgHex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (mx === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 1000,
      background: lum > 0.5 ? "rgba(0,0,0,0.85)" : "rgba(20,20,24,0.92)",
      backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: expanded ? 14 : 28,
      padding: expanded ? "14px 16px" : "0",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      width: expanded ? 220 : 44, height: expanded ? "auto" : 44,
      overflow: "hidden", cursor: expanded ? "default" : "pointer",
      display: "flex", flexDirection: "column", gap: 6,
    }} onClick={() => !expanded && setExpanded(true)}>
      {!expanded && (
        <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg, #0a0a0c 50%, #f0f0f0 50%)", border: "1.5px solid rgba(255,255,255,0.2)" }} />
        </div>
      )}
      {expanded && (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>环境光 AMBIENT</span>
          <button onClick={e => { e.stopPropagation(); setExpanded(false); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 14, cursor: "pointer", padding: "0 2px" }}>✕</button>
        </div>
        <div style={{ width: "100%", height: 24, borderRadius: 5, background: bgHex, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 9, color: lum > 0.5 ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{bgHex}</span>
        </div>
        {[{ label: "明度", val: l, bg: "linear-gradient(to right, #000, #888, #fff)", fn: v => onChange(hslToHex(h, s, v / 100)) },
          { label: "色相", val: h * 360, max: 360, bg: "linear-gradient(to right, hsl(0,60%,50%),hsl(60,60%,50%),hsl(120,60%,50%),hsl(180,60%,50%),hsl(240,60%,50%),hsl(300,60%,50%),hsl(360,60%,50%))", fn: v => onChange(hslToHex(v / 360, Math.max(s, 0.05), l)) },
          { label: "饱和度", val: s * 100, bg: `linear-gradient(to right, hsl(${h*360},0%,${l*100}%), hsl(${h*360},100%,${l*100}%))`, fn: v => onChange(hslToHex(h, v / 100, l)) },
        ].map((sl, i) => {
          const max = sl.max || 100;
          const current = Math.round(i === 0 ? l * 100 : sl.val);
          const pct = (current / max) * 100;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono', monospace" }}>{sl.label}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>{current.toFixed(0)}{i === 1 ? "°" : "%"}</span>
              </div>
              <div style={{ position: "relative", height: 16 }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 6, top: 5, borderRadius: 3, background: sl.bg, opacity: 0.35 }} />
                <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 6, top: 5, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />
                <div style={{
                  position: "absolute", left: `${pct}%`, top: 8,
                  transform: "translate(-50%, -50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.35)",
                  pointerEvents: "none",
                }} />
                <input type="range" min={0} max={max} value={current}
                  onChange={e => sl.fn(parseInt(e.target.value))}
                  style={{ position: "absolute", left: 0, right: 0, width: "100%", height: 22, opacity: 0, cursor: "pointer", margin: 0, touchAction: "pan-x" }} />
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 5, marginTop: 2, justifyContent: "center" }}>
          {[{ hex: "#0a0a0c" }, { hex: "#1a1a2e" }, { hex: "#2d1b33" }, { hex: "#e8e4df" }, { hex: "#f0f0f0" }].map(pr => (
            <button key={pr.hex} onClick={() => onChange(pr.hex)} style={{
              width: 22, height: 22, borderRadius: 5, background: pr.hex,
              border: bgHex === pr.hex ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer", padding: 0,
            }} />
          ))}
        </div>

        {texture && onTextureChange && (
          <>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>质感 TEXTURE</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono', monospace" }}>{texture.preset}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 4 }}>
              {[
                { id: "clean", label: "干净" },
                { id: "soft", label: "柔雾" },
                { id: "glass", label: "玻璃" },
                { id: "grain", label: "颗粒" },
                { id: "neon", label: "霓虹" },
              ].map((t) => (
                <button key={t.id} onClick={(e) => { e.stopPropagation(); onTextureChange({ preset: t.id, ...TEXTURE_PRESETS[t.id] }); }} style={{
                  border: `1px solid ${texture.preset === t.id ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)"}`,
                  background: texture.preset === t.id ? "rgba(255,255,255,0.12)" : "transparent",
                  color: texture.preset === t.id ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.45)",
                  borderRadius: 6, padding: "5px 6px", fontSize: 9, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace",
                }}>{t.label}</button>
              ))}
            </div>

            {[{ key: "noise", label: "颗粒" }, { key: "bloom", label: "泛光" }, { key: "specular", label: "高光" }].map((sl) => {
              const current = Math.round((texture[sl.key] || 0) * 100);
              const pct = current;
              return (
                <div key={sl.key}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "'IBM Plex Mono', monospace" }}>{sl.label}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>{current}%</span>
                  </div>
                  <div style={{ position: "relative", height: 16 }}>
                    <div style={{ position: "absolute", left: 0, right: 0, height: 6, top: 5, borderRadius: 3, background: "rgba(255,255,255,0.16)" }} />
                    <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 6, top: 5, borderRadius: 3, background: "rgba(255,255,255,0.5)" }} />
                    <input type="range" min={0} max={100} value={current}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) / 100;
                        onTextureChange({ ...texture, [sl.key]: v, preset: "custom" });
                      }}
                      style={{ position: "absolute", left: 0, right: 0, width: "100%", height: 22, opacity: 0, cursor: "pointer", margin: 0, touchAction: "pan-x" }} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </>)}
    </div>
  );
}
