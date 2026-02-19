# 设计参数游乐场 · 项目计划 v0.2
## Design Parameter Playground — Project Plan

> **核心定位**：给"脑子里有画面但说不出参数"的人用的网页设计感知工具
> **目标用户**：不懂设计但需要和设计师/AI精确沟通的人
> **不是什么**：不是Figma替代品，不是设计教程，不是组件库
> **是什么**：一本可以用手摸的设计词典——拉一拉就懂了，懂了就说得出来，说完还能拼着玩

---

## 一、产品结构总览

```
设计参数游乐场
├── 词典模式（当前四个分页）
│   ├── 静静呆在那 · Static Presence
│   ├── 提醒你的 · Notifications
│   ├── 暗示可交互 · Interactive Hints
│   └── 它怎么活的 · Motion · Color · Space
│
├── DIY 沙盒（新增）
│   ├── 选择场景 → "我要做一个……"
│   ├── 从词典拖入/选择元素
│   ├── 自由组合 + 实时预览
│   └── 导出完整参数包
│
└── 全局层
    ├── 环境光控制（背景色连续调节）
    ├── 内联参数标注（点击即复制）
    └── 设置（手感偏好、性能模式）
```

### 两种模式的关系

| | 词典模式 | DIY 沙盒 |
|---|---------|----------|
| **比喻** | 学单词 | 造句 |
| **做什么** | 一个一个元素拉着玩，建立参数直觉 | 把多个元素组合在一起，看它们的关系 |
| **导出** | 单个元素 → 点一下边角即复制 | 整个组合 → 专门的导出面板 |
| **核心价值** | 感知 + 词汇量 | 表达 + 可玩性 |

---

## 二、设计哲学

### 不变的原则

1. **没有开关，只有滑块** — 所有参数都是连续光谱
2. **按存在感分类，不按形态分类** — 关系思维，不是形态思维
3. **身体先于语言** — 拉一拉→看到变化→自然说得出来
4. **注释层与展示层分离** — 元素是主角，标签是配角

### 新增原则

5. **手感是最高优先级**
   操作的丝滑程度 > 功能数量。
   光戳着玩也应该上瘾。
   如果加了一个功能但让滑块变卡了，砍功能不砍手感。

6. **数据贴着元素走**
   参数不应该藏在另一个面板里需要你去找。
   它应该就在元素旁边，安静地待着，你需要的时候点一下就到剪贴板了。

### 已定规则（2026-02）

1. **命名统一**
   - `发光按钮 / Glow Button` → `发光轮廓 / Glow Outline`
   - `静静待着的` → `静静呆在那`

2. **布局规则**
   - `static` + `notify`：使用分栏展示（预览区 + 控制区）
   - `interactive` + `alive`：保持上下布局，除非明确做产品决策变更

3. **参数语义规则**
   - `padding-x` 一律表示**单侧值**，左右同时生效
   - 不允许在不同元素里悄悄改语义（同名参数必须同义）

4. **参考系规则**
   - 页面显示参考环境信息（viewport / zoom / dpr / bg）
   - 复制 CSS 时附带参考注释（桌面/移动视口 + 背景）
   - 结论口径：数值 1:1，视觉会随上下文变化

5. **后续执行规则**
   - 共享规则以 `GUARDRAILS.md` 为准
   - 修改 core 组件前后必须过 build + 跨分类快速回归检查

---

## 三、词典模式 · 分页详情

### Page 1：静静呆在那 · Static Presence

| 元素 | 核心可调参数 | 状态 |
|------|------------|------|
| 发光轮廓 Glow Outline | glow-spread, border-radius, brightness, font-size, border-width, padding | ✅ v0.1 |
| 静态卡片 Card | border-radius, shadow-offset/blur, border-width, padding, bg-opacity | ✅ v0.1 |
| 标签 Tag / Badge | border-radius, font-size, padding, border-width, gap | ✅ v0.1 |
| 输入框 Input Field | 边框样式, 圆角, 内距, 聚焦态光晕, placeholder透明度 | 🔲 P2 |
| 分割线 Divider | 粗细, 样式(实线/虚线/点线), 间距, 透明度 | 🔲 P2 |
| 文字层级 Typography | 标题/正文/注释的字号比例, 行高, 字重 | 🔲 P2 |
| 头像容器 Avatar | 尺寸, 圆角, 边框, 状态指示器 | 🔲 P3 |

