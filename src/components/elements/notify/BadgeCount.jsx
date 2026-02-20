import { memo, useContext, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({ count: 1, size: 20, offsetX: 6, offsetY: -6, bounceAmp: 0.2, bounceDuration: 0.36, hue: 0 });
  const [tick, setTick] = useState(0);
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = `hsla(${p.hue}, 90%, ${lum > 0.5 ? 42 : 62}%, 0.8)`;

  const displayCount = p.count > 99 ? "99+" : p.count;
  const css = `--badge-size: ${p.size}px;\n--badge-offset: ${p.offsetX}px ${p.offsetY}px;\nanimation: badge-pop ${p.bounceDuration}s;\n--badge-color: hsl(${p.hue} 90% 55%);`;

  return (
    <ElementCard title="数字徽标" subtitle="Badge Count" focused={focused} onFocus={onFocus}
      copyData={{ css, short: `count:${displayCount} · size:${p.size} · bounce:${p.bounceDuration.toFixed(2)}s` }}>
      <div style={{ width: "100%", maxWidth: 220, display: "grid", placeItems: "center" }}>
        <button onClick={(e) => { e.stopPropagation(); setTick((v) => v + 1); }} style={{
          width: 76, height: 76, borderRadius: 18, border: `1px solid ${fg}0.1)`, background: `${fg}0.05)`, position: "relative", cursor: "pointer",
        }}>
          <span style={{ color: `${fg}0.45)`, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>APP</span>
          {p.count > 0 && (
            <span key={`${tick}-${displayCount}`} style={{
              position: "absolute", top: p.offsetY, right: p.offsetX,
              minWidth: p.size, height: p.size, borderRadius: 999, padding: "0 6px",
              background: accent, color: "white", fontSize: 10, fontWeight: 600,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transformOrigin: "center", animation: `badge-pop ${p.bounceDuration}s cubic-bezier(0.2,1.2,0.2,1)`,
              boxShadow: `0 4px 14px ${accent.replace("0.8", "0.35")}`,
            }}>{displayCount}</span>
          )}
        </button>
        <style>{`@keyframes badge-pop {0%{transform:scale(${1 - p.bounceAmp});}50%{transform:scale(${1 + p.bounceAmp});}100%{transform:scale(1);}}`}</style>
      </div>
      <div>
        <ParamSlider label="数字 count" value={p.count} min={0} max={120} step={1} onChange={(v) => setP((s) => ({ ...s, count: v }))} accent={accent} snaps={[0, 1, 9, 99]} />
        <ParamSlider label="尺寸 size" value={p.size} min={14} max={30} onChange={(v) => setP((s) => ({ ...s, size: v }))} accent={accent} />
        <ParamSlider label="水平偏移 offset-x" value={p.offsetX} min={-8} max={18} onChange={(v) => setP((s) => ({ ...s, offsetX: v }))} accent={accent} />
        <ParamSlider label="垂直偏移 offset-y" value={p.offsetY} min={-16} max={8} onChange={(v) => setP((s) => ({ ...s, offsetY: v }))} accent={accent} />
        <ParamSlider label="弹跳幅度 bounce-amp" value={p.bounceAmp} min={0} max={0.45} step={0.01} onChange={(v) => setP((s) => ({ ...s, bounceAmp: v }))} accent={accent} />
        <ParamSlider label="弹跳时长 bounce-duration" value={p.bounceDuration} min={0.15} max={0.8} step={0.01} unit="s" onChange={(v) => setP((s) => ({ ...s, bounceDuration: v }))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
