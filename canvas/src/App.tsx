import { useState, useRef, useCallback, useEffect } from 'react'
import canvasImg from './assets/imges.png'
import {
  downloadFramePdf,
  downloadFramePng,
  downloadFrameSvg,
  safeExportBaseName,
  type ExportFormat,
} from './exportFrame'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

/* ============================
   SVG Icon Components
   ============================ */

const SelectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.49992 2.5L18.3333 8.39096L9.99992 10.0035L7.91442 18.3333L2.49992 2.5Z"
      stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>
)

const HandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6875 3.74986C14.3631 3.7494 14.0427 3.82175 13.75 3.96158V3.43736C13.7502 2.91599 13.5641 2.4117 13.2254 2.01535C12.8867 1.619 12.4176 1.35667 11.9025 1.27562C11.3875 1.19457 10.8605 1.30014 10.4164 1.5733C9.97229 1.84646 9.64038 2.26925 9.48044 2.76548C9.14732 2.5848 8.77297 2.49375 8.39407 2.50127C8.01518 2.50879 7.64473 2.61461 7.31904 2.80837C6.99335 3.00214 6.72358 3.27719 6.53617 3.60657C6.34876 3.93596 6.25014 4.30839 6.24997 4.68736V9.68736L5.95154 9.20845C5.66166 8.70821 5.18554 8.34307 4.62724 8.19284C4.06894 8.04261 3.47387 8.11952 2.97211 8.40674C2.47034 8.69397 2.10269 9.16815 1.94951 9.72565C1.79634 10.2831 1.87009 10.8786 2.15466 11.3819C3.40466 14.0202 4.41482 15.8913 5.57029 17.0608C6.73747 18.2452 8.06247 18.7499 9.99997 18.7499C11.8227 18.7478 13.5702 18.0228 14.859 16.7339C16.1479 15.4451 16.8729 13.6976 16.875 11.8749V5.93736C16.875 5.3572 16.6445 4.8008 16.2343 4.39056C15.824 3.98033 15.2676 3.74986 14.6875 3.74986Z"
      fill="currentColor" />
  </svg>
)

const ZoomInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.75008 15.8337C12.6621 15.8337 15.8334 12.6623 15.8334 8.75033C15.8334 4.83833 12.6621 1.66699 8.75008 1.66699C4.83808 1.66699 1.66675 4.83833 1.66675 8.75033C1.66675 12.6623 4.83808 15.8337 8.75008 15.8337Z"
      stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <path d="M8.75 6.25V11.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.25659 8.7565L11.2501 8.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.8423 13.8428L17.3778 17.3783" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ZoomOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.75008 15.8337C12.6621 15.8337 15.8334 12.6623 15.8334 8.75033C15.8334 4.83833 12.6621 1.66699 8.75008 1.66699C4.83808 1.66699 1.66675 4.83833 1.66675 8.75033C1.66675 12.6623 4.83808 15.8337 8.75008 15.8337Z"
      stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <path d="M6.25 8.75H11.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.8423 13.8428L17.3778 17.3783" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AddFrameIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_add_frame" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <rect x="0.5" y="0.5" width="19" height="19" fill="#FCFCFC" stroke="#EAEAEA" />
    </mask>
    <g mask="url(#mask0_add_frame)">
      <path d="M12 2H7.4C5.15979 2 4.03968 2 3.18404 2.43597C2.43139 2.81947 1.81947 3.43139 1.43597 4.18404C1 5.03968 1 6.15979 1 8.4V11.6C1 13.8402 1 14.9603 1.43597 15.816C1.81947 16.5686 2.43139 17.1805 3.18404 17.564C4.03968 18 5.15979 18 7.4 18H12.6C14.8402 18 15.9603 18 16.816 17.564C17.5686 17.1805 18.1805 16.5686 18.564 15.816C19 14.9603 19 13.8402 19 11.6V9"
        stroke="black" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M16.4937 2V7" stroke="#232425" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4.5065L18.9935 4.5" stroke="#232425" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

const FitCanvasIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_fit_canvas" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
      <rect x="0.5" y="0.5" width="19" height="19" fill="#FCFCFC" stroke="#EAEAEA" />
    </mask>
    <g mask="url(#mask0_fit_canvas)">
      <path d="M1 8.4C1 6.15979 1 5.03968 1.43597 4.18404C1.81947 3.43139 2.43139 2.81947 3.18404 2.43597C4.03968 2 5.15979 2 7.4 2H12.6C14.8402 2 15.9603 2 16.816 2.43597C17.5686 2.81947 18.1805 3.43139 18.564 4.18404C19 5.03968 19 6.15979 19 8.4V11.6C19 13.8402 19 14.9603 18.564 15.816C18.1805 16.5686 17.5686 17.1805 16.816 17.564C15.9603 18 14.8402 18 12.6 18H7.4C5.15979 18 4.03968 18 3.18404 17.564C2.43139 17.1805 1.81947 16.5686 1.43597 15.816C1 14.9603 1 13.8402 1 11.6V8.4Z"
        stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 5H14C15.1046 5 16 5.89543 16 7V9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 15H6C4.89543 15 4 14.1046 4 13V11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </g>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
    <path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
      fill="currentColor" />
  </svg>
)

const AiEditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5">
    <path d="M17.4487 15.625H2.78711C2.48292 15.625 2.23633 15.8716 2.23633 16.1758V17.3322C2.23633 17.6365 2.48292 17.8831 2.78711 17.8831H17.4487C17.7528 17.8831 17.9994 17.6365 17.9994 17.3322V16.1758C17.9994 15.8716 17.7528 15.625 17.4487 15.625Z" fill="currentColor" />
    <path d="M7.13547 13.3937C7.04726 13.3937 6.97279 13.329 6.95906 13.2408C6.38475 9.44404 5.9692 9.10886 2.19993 8.54043C2.08428 8.52278 1.99805 8.42282 1.99805 8.30521C1.99805 8.18761 2.08428 8.08765 2.19993 8.07C5.94961 7.50354 6.28282 7.16836 6.8493 3.42065C6.86694 3.305 6.96689 3.21875 7.0845 3.21875C7.20211 3.21875 7.30207 3.305 7.31971 3.42065C7.88619 7.16836 8.22136 7.50354 11.9691 8.07C12.0847 8.08765 12.171 8.18761 12.171 8.30521C12.171 8.42282 12.0847 8.52278 11.9691 8.54043C8.20373 9.10886 7.88226 9.44404 7.31187 13.2408C7.29816 13.327 7.22366 13.3937 7.13547 13.3937Z" fill="currentColor" />
    <path d="M14.2849 8.3742C14.2299 8.3742 14.183 8.33303 14.1751 8.27814C13.8164 5.90643 13.5556 5.69669 11.2016 5.34192C11.129 5.33015 11.0742 5.26939 11.0742 5.19491C11.0742 5.12239 11.1272 5.05966 11.2016 5.0479C13.5439 4.69508 13.7537 4.48535 14.1065 2.14304C14.1183 2.07051 14.179 2.01562 14.2535 2.01562C14.3261 2.01562 14.3888 2.06855 14.4005 2.14304C14.7533 4.48535 14.963 4.69508 17.3054 5.0479C17.3779 5.05966 17.4328 5.12043 17.4328 5.19491C17.4328 5.26743 17.3799 5.33015 17.3054 5.34192C14.9533 5.69669 14.7513 5.90643 14.3946 8.27814C14.3868 8.33303 14.3397 8.3742 14.2849 8.3742Z" fill="currentColor" />
    <path d="M14.2729 14.2957C14.2376 14.2957 14.2082 14.2702 14.2023 14.2348C13.9749 12.7255 13.8083 12.5923 12.3108 12.3669C12.2638 12.359 12.2305 12.3198 12.2305 12.2728C12.2305 12.2257 12.2638 12.1865 12.3108 12.1787C13.8004 11.9532 13.9338 11.82 14.1591 10.3303C14.167 10.2833 14.2062 10.25 14.2533 10.25C14.3002 10.25 14.3395 10.2833 14.3473 10.3303C14.5728 11.82 14.706 11.9532 16.1957 12.1787C16.2428 12.1865 16.2761 12.2257 16.2761 12.2728C16.2761 12.3198 16.2428 12.359 16.1957 12.3669C14.6983 12.5923 14.5708 12.7255 14.3435 14.2348C14.3376 14.2702 14.3081 14.2957 14.2729 14.2957Z" fill="currentColor" />
  </svg>
)

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.25 4.58203L15.7336 12.9363C15.6016 15.0707 15.5357 16.1379 15.0007 16.9053C14.7361 17.2846 14.3956 17.6048 14.0006 17.8454C13.2017 18.332 12.1325 18.332 9.99392 18.332C7.8526 18.332 6.78192 18.332 5.98254 17.8444C5.58733 17.6034 5.24667 17.2827 4.98223 16.9027C4.4474 16.1342 4.38287 15.0654 4.25384 12.928L3.75 4.58203"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2.5 4.58464H17.5M13.3797 4.58464L12.8109 3.41108C12.433 2.63152 12.244 2.24174 11.9181 1.99864C11.8458 1.94472 11.7693 1.89675 11.6892 1.85522C11.3283 1.66797 10.8951 1.66797 10.0287 1.66797C9.14067 1.66797 8.69667 1.66797 8.32973 1.86307C8.24842 1.90631 8.17082 1.95622 8.09774 2.01228C7.76803 2.26522 7.58386 2.66926 7.21551 3.47735L6.71077 4.58464"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7.91663 13.75V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12.0834 13.75V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const SubmitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="1">
      <path d="M12.1309 19.6982L12.1309 5.69824" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.00154 8.84844L11.2863 5.73898C11.7182 5.3301 12.4185 5.3301 12.8504 5.73898L16.1352 8.84844"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

const DashedFrameIcon = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5">
    <rect x="2.08984" y="3" width="11" height="11" rx="1.1" stroke="currentColor" strokeDasharray="2.8 2.8" />
  </svg>
)

