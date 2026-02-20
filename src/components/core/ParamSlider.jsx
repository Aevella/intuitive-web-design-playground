import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BgContext } from "../../context/BgContext";
import { createFg } from "../../utils/color";
import { UI_TOKENS } from "../../utils/uiTokens";

function ParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  accent = "rgba(255,255,255,0.6)",
  snaps = [],
}) {
  const range = max - min;
  const pct = range > 0 ? ((value - min) / range) * 100 : 0;
  const { lum } = useContext(BgContext);
  const fg = createFg(lum);
  const [dragging, setDragging] = useState(false);
  const rafRef = useRef(0);
  const nextValueRef = useRef(value);

  const formattedValue = useMemo(() => {
    if (typeof value !== "number") return value;
    if (step < 0.1) return value.toFixed(2);
    if (step < 1) return value.toFixed(1);
    return value;
  }, [value, step]);

  const setDragOn = () => setDragging(true);
  const setDragOff = () => setDragging(false);

  const handleChange = (e) => {
    let v = parseFloat(e.target.value);
    for (const s of snaps) {
      if (Math.abs(v - s) < range * 0.02) {
        v = s;
        break;
      }
    }
    nextValueRef.current = v;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        onChange(nextValueRef.current);
      });
    }
  };

  useEffect(() => {
    if (!dragging) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [dragging]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: fg(0.35), fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.03em" }}>{label}</span>
        <span style={{ fontSize: 11, color: accent, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
          {formattedValue}{unit}
        </span>
      </div>
      <div style={{ position: "relative", height: UI_TOKENS.slider.hitHeight, display: "flex", alignItems: "center", touchAction: "pan-x" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: UI_TOKENS.slider.trackTop, height: 2, background: fg(0.08), borderRadius: 1 }} />
        <div style={{ position: "absolute", left: 0, top: UI_TOKENS.slider.trackTop, width: `${pct}%`, height: 2, background: accent, borderRadius: 1 }} />
        {snaps.map((s, i) => {
          const sp = ((s - min) / (max - min)) * 100;
          return <div key={i} style={{ position: "absolute", left: `${sp}%`, top: UI_TOKENS.slider.trackTop - 2, width: 3, height: 6, background: fg(0.1), borderRadius: 1, transform: "translateX(-50%)", pointerEvents: "none" }} />;
        })}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onPointerDown={setDragOn}
          onPointerUp={setDragOff}
          onPointerCancel={setDragOff}
          onTouchStart={setDragOn}
          onTouchEnd={setDragOff}
          onBlur={setDragOff}
          style={{
            position: "absolute",
            left: -UI_TOKENS.slider.hitXPad,
            width: `calc(100% + ${UI_TOKENS.slider.hitXPad * 2}px)`,
            height: UI_TOKENS.slider.hitHeight,
            opacity: 0,
            cursor: "pointer",
            margin: 0,
            touchAction: "pan-x",
          }}
        />
        <div style={{
          position: "absolute", left: `${pct}%`, top: UI_TOKENS.slider.thumbTop, transform: "translate(-50%, -50%)",
          width: 10, height: 10, borderRadius: "50%", background: accent,
          boxShadow: `0 0 8px ${accent}`, pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

export default memo(ParamSlider);
