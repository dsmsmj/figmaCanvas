import { useState, useRef, useCallback, useEffect } from 'react'
import canvasImg from './assets/imges.png'
import './App.css'

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
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="menu-icon">
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
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="menu-icon">
    <rect x="2.08984" y="3" width="11" height="11" rx="1.1" stroke="currentColor" strokeDasharray="2.8 2.8" />
  </svg>
)

const DropdownArrowIcon = () => (
  <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

type DragAction =
  | { type: 'none' }
  | { type: 'pan' }
  | { type: 'move'; nodeId: string }
  | { type: 'resize'; nodeId: string; corner: number }
  | { type: 'rotate'; nodeId: string }

interface NodeData {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotation: number // degrees
  title: string
  imageSrc: string
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

  // --- Refs ---
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragAction = useRef<DragAction>({ type: 'none' })
  const lastMousePos = useRef<Position>({ x: 0, y: 0 })
  // Snapshot of node state at drag start (for resize & rotate)
  const dragStartNode = useRef<NodeData | null>(null)
  const dragStartMouse = useRef<Position>({ x: 0, y: 0 })

  // --- Computed ---
  const borderWidth = 6.66667
  const handleSize = 46.6667
  const titleScale = 3.33333

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

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
    (e: React.MouseEvent, nodeId: string, corner: number) => {
      if (toolMode !== 'select') return
      e.stopPropagation()
      e.preventDefault()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return
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
        setNodes((prev) =>
          prev.map((n) =>
            n.id === action.nodeId
              ? { ...n, x: n.x + dx / scale, y: n.y + dy / scale }
              : n
          )
        )
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      } else if (action.type === 'resize') {
        const startNode = dragStartNode.current
        if (!startNode) return
        const totalDx = (e.clientX - dragStartMouse.current.x) / scale
        const totalDy = (e.clientY - dragStartMouse.current.y) / scale
        const aspect = startNode.width / startNode.height

        // Each corner has a diagonal direction; project mouse delta onto it
        // so both X and Y mouse movement contribute naturally.
        // Direction vectors: TL=(-1,-1), TR=(1,-1), BR=(1,1), BL=(-1,1)
        const dirs: Record<number, [number, number]> = {
          0: [-1, -1], // TL
          1: [1, -1],  // TR
          2: [1, 1],   // BR
          3: [-1, 1],  // BL
        }
        const [dirX, dirY] = dirs[action.corner]
        // Normalize: length of (1,1) = sqrt(2)
        const invLen = 1 / Math.SQRT2
        // Projected distance along the diagonal
        const projected = (totalDx * dirX + totalDy * dirY) * invLen
        // Convert diagonal distance to width delta (diagonal of rect has ratio sqrt(1 + 1/aspect^2) to width)
        const diagToWidth = Math.SQRT2 // simplified: equal contribution from both axes
        const widthDelta = projected * diagToWidth

        const newW = Math.max(50, startNode.width + widthDelta)
        const newH = newW / aspect

        let newX = startNode.x
        let newY = startNode.y

        // Anchor the opposite corner
        const corner = action.corner
        if (corner === 0) {
          // TL dragged → anchor BR
          newX = startNode.x + startNode.width - newW
          newY = startNode.y + startNode.height - newH
        } else if (corner === 1) {
          // TR dragged → anchor BL
          newY = startNode.y + startNode.height - newH
        } else if (corner === 2) {
          // BR dragged → anchor TL (x,y stay)
        } else if (corner === 3) {
          // BL dragged → anchor TR
          newX = startNode.x + startNode.width - newW
        }

        updateNode(action.nodeId, { x: newX, y: newY, width: newW, height: newH })
      } else if (action.type === 'rotate') {
        const startNode = dragStartNode.current
        if (!startNode) return
        // Center of the node in screen coords
        const rect = viewportRef.current?.getBoundingClientRect()
        if (!rect) return
        const centerScreenX = rect.left + offset.x + (startNode.x + startNode.width / 2) * scale
        const centerScreenY = rect.top + offset.y + (startNode.y + startNode.height / 2) * scale

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
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [scale, offset, updateNode])

  // Prevent default wheel scroll on the viewport
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const prevent = (e: WheelEvent) => e.preventDefault()
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
    <div className="canvas-container">
      {/* Viewport */}
      <div
        ref={viewportRef}
        className="viewport"
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
          onToolModeChange={setToolMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitCanvas={handleFitCanvas}
        />

        {/* Canvas Content Layer */}
        <div
          className="locating-container"
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
}

function TopToolbar({ toolMode, onToolModeChange, onZoomIn, onZoomOut, onFitCanvas }: TopToolbarProps) {
  return (
    <div className="canvas-top-toolbar has-content">
      <button
        className={`toolbar-button mobile-invisible ${toolMode === 'select' ? 'active' : ''}`}
        title="选择模式"
        onClick={() => onToolModeChange('select')}
      >
        <SelectIcon />
      </button>
      <button
        className={`toolbar-button mobile-invisible ${toolMode === 'hand' ? 'active' : ''}`}
        title="手型模式"
        onClick={() => onToolModeChange('hand')}
      >
        <HandIcon />
      </button>
      <button className="toolbar-button mobile-invisible" title="放大" onClick={onZoomIn}>
        <ZoomInIcon />
      </button>
      <button className="toolbar-button mobile-invisible" title="缩小" onClick={onZoomOut}>
        <ZoomOutIcon />
      </button>
      <button className="toolbar-button mobile-invisible" title="添加画框">
        <AddFrameIcon />
      </button>
      <button className="toolbar-button mobile-invisible" title="全画布" onClick={onFitCanvas}>
        <FitCanvasIcon />
      </button>
      <button className="toolbar-button mobile-only" title="关闭">
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
  onResizeMouseDown: (e: React.MouseEvent, corner: number) => void
  onRotateMouseDown: (e: React.MouseEvent) => void
}

function CanvasNode({
  node, isSelected, borderWidth, handleSize, titleScale,
  onMouseDown, onResizeMouseDown, onRotateMouseDown,
}: CanvasNodeProps) {
  const selectionColor = 'rgb(15, 127, 255)'

  return (
    <div
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
        className="content-wrapper"
        style={{
          width: node.width,
          height: node.height,
          boxShadow: isSelected ? `${selectionColor} 0px 0px 0px ${borderWidth}px` : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Page Title */}
        <div
          className="page-title"
          style={{
            transform: `scale(${titleScale})`,
            transformOrigin: 'left bottom',
            bottom: `calc(100% - ${titleScale}px)`,
            left: 0,
            maxWidth: 307.2,
          }}
        >
          <span className="page-title-text">{node.title}</span>
        </div>

        {/* Image */}
        <div className="image-node">
          <div className="image-container">
            <img src={node.imageSrc} alt={node.title} className="image-content" draggable={false} />
          </div>
        </div>

        {/* Selection Handles (only when selected) */}
        {isSelected && (
          <>
            {/* Corner resize handles: 0=TL, 1=TR, 2=BR, 3=BL */}
            {[
              { left: -handleSize / 2, top: -handleSize / 2, cursor: 'nwse-resize' },
              { left: node.width - handleSize / 2, top: -handleSize / 2, cursor: 'nesw-resize' },
              { left: node.width - handleSize / 2, top: node.height - handleSize / 2, cursor: 'nwse-resize' },
              { left: -handleSize / 2, top: node.height - handleSize / 2, cursor: 'nesw-resize' },
            ].map((pos, i) => (
              <div
                key={`resize-${i}`}
                className="resize-handle"
                onMouseDown={(e) => onResizeMouseDown(e, i)}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  width: handleSize,
                  height: handleSize,
                  backgroundColor: '#fff',
                  border: `${borderWidth}px solid ${selectionColor}`,
                  borderRadius: handleSize / 2,
                  cursor: pos.cursor,
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              />
            ))}

            {/* Rotation line (12 o'clock direction) */}
            <div
              className="rotation-line"
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
              className="rotation-handle"
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
}

function FloatingMenu({ left, top, editText, onEditTextChange }: FloatingMenuProps) {
  return (
    <div
      className="floating-menu-wrapper only-button-group has-delete-button"
      style={{ left, top }}
    >
      <div className="floating-menu">
        <div className="flex-row" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Dashed frame icon button */}
          <div className="frame-icon-container">
            <div className="frame-icon-btn">
              <DashedFrameIcon />
            </div>
          </div>

          {/* Main action buttons */}
          <div className="menu-container">
            <button className="menu-btn">
              <AiEditIcon />
              <span className="btn-text">编辑文本</span>
            </button>

            <div className="separator" />

            <button className="menu-btn">
              <span className="btn-text">工具箱</span>
            </button>

            <div className="separator mobile-invisible" />

            <div className="add-button-wrapper mobile-invisible">
              <button className="menu-btn add-btn">
                <span className="btn-text">添加元素</span>
                <DropdownArrowIcon />
              </button>
            </div>

            <div className="separator" />

            <div className="export-button-wrapper">
              <button className="menu-btn export-btn">
                <span className="btn-text">导出</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <div className="menu-container delete-container">
          <button className="menu-btn delete-btn">
            <DeleteIcon />
          </button>
        </div>
      </div>

      {/* Edit textarea */}
      <div className="dimension-input-container">
        <div className="edit-input-group">
          <div className="edit-input-wrapper">
            <textarea
              className="edit-textarea"
              placeholder="Describe what you want to Edit"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
            />
            <div className="edit-input-bottom-row">
              <button
                className="menu-btn edit-apply-btn"
                title="应用"
                disabled={!editText.trim()}
              >
                <SubmitIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
