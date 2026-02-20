import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ scale: 1.05, lift: 4, glowOn: 15, speed: 0.25, radius: 10 });
  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(100,60,180,0.7)" : "rgba(200,160,255,0.7)";
  const active = hovered || locked;
  const glowColor = accent.replace(/[\d.]+\)$/, "0.2)");
  const css = `transform: scale(${p.scale}) translateY(-${p.lift}px); /* on hover/tap */\nbox-shadow: 0 ${p.lift * 2}px ${p.glowOn}px ${glowColor};\ntransition: all ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1);\nborder-radius: ${p.radius}px;`;
  return (
    <ElementCard title="悬停反馈" subtitle="Hover Effect" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `×${p.scale} · ↑${p.lift}px · ${p.speed}s` }}>
      <button
        onMouseEnter={() => { if (!locked) setHovered(true); }}
        onMouseLeave={() => { if (!locked) setHovered(false); }}
        onClick={(e) => {
          e.stopPropagation();
          setLocked((s) => {
            const next = !s;
            if (!next) setHovered(false);
            return next;
          });
        }}
        style={{
        background: accent.replace(/[\d.]+\)$/, "0.08)"), color: accent,
        border: `1px solid ${accent.replace(/[\d.]+\)$/, active ? "0.4)" : "0.15)")}`,
        borderRadius: p.radius, padding: "10px 24px",
        fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
        transform: active ? `scale(${p.scale}) translateY(-${p.lift}px)` : "scale(1) translateY(0)",
        boxShadow: active ? `0 ${p.lift * 2}px ${p.glowOn}px ${glowColor}` : "none",
        transition: `all ${p.speed}s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}>{locked ? "hover locked" : "hover me"}</button>
      <div>
        <ParamSlider label="放大比例 scale" value={p.scale} min={1} max={1.2} step={0.01} unit="x" onChange={v => setP(s => ({...s, scale: v}))} accent={accent} />
        <ParamSlider label="悬浮高度 lift" value={p.lift} min={0} max={12} onChange={v => setP(s => ({...s, lift: v}))} accent={accent} />
        <ParamSlider label="光晕强度 glow" value={p.glowOn} min={0} max={30} onChange={v => setP(s => ({...s, glowOn: v}))} accent={accent} />
        <ParamSlider label="过渡速度 speed" value={p.speed} min={0.05} max={0.6} step={0.01} unit="s" onChange={v => setP(s => ({...s, speed: v}))} accent={accent} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={24} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 8, 12]} />
      </div>
    </ElementCard>
  );
});

export default Component;
