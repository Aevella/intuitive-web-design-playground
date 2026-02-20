import React from "react";

export default class ElementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Element render failed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: 16,
          color: "rgba(255,255,255,0.7)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          background: "rgba(255,255,255,0.03)",
        }}>
          这个元素加载失败，请切换分类或刷新后重试。
        </div>
      );
    }
    return this.props.children;
  }
}
