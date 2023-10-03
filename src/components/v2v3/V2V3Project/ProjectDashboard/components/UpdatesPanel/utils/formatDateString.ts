const MonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const formatDateString = (date: Date) => {
  return (
    date.getUTCDate() +
    ' ' +
    MonthNames[date.getUTCMonth()] +
    ' ' +
    date.getUTCFullYear() +
    ' ' +
    String(date.getUTCHours()).padStart(2, '0') +
    ':' +
    String(date.getUTCMinutes()).padStart(2, '0') +
    ' ' +
    'UTC'
  )
}
