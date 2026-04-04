/**
 * OCR 文字区域检测工具
 * 使用 Tesseract.js 在前端识别图片上的文本区域并返回边界框
 */
import { createWorker, type Worker } from 'tesseract.js'

export interface TextRegion {
  /** 像素坐标边界框（相对于原始图片尺寸） */
  bbox: { x0: number; y0: number; x1: number; y1: number }
  /** 识别到的文本内容 */
  text: string
  /** 置信度 0-100 */
  confidence: number
}

/** 缓存 worker 实例，避免重复初始化 */
let cachedWorker: Worker | null = null

async function getWorker(): Promise<Worker> {
  if (cachedWorker) return cachedWorker
  const worker = await createWorker('eng+chi_sim', undefined, {
    // 使用 CDN 加载语言包
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js',
  })
  cachedWorker = worker
  return worker
}

/**
 * 从图片数据中获取实际像素尺寸
 */
function getImageNaturalSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = src
  })
}

/**
 * 识别图片中的文字区域
 * @param imageSrc 图片的 src（可以是 data URL、blob URL 或普通 URL）
 * @param onProgress 可选的进度回调 (0~1)
 * @returns 检测到的文字区域数组
 */
export async function detectTextRegions(
  imageSrc: string,
  onProgress?: (progress: number) => void,
): Promise<{ regions: TextRegion[]; imageSize: { width: number; height: number } }> {
  onProgress?.(0)

  // 获取原始图片尺寸（用于坐标映射）
  const imageSize = await getImageNaturalSize(imageSrc)
  onProgress?.(0.1)

  const worker = await getWorker()
  onProgress?.(0.3)

  // 使用 word 级别识别以获取较细粒度的文字区域
  const result = await worker.recognize(imageSrc)
  onProgress?.(0.9)

  const regions: TextRegion[] = []

  // Tesseract.js v7: result.data.blocks -> paragraphs -> lines -> words
  const blocks = result.data.blocks
  if (blocks) {
    for (const block of blocks) {
      for (const para of block.paragraphs) {
        for (const line of para.lines) {
          for (const word of line.words) {
            // 过滤低置信度和空白文本
            if (word.confidence < 30 || !word.text.trim()) continue
            regions.push({
              bbox: word.bbox,
              text: word.text,
              confidence: word.confidence,
            })
          }
        }
      }
    }
  }

  onProgress?.(1)
  return { regions, imageSize }
}

/**
 * 合并相邻的文字区域（行级合并）
 * 将水平方向上距离较近、垂直方向重叠的 word 合并为一个行区域
 */
export function mergeAdjacentRegions(regions: TextRegion[], gapThreshold = 20): TextRegion[] {
  if (regions.length === 0) return []

  // 按 y 坐标排序，再按 x 排序
  const sorted = [...regions].sort((a, b) => {
    const yDiff = a.bbox.y0 - b.bbox.y0
    if (Math.abs(yDiff) > 10) return yDiff
    return a.bbox.x0 - b.bbox.x0
  })

  const merged: TextRegion[] = []
  let current = { ...sorted[0], bbox: { ...sorted[0].bbox } }

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]
    const currentMidY = (current.bbox.y0 + current.bbox.y1) / 2
    const nextMidY = (next.bbox.y0 + next.bbox.y1) / 2
    const lineHeight = Math.max(
      current.bbox.y1 - current.bbox.y0,
      next.bbox.y1 - next.bbox.y0,
    )

    // 判断是否在同一行：垂直中心距离 < 行高 * 0.6，水平间距 < gapThreshold
    const sameRow = Math.abs(currentMidY - nextMidY) < lineHeight * 0.6
    const closeHorizontally = next.bbox.x0 - current.bbox.x1 < gapThreshold

    if (sameRow && closeHorizontally) {
      // 合并
      current.bbox.x1 = Math.max(current.bbox.x1, next.bbox.x1)
      current.bbox.y0 = Math.min(current.bbox.y0, next.bbox.y0)
      current.bbox.y1 = Math.max(current.bbox.y1, next.bbox.y1)
      current.text += ' ' + next.text
      current.confidence = Math.min(current.confidence, next.confidence)
    } else {
      merged.push(current)
      current = { ...next, bbox: { ...next.bbox } }
    }
  }
  merged.push(current)

  return merged
}
