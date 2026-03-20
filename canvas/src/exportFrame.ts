import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export type ExportFormat = 'png' | 'svg' | 'pdf'

/** 与画布节点一致、用于 SVG 导出的字段 */
export interface ExportFrameNodeMeta {
  width: number
  height: number
  rotation: number
  title: string
  imageSrc?: string
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function safeExportBaseName(title: string): string {
  const t = (title || 'export').trim() || 'export'
  return t.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 80)
}

async function frameToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const maxSide = Math.max(el.offsetWidth, el.offsetHeight, 1)
  const scale = Math.min(2, Math.max(1, 2048 / maxSide))
  return html2canvas(el, {
    backgroundColor: '#ffffff',
    scale,
    useCORS: true,
    logging: false,
    onclone(_doc, cloned) {
      cloned.querySelectorAll('.resize-handle, .rotation-line, .rotation-handle').forEach((n) => {
        ;(n as HTMLElement).style.display = 'none'
      })
      const cw = cloned.querySelector('.content-wrapper') as HTMLElement | null
      if (cw) cw.style.boxShadow = 'none'
    },
  })
}

export async function downloadFramePng(el: HTMLElement, baseName: string): Promise<void> {
  const canvas = await frameToCanvas(el)
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `${baseName}.png`
  a.click()
}

export async function downloadFramePdf(el: HTMLElement, baseName: string): Promise<void> {
  const canvas = await frameToCanvas(el)
  const w = canvas.width
  const h = canvas.height
  const pdf = new jsPDF({
    orientation: w >= h ? 'landscape' : 'portrait',
    unit: 'px',
    format: [w, h],
  })
  const data = canvas.toDataURL('image/png', 1.0)
  pdf.addImage(data, 'PNG', 0, 0, w, h, undefined, 'FAST')
  pdf.save(`${baseName}.pdf`)
}

export function downloadFrameSvg(node: ExportFrameNodeMeta, baseName: string): void {
  const w = node.width
  const h = node.height
  const cx = w / 2
  const cy = h / 2
  const rot = node.rotation || 0
  let inner = ''
  if (node.imageSrc) {
    inner += `<image href="${escapeXml(node.imageSrc)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`
  } else {
    inner += `<rect width="${w}" height="${h}" fill="#ececec"/>`
  }
  inner += `<text x="12" y="28" font-family="system-ui, Arial, sans-serif" font-size="14" fill="#232425">${escapeXml(node.title)}</text>`
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="translate(${cx},${cy}) rotate(${rot}) translate(${-cx},${-cy})">
    ${inner}
  </g>
</svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${baseName}.svg`
  a.click()
  URL.revokeObjectURL(url)
}
