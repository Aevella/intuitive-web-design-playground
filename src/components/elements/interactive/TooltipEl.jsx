import { memo, useState, useRef, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ radius: 6, delay: 0.3, maxW: 180, padX: 10, padY: 6, arrow: 6, offset: 8 });
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);
  const { lum } = useContext(BgContext);
  const _unused = null;
  const tipBg = lum > 0.5 ? "rgba(30,30,40,0.92)" : "rgba(245,245,255,0.95)";
  const tipFg = lum > 0.5 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)";
  const fg = lumToFg(lum);
  const css = `border-radius: ${p.radius}px;\nmax-width: ${p.maxW}px;\npadding: ${p.padY}px ${p.padX}px;\ntransition-delay: ${p.delay}s;\n/* arrow: ${p.arrow}px, offset: ${p.offset}px */`;
  const handleEnter = () => { timerRef.current = setTimeout(() => setShow(true), p.delay * 1000); };
  const handleLeave = () => { clearTimeout(timerRef.current); setShow(false); };
  return (
    <ElementCard title="工具提示" subtitle="Tooltip" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `r:${p.radius} · delay:${p.delay}s · ${p.maxW}px` }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Tooltip */}
        <div style={{
          position: "absolute", bottom: `calc(100% + ${p.offset}px)`,
          background: tipBg, color: tipFg,
          borderRadius: p.radius, padding: `${p.padY}px ${p.padX}px`,
          fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
          maxWidth: p.maxW, textAlign: "center",
          boxShadow: `0 4px 16px rgba(0,0,0,${lum > 0.5 ? 0.15 : 0.4})`,
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(4px)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          提示内容 tooltip text
          {/* Arrow */}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: `${p.arrow}px solid transparent`,
            borderRight: `${p.arrow}px solid transparent`,
            borderTop: `${p.arrow}px solid ${tipBg}`,
          }} />
        </div>
        <button
          onMouseEnter={handleEnter} onMouseLeave={handleLeave}
          onClick={e => e.stopPropagation()}
          style={{
            background: `${fg}0.06)`, color: `${fg}0.5)`,
            border: `1px solid ${fg}0.12)`,
            borderRadius: 8, padding: "10px 24px",
            fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
          }}>hover for tooltip</button>
      </div>
      <div>
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={16} onChange={v => setP(s => ({...s, radius: v}))} accent={`${fg}0.5)`} snaps={[0, 4, 8]} />
        <ParamSlider label="延迟出现 delay" value={p.delay} min={0} max={1} step={0.05} unit="s" onChange={v => setP(s => ({...s, delay: v}))} accent={`${fg}0.5)`} />
        <ParamSlider label="最大宽度 max-width" value={p.maxW} min={80} max={300} unit="px" onChange={v => setP(s => ({...s, maxW: v}))} accent={`${fg}0.5)`} />
        <ParamSlider label="水平内距 padding-x" value={p.padX} min={4} max={20} onChange={v => setP(s => ({...s, padX: v}))} accent={`${fg}0.5)`} />
        <ParamSlider label="垂直内距 padding-y" value={p.padY} min={2} max={14} onChange={v => setP(s => ({...s, padY: v}))} accent={`${fg}0.5)`} />
        <ParamSlider label="箭头大小 arrow" value={p.arrow} min={0} max={10} onChange={v => setP(s => ({...s, arrow: v}))} accent={`${fg}0.5)`} />
        <ParamSlider label="偏移距离 offset" value={p.offset} min={2} max={20} onChange={v => setP(s => ({...s, offset: v}))} accent={`${fg}0.5)`} />
      </div>
    </ElementCard>
  );
});

export default Component;
