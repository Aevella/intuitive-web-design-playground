import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ gap: 16, padding: 20, itemSize: 40, items: 4, radius: 8 });
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(30,120,160,0.6)" : "rgba(140,220,255,0.6)";
  const css = `gap: ${p.gap}px;\npadding: ${p.padding}px;\n/* item-size: ${p.itemSize}px */\n/* breath ratio: ${(p.gap/p.itemSize).toFixed(2)} */`;
  return (
    <ElementCard title="间距呼吸" subtitle="Spacing / Breath" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `gap:${p.gap} · pad:${p.padding} · breath:${(p.gap/p.itemSize).toFixed(2)}` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
        <div style={{
          display: "flex", gap: p.gap, padding: p.padding,
          background: accent.replace(/[\d.]+\)$/, "0.04)"),
          border: `1px solid ${accent.replace(/[\d.]+\)$/, "0.1)")}`,
          borderRadius: p.radius, transition: "all 0.15s", flexWrap: "wrap", justifyContent: "center",
        }}>
          {Array.from({ length: p.items }).map((_, i) => (
            <div key={i} style={{
              width: p.itemSize, height: p.itemSize, borderRadius: p.radius / 2,
              background: accent.replace(/[\d.]+\)$/, "0.12)"),
              border: `1px solid ${accent.replace(/[\d.]+\)$/, "0.15)")}`,
              transition: "all 0.15s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: Math.max(4, p.gap / 2), height: 2, background: "rgba(255,130,100,0.4)" }} />
            <span style={{ fontSize: 8, color: "rgba(255,130,100,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>gap</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: Math.max(4, p.padding / 3), height: 2, background: "rgba(100,200,255,0.4)" }} />
            <span style={{ fontSize: 8, color: "rgba(100,200,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>pad</span>
          </div>
        </div>
      </div>
      <div>
        <ParamSlider label="间距 gap" value={p.gap} min={0} max={48} onChange={v => setP(s => ({...s, gap: v}))} accent="rgba(255,130,100,0.6)" snaps={[4, 8, 16, 24, 32]} />
        <ParamSlider label="内距 padding" value={p.padding} min={4} max={48} onChange={v => setP(s => ({...s, padding: v}))} accent="rgba(100,200,255,0.6)" snaps={[8, 16, 24, 32]} />
        <ParamSlider label="元素尺寸 size" value={p.itemSize} min={20} max={80} unit="px" onChange={v => setP(s => ({...s, itemSize: v}))} accent={accent} />
        <ParamSlider label="数量 count" value={p.items} min={2} max={8} onChange={v => setP(s => ({...s, items: v}))} accent={accent} />
        <ParamSlider label="圆角 radius" value={p.radius} min={0} max={20} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 4, 8, 16]} />
      </div>
    </ElementCard>
  );
});

export default Component;
