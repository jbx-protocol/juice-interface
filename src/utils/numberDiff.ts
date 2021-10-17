
export const numbersDiff = (a?: number, b?: number) => {
  if ((a && !b) || (!a && b)) return true

  return a && b ? a !== b : false
}
