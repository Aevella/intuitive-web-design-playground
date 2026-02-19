import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ height: 4, radius: 2, progress: 65, speed: 0.8, glow: 6 });
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(30,100,200,0.7)" : "rgba(100,180,255,0.7)";
  const fg = lumToFg(lum);
  const css = `height: ${p.height}px;\nborder-radius: ${p.radius}px;\ntransition: width ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1);\nbox-shadow: 0 0 ${p.glow}px (accent);`;
  return (
    <ElementCard title="进度条" subtitle="Progress Bar" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `${p.height}px · r:${p.radius} · ${p.speed}s` }}>
      <div style={{ width: "100%", maxWidth: 240 }}>
        <div style={{ width: "100%", height: p.height, background: `${fg}0.06)`, borderRadius: p.radius, overflow: "hidden" }}>
          <div style={{
            width: `${p.progress}%`, height: "100%", background: accent,
            borderRadius: p.radius, transition: `width ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1)`,
            boxShadow: `0 0 ${p.glow}px ${accent}`,
          }} />
        </div>
      </div>
      <div>
        <ParamSlider label="进度 progress" value={p.progress} min={0} max={100} unit="%" onChange={v => setP(s => ({...s, progress: v}))} accent={accent} />
        <ParamSlider label="高度 height" value={p.height} min={2} max={16} onChange={v => setP(s => ({...s, height: v}))} accent={accent} snaps={[2, 4, 8]} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={8} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 2, 4]} />
        <ParamSlider label="过渡速度 transition" value={p.speed} min={0.1} max={2} step={0.1} unit="s" onChange={v => setP(s => ({...s, speed: v}))} accent={accent} />
        <ParamSlider label="发光 glow" value={p.glow} min={0} max={20} onChange={v => setP(s => ({...s, glow: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});

// NEW: Spinner

export default Component;
