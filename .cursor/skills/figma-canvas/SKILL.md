---
name: figma-canvas
description: >-
  Guides edits to the figmaCanvas React editor (Figma-style viewport, pan/zoom,
  frames as nodes, select/hand tools, resize/rotate). Use when working on
  canvas/src/App.tsx, viewport or 画布 behavior, frames, zoom, node transforms,
  or Figma-like canvas interactions.
---

# 画布编辑器（figmaCanvas）

## 何时读取本技能

在修改本仓库的无限画布、视口平移/缩放、Frame（节点）选中与变换、工具栏逻辑时，先读 `canvas/src/App.tsx` 再改代码。

## 入口与分层

- **主实现**：`canvas/src/App.tsx`（单文件内包含类型、状态、指针逻辑与部分子组件）。
- **样式**：`canvas/src/App.css`；演示页可参考 `canvas/demo/`。
- **视口 DOM**：`ref={viewportRef}`、`className="viewport"`。画布内容在内部的 `locating-container`，用 `transform: translate(offset) scale(scale)` 与视口对齐。

## 坐标系

- **画布坐标（世界坐标）**：`NodeData` 的 `x, y, width, height` 与 `rotation`（度）均在未缩放空间里定义。
- **屏幕 ↔ 画布**：平移量 `offset`、缩放 `scale`。鼠标在画布上的位移除以 `scale` 再写回节点（见 `move`）。
- **屏幕位置公式**：某画布点 `(cx, cy)` 在视口内的像素位置约为  
  `offset.x + cx * scale`、`offset.y + cy * scale`（与 `floatingMenuPos`、`rotate` 中中心点计算一致）。

## 核心状态

| 状态 | 含义 |
|------|------|
| `toolMode` | `'select'` \| `'hand'` |
| `scale` | 视口缩放，Ctrl+滚轮与 `zoomCanvasAroundPoint` 中限制在 **0.05～5** |
| `offset` | 视口平移（像素） |
| `nodes` | `NodeData[]`，每个节点是一块可变换的 Frame（含 `imageSrc`、`title`） |
| `selectedNodeId` | 当前选中节点 |
| `dragAction`（ref） | 当前拖拽类型：`none` / `pan` / `move` / `resize` / `rotate` |

新增节点字段时：同步更新 `NodeData`、初始 state、`updateNode` 调用处及渲染。

## 交互契约（勿破坏）

1. **平移**：中键拖动；`hand` 模式下左键拖动；`dragAction.type === 'pan'` 时 `setOffset` 累加像素位移。
2. **Ctrl + 滚轮**：仅在此情况下缩放视口，并以指针下点为锚（`handleWheel`）；视口上对 `wheel` 做了 `preventDefault`（passive: false）。
3. **选中**：`select` 模式下点击节点体开始 `move`；点击空白 `.viewport` / `.locating-container` 取消选中。
4. **缩放角点**：`resize` 的 `corner` 为 **0=TL, 1=TR, 2=BR, 3=BL**，按比例锁定 `width/height`，锚定对边。
5. **旋转**：以节点中心在屏幕上的投影为圆心，用 `atan2` 差值累加 `rotation`（注意 Y 轴取负与 Figma/屏幕坐标习惯一致）。
6. **工具栏放大/缩小**：在 `select` 且**有选中节点**时，改的是**节点**宽高（中心不变）；否则对**整个视口**以内容包围盒中心做 `zoomCanvasAroundPoint`。
7. **全局监听**：`mousemove` / `mouseup` 挂在 `window` 上，避免拖出视口丢事件；改拖拽逻辑时勿只绑在 viewport 上。

## UI 常量（与 CSS 对齐）

`borderWidth`、`handleSize`、`titleScale` 与选中框/标题视觉一致；改手柄或边框时同时检查这些值与 `App.css`。

## 修改清单（自检）

- [ ] 新世界坐标运算是否一律在 `scale` 变化时仍正确（移动用 `dx/scale`，缩放角点用 `totalDx/scale`）。
- [ ] 新增交互是否在中键、`hand`、`select` 之间无冲突。
- [ ] 是否需在 `DragAction` 联合类型中增加分支，并在 `mousemove` / `mouseup` 中收尾。
- [ ] 工具栏行为是否仍符合「选中节点改节点，否则改观口」的双语义。

## 延伸阅读

实现细节过长时，优先在 `App.tsx` 内按区块注释（SVG 图标 / 类型 / 主组件 / 子组件）定位，避免重复粘贴大段公式到本文件。
