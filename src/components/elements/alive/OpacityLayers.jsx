import { memo, useContext, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ base: 0.12, mid: 0.24, top: 0.42, gap: 16, hue: 220 });
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = `hsla(${p.hue}, 85%, ${lum > 0.5 ? 42 : 70}%, 0.72)`;

  const layer = (alpha) => `hsla(${p.hue}, 85%, ${lum > 0.5 ? 42 : 70}%, ${alpha})`;
  const css = `--layer-base: ${p.base.toFixed(2)};\n--layer-mid: ${p.mid.toFixed(2)};\n--layer-top: ${p.top.toFixed(2)};\ngap: ${p.gap}px;\ncolor: hsl(${p.hue} 85% 55%);`;

  return (
    <ElementCard title="透明度层级" subtitle="Opacity Layers" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `base:${p.base.toFixed(2)} · mid:${p.mid.toFixed(2)} · top:${p.top.toFixed(2)}` }}>
      <div style={{ width: "100%", maxWidth: 240, display: "grid", placeItems: "center", minHeight: 160 }}>
        <div style={{ position: "relative", width: 160, height: 120 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: layer(p.base), border: `1px solid ${fg}0.08)` }} />
          <div style={{ position: "absolute", inset: `${p.gap * 0.45}px`, borderRadius: 10, background: layer(p.mid), border: `1px solid ${fg}0.1)` }} />
          <div style={{ position: "absolute", inset: `${p.gap}px`, borderRadius: 8, background: layer(p.top), border: `1px solid ${fg}0.12)` }} />
        </div>
      </div>
      <div>
        <ParamSlider label="底层透明度 base-alpha" value={p.base} min={0.02} max={0.35} step={0.01} onChange={(v) => setP((s) => ({ ...s, base: v }))} accent={accent} />
        <ParamSlider label="中层透明度 mid-alpha" value={p.mid} min={0.05} max={0.55} step={0.01} onChange={(v) => setP((s) => ({ ...s, mid: v }))} accent={accent} />
        <ParamSlider label="顶层透明度 top-alpha" value={p.top} min={0.1} max={0.85} step={0.01} onChange={(v) => setP((s) => ({ ...s, top: v }))} accent={accent} />
        <ParamSlider label="层间距 layer-gap" value={p.gap} min={8} max={24} step={1} onChange={(v) => setP((s) => ({ ...s, gap: v }))} accent={accent} snaps={[10, 16, 20]} />
        <ParamSlider label="色相 hue" value={p.hue} min={0} max={360} unit="°" onChange={(v) => setP((s) => ({ ...s, hue: v }))} accent={accent} snaps={[200, 260, 320]} />
      </div>
    </ElementCard>
  );
});

export default Component;
