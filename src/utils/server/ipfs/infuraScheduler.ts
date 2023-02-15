import Bottleneck from 'bottleneck'

// Back off for 3 secs - pinata rate limits for 180/min
const INFURA_RATE_LIMIT_SECONDS = 1000
const SECONDS_IN_MINUTES = 60

const createInfuraScheduler = (id?: string) => {
  const infuraApiCallsPermittedPerSecond =
    INFURA_RATE_LIMIT_SECONDS / SECONDS_IN_MINUTES
  return new Bottleneck({
    minTime: Math.round((1 / infuraApiCallsPermittedPerSecond) * 1000),
    id,
  })
}

export const GlobalInfuraScheduler = createInfuraScheduler(
  `money.juicebox.infura-global-scheduler`,
)
