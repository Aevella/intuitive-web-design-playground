import { memo, useState } from "react";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ size: 10, spread: 20, speed: 1.5, color_h: 0, rings: 2 });
  const accent = `hsla(${p.color_h}, 70%, 60%, 0.7)`;
  const css = `width: ${p.size}px;\nheight: ${p.size}px;\nborder-radius: 50%;\nanimation: pulse ${p.speed}s ease-out infinite;\n/* ${p.rings} rings, spread ${p.spread}px */`;
  return (
    <ElementCard title="脉冲指示器" subtitle="Pulse Indicator" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `${p.size}px · ${p.speed}s · ${p.rings} rings` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 80, height: 80 }}>
        <style>{`@keyframes pr-${p.color_h}-${p.spread} { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(${1 + p.spread / 10}); opacity: 0; } }`}</style>
        {Array.from({ length: p.rings }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", width: p.size * 2, height: p.size * 2,
            borderRadius: "50%", border: `1.5px solid ${accent}`,
            animation: `pr-${p.color_h}-${p.spread} ${p.speed}s ease-out infinite`,
            animationDelay: `${(i * p.speed) / p.rings}s`,
          }} />
        ))}
        <div style={{ width: p.size, height: p.size, borderRadius: "50%", background: accent, boxShadow: `0 0 ${p.size}px ${accent}` }} />
      </div>
      <div>
        <ParamSlider label="点大小 dot-size" value={p.size} min={4} max={20} onChange={v => setP(s => ({...s, size: v}))} accent={accent} />
        <ParamSlider label="扩散范围 spread" value={p.spread} min={5} max={40} onChange={v => setP(s => ({...s, spread: v}))} accent={accent} />
        <ParamSlider label="脉冲速度 speed" value={p.speed} min={0.5} max={4} step={0.1} unit="s" onChange={v => setP(s => ({...s, speed: v}))} accent={accent} />
        <ParamSlider label="色相 hue" value={p.color_h} min={0} max={360} onChange={v => setP(s => ({...s, color_h: v}))} accent={accent} />
        <ParamSlider label="波纹层数 rings" value={p.rings} min={1} max={4} onChange={v => setP(s => ({...s, rings: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
