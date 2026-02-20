import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ width: 48, height: 26, radius: 13, speed: 0.25, thumbGap: 2 });
  const [on, setOn] = useState(false);
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(20,160,80,0.8)" : "rgba(100,255,180,0.7)";
  const off = lumToFg(lum) + "0.15)";
  const ts = p.height - p.thumbGap * 2;
  const css = `width: ${p.width}px;\nheight: ${p.height}px;\nborder-radius: ${p.radius}px;\ntransition: all ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1);`;
  return (
    <ElementCard title="开关" subtitle="Toggle Switch" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `${p.width}×${p.height} · r:${p.radius} · ${p.speed}s` }}>
      <div onClick={(e) => { e.stopPropagation(); setOn(!on); }} style={{
        width: p.width, height: p.height, borderRadius: p.radius,
        background: on ? accent.replace(/[\d.]+\)$/, "0.2)") : lumToFg(lum) + "0.06)",
        border: `1px solid ${on ? accent : off}`, position: "relative", cursor: "pointer",
        transition: `all ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}>
        <div style={{
          position: "absolute", top: p.thumbGap,
          left: on ? p.width - ts - p.thumbGap : p.thumbGap,
          width: ts, height: ts, borderRadius: p.radius - 1,
          background: on ? accent : off,
          boxShadow: on ? `0 0 8px ${accent}` : "none",
          transition: `all ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }} />
      </div>
      <div>
        <ParamSlider label="宽度 width" value={p.width} min={32} max={72} onChange={v => setP(s => ({...s, width: v}))} accent={accent} snaps={[44, 48, 56]} />
        <ParamSlider label="高度 height" value={p.height} min={18} max={40} onChange={v => setP(s => ({...s, height: v}))} accent={accent} snaps={[24, 28, 32]} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={20} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} />
        <ParamSlider label="过渡速度 speed" value={p.speed} min={0.05} max={0.6} step={0.01} unit="s" onChange={v => setP(s => ({...s, speed: v}))} accent={accent} />
        <ParamSlider label="滑块内距 thumb-gap" value={p.thumbGap} min={1} max={5} onChange={v => setP(s => ({...s, thumbGap: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});


export default Component;
