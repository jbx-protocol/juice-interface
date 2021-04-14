const allowedChars = 'abcdefghijklmnopqrstuvwxyz1234567890_'

export const normalizeHandle = (handle: string) =>
  handle
    .toLowerCase()
    .split('')
    .filter(char => allowedChars.includes(char))
    .join('')
