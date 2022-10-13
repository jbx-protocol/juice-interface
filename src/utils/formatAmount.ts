export const formatAmount = (amount: number | string) => {
  let a = amount
  if (typeof amount === 'string') {
    a = parseFloat(amount)
  }
  return a.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
