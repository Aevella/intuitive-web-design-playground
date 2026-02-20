export const monoFont = "'IBM Plex Mono', monospace";

export function optionChipStyle({ fg, active, pad = "6px 8px" }) {
  return {
    border: `1px solid ${fg}${active ? "0.22)" : "0.10)"}`,
    background: active ? `${fg}0.10)` : "transparent",
    color: `${fg}${active ? "0.75)" : "0.35)"}`,
    borderRadius: 7,
    padding: pad,
    fontSize: 10,
    fontFamily: monoFont,
    cursor: "pointer",
  };
}

export function noteTextStyle(fg) {
  return {
    fontSize: 10,
    color: `${fg}0.28)`,
    marginBottom: 8,
    fontFamily: monoFont,
  };
}
