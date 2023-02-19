import Bottleneck from 'bottleneck'

// # calls permitted to infura per second
// https://docs.infura.io/infura/networks/ipfs/how-to/request-rate-limits
const INFURA_RATE_LIMIT_SECONDS = 100

const createInfuraScheduler = (id?: string) => {
  return new Bottleneck({
    minTime: Math.round((1 / INFURA_RATE_LIMIT_SECONDS) * 1000),
    id,
  })
}

export const GlobalInfuraScheduler = createInfuraScheduler(
  `money.juicebox.infura-global-scheduler`,
)