const DropdownArrowIcon = () => (
  <svg className="text-current w-3 h-3 transition-transform duration-150" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ============================
   Type Definitions
   ============================ */

type ToolMode = 'select' | 'hand'

interface Position {
  x: number
  y: number
}

type ResizeCorner = 'tl' | 'tr' | 'br' | 'bl'

class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(v: Vec2) {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  sub(v: Vec2) {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  had(v: Vec2) {
    return new Vec2(this.x * v.x, this.y * v.y)
  }

  static of(x: number, y: number) {
    return new Vec2(x, y)
  }

  static dot(a: Vec2, b: Vec2) {
    return a.x * b.x + a.y * b.y
  }
}

const MIN_NODE_SIZE = 50
/** 新建无图画框的默认宽高（画布坐标） */
const DEFAULT_NEW_FRAME_W = 1920
const DEFAULT_NEW_FRAME_H = 1080

/** CSS-style 2D rotation of a vector (degrees, +y down). */
function rotateVec(v: Vec2, deg: number): Vec2 {
  if (!deg) return v
  const r = (deg * Math.PI) / 180
  const c = Math.cos(r)
  const s = Math.sin(r)
  return Vec2.of(v.x * c - v.y * s, v.x * s + v.y * c)
}

function normalizeVec(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.y)
  if (len < 1e-12) return Vec2.of(1, 0)
  return Vec2.of(v.x / len, v.y / len)
}

/** Local offset from node center to a corner (unrotated box, +y down). */
function cornerOffsetFromCenter(corner: ResizeCorner, w: number, h: number): Vec2 {
  switch (corner) {
    case 'tl':
      return Vec2.of(-w / 2, -h / 2)
    case 'tr':
      return Vec2.of(w / 2, -h / 2)
    case 'br':
      return Vec2.of(w / 2, h / 2)
    case 'bl':
      return Vec2.of(-w / 2, h / 2)
  }
}

/** Corner position in canvas (parent) space, accounting for rotation about box center. */
function canvasCornerPos(n: NodeData, corner: ResizeCorner): Vec2 {
  const cx = n.x + n.width / 2
  const cy = n.y + n.height / 2
  const off = cornerOffsetFromCenter(corner, n.width, n.height)
  return Vec2.of(cx, cy).add(rotateVec(off, n.rotation))
}

/**
 * Proportional resize so the dragged corner follows `targetCanvas` (mouse minus grab offset),
 * opposite corner fixed in canvas space. Matches large hit targets on handles.
 */
function resizePatchFromTargetCorner(
  snap: NodeData,
  corner: ResizeCorner,
  targetCanvas: Vec2
): Partial<NodeData> {
  const aspect = snap.width / snap.height
  const rot = snap.rotation
  const tl0 = canvasCornerPos(snap, 'tl')
  const tr0 = canvasCornerPos(snap, 'tr')
  const br0 = canvasCornerPos(snap, 'br')
  const bl0 = canvasCornerPos(snap, 'bl')

  if (corner === 'br') {
    const v = targetCanvas.sub(tl0)
    const nL = normalizeVec(Vec2.of(1, 1 / aspect))
    const dirC = rotateVec(nL, rot)
    const pMin = Math.max(MIN_NODE_SIZE / nL.x, MIN_NODE_SIZE / nL.y)
    const p = Math.max(Vec2.dot(v, dirC), pMin)
    const newW = p * nL.x
    const newH = p * nL.y
    return { x: snap.x, y: snap.y, width: newW, height: newH }
  }

  if (corner === 'tl') {
    const v = br0.sub(targetCanvas)
    const nL = normalizeVec(Vec2.of(1, 1 / aspect))
    const dirC = rotateVec(nL, rot)
    const pMin = Math.max(MIN_NODE_SIZE / nL.x, MIN_NODE_SIZE / nL.y)
    const p = Math.max(Vec2.dot(v, dirC), pMin)
    const newW = p * nL.x
    const newH = p * nL.y
    const tl = br0.sub(rotateVec(Vec2.of(newW, newH), rot))
    return { x: tl.x, y: tl.y, width: newW, height: newH }
  }

  if (corner === 'tr') {
    const v = targetCanvas.sub(bl0)
    const nL = normalizeVec(Vec2.of(1, -1 / aspect))
    const dirC = rotateVec(nL, rot)
    const pMin = Math.max(MIN_NODE_SIZE / nL.x, MIN_NODE_SIZE / -nL.y)
    const p = Math.max(Vec2.dot(v, dirC), pMin)
    const newW = p * nL.x
    const newH = -p * nL.y
    const tl = bl0.sub(rotateVec(Vec2.of(0, newH), rot))
    return { x: tl.x, y: tl.y, width: newW, height: newH }
  }

  // bl
  const v = targetCanvas.sub(tr0)
  const nL = normalizeVec(Vec2.of(-1, 1 / aspect))
  const dirC = rotateVec(nL, rot)
  const pMin = Math.max(MIN_NODE_SIZE / -nL.x, MIN_NODE_SIZE / nL.y)
  const p = Math.max(Vec2.dot(v, dirC), pMin)
  const newW = -p * nL.x
  const newH = p * nL.y
  const tl = tr0.sub(rotateVec(Vec2.of(newW, 0), rot))
  return { x: tl.x, y: tl.y, width: newW, height: newH }
}

type DragAction =
  | { type: 'none' }
  | { type: 'pan' }
  | { type: 'move'; nodeId: string }
  | { type: 'resize'; nodeId: string; corner: ResizeCorner }
  | { type: 'rotate'; nodeId: string }

interface NodeData {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number // degrees
  title: string
  /** 无则渲染空白画框 */
  imageSrc?: string
}

/* ============================
   Main App Component
   ============================ */

function App() {
  // --- State ---
  const [toolMode, setToolMode] = useState<ToolMode>('select')
  const [scale, setScale] = useState(0.3)
  const [offset, setOffset] = useState<Position>({ x: 153.6, y: 98.1 })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1')
  const [editText, setEditText] = useState('')

  // Mutable node data (position, size, rotation can change)
  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: 'node-1',
      x: 13.3333,
      y: 283.333,
      width: 1024,
      height: 1536,
      rotation: 0,
      title: 'Concert Poster Template Variations',
      imageSrc: canvasImg,
    },
  ])

  const handleToolModeChange = useCallback((mode: ToolMode) => {
    setToolMode(mode)
    if (mode === 'hand') setSelectedNodeId(null)
  }, [])

  // --- Refs ---
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragAction = useRef<DragAction>({ type: 'none' })
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  // Snapshot of node state at drag start (for resize & rotate)
  const dragStartNode = useRef<NodeData | null>(null)
  const dragStartMouse = useRef<Position>({ x: 0, y: 0 })
  /**
   * Viewport-local px: mouse − (offset + cornerCanvas·scale) at mousedown.
   * Keeps resize correct at any zoom; mousemove uses latest scale/offset via ref.
   */
  const resizeGrabView = useRef<Vec2 | null>(null)
  /** Latest viewport transform for window listeners (avoid stale effect closure). */
  const viewportTransformRef = useRef({ scale, ox: offset.x, oy: offset.y })
  viewportTransformRef.current = { scale, ox: offset.x, oy: offset.y }

  const handleAddFrame = useCallback(() => {
    const w = DEFAULT_NEW_FRAME_W
    const h = DEFAULT_NEW_FRAME_H
    const rect = viewportRef.current?.getBoundingClientRect()
    const t = viewportTransformRef.current
    let x = 100
    let y = 100
    if (rect) {
      const cx = (rect.width / 2 - t.ox) / t.scale
      const cy = (rect.height / 2 - t.oy) / t.scale
      x = cx - w / 2
      y = cy - h / 2
    }
    const id = `node-${Date.now()}`
    const newNode: NodeData = {
      id,
      x,
      y,
      width: w,
      height: h,
      rotation: 0,
      title: '画框',
    }
    setNodes((prev) => [...prev, newNode])
    setSelectedNodeId(id)
  }, [])

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId) return
    const id = selectedNodeId
    setNodes((prev) => prev.filter((n) => n.id !== id))
    setSelectedNodeId(null)
    const a = dragAction.current
    if (
      a.type === 'move' ||
      a.type === 'resize' ||
      a.type === 'rotate'
    ) {
      if (a.nodeId === id) {
        dragAction.current = { type: 'none' }
        dragStartNode.current = null
        resizeGrabView.current = null
      }
    }
  }, [selectedNodeId])

  // --- Computed ---
  const borderWidth = 6.66667
  const handleSize = 46.6667
  const titleScale = 3.33333

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  const handleExportFormat = useCallback(
    async (format: ExportFormat) => {
      if (!selectedNodeId || !selectedNode) return
      const base = safeExportBaseName(selectedNode.title)
      try {
        if (format === 'svg') {
          downloadFrameSvg(selectedNode, base)
          return
        }
        const el = document.querySelector(
          `[data-canvas-node="${selectedNodeId}"]`
        ) as HTMLElement | null
        if (!el) return
        if (format === 'png') await downloadFramePng(el, base)
        else await downloadFramePdf(el, base)
      } catch (err) {
        console.error('Export failed:', err)
      }
    },
    [selectedNodeId, selectedNode]
  )

  // Floating menu position (below the selected node, accounting for rotation)
  const floatingMenuPos = selectedNode
    ? {
        left: offset.x + (selectedNode.x + selectedNode.width / 2) * scale,
        top: offset.y + (selectedNode.y + selectedNode.height + 80) * scale,
      }
    : { left: 0, top: 0 }

  // --- Helper: update a single node ---
  const updateNode = useCallback((id: string, patch: Partial<NodeData>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }, [])

  // --- Wheel zoom ---
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.05), 5)

      const newOffsetX = mouseX - ((mouseX - offset.x) / scale) * newScale
      const newOffsetY = mouseY - ((mouseY - offset.y) / scale) * newScale

      setScale(newScale)
      setOffset({ x: newOffsetX, y: newOffsetY })
    },
    [scale, offset]
  )

  // --- Viewport mouse down ---
  const handleViewportMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Middle-mouse always pans
      if (e.button === 1) {
        dragAction.current = { type: 'pan' }
        lastMousePos.current = { x: e.clientX, y: e.clientY }
        e.preventDefault()
        return
      }

      if (toolMode === 'hand') {
        // Hand mode: drag = pan canvas
        dragAction.current = { type: 'pan' }
        lastMousePos.current = { x: e.clientX, y: e.clientY }
        e.preventDefault()
      } else if (toolMode === 'select') {
        // If clicking on bare viewport background, deselect
        const target = e.target as HTMLElement
        if (target.classList.contains('viewport') || target.classList.contains('locating-container')) {
          setSelectedNodeId(null)
        }
      }
    },
    [toolMode]
  )

  // --- Node body mouse down (select mode: select + drag to move) ---
  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (toolMode !== 'select') return
      e.stopPropagation()
      e.preventDefault()
      setSelectedNodeId(nodeId)
      dragAction.current = { type: 'move', nodeId }
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    },
    [toolMode]
  )

  // --- Resize handle mouse down ---
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string, corner: ResizeCorner) => {
      if (toolMode !== 'select') return
      e.stopPropagation()
      e.preventDefault()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) return
      const t = viewportTransformRef.current
      const cornerCanvas = canvasCornerPos(node, corner)
      const mouseV = Vec2.of(e.clientX - rect.left, e.clientY - rect.top)
      const cornerV = Vec2.of(
        t.ox + cornerCanvas.x * t.scale,
        t.oy + cornerCanvas.y * t.scale
      )
      resizeGrabView.current = mouseV.sub(cornerV)
      dragAction.current = { type: 'resize', nodeId, corner }
      dragStartNode.current = { ...node }
      dragStartMouse.current = { x: e.clientX, y: e.clientY }
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    },
    [toolMode, nodes]
  )

  // --- Rotation handle mouse down ---
  const handleRotateMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (toolMode !== 'select') return
      e.stopPropagation()
      e.preventDefault()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
      dragAction.current = { type: 'rotate', nodeId }
      dragStartNode.current = { ...node }
      dragStartMouse.current = { x: e.clientX, y: e.clientY }
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    },
    [toolMode, nodes]
  )

  // --- Global mouse move & up (window level for reliable tracking) ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const action = dragAction.current
      if (action.type === 'none') return

      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y

      if (action.type === 'pan') {
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      } else if (action.type === 'move') {
        const t = viewportTransformRef.current
        setNodes((prev) =>
          prev.map((n) =>
            n.id === action.nodeId
              ? { ...n, x: n.x + dx / t.scale, y: n.y + dy / t.scale }
              : n
          )
        )
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      } else if (action.type === 'resize') {
        const startNode = dragStartNode.current
        const grabV = resizeGrabView.current
        if (!startNode || !grabV) return
        const rect = viewportRef.current?.getBoundingClientRect()
        if (!rect) return
        const t = viewportTransformRef.current
        const mouseV = Vec2.of(e.clientX - rect.left, e.clientY - rect.top)
        const targetCorner = Vec2.of(
          (mouseV.x - grabV.x - t.ox) / t.scale,
          (mouseV.y - grabV.y - t.oy) / t.scale
        )
        const patch = resizePatchFromTargetCorner(startNode, action.corner, targetCorner)
        updateNode(action.nodeId, patch)
      } else if (action.type === 'rotate') {
        const startNode = dragStartNode.current
        if (!startNode) return
        // Center of the node in screen coords
        const rect = viewportRef.current?.getBoundingClientRect()
        if (!rect) return
        const t = viewportTransformRef.current
        const centerScreenX = rect.left + t.ox + (startNode.x + startNode.width / 2) * t.scale
        const centerScreenY = rect.top + t.oy + (startNode.y + startNode.height / 2) * t.scale

        // Angle from center to current mouse
        const angleNow = Math.atan2(
          e.clientX - centerScreenX,
          -(e.clientY - centerScreenY)
        )
        // Angle from center to initial mouse
        const angleStart = Math.atan2(
          dragStartMouse.current.x - centerScreenX,
          -(dragStartMouse.current.y - centerScreenY)
        )
        const angleDelta = ((angleNow - angleStart) * 180) / Math.PI
        updateNode(action.nodeId, { rotation: startNode.rotation + angleDelta })
      }
    }

    const handleMouseUp = () => {
      dragAction.current = { type: 'none' }
      dragStartNode.current = null
      resizeGrabView.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [updateNode])

  // Delete / Backspace: remove selected node（输入框内不拦截）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const el = e.target as HTMLElement | null
      if (!el) return
      if (el.closest('textarea, input, [contenteditable="true"]')) return
      if (toolMode !== 'select' || !selectedNodeId) return
      e.preventDefault()
      handleDeleteSelected()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toolMode, selectedNodeId, handleDeleteSelected])

  // Only prevent browser zoom when Ctrl+wheel is used on viewport
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const prevent = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()
    }
    el.addEventListener('wheel', prevent, { passive: false })
    return () => el.removeEventListener('wheel', prevent)
  }, [])

  // --- Toolbar zoom handlers (mode-dependent) ---
  // Helper: zoom canvas centered on a specific canvas-space point
  const zoomCanvasAroundPoint = useCallback(
    (factor: number, canvasCenterX: number, canvasCenterY: number) => {
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) {
        setScale((s) => Math.min(Math.max(s * factor, 0.05), 5))
        return
      }
      // Screen position of the canvas-space center point
      const screenCX = offset.x + canvasCenterX * scale
      const screenCY = offset.y + canvasCenterY * scale

      const newScale = Math.min(Math.max(scale * factor, 0.05), 5)
      // Keep that center point at the same screen position
      setScale(newScale)
      setOffset({
        x: screenCX - canvasCenterX * newScale,
        y: screenCY - canvasCenterY * newScale,
      })
    },
    [scale, offset]
  )

  // Get the center point of all content (or the selected node)
  const getContentCenter = useCallback((): Position => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const n of nodes) {
      minX = Math.min(minX, n.x)
      minY = Math.min(minY, n.y)
      maxX = Math.max(maxX, n.x + n.width)
      maxY = Math.max(maxY, n.y + n.height)
    }
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
  }, [nodes])

  const handleZoomIn = useCallback(() => {
    if (toolMode === 'select' && selectedNodeId) {
      // Select mode: scale the selected element (enlarge)
      const node = nodes.find((n) => n.id === selectedNodeId)
      if (!node) return
      const factor = 1.2
      const newW = node.width * factor
      const newH = node.height * factor
      const cx = node.x + node.width / 2
      const cy = node.y + node.height / 2
      updateNode(selectedNodeId, {
        width: newW,
        height: newH,
        x: cx - newW / 2,
        y: cy - newH / 2,
      })
    } else {
      // Hand mode (or no selection): zoom canvas centered on content center
      const center = getContentCenter()
      zoomCanvasAroundPoint(1.2, center.x, center.y)
    }
  }, [toolMode, selectedNodeId, nodes, updateNode, getContentCenter, zoomCanvasAroundPoint])

  const handleZoomOut = useCallback(() => {
    if (toolMode === 'select' && selectedNodeId) {
      // Select mode: scale the selected element (shrink)
      const node = nodes.find((n) => n.id === selectedNodeId)
      if (!node) return
      const factor = 0.8
      const newW = Math.max(50, node.width * factor)
      const newH = Math.max(50, node.height * factor)
      const cx = node.x + node.width / 2
      const cy = node.y + node.height / 2
      updateNode(selectedNodeId, {
        width: newW,
        height: newH,
        x: cx - newW / 2,
        y: cy - newH / 2,
      })
    } else {
      // Hand mode (or no selection): zoom canvas centered on content center
      const center = getContentCenter()
      zoomCanvasAroundPoint(0.8, center.x, center.y)
    }
  }, [toolMode, selectedNodeId, nodes, updateNode, getContentCenter, zoomCanvasAroundPoint])

  const handleFitCanvas = useCallback(() => {
    if (!viewportRef.current || nodes.length === 0) return
    const vw = viewportRef.current.clientWidth
    const vh = viewportRef.current.clientHeight

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const n of nodes) {
      minX = Math.min(minX, n.x)
      minY = Math.min(minY, n.y)
      maxX = Math.max(maxX, n.x + n.width)
      maxY = Math.max(maxY, n.y + n.height)
    }

    const contentW = maxX - minX
    const contentH = maxY - minY
    const padding = 100

    const newScale = Math.min(
      (vw - padding * 2) / contentW,
      (vh - padding * 2) / contentH,
      2
    )

    setScale(newScale)
    setOffset({
      x: (vw - contentW * newScale) / 2 - minX * newScale,
      y: (vh - contentH * newScale) / 2 - minY * newScale,
    })
  }, [nodes])

  // Determine viewport cursor
  const getViewportCursor = () => {
    const action = dragAction.current
    if (action.type === 'pan') return 'grabbing'
    if (action.type === 'move') return 'move'
    if (toolMode === 'hand') return 'grab'
    return 'default'
  }

  // --- Render ---
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Viewport */}
      <div
        ref={viewportRef}
        className="viewport w-full h-full relative overflow-hidden [background-image:radial-gradient(circle,#ccc_1px,transparent_1px)]"
        style={{
          backgroundPosition: `${offset.x}px ${offset.y}px`,
          backgroundSize: `${15 * scale}px ${15 * scale}px`,
          cursor: getViewportCursor(),
        }}
        onWheel={handleWheel}
        onMouseDown={handleViewportMouseDown}
      >
        {/* Top Toolbar */}
        <TopToolbar
          toolMode={toolMode}
          onToolModeChange={handleToolModeChange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitCanvas={handleFitCanvas}
          onAddFrame={handleAddFrame}
        />

        {/* Canvas Content Layer */}
        <div
          className="locating-container origin-top-left [--text-node-default-line-height:1]"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          {/* Render Nodes */}
          {nodes.map((node) => (
            <CanvasNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              borderWidth={borderWidth}
              handleSize={handleSize}
              titleScale={titleScale}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onResizeMouseDown={(e, corner) => handleResizeMouseDown(e, node.id, corner)}
              onRotateMouseDown={(e) => handleRotateMouseDown(e, node.id)}
            />
          ))}
        </div>
      </div>

      {/* Floating Menu (only when a node is selected) */}
      {selectedNode && (
        <FloatingMenu
          left={floatingMenuPos.left}
          top={floatingMenuPos.top}
          editText={editText}
          onEditTextChange={setEditText}
          onDelete={handleDeleteSelected}
          onExportFormat={handleExportFormat}
        />
      )}
    </div>
  )
}

