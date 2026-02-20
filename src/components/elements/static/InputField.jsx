import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ radius: 8, borderW: 1, padX: 14, padY: 10, size: 14, focusGlow: 8, placeholderOp: 0.3 });
  const [isFocused, setIsFocused] = useState(false);
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(40,100,200,0.7)" : "rgba(100,160,255,0.7)";
  const focusGlowColor = accent.replace(/[\d.]+\)$/, "0.3)");
  const css = `border-radius: ${p.radius}px;\nborder: ${p.borderW}px solid ${fg}0.15);\npadding: ${p.padY}px ${p.padX}px;\nfont-size: ${p.size}px;\ncolor: ${fg}0.7);\n&::placeholder { color: ${fg}${p.placeholderOp.toFixed(2)}); }\n&:focus { border-color: ${accent}; box-shadow: 0 0 ${p.focusGlow}px ${focusGlowColor}; }`;
  return (
    <ElementCard title="输入框" subtitle="Input Field" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `r:${p.radius} · focus-glow:${p.focusGlow} · ${p.size}px` }}>
      <div style={{ width: "100%", maxWidth: 220 }}>
        <input
          type="text" placeholder="请输入内容..."
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "transparent",
            color: `${fg}0.7)`,
            border: `${p.borderW}px solid ${isFocused ? accent : `${fg}0.15)`}`,
            borderRadius: p.radius,
            padding: `${p.padY}px ${p.padX}px`,
            fontSize: p.size, fontFamily: "'IBM Plex Mono', monospace",
            outline: "none",
            boxShadow: isFocused ? `0 0 ${p.focusGlow}px ${focusGlowColor}` : "none",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <style>{`input::placeholder { color: ${fg}${p.placeholderOp}) !important; font-family: 'IBM Plex Mono', monospace; }`}</style>
      </div>
      <div>
        <ParamSlider label="圆角 border-radius" value={p.radius} min={0} max={24} onChange={v => setP(s => ({...s, radius: v}))} accent={accent} snaps={[0, 4, 8, 16]} />
        <ParamSlider label="边框粗细 border-width" value={p.borderW} min={0} max={3} step={0.5} onChange={v => setP(s => ({...s, borderW: v}))} accent={accent} snaps={[0, 1, 2]} />
        <ParamSlider label="水平内距 padding-x" value={p.padX} min={6} max={24} onChange={v => setP(s => ({...s, padX: v}))} accent={accent} />
        <ParamSlider label="垂直内距 padding-y" value={p.padY} min={4} max={18} onChange={v => setP(s => ({...s, padY: v}))} accent={accent} />
        <ParamSlider label="字号 font-size" value={p.size} min={10} max={20} onChange={v => setP(s => ({...s, size: v}))} accent={accent} snaps={[12, 14, 16]} />
        <ParamSlider label="聚焦光晕 focus-glow" value={p.focusGlow} min={0} max={24} onChange={v => setP(s => ({...s, focusGlow: v}))} accent={accent} />
        <ParamSlider label="占位符透明度 placeholder" value={p.placeholderOp} min={0.1} max={0.6} step={0.05} onChange={v => setP(s => ({...s, placeholderOp: v}))} accent={accent} />
      </div>
    </ElementCard>
  );
});


export default Component;