### Page 2：提醒你的 · Notifications

| 元素 | 核心可调参数 | 状态 |
|------|------------|------|
| 飘窗通知 Toast | border-radius, duration, slide, backdrop-blur, bg-opacity, width | ✅ v0.1 |
| 脉冲指示器 Pulse | dot-size, spread, speed, hue, rings | ✅ v0.1 |
| 进度条 Progress Bar | height, border-radius, progress, speed, glow | ✅ v0.1 |
| 加载旋转 Spinner | 尺寸, 粗细, 速度, 弧长, 颜色 | 🔲 P2 |
| 骨架屏 Skeleton | 闪烁速度, 圆角, 明暗差, 波纹方向 | 🔲 P2 |
| 数字徽标 Badge Count | 尺寸, 弹跳动画, 颜色, 位置偏移 | 🔲 P3 |
| 横幅提示 Banner | 高度, 背景色, 关闭按钮, 滑入方向 | 🔲 P3 |

### Page 3：暗示可交互 · Interactive Hints

| 元素 | 核心可调参数 | 状态 |
|------|------------|------|
| 悬停反馈 Hover Effect | scale, lift, glow, speed, border-radius | ✅ v0.1 |
| 涟漪效果 Ripple | duration, max-size, opacity, border-radius | ✅ v0.1 |
| 开关 Toggle Switch | width, height, border-radius, speed, thumb-gap | ✅ v0.1 |
| 工具提示 Tooltip | 延迟, 箭头, 位置, 最大宽度, 动画 | 🔲 P2 |
| 下拉菜单 Dropdown | 展开动画, 最大高度, 圆角, 阴影, 选中态 | 🔲 P2 |
| 选项卡 Tabs | 指示器动画, 宽度模式, 间距, 切换过渡 | 🔲 P3 |
| 手风琴 Accordion | 展开速度, 箭头旋转, 内容区内距 | 🔲 P3 |

### Page 4：它怎么活的 · Motion · Color · Space

| 元素 | 核心可调参数 | 状态 |
|------|------------|------|
| 缓动曲线 Easing | 4个控制点, duration, 预设 | ✅ v0.1 |
| 色彩关系 Color Relation | 双色HSL, 预设关系 | ✅ v0.1 |
| 间距呼吸 Spacing | gap, padding, item-size, count | ✅ v0.1 |
| 透明度层级 Opacity | 0→1连续对比, 不同背景可见性 | 🔲 P2 |
| 阴影层次 Shadow Depth | 多层叠加, 浮起→嵌入 | 🔲 P2 |
| 过渡编排 Stagger | 多元素delay, 入场顺序 | 🔲 P3 |

---

## 四、DIY 沙盒 · 设计详情

### 入口方式

用户进入沙盒后先看到一个场景选择：

**"我想捏一个……"**
- 登录页面（输入框 + 按钮 + 卡片）
- 通知卡片（Toast + Badge + 图标）
- 导航栏（Tabs + 按钮 + Logo容器）
- 设置面板（开关 + 滑块 + 分割线）
- 空白画布（完全自由）

选择场景后进入画布，预置了该场景常用的元素组合，用户可以：
- 调整每个元素的参数（复用词典模式的滑块）
- 添加/删除元素
- 调整元素之间的间距、对齐
- 切换环境光看整体效果

### 和词典模式的区别

词典模式里每个元素是**孤立展示**的——你只看它自己。
沙盒模式里元素是**共存**的——你看它们之间的关系。

同样是一个按钮，在词典里你关心"它的圆角多大"；
在沙盒里你关心"它和旁边的输入框看起来协调吗"。

### DIY沙盒的优先级

🔲 P3-P4阶段。词典模式先做扎实，沙盒才有意义。
原因：沙盒的每个元素都复用词典模式的组件，
所以词典里的元素越完善，沙盒的可玩性越高。

---

## 五、数据导出 · 设计详情

### 层级一：内联标注（词典模式）

