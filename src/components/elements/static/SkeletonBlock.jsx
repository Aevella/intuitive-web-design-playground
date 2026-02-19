import { memo, useContext, useEffect, useMemo, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({
    speed: 1.2,
    direction: "x",
    contrast: 0.12,
    sweep: 40,
    radius: 8,
    rows: 4,
    gap: 10,
  });
  const [phase, setPhase] = useState(0);

  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(70,100,180,0.62)" : "rgba(185,210,255,0.62)";

  useEffect(() => {
    const id = setInterval(() => {
      setPhase((v) => (v + p.speed * 0.02) % 1);
    }, 16);
    return () => clearInterval(id);
  }, [p.speed]);

  const rowWidths = useMemo(() => {
    const list = [];
    for (let i = 0; i < p.rows; i += 1) {
      if (i === p.rows - 1) list.push("58%");
      else if (i % 3 === 1) list.push("90%");
      else list.push("100%");
    }
    return list;
  }, [p.rows]);

  const baseAlpha = lum > 0.5 ? 0.07 : 0.11;
  const hiAlpha = Math.min(baseAlpha + p.contrast, 0.42);

  const shimmerStyle = p.direction === "x"
    ? {
        left: `${-35 + phase * 170}%`,
        top: 0,
        bottom: 0,
        width: `${p.sweep}%`,
        background: `linear-gradient(90deg, transparent 0%, ${fg}${hiAlpha.toFixed(3)}) 50%, transparent 100%)`,
      }
    : {
        left: 0,
        right: 0,
        height: `${p.sweep}%`,
        top: `${-35 + phase * 170}%`,
        background: `linear-gradient(180deg, transparent 0%, ${fg}${hiAlpha.toFixed(3)}) 50%, transparent 100%)`,
      };

  const css = `/* skeleton loading */\nborder-radius: ${p.radius}px;\n--skeleton-gap: ${p.gap}px;\n--skeleton-rows: ${p.rows};\n--shimmer-direction: ${p.direction === "x" ? "left-to-right" : "top-to-bottom"};\n--shimmer-speed: ${p.speed.toFixed(2)};\n--shimmer-contrast: ${p.contrast.toFixed(2)};\n--shimmer-sweep: ${p.sweep}%;`;

  return (
    <ElementCard
      title="骨架屏"
      subtitle="Skeleton / Loading State"
      focused={focused}
      onFocus={onFocus}
      layout="split"
      copyData={{ css, short: `rows:${p.rows} · speed:${p.speed.toFixed(1)} · ${p.direction === "x" ? "L→R" : "T→B"}` }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 240,
          borderRadius: p.radius,
          overflow: "hidden",
          padding: 14,
          background: `${fg}${(baseAlpha * 0.6).toFixed(3)})`,
          border: `1px solid ${fg}0.06)`,
          position: "relative",
        }}
      >
        <div style={{ display: "grid", gap: p.gap }}>
          {rowWidths.map((w, i) => (
            <div
              key={i}
              style={{
                height: i === 0 ? 12 : 10,
                borderRadius: Math.min(p.radius, 999),
                width: w,
                background: `${fg}${baseAlpha.toFixed(3)})`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", ...shimmerStyle }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <ParamSlider label="闪烁速度 shimmer-speed" value={p.speed} min={0.3} max={2.4} step={0.05} onChange={(v) => setP((s) => ({ ...s, speed: v }))} accent={accent} snaps={[0.5, 1.0, 1.6]} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[
            { id: "x", label: "左→右" },
            { id: "y", label: "上→下" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setP((s) => ({ ...s, direction: d.id }))}
              style={{
                border: `1px solid ${fg}${p.direction === d.id ? "0.22)" : "0.10)"}`,
                background: p.direction === d.id ? `${fg}0.10)` : "transparent",
                color: `${fg}${p.direction === d.id ? "0.75)" : "0.35)"}`,
                borderRadius: 7,
                padding: "6px 10px",
                fontSize: 10,
                fontFamily: "'IBM Plex Mono', monospace",
                cursor: "pointer",
              }}
            >
              波纹方向 {d.label}
            </button>
          ))}
        </div>
        <ParamSlider label="亮暗差 contrast" value={p.contrast} min={0.02} max={0.28} step={0.01} onChange={(v) => setP((s) => ({ ...s, contrast: v }))} accent={accent} />
        <ParamSlider label={p.direction === "x" ? "光带长度 sweep-length" : "光带宽度 sweep-width"} value={p.sweep} min={16} max={72} step={1} unit="%" onChange={(v) => setP((s) => ({ ...s, sweep: v }))} accent={accent} snaps={[24, 40, 56]} />
        <ParamSlider label="圆角 radius" value={p.radius} min={0} max={16} onChange={(v) => setP((s) => ({ ...s, radius: v }))} accent={accent} snaps={[0, 6, 10]} />
        <ParamSlider label="行数 rows" value={p.rows} min={2} max={6} step={1} onChange={(v) => setP((s) => ({ ...s, rows: v }))} accent={accent} />
        <ParamSlider label="行间距 row-gap" value={p.gap} min={4} max={18} step={1} onChange={(v) => setP((s) => ({ ...s, gap: v }))} accent={accent} snaps={[6, 10, 14]} />
      </div>
    </ElementCard>
  );
});

export default Component;
