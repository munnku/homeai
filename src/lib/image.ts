'use client'

const MAX_WIDTH = 800
const JPEG_QUALITY = 0.75

export async function compressImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const canvas = document.createElement('canvas')
      const scale = Math.min(1, MAX_WIDTH / img.width)
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Canvas toBlob failed')); return }
          const reader = new FileReader()
          reader.onloadend = () => {
            const dataUrl = reader.result as string
            const base64 = dataUrl.split(',')[1]
            resolve({ base64, mimeType: 'image/jpeg' })
          }
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }

    img.onerror = reject
    img.src = url
  })
}