**位置**：每个元素卡片的边角/底部
**展示**：缩略版参数（最关键的2-3个值）
**交互**：点一下 → 完整CSS自动进入剪贴板
**视觉**：极低存在感，和注释层同级，不干扰元素展示

```
示例：

  ┌─────────────────────────────┐
  │                             │
  │      [ 按钮文字 ]            │
  │                             │
  │  r:12 · glow:20 · 0.8  📋  │  ← 缩略版，点📋复制完整CSS
  └─────────────────────────────┘

点击后剪贴板内容：
border-radius: 12px;
box-shadow: 0 0 20px hsla(220, 80%, 64%, 0.5),
            inset 0 0 10px hsla(220, 80%, 64%, 0.5);
font-size: 14px;
padding: 10px 24px;
border: 1px solid hsl(220, 60%, 80%);
```

### 层级二：参数快照（词典模式增强）

**功能**：保存当前参数状态，和另一组参数并排对比
**用途**："我调了两个版本，哪个好看？"

### 层级三：完整导出（DIY沙盒）

**功能**：导出整个组合的参数包
**格式选择**：
- CSS变量包（给开发者）
- 自然语言描述（给设计师/甲方）
- JSON参数（给AI）

---

## 六、操作手感 · 优先级最高

### 手感设计原则

1. **滑块响应 < 16ms**
   一帧内完成状态更新 + 视觉反馈。
   用户手指在滑块上移动时，元素的变化必须和手指同步，不能有延迟。

2. **60fps 不掉帧**
   所有动画和过渡保持60fps。
   如果某个效果在低端设备上掉帧，降级而不是卡顿。

3. **触觉反馈**
   滑块到达关键值时有轻微的"吸附感"（CSS snap points）。
   比如圆角拉到0（直角）和最大值（全圆）时稍微粘一下。

4. **连续性不断裂**
   从词典切到沙盒，环境光、已调参数都保持。
   切换分页时当前参数不重置。

### 性能防卡策略

| 风险 | 预防方案 |
|------|---------|
| 滑块拖动时重渲染整个页面 | 每个元素组件隔离state，React.memo防止无关组件重渲染 |
| 动画元素过多同时运行 | 聚焦模式下只渲染聚焦元素的动画，其余暂停 |
| 背景色变化触发全局重渲染 | Context拆分：bgContext只传lum值，不传整个对象 |
| CSS box-shadow实时计算卡顿 | will-change + transform: translateZ(0) 启用GPU加速 |
| 移动端触摸滑块不流畅 | touch-action: none + 自定义touch handler |
| 元素数量增长后页面变慢 | 虚拟滚动/懒加载：只渲染可视区域内的元素卡片 |

---

## 七、代码架构 · 防止变乱

### 当前问题

v0.3是单文件，所有元素组件都在一个JSX里。
现在12个组件还能管理，但后续会涨到30+个，必须拆分。

### 目标架构

```
src/
├── components/
│   ├── core/                    # 基础组件（不会经常改）
│   │   ├── ParamSlider.jsx      # 滑块
│   │   ├── ElementCard.jsx      # 元素卡片容器
│   │   ├── Note.jsx             # 注释文字
│   │   ├── CopyBadge.jsx        # 内联复制按钮（新增）
│   │   └── BgControl.jsx        # 环境光控制面板
│   │
│   ├── elements/                # 每个展示元素一个文件
│   │   ├── static/
│   │   │   ├── GlowButton.jsx
│   │   │   ├── StaticCard.jsx
│   │   │   ├── TagBadge.jsx
│   │   │   ├── InputField.jsx   # 待做
│   │   │   └── ...
│   │   ├── notify/
│   │   │   ├── ToastNotify.jsx
│   │   │   ├── PulseIndicator.jsx
│   │   │   └── ...
│   │   ├── interactive/
│   │   │   ├── HoverButton.jsx
│   │   │   ├── RippleButton.jsx
│   │   │   └── ...
│   │   └── alive/
│   │       ├── EasingCurve.jsx
│   │       ├── ColorRelation.jsx
│   │       └── ...
│   │
│   └── sandbox/                 # DIY沙盒（P3-P4）
│       ├── Canvas.jsx
│       ├── ScenePicker.jsx
│       └── ExportPanel.jsx
│
├── context/
│   ├── BgContext.jsx             # 环境光上下文
│   └── ParamContext.jsx          # 参数持久化（跨分页保持）
│
├── utils/
│   ├── color.js                 # 颜色计算工具函数
│   ├── export.js                # CSS/JSON/自然语言导出
│   └── performance.js           # 性能监控 + 降级逻辑
│
├── data/
│   └── registry.js              # 元素注册表（元数据、分类、默认参数）
│
└── App.jsx                      # 主入口 + 路由
```

