import { memo, useContext, useMemo, useState } from "react";
import { BgContext } from "../../../context/BgContext";
import { lumToFg } from "../../../utils/color";
import ElementCard from "../../core/ElementCard";
import ParamSlider from "../../core/ParamSlider";

const EASINGS = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  overshoot: "cubic-bezier(0.2, 1.25, 0.2, 1)",
  linear: "linear",
};

const Component = memo(({ focused, onFocus }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("默认选项");
  const [p, setP] = useState({
    motion: "easeOut",
    duration: 0.28,
    delay: 0,
    maxH: 170,
    radius: 10,
    shadow: 24,
    highlightHue: 210,
  });

  const { lum } = useContext(BgContext);
  const fg = lumToFg(lum);
  const accent = useMemo(
    () => `hsla(${p.highlightHue}, 85%, ${lum > 0.5 ? 40 : 72}%, 0.75)`,
    [p.highlightHue, lum]
  );

  const list = [
    { label: "默认选项", motion: "easeOut" },
    { label: "优雅展开", motion: "easeOut" },
    { label: "弹性展开", motion: "overshoot" },
    { label: "机械展开", motion: "linear" },
    { label: "极简模式", motion: "linear" },
  ];

  const css = `border-radius: ${p.radius}px;\nmax-height: ${p.maxH}px;\ntransition: all ${p.duration.toFixed(2)}s ${EASINGS[p.motion]};\ntransition-delay: ${p.delay.toFixed(2)}s;\nbox-shadow: 0 10px ${p.shadow}px rgba(0,0,0,${(lum > 0.5 ? 0.18 : 0.35).toFixed(2)});\n--highlight: hsl(${p.highlightHue} 85% ${lum > 0.5 ? 40 : 72}%);`;

  return (
    <ElementCard
      title="下拉菜单"
      subtitle="Dropdown / Expand"
      focused={focused}
      onFocus={onFocus}
      copyData={{ css, short: `${p.motion} · ${p.duration.toFixed(2)}s · h:${p.maxH}` }}
    >
      <div style={{ width: "100%", maxWidth: 240 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          style={{
            width: "100%",
            border: `1px solid ${fg}0.14)`,
            borderRadius: p.radius,
            background: `${fg}0.04)`,
            color: `${fg}0.62)`,
            padding: "10px 12px",
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <span>{selected}</span>
          <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: `transform ${p.duration}s ${EASINGS[p.motion]} ${p.delay}s` }}>⌄</span>
        </button>

        <div
          style={{
            marginTop: 6,
            border: `1px solid ${fg}0.1)`,
            borderRadius: p.radius,
            overflow: "hidden",
            background: `${fg}0.03)`,
            boxShadow: `0 10px ${p.shadow}px rgba(0,0,0,${lum > 0.5 ? 0.18 : 0.35})`,
            maxHeight: open ? p.maxH : 0,
            opacity: open ? 1 : 0,
            transform:
              p.motion === "overshoot"
                ? `translateY(${open ? 0 : -6}px) scale(${open ? 1 : 0.98})`
                : `translateY(${open ? 0 : -4}px)`,
            transformOrigin: "top",
            transition: `all ${p.duration}s ${EASINGS[p.motion]} ${p.delay}s`,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {list.map((item) => {
            const active = selected === item.label;
            return (
              <button
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(item.label);
                  setP((s) => ({ ...s, motion: item.motion }));
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  border: "none",
                  background: active ? accent.replace("0.75", "0.18") : "transparent",
                  color: active ? accent : `${fg}0.5)`,
                  borderBottom: `1px solid ${fg}0.06)`,
                  textAlign: "left",
                  padding: "9px 12px",
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: `${fg}0.28)`, marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
          动画类型由左侧选项决定 · 当前 {p.motion}
        </div>
        <ParamSlider label="展开时长 duration" value={p.duration} min={0.12} max={0.6} step={0.01} unit="s" onChange={(v) => setP((s) => ({ ...s, duration: v }))} accent={accent} snaps={[0.18, 0.28, 0.4]} />
        <ParamSlider label="触发延迟 delay" value={p.delay} min={0} max={0.35} step={0.01} unit="s" onChange={(v) => setP((s) => ({ ...s, delay: v }))} accent={accent} snaps={[0, 0.08, 0.18]} />
        <ParamSlider label="最大高度 max-height" value={p.maxH} min={90} max={240} unit="px" onChange={(v) => setP((s) => ({ ...s, maxH: v }))} accent={accent} snaps={[120, 170, 210]} />
        <ParamSlider label="圆角 radius" value={p.radius} min={0} max={16} onChange={(v) => setP((s) => ({ ...s, radius: v }))} accent={accent} snaps={[0, 8, 12]} />
        <ParamSlider label="阴影深度 shadow" value={p.shadow} min={0} max={44} onChange={(v) => setP((s) => ({ ...s, shadow: v }))} accent={accent} />
        <ParamSlider label="高亮色 hue" value={p.highlightHue} min={0} max={360} unit="°" onChange={(v) => setP((s) => ({ ...s, highlightHue: v }))} accent={accent} snaps={[200, 280, 340]} />
      </div>
    </ElementCard>
  );
});

export default Component;
