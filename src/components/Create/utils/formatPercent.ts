export const formatPercent = (percent: number) => {
  if (Number.isInteger(percent)) {
    return `${percent}%`
  }
  return `${percent.toFixed(2)}%`
}
