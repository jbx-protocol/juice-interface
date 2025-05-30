type Format = 'long' | 'short' | 'minimal'
type CaseFormat = 'sentence' | 'lower'
export const timeSecondsToDateString = (
  timeInSeconds: number,
  format: Format = 'long',
  caseFormat: CaseFormat = 'sentence',
) => {
  const days = Math.floor(timeInSeconds / 86400)
  const hours = Math.floor((timeInSeconds % 86400) / 3600)
  const minutes = Math.floor(((timeInSeconds % 86400) % 3600) / 60)
  const seconds = Math.floor(((timeInSeconds % 86400) % 3600) % 60)
  let formatted = ''

  switch (format) {
    case 'short': {
      const i = [days, hours, minutes, seconds].findIndex(v => v > 0)
      if (i === -1) {
        formatted = '0 Seconds'
        break
      }
      const [d, h, m, s] = [days, hours, minutes, seconds]
      if (i === 0) {
        formatted = `${d} Day${d > 1 || d === 0 ? 's' : ''}`
        break
      }
      if (i === 1) {
        formatted = `${h} Hour${h > 1 || h === 0 ? 's' : ''}`
        break
      }
      if (i === 2) {
        formatted = `${m} Minute${m > 1 || m === 0 ? 's' : ''}`
        break
      }
      if (i === 3) {
        formatted = `${s} Second${s > 1 || s === 0 ? 's' : ''}`
        break
      }
      break
    }
    case 'minimal': {
      // Show maximum of 2 units, starting with the most significant non-zero unit
      const units = [
        { value: days, suffix: 'd' },
        { value: hours, suffix: 'h' },
        { value: minutes, suffix: 'm' },
        { value: seconds, suffix: 's' },
      ]
      const nonZeroUnits = units.filter(unit => unit.value > 0)

      if (nonZeroUnits.length === 0) {
        formatted = '0s'
      } else {
        // Take up to 2 most significant units
        const relevantUnits = nonZeroUnits.slice(0, 2)
        formatted = relevantUnits.map(unit => `${unit.value}${unit.suffix}`).join(' ')
      }
      break
    }
    case 'long':
    default:
      formatted = `${days}d ${hours}h ${minutes}m ${seconds}s`
      break
  }

  if (caseFormat === 'lower') {
    return formatted.toLowerCase()
  }
  return formatted
}
