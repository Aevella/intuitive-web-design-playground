import { memo, useState, useContext, useCallback } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ radius: 12, duration: 3, slideIn: 20, blur: 10, opacity: 0.9, width: 260 });
  const [visible, setVisible] = useState(true);
  const [animPhase, setAnimPhase] = useState("in");
  const { lum } = useContext(BgContext);
  const accent = lum > 0.5 ? "rgba(200,120,40,0.8)" : "rgba(255,180,100,0.7)";
  const toastBg = lum > 0.5 ? `rgba(255,255,255,${p.opacity})` : `rgba(30,28,24,${p.opacity})`;
  const fg = lumToFg(lum);
  const css = `border-radius: ${p.radius}px;\nbackdrop-filter: blur(${p.blur}px);\nwidth: ${p.width}px;\nanimation-duration: 0.4s;\n/* stays for ${p.duration}s, slides ${p.slideIn}px */`;
  const triggerToast = useCallback(() => {
    setVisible(true); setAnimPhase("in");
    const t = setTimeout(() => { setAnimPhase("out"); setTimeout(() => setVisible(false), 400); }, p.duration * 1000);
    return () => clearTimeout(t);
  }, [p.duration]);
  return (
    <ElementCard title="飘窗通知" subtitle="Toast / Notification" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `r:${p.radius} · ${p.duration}s · blur:${p.blur}` }}>
      <div style={{ position: "relative", width: "100%", minHeight: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, overflow: "hidden" }}>
        {visible && (
          <div style={{
            width: `min(${p.width}px, 100%)`, maxWidth: "100%", boxSizing: "border-box",
            padding: "12px 16px", background: toastBg,
            backdropFilter: `blur(${p.blur}px)`,
            border: `1px solid ${accent.replace(/[\d.]+\)$/, "0.15)")}`,
            borderRadius: p.radius, boxShadow: `0 8px 32px rgba(0,0,0,${lum > 0.5 ? 0.1 : 0.4})`,
            transform: animPhase === "in" ? "translateY(0) scale(1)" : `translateY(-${p.slideIn}px) scale(0.98)`,
            filter: animPhase === "in" ? "blur(0px)" : "blur(1px)",
            opacity: animPhase === "in" ? 1 : 0, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <div style={{ fontSize: 12, color: accent, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>通知标题</div>
            <div style={{ fontSize: 10, color: `${fg}0.3)`, fontFamily: "'IBM Plex Mono', monospace" }}>{p.duration}s 后消失</div>
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); triggerToast(); }} style={{
          background: "transparent", border: `1px solid ${accent.replace(/[\d.]+\)$/, "0.2)")}`,
          color: accent, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
          padding: "6px 14px", borderRadius: 6, cursor: "pointer",
        }}>触发 trigger</button>
      </div>
      <div>
        <ParamSlider label="停留时长 duration" value={p.duration} min={1} max={8} step={0.5} unit="s" onChange={v => setP(s => ({...s, duration: v}))} accent={accent} snaps={[2, 3, 5]} />
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={24} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 8, 12]} />
        <ParamSlider label="滑入距离 slide-distance" value={p.slideIn} min={0} max={60} onChange={v => setP(s => ({...s, slideIn: v}))} accent={accent} />
        <ParamSlider label="背景模糊 backdrop-blur" value={p.blur} min={0} max={30} onChange={v => setP(s => ({...s, blur: v}))} accent={accent} />
        <ParamSlider label="背景不透明度 bg-opacity" value={p.opacity} min={0.3} max={1} step={0.05} onChange={v => setP(s => ({...s, opacity: v}))} accent={accent} />
        <ParamSlider label="宽度 width" value={p.width} min={160} max={360} onChange={v => setP(s => ({...s, width: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
