import { memo, useState, useRef, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ duration: 0.6, maxSize: 200, opacity: 0.3, radius: 8 });
  const [ripples, setRipples] = useState([]);
  const btnRef = useRef(null);
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(20,140,120,0.7)" : "rgba(120,220,200,0.7)";
  const css = `/* Ripple effect */\nanimation: ripple ${p.duration}s ease-out;\nmax-size: ${p.maxSize}px;\nopacity: ${p.opacity};\nborder-radius: ${p.radius}px;`;
  const handleClick = (e) => {
    e.stopPropagation();
    const rect = btnRef.current.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), p.duration * 1000 + 100);
  };
  return (
    <ElementCard title="涟漪效果" subtitle="Ripple Effect" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `${p.duration}s · ${p.maxSize}px · op:${p.opacity}` }}>
      <div>
        <style>{`@keyframes rip-e { 0% { transform: translate(-50%,-50%) scale(0); opacity: ${p.opacity}; } 100% { transform: translate(-50%,-50%) scale(1); opacity: 0; } }`}</style>
        <button ref={btnRef} onClick={handleClick} style={{
          position: "relative", overflow: "hidden",
          background: accent.replace(/[\d.]+\)$/, "0.06)"), color: accent,
          border: `1px solid ${accent.replace(/[\d.]+\)$/, "0.2)")}`,
          borderRadius: p.radius, padding: "10px 28px",
          fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
        }}>
          click me
          {ripples.map(r => (
            <span key={r.id} style={{
              position: "absolute", left: r.x, top: r.y,
              width: p.maxSize, height: p.maxSize,
              background: accent.replace(/[\d.]+\)$/, "0.3)"), borderRadius: "50%",
              animation: `rip-e ${p.duration}s ease-out forwards`, pointerEvents: "none",
            }} />
          ))}
        </button>
      </div>
      <div>
        <ParamSlider label="扩散时间 duration" value={p.duration} min={0.2} max={1.5} step={0.05} unit="s" onChange={v => setP(s => ({...s, duration: v}))} accent={accent} />
        <ParamSlider label="最大尺寸 max-size" value={p.maxSize} min={50} max={400} onChange={v => setP(s => ({...s, maxSize: v}))} accent={accent} />
        <ParamSlider label="起始不透明度 opacity" value={p.opacity} min={0.1} max={0.6} step={0.05} onChange={v => setP(s => ({...s, opacity: v}))} accent={accent} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={24} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 8]} />
      </div>
    </ElementCard>
  );
});

export default Component;
