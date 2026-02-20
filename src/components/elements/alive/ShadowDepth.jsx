import { memo, useContext, useMemo, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({
    lift: 42,
    nearAlpha: 0.28,
    farBlur: 42,
    warmth: 0,
    angle: 35,
  });

  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(70,100,180,0.62)" : "rgba(190,210,255,0.62)";

  const rad = (p.angle * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  const nearX = Math.round(dx * (p.lift * 0.18));
  const nearY = Math.round(dy * (p.lift * 0.36));
  const farX = Math.round(dx * (p.lift * 0.08));
  const farY = Math.round(dy * (p.lift * 0.75));

  const coolHue = 222;
  const warmHue = 24;
  const hue = p.warmth >= 0 ? coolHue + (warmHue - coolHue) * p.warmth : coolHue + (260 - coolHue) * Math.abs(p.warmth);
  const sat = 18 + Math.abs(p.warmth) * 20;
  const light = lum > 0.5 ? 34 : 12;

  const nearA = clamp(p.nearAlpha * (0.35 + p.lift / 120), 0.04, 0.5);
  const farA = clamp((p.nearAlpha * 0.6) * (0.3 + p.lift / 100), 0.03, 0.35);

  const shadowColor = `hsla(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light}%, `;
  const shadow = `${nearX}px ${nearY}px ${Math.round(10 + p.lift * 0.35)}px ${shadowColor}${nearA.toFixed(3)}), ${farX}px ${farY}px ${Math.round(p.farBlur)}px ${shadowColor}${farA.toFixed(3)})`;

  const css = `box-shadow: ${shadow};\n/* lift:${p.lift} · angle:${p.angle}° · warmth:${p.warmth.toFixed(2)} */`;

  const glowBg = useMemo(() => {
    const alpha = lum > 0.5 ? 0.06 : 0.1;
    return `${fg}${alpha.toFixed(3)})`;
  }, [fg, lum]);

  return (
    <ElementCard
      title="阴影层次"
      subtitle="Shadow Depth / Elevation"
      focused={focused}
      onFocus={onFocus}
      copyData={{ css, short: `lift:${p.lift} · angle:${p.angle}° · far-blur:${Math.round(p.farBlur)}` }}
    >
      <div style={{ width: "100%", maxWidth: 240, display: "grid", placeItems: "center", minHeight: 160 }}>
        <div
          style={{
            width: 170,
            height: 106,
            borderRadius: 14,
            border: `1px solid ${fg}0.10)`,
            background: `linear-gradient(160deg, ${fg}0.12), ${fg}0.05))`,
            boxShadow: shadow,
            transition: "all 0.15s",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 15% 0%, ${fg}0.12), transparent 55%)` }} />
          <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 10, color: `${fg}0.45)`, fontFamily: "'IBM Plex Mono', monospace" }}>
            elevation {Math.round((p.lift / 100) * 9)}
          </div>
        </div>
        <div style={{ marginTop: 12, width: 150, height: 10, borderRadius: 999, background: glowBg }} />
      </div>

      <div>
        <ParamSlider label="浮起程度 lift" value={p.lift} min={0} max={100} onChange={(v) => setP((s) => ({ ...s, lift: v }))} accent={accent} snaps={[0, 24, 48, 72]} />
        <ParamSlider label="近层强度 near-layer" value={p.nearAlpha} min={0.08} max={0.45} step={0.01} onChange={(v) => setP((s) => ({ ...s, nearAlpha: v }))} accent={accent} />
        <ParamSlider label="远层扩散 far-blur" value={p.farBlur} min={14} max={90} onChange={(v) => setP((s) => ({ ...s, farBlur: v }))} accent={accent} snaps={[24, 42, 64]} />
        <ParamSlider label="色温 warmth" value={p.warmth} min={-1} max={1} step={0.02} onChange={(v) => setP((s) => ({ ...s, warmth: v }))} accent={accent} snaps={[-0.5, 0, 0.5]} />
        <ParamSlider label="角度 angle" value={p.angle} min={-160} max={160} unit="°" onChange={(v) => setP((s) => ({ ...s, angle: v }))} accent={accent} snaps={[-45, 0, 45, 90]} />
      </div>
    </ElementCard>
  );
});

export default Component;
