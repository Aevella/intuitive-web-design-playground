import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ radius: 16, shadow: 20, blur: 30, borderW: 1, padInner: 20, opacity: 0.06 });
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(60,80,140,0.6)" : "rgba(180,200,255,0.6)";
  const shadowA = lum > 0.5 ? 0.12 : 0.4;
  const css = `border-radius: ${p.radius}px;\nbox-shadow: 0 ${Math.round(p.shadow/2)}px ${p.blur}px rgba(0,0,0,${shadowA});\nborder: ${p.borderW}px solid ${fg}${(p.opacity*2).toFixed(3)});\npadding: ${p.padInner}px;\nbackground: ${fg}${p.opacity.toFixed(3)});`;
  return (
    <ElementCard title="静态卡片" subtitle="Card / Container" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `r:${p.radius} · shadow:${p.shadow}/${p.blur} · bg:${(p.opacity*100).toFixed(0)}%` }}>
      <div style={{
        width: "100%", maxWidth: 200, padding: p.padInner,
        background: `${fg}${p.opacity})`, border: `${p.borderW}px solid ${fg}${p.opacity * 2})`,
        borderRadius: p.radius, boxShadow: `0 ${p.shadow / 2}px ${p.blur}px rgba(0,0,0,${shadowA})`,
        transition: "all 0.15s",
      }}>
        <div style={{ width: "60%", height: 8, background: `${fg}0.2)`, borderRadius: 4, marginBottom: 8 }} />
        <div style={{ width: "90%", height: 6, background: `${fg}0.08)`, borderRadius: 3, marginBottom: 4 }} />
        <div style={{ width: "75%", height: 6, background: `${fg}0.08)`, borderRadius: 3 }} />
      </div>
      <div>
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={32} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 8, 16, 24]} />
        <ParamSlider label="阴影偏移 shadow-offset" value={p.shadow} min={0} max={40} onChange={v => setP(s => ({...s, shadow: v}))} accent={accent} />
        <ParamSlider label="阴影模糊 shadow-blur" value={p.blur} min={0} max={60} onChange={v => setP(s => ({...s, blur: v}))} accent={accent} />
        <ParamSlider label="边框粗细 border-width" value={p.borderW} min={0} max={3} step={0.5} onChange={v => setP(s => ({...s, borderW: v}))} accent={accent} snaps={[0, 1]} />
        <ParamSlider label="内距 padding" value={p.padInner} min={8} max={40} onChange={v => setP(s => ({...s, padInner: v}))} accent={accent} snaps={[8, 16, 24]} />
        <ParamSlider label="背景透明度 bg-opacity" value={p.opacity} min={0} max={0.2} step={0.005} onChange={v => setP(s => ({...s, opacity: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
