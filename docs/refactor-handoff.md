# Design Playground — 框架拆分交接文档
## For: Corveil (本地环境)

---

## 当前状态

- **文件**: `design-playground-v4.jsx` (单文件, ~1200行)
- **框架**: React JSX, 无构建工具依赖, 当前作为 Claude Artifact 运行
- **元素数**: 16个组件 + 4个核心组件 + 1个全局控制
- **样式**: 全部 inline styles, 无 CSS 文件
- **状态管理**: 每个元素组件内部 useState, 全局背景色通过 BgContext 传递

## 目标架构

```
src/
├── components/
│   ├── core/                    # 基础组件（锁定，很少改动）
│   │   ├── ParamSlider.jsx      # 滑块组件（含snap吸附逻辑）
│   │   ├── ElementCard.jsx      # 元素卡片容器（含focus逻辑）
│   │   ├── Note.jsx             # 注释文字
│   │   ├── CopyBadge.jsx        # 内联复制按钮
│   │   └── BgControl.jsx        # 右下角环境光控制面板
│   │
│   ├── elements/                # 每个展示元素一个文件
│   │   ├── static/
│   │   │   ├── GlowButton.jsx
│   │   │   ├── StaticCard.jsx
│   │   │   ├── TagBadge.jsx
│   │   │   ├── InputField.jsx
│   │   │   └── Divider.jsx
│   │   ├── notify/
│   │   │   ├── ToastNotify.jsx
│   │   │   ├── PulseIndicator.jsx
│   │   │   ├── ProgressBarEl.jsx
│   │   │   └── SpinnerEl.jsx
│   │   ├── interactive/
│   │   │   ├── HoverButton.jsx
│   │   │   ├── RippleButton.jsx
│   │   │   ├── ToggleSwitch.jsx
│   │   │   └── TooltipEl.jsx
│   │   └── alive/
│   │       ├── EasingCurve.jsx
│   │       ├── ColorRelation.jsx
│   │       └── SpacingBreath.jsx
│   │
│   └── layout/
│       └── TabNav.jsx           # 分页导航
│
├── context/
│   └── BgContext.jsx             # 背景色 context (bg hex + lum值)
│
├── utils/
│   ├── color.js                 # hexToLum, lumToFg, hslToHex
│   └── constants.js             # CATEGORIES 数组
│
├── data/
│   └── registry.js              # 元素注册表（见下方说明）
│
└── App.jsx                      # 主入口
```

## 迁移步骤（建议顺序）

### Step 1: 提取工具函数
从单文件中提取到 `utils/`:
- `hexToLum(hex)` → `utils/color.js`
- `lumToFg(lum)` → `utils/color.js`
- `hslToHex(h, s, l)` → `utils/color.js`
- `CATEGORIES` 数组 → `utils/constants.js`

### Step 2: 提取 Context
- `BgContext` → `context/BgContext.jsx`
- 导出 `BgContext` 和 `BgProvider` wrapper

### Step 3: 提取 core 组件
按以下顺序（每个都依赖 BgContext）：
1. `Note.jsx` — 最简单，无依赖
2. `CopyBadge.jsx` — 依赖 BgContext
3. `ParamSlider.jsx` — 依赖 BgContext，含 snap 逻辑
4. `ElementCard.jsx` — 依赖 BgContext + CopyBadge
5. `BgControl.jsx` — 依赖 color utils

### Step 4: 提取元素组件
每个元素组件需要 import:
- `{ useContext, useState, ... }` from react
- `{ BgContext }` from context
- `{ ParamSlider, ElementCard, CopyBadge, Note }` from core
- `{ lumToFg }` from utils (部分组件需要)

每个元素组件导出: `export default memo(function ComponentName({ focused, onFocus }) { ... })`

### Step 5: 创建注册表
```js
// data/registry.js
import GlowButton from '../components/elements/static/GlowButton';
import StaticCard from '../components/elements/static/StaticCard';
// ... all imports

export const registry = {
  static: [
    { id: 'glow-button', component: GlowButton, key: 'gb' },
    { id: 'static-card', component: StaticCard, key: 'sc' },
    { id: 'tag-badge', component: TagBadge, key: 'tb' },
    { id: 'input-field', component: InputField, key: 'if' },
    { id: 'divider', component: Divider, key: 'dv' },
  ],
  notify: [
    { id: 'toast', component: ToastNotify, key: 'tn' },
    { id: 'pulse', component: PulseIndicator, key: 'pi' },
    { id: 'progress', component: ProgressBarEl, key: 'pb' },
    { id: 'spinner', component: SpinnerEl, key: 'sp' },
  ],
  interactive: [
    { id: 'hover', component: HoverButton, key: 'hb' },
    { id: 'ripple', component: RippleButton, key: 'rb' },
    { id: 'toggle', component: ToggleSwitch, key: 'ts' },
    { id: 'tooltip', component: TooltipEl, key: 'tt' },
  ],
  alive: [
    { id: 'easing', component: EasingCurve, key: 'ec' },
    { id: 'color', component: ColorRelation, key: 'cr' },
    { id: 'spacing', component: SpacingBreath, key: 'sb' },
  ],
};
```

### Step 6: 重写 App.jsx
用注册表驱动渲染，替代硬编码的 tabs 对象：
```jsx
const tabs = {};
Object.entries(registry).forEach(([cat, elements]) => {
  tabs[cat] = elements.map(({ component: Comp, key }, i) => (
    (f, o) => <Comp key={key} focused={f} onFocus={o} />
  ));
});
```

## 注意事项

1. **不要改任何视觉表现** — 拆分是纯结构重构，拆完应该看起来和用起来完全一样
2. **保留所有 memo()** — 性能优化已经做了，拆分时保留
3. **inline styles 保持不变** — 不要提取到 CSS 文件，这个项目需要 runtime 动态计算样式
4. **ElementCard 的 children/controls 模式** — 每个元素组件 return 的是 `<ElementCard>` 包裹预览区和控制区，这个模式不要改
5. **CopyBadge 的 copyData prop** — 通过 ElementCard 传入 `{ css, short }` 对象
6. **snap 数组** — 每个 ParamSlider 的 snaps prop 是特定于该参数的，跟着元素走

## 后续新增元素的流程（拆分完成后）

1. 在 `components/elements/{category}/` 下新建文件
2. 写组件（import core 组件 + context）
3. 在 `data/registry.js` 注册
4. 完成。不需要改 App.jsx 或其他文件。

## 构建环境

如果要在本地跑起来（非 Artifact 模式）：
- 用 Vite + React 即可
- `npm create vite@latest design-playground -- --template react`
- 把 Google Fonts link 移到 index.html
- 唯一外部依赖: IBM Plex Mono 字体 (Google Fonts)

---

*源文件: design-playground-v4.jsx*
*计划文档: design-playground-plan-v2.md*
