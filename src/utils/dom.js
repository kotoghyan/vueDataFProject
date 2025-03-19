export const generatePadding = (padding) => {
  if (Array.isArray(padding)) {
    const [vertical, horizontal] = padding
    return {
      paddingTop: vertical,
      paddingRight: horizontal,
      paddingBottom: vertical,
      paddingLeft: horizontal,
    }
  }

  if (typeof padding === 'object') {
    const output = {}

    if (padding.top !== undefined) {
      output.paddingTop = padding.top
    }
    if (padding.bottom !== undefined) {
      output.paddingBottom = padding.bottom
    }
    if (padding.left !== undefined) {
      output.paddingLeft = padding.left
    }
    if (padding.right !== undefined) {
      output.paddingRight = padding.right
    }

    return output
  }
}