/* ============================
   Top Toolbar Component
   ============================ */

interface TopToolbarProps {
  toolMode: ToolMode
  onToolModeChange: (mode: ToolMode) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFitCanvas: () => void
  onAddFrame: () => void
}

function TopToolbar({
  toolMode,
  onToolModeChange,
  onZoomIn,
  onZoomOut,
  onFitCanvas,
  onAddFrame,
}: TopToolbarProps) {
  const btnBase =
    'cursor-pointer border flex justify-center items-center w-10 h-10 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px active:translate-y-0 active:shadow-[0_1px_4px_rgba(0,0,0,0.05)]'
  const btnInactive =
    'text-[#232425] bg-[#fcfcfc] border-[#eaeaea] rounded-lg hover:bg-[#f5f5f5]'
  const btnActive =
    'text-white bg-[#232425] border-[#e2e8f0] rounded-xl hover:bg-[#1a1b1c] active:bg-[#0f1011]'

  return (
    <div className="backdrop-blur-[5px] z-[100] bg-white/45 border border-white/20 rounded-xl flex flex-row flex-wrap content-start items-start gap-2 h-14 px-3 py-2 absolute top-[19px] left-1/2 -translate-x-1/2 max-[1220px]:bg-transparent max-[1220px]:border-0 max-[1220px]:h-auto max-[1220px]:p-0 max-[1220px]:left-full max-[1220px]:translate-x-[calc(-100%-16px)]">
      <button
        className={`${btnBase} ${toolMode === 'select' ? btnActive : btnInactive} max-[1220px]:hidden`}
        title="选择模式"
        onClick={() => onToolModeChange('select')}
      >
        <SelectIcon />
      </button>
      <button
        className={`${btnBase} ${toolMode === 'hand' ? btnActive : btnInactive} max-[1220px]:hidden`}
        title="手型模式"
        onClick={() => onToolModeChange('hand')}
      >
        <HandIcon />
      </button>
      <button
        className={`${btnBase} ${btnInactive} max-[1220px]:hidden`}
        title="放大"
        onClick={onZoomIn}
      >
        <ZoomInIcon />
      </button>
      <button
        className={`${btnBase} ${btnInactive} max-[1220px]:hidden`}
        title="缩小"
        onClick={onZoomOut}
      >
        <ZoomOutIcon />
      </button>
      <button
        type="button"
        className={`${btnBase} ${btnInactive} max-[1220px]:hidden`}
        title="添加画框"
        onClick={onAddFrame}
      >
        <AddFrameIcon />
      </button>
      <button
        className={`${btnBase} ${btnInactive} max-[1220px]:hidden`}
        title="全画布"
        onClick={onFitCanvas}
      >
        <FitCanvasIcon />
      </button>
      <button
        className={`${btnBase} ${btnInactive} hidden max-[1220px]:block`}
        title="关闭"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

/* ============================
   Canvas Node Component
   ============================ */

interface CanvasNodeProps {
  node: NodeData
  isSelected: boolean
  borderWidth: number
  handleSize: number
  titleScale: number
  onMouseDown: (e: React.MouseEvent) => void
  onResizeMouseDown: (e: React.MouseEvent, corner: ResizeCorner) => void
  onRotateMouseDown: (e: React.MouseEvent) => void
}

function CanvasNode({
  node, isSelected, borderWidth, handleSize, titleScale,
  onMouseDown, onResizeMouseDown, onRotateMouseDown,
}: CanvasNodeProps) {
  const selectionColor = 'rgb(15, 127, 255)'

  return (
    <div
      data-canvas-node={node.id}
      style={{
        position: 'absolute',
        left: node.x,
        top: node.y,
        transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
        transformOrigin: `${node.width / 2}px ${node.height / 2}px`,
      }}
      onMouseDown={onMouseDown}
    >
      <div
        className="relative"
        style={{
          width: node.width,
          height: node.height,
          boxShadow: isSelected ? `${selectionColor} 0px 0px 0px ${borderWidth}px` : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Page Title */}
        <div
          className="pointer-events-auto overflow-hidden text-ellipsis select-none whitespace-nowrap absolute"
          style={{
            transform: `scale(${titleScale})`,
            transformOrigin: 'left bottom',
            bottom: `calc(100% - ${titleScale}px)`,
            left: 0,
            maxWidth: 307.2,
          }}
        >
          <span className="text-[#999] font-sans text-[13px] leading-none">{node.title}</span>
        </div>

        {/* Image */}
        <div className="overflow-hidden flex justify-center items-center w-full h-full relative">
          <div className="flex justify-center items-center w-full h-full relative">
            {node.imageSrc ? (
              <img src={node.imageSrc} alt={node.title} className="object-contain select-none w-full h-full" draggable={false} />
            ) : (
              <div className="w-full h-full bg-[#ececec]" aria-hidden />
            )}
          </div>
        </div>

        {/* Selection Handles (only when selected) */}
        {isSelected && (
          <>
            {[
              {
                corner: 'tl' as const,
                left: -handleSize / 2,
                top: -handleSize / 2,
                cursor: 'nwse-resize' as const,
              },
              {
                corner: 'tr' as const,
                left: node.width - handleSize / 2,
                top: -handleSize / 2,
                cursor: 'nesw-resize' as const,
              },
              {
                corner: 'br' as const,
                left: node.width - handleSize / 2,
                top: node.height - handleSize / 2,
                cursor: 'nwse-resize' as const,
              },
              {
                corner: 'bl' as const,
                left: -handleSize / 2,
                top: node.height - handleSize / 2,
                cursor: 'nesw-resize' as const,
              },
            ].map(({ corner, left, top, cursor }) => (
              <div
                key={`resize-${corner}`}
                className="box-border select-none hover:scale-[1.2]"
                onMouseDown={(e) => onResizeMouseDown(e, corner)}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: handleSize,
                  height: handleSize,
                  backgroundColor: '#fff',
                  border: `${borderWidth}px solid ${selectionColor}`,
                  borderRadius: handleSize / 2,
                  cursor,
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              />
            ))}

            {/* Rotation line (12 o'clock direction) */}
            <div
              style={{
                position: 'absolute',
                left: node.width / 2 - borderWidth / 2,
                top: -100,
                width: borderWidth,
                height: 100,
                backgroundColor: selectionColor,
                pointerEvents: 'none',
                zIndex: 9,
              }}
            />

            {/* Rotation handle */}
            <div
              className="box-border select-none hover:scale-[1.2]"
              onMouseDown={onRotateMouseDown}
              style={{
                position: 'absolute',
                left: node.width / 2 - handleSize / 2,
                top: -100 - handleSize / 2,
                width: handleSize,
                height: handleSize,
                backgroundColor: '#fff',
                border: `${borderWidth}px solid ${selectionColor}`,
                borderRadius: handleSize / 2,
                cursor: 'grab',
                pointerEvents: 'auto',
                zIndex: 10,
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

/* ============================
   Floating Menu Component
   ============================ */

interface FloatingMenuProps {
  left: number
  top: number
  editText: string
  onEditTextChange: (val: string) => void
  onDelete: () => void
  onExportFormat: (format: ExportFormat) => void | Promise<void>
}

function FloatingMenu({
  left,
  top,
  editText,
  onEditTextChange,
  onDelete,
  onExportFormat,
}: FloatingMenuProps) {
  const [editPanelOpen, setEditPanelOpen] = useState(true)

  const menuBtnBase =
    'text-inherit cursor-pointer whitespace-nowrap bg-transparent border-0 rounded-lg flex items-center gap-1.5 h-full px-3 py-1 font-[Arial,sans-serif] text-sm enabled:hover:bg-[#f5f5f5] enabled:active:bg-[#e8e9ea] enabled:active:translate-y-px focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div
      className="z-[100] flex flex-col gap-[18px] absolute translate-x-[calc(28px-50%)]"
      style={{ left, top }}
    >
      <div className="rounded-lg flex items-center gap-3">
        <div className="flex items-center">
          {/* Dashed frame icon: toggle edit description panel */}
          <div className="bg-white p-0.5 flex items-center justify-center rounded-xl mr-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <button
              type="button"
              className={`flex items-center gap-1.5 h-9 box-border cursor-pointer px-3 py-1 rounded-lg whitespace-nowrap transition-colors bg-white border-0 enabled:hover:bg-[#f5f5f5]${!editPanelOpen ? ' is-open' : ''}`}
              title={editPanelOpen ? '收起编辑描述' : '展开编辑描述'}
              aria-expanded={editPanelOpen}
              onClick={() => setEditPanelOpen((o) => !o)}
            >
              <DashedFrameIcon />
            </button>
          </div>

          {/* Main action buttons */}
          <div className="text-[#232425] bg-white border border-[#eaeaea] rounded-xl flex items-center h-10 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <button className={menuBtnBase}>
              <AiEditIcon />
              <span className="font-[Arial] text-sm z-[1] tracking-normal font-normal leading-[150%] relative">编辑文本</span>
            </button>

            <div className="bg-[#eaeaea] w-px h-4 mx-1.5" />

            <button className={menuBtnBase}>
              <span className="font-[Arial] text-sm z-[1] tracking-normal font-normal leading-[150%] relative">工具箱</span>
            </button>

            <div className="bg-[#eaeaea] w-px h-4 mx-1.5 max-[1220px]:hidden" />

            <div className="max-[1220px]:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`${menuBtnBase} gap-2 data-[popup-open]:text-white data-[popup-open]:bg-[rgb(15,127,255)] data-[popup-open]:hover:bg-[rgb(12,108,220)]`}
                >
                  <span className="font-[Arial] text-sm z-[1] tracking-normal font-normal leading-[150%] relative">添加元素</span>
                  <DropdownArrowIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={6}>
                  <DropdownMenuItem>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="add-el-text-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                        <rect width="16" height="16" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#add-el-text-mask)">
                        <path d="M3 5V4C3 3.44772 3.44772 3 4 3H12C12.5523 3 13 3.44772 13 4V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M6 12H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M8 3.5V11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    </svg>
                    添加文本
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="add-el-img-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                        <rect width="16" height="16" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#add-el-img-mask)">
                        <path d="M3 5V11C3 12.1046 3.89543 13 5 13H11C12.1046 13 13 12.1046 13 11V5C13 3.89543 12.1046 3 11 3H5C3.89543 3 3 3.89543 3 5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M8.5 9.50005C9.5 8.50005 12 8.5 13 9.99999" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M3.5 7C5.33333 7 9.1 8.2 9.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    </svg>
                    添加图片
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="add-el-draw-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                        <rect width="16" height="16" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#add-el-draw-mask)">
                        <path d="M6.68343 10.5959L10.2621 4.39743C10.6764 3.67999 10.4305 2.7626 9.7131 2.34839C8.99566 1.93418 8.07828 2.17999 7.66406 2.89743L4.08535 9.09593C3.96113 9.31109 3.87809 9.54751 3.84047 9.79308L3.55607 11.6496C3.51041 11.9476 3.65228 12.2431 3.91337 12.3938C4.17446 12.5446 4.50129 12.5197 4.73654 12.3311L6.20212 11.1566C6.39599 11.0012 6.55921 10.8111 6.68343 10.5959Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        <path d="M4 9L6.5 10.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M4 12.5235C9.29381 14.7565 9.29381 8.17201 14 12.5235" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    </svg>
                    涂鸦
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="bg-[#eaeaea] w-px h-4 mx-1.5" />

            {/* Export dropdown — shadcn DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`${menuBtnBase} gap-2 data-[popup-open]:text-white data-[popup-open]:bg-[rgb(15,127,255)] data-[popup-open]:hover:bg-[rgb(12,108,220)]`}
                title="导出"
              >
                <span className="font-[Arial] text-sm z-[1] tracking-normal font-normal leading-[150%] relative">导出</span>
                <DropdownArrowIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={6}>
                <DropdownMenuItem onSelect={() => void onExportFormat('png')}>
                  PNG
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void onExportFormat('svg')}>
                  SVG
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void onExportFormat('pdf')}>
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Delete button */}
        <div className="text-[#232425] bg-white border border-[#eaeaea] rounded-xl flex items-center h-10 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            className={`${menuBtnBase} [&_svg]:w-4 [&_svg]:h-4`}
            title="删除"
            onClick={onDelete}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {/* Edit textarea */}
      {editPanelOpen && (
        <div className="relative">
          <div className="w-full min-w-[316px] flex max-[768px]:min-w-[280px]">
            <div className="bg-white rounded-xl flex flex-col gap-3 w-full p-3 transition-[border-color,box-shadow] duration-150 relative shadow-[0_4px_10px_rgba(0,0,0,0.15)] max-[768px]:p-2.5">
              <textarea
                className="resize-none bg-transparent border-0 outline-none flex-1 max-h-[120px] p-0 font-inherit text-sm leading-none placeholder:text-[#ccc] placeholder:opacity-100"
                placeholder="Describe what you want to Edit"
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
              />
              <div className="flex justify-center items-center gap-2">
                <button
                  className="bg-[rgb(38,38,38)] text-white rounded-[35%] border-0 flex justify-center items-center w-7 h-7 ml-auto p-0 cursor-pointer enabled:hover:bg-[rgb(58,58,58)] disabled:bg-[rgb(244,244,244)] disabled:text-[rgb(144,148,153)] disabled:cursor-not-allowed"
                  title="应用"
                  disabled={!editText.trim()}
                >
                  <SubmitIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
