type Format = 'long' | 'short'
export const timeSecondsToDateString = (
  timeInSeconds: number,
  format: Format = 'long',
) => {
  const days = Math.floor(timeInSeconds / 86400)
  const hours = Math.floor((timeInSeconds % 86400) / 3600)
  const minutes = Math.floor(((timeInSeconds % 86400) % 3600) / 60)
  const seconds = Math.floor(((timeInSeconds % 86400) % 3600) % 60)
  switch (format) {
    case 'short': {
      const i = [days, hours, minutes, seconds].findIndex(v => v > 0)
      if (i === -1) return '0 Seconds'
      const [d, h, m, s] = [days, hours, minutes, seconds]
      if (i === 0) return `${d} Day${d > 1 || d === 0 ? 's' : ''}`
      if (i === 1) return `${h} Hour${h > 1 || h === 0 ? 's' : ''}`
      if (i === 2) return `${m} Minute${m > 1 || m === 0 ? 's' : ''}`
      if (i === 3) return `${s} Second${s > 1 || s === 0 ? 's' : ''}`
      return ''
    }
    case 'long':
    default:
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }
}
