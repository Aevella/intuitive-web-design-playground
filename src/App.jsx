import { useState, useEffect, useMemo } from "react";
import { BgProvider } from "./context/BgContext";
import { CATEGORIES } from "./utils/constants";
import { createFg, hexToLum } from "./utils/color";
import BgControl from "./components/core/BgControl";
import ElementErrorBoundary from "./components/core/ElementErrorBoundary";
import { registry } from "./data/registry";

function detectDeviceProfile() {
  const ua = window.navigator.userAgent.toLowerCase();
  const ios = /iphone|ipad|ipod/.test(ua);
  const isTouchMac = /macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const isTablet = /ipad/.test(ua) || isTouchMac;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
  return { ios, isTablet, lowPower };
}

export default function DesignPlayground() {
  const [activeTab, setActiveTab] = useState("static");
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [bgHex, setBgHex] = useState("#0a0a0c");
  const [texture, setTexture] = useState({ preset: "clean", noise: 0.08, bloom: 0.15, specular: 0.18 });
  const [lastCustomTexture, setLastCustomTexture] = useState({ noise: 0.08, bloom: 0.15, specular: 0.18 });
  const [viewport, setViewport] = useState({ w: 1440, h: 900, scale: 1, dpr: 1 });
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallHint, setShowInstallHint] = useState(false);
  const deviceProfile = useMemo(() => detectDeviceProfile(), []);
  const isIos = deviceProfile.ios;
  const renderMode = deviceProfile.isTablet || deviceProfile.lowPower ? "lite" : "full";
  const APP_VERSION = import.meta.env.VITE_APP_VERSION || "v0.0.0";
  const lum = hexToLum(bgHex);
  const fg = createFg(lum);
  const handleFocus = (idx) => setFocusedIdx(prev => prev === idx ? null : idx);
  const getFocused = (idx) => focusedIdx === null ? null : focusedIdx === idx;

  useEffect(() => {
    const updateViewport = () => {
      const vv = window.visualViewport;
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        scale: vv?.scale || 1,
        dpr: window.devicePixelRatio || 1,
      });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const dismissedUntil = Number(localStorage.getItem("nudge.installHint.dismissedUntil") || 0);
    if (Date.now() < dismissedUntil || standalone) return;

    const timer = setTimeout(() => setShowInstallHint(true), 2000);

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setShowInstallHint(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const installHintText = useMemo(() => {
    if (deferredInstallPrompt) return "可安装到主屏幕，像原生应用一样打开";
    if (isIos) return "iOS：分享按钮 → 添加到主屏幕";
    return "可添加到主屏幕（浏览器菜单中选择安装）";
  }, [deferredInstallPrompt, isIos]);

  const tabs = Object.fromEntries(
    Object.entries(registry).map(([cat, elements]) => [
      cat,
      elements.map((entry) => {
        const Comp = entry.component;
        return (f, o) => <Comp key={entry.key} focused={f} onFocus={o} />;
      }),
    ])
  );
  const totalElements = Object.values(registry).reduce((sum, arr) => sum + arr.length, 0);

  const isCompactTabs = viewport.w < 760;

  const isGrain = texture.preset === "grain";
  const textureOverlay = {
    backgroundImage:
      texture.noise > 0
        ? isGrain
          ? `radial-gradient(circle at 20% 18%, rgba(255,255,255,${(texture.specular * 0.1).toFixed(3)}) 0%, transparent 42%), radial-gradient(circle at 78% 72%, rgba(255,255,255,${(texture.specular * 0.08).toFixed(3)}) 0%, transparent 44%), radial-gradient(circle, rgba(255,255,255,${(texture.noise * 0.03).toFixed(3)}) 0.7px, rgba(255,255,255,0) 0.8px)`
          : renderMode === "lite"
            ? `radial-gradient(circle at 24% 18%, rgba(255,255,255,${(texture.specular * 0.1).toFixed(3)}) 0%, transparent 40%), linear-gradient(115deg, rgba(255,255,255,${(texture.noise * 0.02).toFixed(3)}) 0%, rgba(255,255,255,0) 38%), linear-gradient(295deg, rgba(255,255,255,${(texture.noise * 0.016).toFixed(3)}) 0%, rgba(255,255,255,0) 35%)`
            : `radial-gradient(circle at 20% 18%, rgba(255,255,255,${(texture.specular * 0.13).toFixed(3)}) 0%, transparent 38%), radial-gradient(circle at 78% 72%, rgba(255,255,255,${(texture.specular * 0.09).toFixed(3)}) 0%, transparent 40%), linear-gradient(25deg, rgba(255,255,255,${(texture.noise * 0.02).toFixed(3)}) 0%, rgba(255,255,255,0) 24%), linear-gradient(-35deg, rgba(255,255,255,${(texture.noise * 0.014).toFixed(3)}) 0%, rgba(255,255,255,0) 24%)`
        : "none",
    backgroundSize: isGrain ? "auto, auto, 3px 3px" : "auto",
    boxShadow: texture.bloom > 0 ? `inset 0 0 ${Math.round(48 + texture.bloom * (renderMode === "lite" ? 72 : 110))}px rgba(140,180,255,${(texture.bloom * 0.07).toFixed(3)})` : "none",
  };

  const dismissInstallHint = (days = 7) => {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem("nudge.installHint.dismissedUntil", String(until));
    setShowInstallHint(false);
  };

  const triggerInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(() => null);
      setDeferredInstallPrompt(null);
      dismissInstallHint(30);
      return;
    }
    if (isIos) {
      alert("在 Safari 点分享按钮，再选“添加到主屏幕”");
      return;
    }
    alert("请在浏览器菜单里选择“安装应用”或“添加到主屏幕”");
  };

  return (
    <BgProvider bgHex={bgHex}>
      <div style={{
        minHeight: "100vh", background: bgHex,
        fontFamily: "'IBM Plex Mono', monospace", color: fg(0.7),
        transition: "background 0.4s ease",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 1, ...textureOverlay }} />
        <div style={{ padding: "40px 32px 0", maxWidth: 840, margin: "0 auto" }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 300, color: fg(0.5), letterSpacing: "-0.02em", transition: "color 0.4s" }}>轻轻推一下-设计参数</span>
          </div>
          <div style={{ fontSize: 9, color: fg(0.12), letterSpacing: "0.08em", transition: "color 0.4s" }}>
            DESIGN PARAMETER PLAYGROUND — {APP_VERSION} · 点击元素底部参数即复制CSS
          </div>
          <div style={{ fontSize: 9, color: fg(0.12), letterSpacing: "0.08em", marginTop: 4, transition: "color 0.4s" }}>
            参考护栏：CSS 数值 1:1；视觉感受会随容器/背景变化 · padding-x 为单侧值（左右同时生效）
          </div>
          <div style={{
            display: "inline-flex", gap: 10, alignItems: "center",
            marginTop: 8, marginBottom: 28, padding: "4px 8px",
            borderRadius: 6, border: `1px solid ${fg(0.08)}`, background: fg(0.02),
            fontSize: 9, color: fg(0.22), letterSpacing: "0.04em",
          }}>
            <span>REF 1440×900 / 390×844</span>
            <span>ZOOM 100%</span>
            <span>BG {bgHex}</span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isCompactTabs ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
            columnGap: 0,
            rowGap: 0,
            marginBottom: 12,
            borderBottom: `1px solid ${fg(0.06)}`,
          }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveTab(cat.id); setFocusedIdx(null); }}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "12px 10px", position: "relative", textAlign: "left",
                  color: activeTab === cat.id ? fg(0.7) : fg(0.2),
                  fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", transition: "color 0.3s",
                  minWidth: 0,
                }}>
                <span>{cat.label}</span>
                <span style={{ fontSize: 9, marginLeft: 6, opacity: 0.5 }}>{cat.subtitle}</span>
                {activeTab === cat.id && <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 1, background: fg(0.3) }} />}
              </button>
            ))}
          </div>
          <div style={{
            marginBottom: 16,
            fontSize: 9,
            color: fg(0.16),
            letterSpacing: "0.06em",
            fontFamily: "'IBM Plex Mono', monospace",
            border: `1px solid ${fg(0.05)}`,
            borderRadius: 6,
            padding: "7px 10px",
          }}>
            参考环境 · viewport {viewport.w}×{viewport.h} · zoom×{viewport.scale.toFixed(2)} · dpr {viewport.dpr.toFixed(2)} · bg {bgHex}
          </div>
        </div>
        <div style={{ padding: "0 32px 60px", maxWidth: 840, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tabs[activeTab].map((render, i) => (
              <ElementErrorBoundary key={`el-${activeTab}-${i}`}>
                {render(getFocused(i), () => handleFocus(i))}
              </ElementErrorBoundary>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 32px", maxWidth: 840, margin: "0 auto", borderTop: `1px solid ${fg(0.03)}` }}>
          <div style={{ fontSize: 9, color: fg(0.1), fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
            {totalElements} elements · 4 categories · inline CSS export · snap points · {APP_VERSION}
          </div>
        </div>
        {showInstallHint && (
          <div style={{
            position: "fixed", left: 12, right: 12, bottom: "max(12px, calc(env(safe-area-inset-bottom, 0px) + 72px))",
            border: `1px solid ${fg(0.12)}`, background: `${bgHex}ee`,
            borderRadius: 12, padding: "10px 12px",
            backdropFilter: "blur(8px)", zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: fg(0.72), fontFamily: "'IBM Plex Mono', monospace" }}>保存到主屏幕</div>
              <div style={{ fontSize: 10, color: fg(0.4), fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{installHintText}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => dismissInstallHint(1)} style={{ border: `1px solid ${fg(0.12)}`, background: "transparent", color: fg(0.42), borderRadius: 8, padding: "6px 9px", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer" }}>稍后</button>
              <button onClick={triggerInstall} style={{ border: `1px solid ${fg(0.2)}`, background: fg(0.1), color: fg(0.82), borderRadius: 8, padding: "6px 9px", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer" }}>添加</button>
            </div>
          </div>
        )}
        <BgControl
          bgHex={bgHex}
          onChange={setBgHex}
          texture={texture}
          onTextureChange={(next) => {
            setTexture(next);
            if (next?.preset === "custom") {
              setLastCustomTexture({ noise: next.noise, bloom: next.bloom, specular: next.specular });
            }
            if (next?.preset && next.preset !== "custom" && texture.preset === "custom") {
              setLastCustomTexture({ noise: texture.noise, bloom: texture.bloom, specular: texture.specular });
            }
            if (next?.preset === "custom" && !Number.isFinite(next.noise)) {
              setTexture({ preset: "custom", ...lastCustomTexture });
            }
          }}
          lastCustomTexture={lastCustomTexture}
        />
      </div>
    </BgProvider>
  );
}