### 架构原则

1. **一个元素一个文件**
   新增元素只需要在 `elements/` 对应分类下加一个文件 + 在 `registry.js` 注册。
   不需要修改任何已有代码。

2. **基础组件锁定**
   `core/` 里的组件（ParamSlider, ElementCard等）一旦稳定就很少改动。
   所有元素共享同一套基础组件，保证视觉一致性。

3. **元素注册表**
   ```js
   // data/registry.js
   export const elements = {
     static: [
       { id: "glow-button", component: GlowButton,
         title: "发光轮廓", subtitle: "Glow Outline",
         defaultParams: { glow: 12, radius: 12, ... },
         cssExport: (p) => `border-radius: ${p.radius}px; ...` },
       ...
     ],
     ...
   };
   ```
   新增元素 = 写组件 + 注册。分页渲染逻辑从注册表自动生成。

4. **参数 ↔ CSS映射集中管理**
   每个元素的 `cssExport` 函数定义在注册表里。
   导出逻辑不散落在各个组件中。

### 迁移路径

不需要一次性重构。逐步拆分：
1. 先把 `core/` 基础组件提出来（ParamSlider, ElementCard, Note, BgControl）
2. 然后每次新增元素时，新元素直接用新结构写
3. 旧元素有空再逐个迁移

---

## 八、开发阶段

### Phase 1 ✅ 已完成 — 核心体验
- 四个分页 × 3个基础元素 = 12个元素
- 全局背景调节 + 聚焦模式
- 单文件架构（可运行的原型）

### Phase 2 🔜 下一步 — 补全 + 手感 + 导出
**新增元素**（每页+2-3个高频元素）：
- Static: 输入框, 文字层级, 分割线
- Notify: 加载旋转, 骨架屏
- Interactive: Tooltip, 下拉菜单
- Alive: 透明度层级, 阴影层次

**操作手感**：
- 滑块吸附感（关键值snap）
- 性能优化（React.memo + Context拆分）
- 触摸适配

**内联导出**：
- 每个元素底部缩略参数 + 点击复制完整CSS
- 复制成功的微动画反馈

**代码拆分**：
- 提取core基础组件
- 建立元素注册表

### Phase 3 — 组合 + 对比
- 参数快照：保存 + 并排对比两组参数
- 跨分页参数持久化（切走再切回来不丢）
- DIY沙盒 v1：场景选择 + 基础画布 + 元素组合

### Phase 4 — 沟通桥接
- 自然语言描述生成
- JSON参数导出（给AI用）
- 分享链接（参数编码成URL）
- DIY沙盒完整导出

---

## 九、边界

### 做（网页设计）
- 有时间维度的元素（动画、过渡、状态变化）
- 有交互的元素（悬停、点击、拖拽）
- 有响应的元素（不同屏幕尺寸下的适配）
- 系统化的间距、色彩、运动

### 不做（平面设计）
- 排版/字体搭配（品牌设计领域）
- 印刷色彩（CMYK）
- 固定尺寸的海报/传单
- 图片处理/滤镜

---

*v0.2 · 2025.02*
*Aeve × Pharos*


## 已定规则（2026-02-19）

- 命名统一：`发光轮廓 / Glow Outline`、`静静呆在那 / Static Presence`。
- 参数可信度：CSS 数值 1:1，视觉感受可能因容器/背景/设备变化而需微调。
- 参考系：Desktop 1440×900、Mobile 390×844、建议 100% 缩放。
- 语义固定：`padding-x` 为单侧值（左右同时生效），不得在不同组件中改义。
- 布局规则：`static` 与 `notify` 可使用 split；`interactive` 与 `alive` 默认 vertical。
- 具体执行与未来维护以 `GUARDRAILS.md` 为准。
