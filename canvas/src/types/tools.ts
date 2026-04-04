/* ============================================================
   工具与交互类型
   ============================================================ */

import type { Vec2 } from './geometry'
import type { ResizeCorner, FrameDir } from './geometry'

/** 当前激活的工具模式 */
export type ToolMode = 'select' | 'hand'

/**
 * 拖拽行为判别联合（Figma 式 Command 对象的简化版）
 * 记录当前正在进行的拖拽操作及其所需的上下文数据
 */
export type DragAction =
  | { type: 'none' }
  | { type: 'pan' }
  | { type: 'move';        nodeId: string }
  | { type: 'resize';      nodeId: string; corner: ResizeCorner }
  | { type: 'rotate';      nodeId: string }
  | { type: 'drawframe';   startCanvas: Vec2 }
  | { type: 'moveframe' }
  | { type: 'resizeframe'; dir: FrameDir }
  | { type: 'doodle' }

/** 视口变换状态（摄像机位置） */
export interface ViewportTransform {
  scale: number
  ox: number  // offset x
  oy: number  // offset y
}

export { type ResizeCorner, type FrameDir }
