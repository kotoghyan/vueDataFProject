export const hexToRGB = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (result === null) {
    return null
  }

  const { r, g, b } = {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const waitUntil = (condition, interval, timeout) =>
  new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId)
        resolve()
      }
    }, interval)

    if (timeout) {
      setTimeout(() => {
        clearInterval(intervalId)
        reject()
      }, timeout)
    }
  })
