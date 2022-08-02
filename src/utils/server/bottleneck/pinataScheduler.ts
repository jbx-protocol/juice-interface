import Bottleneck from 'bottleneck'

// Back off for 3 secs - pinata rate limits for 180/min
const PINATA_RATE_LIMIT_SECONDS = 180
const SECONDS_IN_MINUTES = 60

export const generatePinataScheduler = (id?: string) => {
  const pinataApiCallsPermittedPerSecond =
    PINATA_RATE_LIMIT_SECONDS / SECONDS_IN_MINUTES
  return new Bottleneck({
    minTime: Math.round((1 / pinataApiCallsPermittedPerSecond) * 1000),
    id,
  })
}

export const GlobalPinataScheduler = generatePinataScheduler(
  `money.juicebox.pinata-global-scheduler`,
)
