import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ radius: 20, size: 12, padX: 12, padY: 4, borderW: 1, gap: 8 });
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(40,140,80,0.7)" : "rgba(160,220,180,0.6)";
  const css = `border-radius: ${p.radius}px;\nfont-size: ${p.size}px;\npadding: ${p.padY}px ${p.padX}px;\nborder: ${p.borderW}px solid;\ngap: ${p.gap}px;`;
  return (
    <ElementCard title="标签 / 徽标" subtitle="Tag / Badge" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `r:${p.radius} · ${p.size}px · gap:${p.gap}` }}>
      <div style={{ display: "flex", gap: p.gap, flexWrap: "wrap", justifyContent: "center" }}>
        {["标签一", "Tag B", "分类"].map((t, i) => (
          <span key={i} style={{
            fontSize: p.size, fontFamily: "'IBM Plex Mono', monospace",
            color: accent, border: `${p.borderW}px solid ${accent}`,
            borderRadius: p.radius, padding: `${p.padY}px ${p.padX}px`,
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}>{t}</span>
        ))}
      </div>
      <div>
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={30} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 4, 20]} />
        <ParamSlider label="字号 font-size" value={p.size} min={9} max={18} onChange={v => setP(s => ({...s, size: v}))} accent={accent} snaps={[10, 12, 14]} />
        <ParamSlider label="水平内距 padding-x" value={p.padX} min={4} max={24} onChange={v => setP(s => ({...s, padX: v}))} accent={accent} />
        <ParamSlider label="垂直内距 padding-y" value={p.padY} min={2} max={12} onChange={v => setP(s => ({...s, padY: v}))} accent={accent} />
        <ParamSlider label="边框粗细 border-width" value={p.borderW} min={0} max={3} step={0.5} onChange={v => setP(s => ({...s, borderW: v}))} accent={accent} snaps={[0, 1]} />
        <ParamSlider label="间距 gap" value={p.gap} min={2} max={20} onChange={v => setP(s => ({...s, gap: v}))} accent={accent} snaps={[4, 8, 12]} />
      </div>
    </ElementCard>
  );
});


export default Component;
