# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # TypeScript compile + Vite bundle (tsc -b && vite build)
npm run lint      # ESLint across all files
npm run preview   # Preview production build locally
```

There are no test commands configured in this project.

## Architecture

This is a **Figma-like canvas editor** — a single-page React app for creating and manipulating frames containing text, images, and freehand doodles, with multi-format export.

### Key files

- `src/App.tsx` (~2800 lines) — The entire application lives here as a monolithic component. All state, event handlers, canvas math, and rendering logic are colocated.
- `src/exportFrame.ts` — PNG (html2canvas), PDF (jsPDF), and SVG export utilities.
- `src/components/ui/dropdown-menu.tsx` — Dropdown built on `@base-ui/react`.
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).

### State architecture

All application state is managed with `useState`/`useRef` directly in `App.tsx` — no external state library, no Context. Key state:

- `nodes: NodeData[]` — The canvas objects (frames and their contents)
- `toolMode` — Current active tool: `select | hand | zoom-in | zoom-out | frame | doodle`
- `scale` / `offset` — Viewport transform (zoom level and pan position)
- `selectedNodeId` — Currently selected canvas object
- `dragAction` — Discriminated union (`DragAction` type) tracking the current drag operation: `pan | move | resize | rotate | drawframe | moveframe | resizeframe | doodle`

### Coordinate system

There are two coordinate spaces — convert carefully:
- **Viewport space**: screen pixels, origin at top-left of the browser window
- **Canvas space**: world coordinates, affected by `scale` and `offset`

Conversion: `canvasPoint = (viewportPoint - offset) / scale`

### Data models

```ts
interface NodeData {
  id: string; type: 'frame' | 'text' | 'image' | 'doodle';
  x, y, width, height, rotation: number;
  // text nodes:
  textContent, fontSize, textColor, fontFamily, fontWeight, fontStyle, textAlign
  // image nodes:
  imageSrc: string;
  // doodle nodes:
  doodleStrokes: { path: string; color: string; width: number }[];
}
```

`Vec2` is a utility class for 2D vector math (addition, subtraction, scaling, rotation). It's used throughout for transform calculations and hit detection (AABB).

### Tech stack

- React 19 + TypeScript (strict mode, ES2023 target)
- Vite 8 with `@vitejs/plugin-react` (Oxc-based Fast Refresh)
- Tailwind CSS v4 via `@tailwindcss/vite`
- `@base-ui/react` for unstyled dropdown primitives
- `html2canvas` + `jsPDF` for export
- Path alias: `@` → `./src`
