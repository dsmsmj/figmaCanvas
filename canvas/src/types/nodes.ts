/* ============================================================
   场景节点类型系统
   基于 Figma 判别联合（Discriminated Union）设计思想：
   每种节点类型有独立的字段定义，避免单一宽泛 interface + 可选字段
   ============================================================ */

/** 所有节点共有的基础属性 */
export interface BaseNode {
  id: string
  /** 画布坐标 x（相对于画布原点） */
  x: number
  /** 画布坐标 y */
  y: number
  width: number
  height: number
  /** 旋转角度（degrees，绕节点中心顺时针） */
  rotation: number
  title: string
}

/** 涂鸦笔画数据 */
export interface DoodleStroke {
  /** SVG path data */
  d: string
  color: string
  width: number
}

/** 画框节点：可以包含图片，也可以是空白框 */
export interface FrameNode extends BaseNode {
  type: 'frame'
  imageSrc?: string
}

/** 文本节点 */
export interface TextNode extends BaseNode {
  type: 'text'
  textContent: string
  fontSize: number
  textColor: string
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textAlign: 'left' | 'center' | 'right'
}

/** 图片节点 */
export interface ImageNode extends BaseNode {
  type: 'image'
  imageSrc: string
}

/** 涂鸦节点 */
export interface DoodleNode extends BaseNode {
  type: 'doodle'
  strokes: DoodleStroke[]
  /** 涂鸦创建时的原始尺寸（用于 SVG viewBox 缩放） */
  viewBox: [number, number]
}

/** 场景节点联合类型 */
export type SceneNode = FrameNode | TextNode | ImageNode | DoodleNode

/** 内容节点（可被放入 Frame 的节点） */
export type ContentNode = TextNode | ImageNode | DoodleNode

/** 类型守卫 */
export function isFrameNode(n: SceneNode): n is FrameNode   { return n.type === 'frame'  }
export function isTextNode(n: SceneNode):  n is TextNode    { return n.type === 'text'   }
export function isImageNode(n: SceneNode): n is ImageNode   { return n.type === 'image'  }
export function isDoodleNode(n: SceneNode): n is DoodleNode { return n.type === 'doodle' }
export function isContentNode(n: SceneNode): n is ContentNode {
  return n.type === 'text' || n.type === 'image' || n.type === 'doodle'
}

/** 节点的 AABB 计算需要的字段（几何相关） */
export type NodeGeometry = Pick<BaseNode, 'x' | 'y' | 'width' | 'height' | 'rotation'>

/** 文本节点的默认样式值 */
export const TEXT_NODE_DEFAULTS = {
  textContent: '文本',
  fontSize: 80,
  textColor: '#000000',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal' as const,
  fontStyle: 'normal' as const,
  textAlign: 'left' as const,
}
