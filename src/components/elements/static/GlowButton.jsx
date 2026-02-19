import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ glow: 12, radius: 12, brightness: 0.8, size: 14, borderW: 1, padX: 24, padY: 10 });
  const { lum } = useContext(BgContext);
  const hueL = lum > 0.5 ? Math.round(p.brightness * 40) : Math.round(p.brightness * 100);
  const color = `hsl(220, 60%, ${hueL}%)`;
  const glowC = `hsla(220, 80%, ${Math.round(p.brightness * 80)}%, ${(p.glow / 40).toFixed(2)})`;
  const css = `border-radius: ${p.radius}px;\nbox-shadow: 0 0 ${p.glow}px ${glowC}, inset 0 0 ${Math.round(p.glow/2)}px ${glowC};\nfont-size: ${p.size}px;\npadding: ${p.padY}px ${p.padX}px;\nborder: ${p.borderW}px solid ${color};`;
  return (
    <ElementCard title="发光轮廓" subtitle="Glow Outline" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `r:${p.radius} · glow:${p.glow} · ${(p.brightness*100).toFixed(0)}%` }}>
      <button style={{
        background: "transparent", color, border: `${p.borderW}px solid ${color}`,
        borderRadius: p.radius, padding: `${p.padY}px ${p.padX}px`,
        fontSize: p.size, fontFamily: "'IBM Plex Mono', monospace",
        boxShadow: `0 0 ${p.glow}px ${glowC}, inset 0 0 ${p.glow / 2}px ${glowC}`,
        cursor: "pointer", transition: "all 0.15s", textShadow: `0 0 ${p.glow / 2}px ${glowC}`,
      }}>按钮文字</button>
      <div>
        <ParamSlider label="发光半径 glow-spread" value={p.glow} min={0} max={40} onChange={v => setP(s => ({...s, glow: v}))} accent={color} snaps={[0, 20]} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={30} onChange={v => setP(s => ({...s, radius: v}))} accent={color} snaps={[0, 8, 16]} />
        <ParamSlider label="亮度 brightness" value={p.brightness} min={0.2} max={1} step={0.01} onChange={v => setP(s => ({...s, brightness: v}))} accent={color} />
        <ParamSlider label="字号 font-size" value={p.size} min={10} max={24} onChange={v => setP(s => ({...s, size: v}))} accent={color} snaps={[12, 14, 16]} />
        <ParamSlider label="边框粗细 border-width" value={p.borderW} min={0} max={4} step={0.5} onChange={v => setP(s => ({...s, borderW: v}))} accent={color} snaps={[0, 1, 2]} />
        <ParamSlider label="水平内距 padding-x" value={p.padX} min={8} max={48} onChange={v => setP(s => ({...s, padX: v}))} accent={color} />
        <ParamSlider label="垂直内距 padding-y" value={p.padY} min={4} max={24} onChange={v => setP(s => ({...s, padY: v}))} accent={color} />
      </div>
    </ElementCard>
  );
});

export default Component;
