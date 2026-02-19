import { memo, useState, useRef, useCallback, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ x1: 0.16, y1: 1.0, x2: 0.3, y2: 1.0, duration: 0.8 });
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(180,120,40,0.85)" : "rgba(255,200,120,0.8)";
  const fg = lumToFg(lum);
  const svgW = 200, svgH = 200, pad = 20;
  const toSvg = (x, y) => [pad + x * (svgW - 2 * pad), svgH - pad - y * (svgH - 2 * pad)];
  const [sx, sy] = toSvg(0, 0); const [ex, ey] = toSvg(1, 1);
  const [c1x, c1y] = toSvg(p.x1, p.y1); const [c2x, c2y] = toSvg(p.x2, p.y2);
  const cb = useCallback((t, p0, p1, p2, p3) => { const u = 1 - t; return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3; }, []);
  const getEY = useCallback((lt) => { let lo = 0, hi = 1, m; for (let i = 0; i < 20; i++) { m = (lo + hi) / 2; if (cb(m, 0, p.x1, p.x2, 1) < lt) lo = m; else hi = m; } return cb(m, 0, p.y1, p.y2, 1); }, [p.x1, p.y1, p.x2, p.y2, cb]);
  const play = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPlaying(true); const start = performance.now(); const dur = p.duration * 1000;
    const step = (now) => { const t = Math.min((now - start) / dur, 1); setProgress(t); if (t < 1) animRef.current = requestAnimationFrame(step); else setPlaying(false); };
    animRef.current = requestAnimationFrame(step);
  };
  const eY = getEY(progress);
  let curvePath = "";
  for (let i = 0; i <= 60; i++) { const t = i / 60; const [px, py] = toSvg(cb(t, 0, p.x1, p.x2, 1), cb(t, 0, p.y1, p.y2, 1)); curvePath += (i === 0 ? "M" : "L") + `${px},${py} `; }
  const css = `transition-timing-function: cubic-bezier(${p.x1}, ${p.y1}, ${p.x2}, ${p.y2});\ntransition-duration: ${p.duration}s;`;
  return (
    <ElementCard title="缓动曲线" subtitle="Easing / Bezier Curve" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `cubic-bezier(${p.x1},${p.y1},${p.x2},${p.y2})` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
        <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
          <rect x={pad} y={pad} width={svgW-2*pad} height={svgH-2*pad} fill="none" stroke={`${fg}0.05)`} strokeWidth={1} />
          <line x1={pad} y1={svgH-pad} x2={svgW-pad} y2={pad} stroke={`${fg}0.04)`} strokeWidth={1} strokeDasharray="4,4" />
          <line x1={sx} y1={sy} x2={c1x} y2={c1y} stroke={accent.replace(/[\d.]+\)$/,"0.2)")} strokeWidth={1} />
          <line x1={ex} y1={ey} x2={c2x} y2={c2y} stroke={accent.replace(/[\d.]+\)$/,"0.2)")} strokeWidth={1} />
          <path d={curvePath} fill="none" stroke={accent} strokeWidth={2} />
          <circle cx={c1x} cy={c1y} r={5} fill={accent.replace(/[\d.]+\)$/,"0.4)")} stroke={accent} strokeWidth={1.5} />
          <circle cx={c2x} cy={c2y} r={5} fill={accent.replace(/[\d.]+\)$/,"0.4)")} stroke={accent} strokeWidth={1.5} />
          {playing && <circle cx={pad + progress * (svgW-2*pad)} cy={svgH - pad - eY * (svgH-2*pad)} r={6} fill={accent} style={{ filter: `drop-shadow(0 0 6px ${accent})` }} />}
        </svg>
        <div style={{ width: "100%", position: "relative", height: 28 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: `${fg}0.06)` }} />
          <div style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", left: `${Math.max(0, Math.min(1, eY)) * 100}%`, width: 14, height: 14, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}`, transition: playing ? "none" : `left ${p.duration}s` }} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); play(); }} style={{
          background: "transparent", border: `1px solid ${accent.replace(/[\d.]+\)$/,"0.2)")}`,
          color: accent, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
          padding: "5px 12px", borderRadius: 6, cursor: "pointer",
        }}>▶ play</button>
      </div>
      <div>
        <ParamSlider label="cp1-x" value={p.x1} min={0} max={1} step={0.01} onChange={v => setP(s => ({...s, x1: v}))} accent={accent} />
        <ParamSlider label="cp1-y" value={p.y1} min={-0.5} max={2} step={0.01} onChange={v => setP(s => ({...s, y1: v}))} accent={accent} />
        <ParamSlider label="cp2-x" value={p.x2} min={0} max={1} step={0.01} onChange={v => setP(s => ({...s, x2: v}))} accent={accent} />
        <ParamSlider label="cp2-y" value={p.y2} min={-0.5} max={2} step={0.01} onChange={v => setP(s => ({...s, y2: v}))} accent={accent} />
        <ParamSlider label="duration" value={p.duration} min={0.1} max={3} step={0.1} unit="s" onChange={v => setP(s => ({...s, duration: v}))} accent={accent} />
        <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[{ name:"ease",v:[.25,.1,.25,1]},{ name:"ease-in-out",v:[.42,0,.58,1]},{ name:"overshoot",v:[.16,1,.3,1.6]},{ name:"bounce",v:[.34,1.56,.64,1]},{ name:"linear",v:[0,0,1,1]},{ name:"snap",v:[.5,0,0,1]}].map(pr => (
            <button key={pr.name} onClick={(e) => { e.stopPropagation(); setP(s => ({...s,x1:pr.v[0],y1:pr.v[1],x2:pr.v[2],y2:pr.v[3]})); }}
              style={{ background: accent.replace(/[\d.]+\)$/,"0.06)"), border: `1px solid ${accent.replace(/[\d.]+\)$/,"0.12)")}`, color: accent.replace(/[\d.]+\)$/,"0.5)"), fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", padding: "3px 7px", borderRadius: 4, cursor: "pointer" }}>{pr.name}</button>
          ))}
        </div>
      </div>
    </ElementCard>
  );
});

export default Component;
