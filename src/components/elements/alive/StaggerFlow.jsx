import { memo, useContext, useMemo, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import { monoFont, optionChipStyle } from "../../../utils/stylePresets";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const MOTIONS = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  overshoot: "cubic-bezier(0.2, 1.25, 0.2, 1)",
  linear: "linear",
};

const DIR_OFFSET = {
  left: { x: -26, y: 0 },
  bottom: { x: 0, y: 26 },
  center: { x: 0, y: 0, scale: 0.82 },
};

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState({
    count: 7,
    delay: 80,
    direction: "left",
    motion: "easeOut",
    duration: 520,
  });
  const [tick, setTick] = useState(0);

  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(60,100,170,0.66)" : "rgba(176,210,255,0.66)";

  const css = `/* stagger */\ntransition-duration: ${p.duration}ms;\ntransition-timing-function: ${MOTIONS[p.motion]};\n--stagger-delay: ${p.delay}ms;\n--stagger-count: ${p.count};\n--stagger-direction: ${p.direction};`;

  const offsets = DIR_OFFSET[p.direction];

  const cells = useMemo(() => Array.from({ length: p.count }), [p.count]);
  const keyframeName = `stagger-in-${tick}`;

  return (
    <ElementCard
      title="过渡编排"
      subtitle="Stagger / Sequence"
      focused={focused}
      onFocus={onFocus}
      copyData={{ css, short: `count:${p.count} · delay:${p.delay}ms · motion:${p.motion}` }}
    >
      <div style={{ width: "100%", maxWidth: 240 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTick((v) => v + 1);
            }}
            style={{
              border: `1px solid ${fg}0.16)`,
              background: `${fg}0.06)`,
              color: `${fg}0.56)`,
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 10,
              fontFamily: monoFont,
              cursor: "pointer",
            }}
          >
            replay
          </button>
          <span style={{ fontSize: 10, color: `${fg}0.3)`, fontFamily: monoFont }}>{p.direction} · {p.motion}</span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: 10,
          borderRadius: 10,
          border: `1px solid ${fg}0.06)`,
          background: `${fg}0.03)`,
        }}>
          {cells.map((_, i) => (
            <div
              key={`${tick}-${i}`}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: 7,
                background: `${fg}0.09)`,
                opacity: 0,
                transform: `translate(${offsets.x || 0}px, ${offsets.y || 0}px) scale(${offsets.scale || 1})`,
                animation: `${keyframeName} ${p.duration}ms ${MOTIONS[p.motion]} forwards`,
                animationDelay: `${i * p.delay}ms`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes ${keyframeName} {
            from { opacity: 0; }
            to { opacity: 1; transform: translate(0,0) scale(1); }
          }
        `}</style>
      </div>

      <div>
        <ParamSlider label="数量 count" value={p.count} min={4} max={12} step={1} onChange={(v) => setP((s) => ({ ...s, count: v }))} accent={accent} />
        <ParamSlider label="间隔 delay" value={p.delay} min={0} max={220} step={5} unit="ms" onChange={(v) => setP((s) => ({ ...s, delay: v }))} accent={accent} snaps={[0, 40, 80, 140]} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[{ id: "left", label: "从左" }, { id: "bottom", label: "从下" }, { id: "center", label: "从中心" }].map((d) => (
            <button
              key={d.id}
              onClick={() => setP((s) => ({ ...s, direction: d.id }))}
              style={optionChipStyle({ fg, active: p.direction === d.id })}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[{ id: "easeOut", label: "ease-out" }, { id: "overshoot", label: "overshoot" }, { id: "linear", label: "linear" }].map((m) => (
            <button
              key={m.id}
              onClick={() => setP((s) => ({ ...s, motion: m.id }))}
              style={optionChipStyle({ fg, active: p.motion === m.id })}
            >
              {m.label}
            </button>
          ))}
        </div>
        <ParamSlider label="总时长 duration" value={p.duration} min={180} max={1200} step={20} unit="ms" onChange={(v) => setP((s) => ({ ...s, duration: v }))} accent={accent} snaps={[280, 520, 760]} />
      </div>
    </ElementCard>
  );
});

export default Component;
