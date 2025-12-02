/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {number} [maxSizeMB=5] - 最大允许大小（单位：MB）
 * @returns {Promise<File>} 压缩后的 File 对象
 */
export async function compressImage(file, maxSizeMB = 5) {
  const maxSize = maxSizeMB * 1024 * 1024

  const image = await loadImage(file)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const maxWidth = 1920
  const ratio = image.width / image.height

  if (image.width > maxWidth) {
    canvas.width = maxWidth
    canvas.height = maxWidth / ratio
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  // 压缩导出
  let quality = 0.92 // 初始质量
  let blob = null

  while (quality > 0.1) {
    blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality)
    })

    if (blob && blob.size <= maxSize) break
    quality -= 0.05
  }

  // 新的 File 对象
  if (!blob) throw new Error("图片压缩失败")
  return new File([blob], file.name, { type: "image/jpeg" })
}

/**
 * 加载图片文件为 HTMLImageElement
 * @param {File} file - 图片文件
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("图片加载失败"))
    img.src = URL.createObjectURL(file)
  })
}
