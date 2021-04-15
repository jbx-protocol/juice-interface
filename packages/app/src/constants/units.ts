export const SECONDS_IN_DAY = 86400

export const SECONDS_MULTIPLIER =
  process.env.NODE_ENV === 'production' ? SECONDS_IN_DAY : 1
