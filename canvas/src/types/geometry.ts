/* ============================================================
   几何类型与工具函数
   ============================================================ */

export class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(v: Vec2) { return new Vec2(this.x + v.x, this.y + v.y) }
  sub(v: Vec2) { return new Vec2(this.x - v.x, this.y - v.y) }
  /** Hadamard (component-wise) product */
  had(v: Vec2) { return new Vec2(this.x * v.x, this.y * v.y) }

  static of(x: number, y: number) { return new Vec2(x, y) }
  static dot(a: Vec2, b: Vec2) { return a.x * b.x + a.y * b.y }
}

export interface Position {
  x: number
  y: number
}

/** 轴对齐包围盒（画布坐标） */
export interface AABB {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** 节点四个角 */
export type ResizeCorner = 'tl' | 'tr' | 'br' | 'bl'

/** 帧选区的 8 个方向控制柄 */
export type FrameDir = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r'

/** 帧选区矩形（画布坐标） */
export interface SelRect {
  x: number
  y: number
  w: number
  h: number
}

/** CSS-style 2D rotation of a vector (degrees, +y down). */
export function rotateVec(v: Vec2, deg: number): Vec2 {
  if (!deg) return v
  const r = (deg * Math.PI) / 180
  const c = Math.cos(r)
  const s = Math.sin(r)
  return Vec2.of(v.x * c - v.y * s, v.x * s + v.y * c)
}

export function normalizeVec(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.y)
  if (len < 1e-12) return Vec2.of(1, 0)
  return Vec2.of(v.x / len, v.y / len)
}

/** Convert viewport-local pixel coords to canvas (world) coords. */
export function screenToCanvas(
  vx: number, vy: number,
  ox: number, oy: number,
  sc: number
): Vec2 {
  return Vec2.of((vx - ox) / sc, (vy - oy) / sc)
}

/** Convert an array of [x,y] points to a smooth SVG path using quadratic midpoint interpolation. */
export function pointsToSvgPath(pts: [number, number][]): string {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M${pts[0][0]} ${pts[0][1]}L${pts[0][0]} ${pts[0][1]}`
  let d = `M${pts[0][0]} ${pts[0][1]}`
  if (pts.length === 2) return d + `L${pts[1][0]} ${pts[1][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += `Q${pts[i][0]} ${pts[i][1]} ${mx} ${my}`
  }
  const last = pts[pts.length - 1]
  return d + `L${last[0]} ${last[1]}`
}

/** Clamp a canvas-space point to within an AABB. */
export function clampToAABB(v: Vec2, a: AABB): Vec2 {
  return Vec2.of(
    Math.max(a.minX, Math.min(a.maxX, v.x)),
    Math.max(a.minY, Math.min(a.maxY, v.y)),
  )
}
