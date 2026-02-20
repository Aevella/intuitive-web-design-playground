import { memo, useContext, useMemo, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const PRESETS = {
  strong: { h1Size: 24, bodySize: 14, noteSize: 10, lineHeight: 1.45, weight: 560, tracking: 0.2, contrast: 0.78 },
  reading: { h1Size: 20, bodySize: 16, noteSize: 12, lineHeight: 1.58, weight: 500, tracking: 0.1, contrast: 0.68 },
  magazine: { h1Size: 28, bodySize: 15, noteSize: 11, lineHeight: 1.5, weight: 620, tracking: 0.35, contrast: 0.82 },
};

const Component = memo(({ focused, onFocus }) => {
  const [p, setP] = useState(PRESETS.strong);
  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = lum > 0.5 ? "rgba(70,110,180,0.66)" : "rgba(170,210,255,0.66)";

  const titleColor = `${fg}${Math.min(0.9, p.contrast).toFixed(3)})`;
  const bodyColor = `${fg}${Math.max(0.28, p.contrast * 0.75).toFixed(3)})`;
  const noteColor = `${fg}${Math.max(0.18, p.contrast * 0.55).toFixed(3)})`;

  const css = `h1 { font-size: ${p.h1Size}px; font-weight: ${Math.round(p.weight)}; letter-spacing: ${p.tracking.toFixed(2)}px; }\np { font-size: ${p.bodySize}px; line-height: ${p.lineHeight.toFixed(2)}; }\nsmall { font-size: ${p.noteSize}px; opacity: ${Math.max(0.2, p.contrast * 0.7).toFixed(2)}; }`;

  const ratio = useMemo(() => (p.h1Size / p.bodySize).toFixed(2), [p.h1Size, p.bodySize]);

  return (
    <ElementCard
      title="文字层级"
      subtitle="Typography Scale"
      focused={focused}
      onFocus={onFocus}
      copyData={{ css, short: `h1:${p.h1Size} · body:${p.bodySize} · ratio:${ratio}` }}
    >
      <div style={{ width: "100%", maxWidth: 250, border: `1px solid ${fg}0.08)`, borderRadius: 10, padding: 14, background: `${fg}0.03)` }}>
        <div style={{ fontSize: p.h1Size, lineHeight: 1.1, fontWeight: Math.round(p.weight), letterSpacing: `${p.tracking}px`, color: titleColor, transition: "all 0.15s" }}>
          标题 Title
        </div>
        <div style={{ marginTop: 8, fontSize: p.bodySize, lineHeight: p.lineHeight, color: bodyColor, transition: "all 0.15s" }}>
          这是一段正文，观察层级呼吸与阅读节奏。
          This is body text to feel pacing and hierarchy.
        </div>
        <div style={{ marginTop: 8, fontSize: p.noteSize, color: noteColor, letterSpacing: `${Math.max(0, p.tracking - 0.05)}px`, transition: "all 0.15s" }}>
          注释 Note · ratio {ratio}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[
            { id: "strong", label: "层次强 / Strong" },
            { id: "reading", label: "阅读稳 / Reading" },
            { id: "magazine", label: "杂志感 / Magazine" },
          ].map((x) => (
            <button key={x.id} onClick={() => setP(PRESETS[x.id])} style={{ border: `1px solid ${fg}0.12)`, background: `${fg}0.05)`, color: `${fg}0.55)`, borderRadius: 7, padding: "5px 7px", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer" }}>{x.label}</button>
          ))}
        </div>
        <ParamSlider label="标题字号 h1-size" value={p.h1Size} min={16} max={36} onChange={(v) => setP((s) => ({ ...s, h1Size: v }))} accent={accent} snaps={[20, 24, 28]} />
        <ParamSlider label="正文字号 body-size" value={p.bodySize} min={12} max={22} onChange={(v) => setP((s) => ({ ...s, bodySize: v }))} accent={accent} snaps={[14, 16, 18]} />
        <ParamSlider label="注释字号 note-size" value={p.noteSize} min={9} max={16} onChange={(v) => setP((s) => ({ ...s, noteSize: v }))} accent={accent} snaps={[10, 12]} />
        <ParamSlider label="行高 line-height" value={p.lineHeight} min={1.2} max={1.9} step={0.01} onChange={(v) => setP((s) => ({ ...s, lineHeight: v }))} accent={accent} />
        <ParamSlider label="字重 weight" value={p.weight} min={300} max={700} step={10} onChange={(v) => setP((s) => ({ ...s, weight: v }))} accent={accent} snaps={[400, 500, 600]} />
        <ParamSlider label="字距 letter-spacing" value={p.tracking} min={-0.2} max={1} step={0.01} unit="px" onChange={(v) => setP((s) => ({ ...s, tracking: v }))} accent={accent} />
      </div>
    </ElementCard>
  );
});

export default Component;
