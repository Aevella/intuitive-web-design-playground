import { memo, useState } from "react";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ size: 28, thickness: 3, speed: 0.8, arc: 270, color_h: 210 });
  const accent = `hsla(${p.color_h}, 70%, 60%, 0.8)`;
  const bgRing = `hsla(${p.color_h}, 70%, 60%, 0.12)`;
  const css = `width: ${p.size}px;\nheight: ${p.size}px;\nborder: ${p.thickness}px solid transparent;\nborder-top-color: hsl(${p.color_h}, 70%, 60%);\nborder-radius: 50%;\nanimation: spin ${p.speed}s linear infinite;`;
  return (
    <ElementCard title="加载旋转" subtitle="Spinner" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `${p.size}px · ${p.thickness}px · ${p.speed}s` }}>
      <div style={{ position: "relative", width: p.size, height: p.size }}>
        <style>{`@keyframes spin-p { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        {/* Background ring */}
        <svg width={p.size} height={p.size} style={{ position: "absolute" }}>
          <circle cx={p.size/2} cy={p.size/2} r={(p.size - p.thickness) / 2}
            fill="none" stroke={bgRing} strokeWidth={p.thickness} />
        </svg>
        {/* Spinning arc */}
        <svg width={p.size} height={p.size}
          style={{ position: "absolute", animation: `spin-p ${p.speed}s linear infinite` }}>
          <circle cx={p.size/2} cy={p.size/2} r={(p.size - p.thickness) / 2}
            fill="none" stroke={accent} strokeWidth={p.thickness}
            strokeLinecap="round"
            strokeDasharray={`${(p.arc / 360) * Math.PI * (p.size - p.thickness)} ${Math.PI * (p.size - p.thickness)}`}
          />
        </svg>
      </div>
      <div>
        <ParamSlider label="尺寸 size" value={p.size} min={16} max={56} onChange={v => setP(s => ({...s, size: v}))} accent={accent} snaps={[24, 32, 48]} />
        <ParamSlider label="线粗 thickness" value={p.thickness} min={1} max={8} step={0.5} onChange={v => setP(s => ({...s, thickness: v}))} accent={accent} snaps={[2, 3, 4]} />
        <ParamSlider label="转速 speed" value={p.speed} min={0.3} max={2.5} step={0.1} unit="s" onChange={v => setP(s => ({...s, speed: v}))} accent={accent} />
        <ParamSlider label="弧长 arc" value={p.arc} min={30} max={340} unit="°" onChange={v => setP(s => ({...s, arc: v}))} accent={accent} snaps={[90, 180, 270]} />
        <ParamSlider label="色相 hue" value={p.color_h} min={0} max={360} onChange={v => setP(s => ({...s, color_h: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
