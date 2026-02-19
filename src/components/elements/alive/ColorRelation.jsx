import { memo, useState } from "react";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ h1: 220, s1: 60, l1: 60, h2: 340, s2: 60, l2: 60 });
  const c1 = `hsl(${p.h1},${p.s1}%,${p.l1}%)`; const c2 = `hsl(${p.h2},${p.s2}%,${p.l2}%)`;
  const diff = Math.abs(p.h1 - p.h2); const hueDist = Math.min(diff, 360 - diff);
  const css = `/* Color A */ hsl(${p.h1}, ${p.s1}%, ${p.l1}%)\n/* Color B */ hsl(${p.h2}, ${p.s2}%, ${p.l2}%)\n/* Hue distance: ${hueDist}° */`;
  return (
    <ElementCard title="色彩关系" subtitle="Color Relation" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `Δhue:${hueDist}° · Δlight:${Math.abs(p.l1-p.l2)}` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
        <div style={{ display: "flex", gap: 2, width: "100%", height: 70, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ flex: 1, background: c1, transition: "background 0.15s" }} />
          <div style={{ flex: 1, background: c2, transition: "background 0.15s" }} />
        </div>
        <div style={{ width: "100%", height: 20, borderRadius: 4, background: `linear-gradient(to right, ${c1}, ${c2})` }} />
        <div style={{ display: "flex", gap: 6, width: "100%" }}>
          <div style={{ flex: 1, background: c1, borderRadius: 6, padding: "6px 10px" }}>
            <span style={{ color: c2, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>Aa</span>
          </div>
          <div style={{ flex: 1, background: c2, borderRadius: 6, padding: "6px 10px" }}>
            <span style={{ color: c1, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>Aa</span>
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>— A</div>
        <ParamSlider label="hue" value={p.h1} min={0} max={360} unit="°" onChange={v => setP(s => ({...s, h1: v}))} accent={c1} />
        <ParamSlider label="sat" value={p.s1} min={0} max={100} unit="%" onChange={v => setP(s => ({...s, s1: v}))} accent={c1} />
        <ParamSlider label="light" value={p.l1} min={10} max={90} unit="%" onChange={v => setP(s => ({...s, l1: v}))} accent={c1} />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6, marginTop: 10 }}>— B</div>
        <ParamSlider label="hue" value={p.h2} min={0} max={360} unit="°" onChange={v => setP(s => ({...s, h2: v}))} accent={c2} />
        <ParamSlider label="sat" value={p.s2} min={0} max={100} unit="%" onChange={v => setP(s => ({...s, s2: v}))} accent={c2} />
        <ParamSlider label="light" value={p.l2} min={10} max={90} unit="%" onChange={v => setP(s => ({...s, l2: v}))} accent={c2} />
        <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[{ name:"互补",fn:()=>setP(s=>({...s,h2:(s.h1+180)%360,s2:s.s1,l2:s.l1}))},{ name:"类似",fn:()=>setP(s=>({...s,h2:(s.h1+30)%360,s2:s.s1,l2:s.l1}))},{ name:"三等分",fn:()=>setP(s=>({...s,h2:(s.h1+120)%360,s2:s.s1,l2:s.l1}))},{ name:"深浅",fn:()=>setP(s=>({...s,h2:s.h1,s2:s.s1,l2:Math.min(90,s.l1+25)}))}].map(pr => (
            <button key={pr.name} onClick={(e)=>{e.stopPropagation();pr.fn();}} style={{ background:"rgba(200,180,255,0.06)", border:"1px solid rgba(200,180,255,0.12)", color:"rgba(200,180,255,0.5)", fontSize:9, fontFamily:"'IBM Plex Mono', monospace", padding:"3px 7px", borderRadius:4, cursor:"pointer" }}>{pr.name}</button>
          ))}
        </div>
      </div>
    </ElementCard>
  );
});

export default Component;
