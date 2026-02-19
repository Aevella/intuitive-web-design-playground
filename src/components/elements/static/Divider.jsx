import { memo, useState, useContext } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ thickness: 1, style: 0, opacity: 0.12, spacing: 24 });
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
  const styles = ["solid", "dashed", "dotted"];
  const st = styles[Math.round(p.style)];
  const css = `border: none;\nborder-top: ${p.thickness}px ${st} ${fg}${p.opacity.toFixed(2)});\nmargin: ${p.spacing}px 0;`;
  return (
    <ElementCard title="分割线" subtitle="Divider" focused={focused} onFocus={onFocus} layout="split"
      copyData={{ css, short: `${p.thickness}px ${st} · op:${(p.opacity*100).toFixed(0)}% · m:${p.spacing}` }}>
      <div style={{ width: "100%", padding: "8px 0" }}>
        <div style={{ width: "60%", height: 6, background: `${fg}0.12)`, borderRadius: 3, marginBottom: p.spacing }} />
        <hr style={{
          border: "none", borderTop: `${p.thickness}px ${st} ${fg}${p.opacity})`,
          margin: 0, transition: "all 0.15s",
        }} />
        <div style={{ width: "80%", height: 6, background: `${fg}0.08)`, borderRadius: 3, marginTop: p.spacing }} />
        <div style={{ width: "50%", height: 6, background: `${fg}0.08)`, borderRadius: 3, marginTop: 6 }} />
      </div>
      <div>
        <ParamSlider label="粗细 thickness" value={p.thickness} min={0.5} max={4} step={0.5} unit="px" onChange={v => setP(s => ({...s, thickness: v}))} accent={accent} snaps={[1, 2]} />
        <ParamSlider label="样式 style (实/虚/点)" value={p.style} min={0} max={2} step={1} onChange={v => setP(s => ({...s, style: v}))} accent={accent} />
        <ParamSlider label="透明度 opacity" value={p.opacity} min={0.03} max={0.4} step={0.01} onChange={v => setP(s => ({...s, opacity: v}))} accent={accent} />
        <ParamSlider label="上下间距 spacing" value={p.spacing} min={4} max={48} onChange={v => setP(s => ({...s, spacing: v}))} accent={accent} snaps={[8, 16, 24, 32]} />
      </div>
    </ElementCard>
  );
});

export default Component;
