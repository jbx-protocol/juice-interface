import { constants } from 'ethers'

export type Strategy = {
  address: string
  name: string
  description?: string
  unknown?: boolean
}

export const ballotStrategies: Strategy[] = [
  {
    name: 'No strategy',
    description:
      'Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may be vulnerable to being rug-pulled by its owner.',
    address: constants.AddressZero,
  },
  {
    name: '7-day delay',
    description:
      'A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.',
    address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
  },
  {
    name: '3-day delay',
    description:
      'A reconfiguration to an upcoming funding cycle must be submitted at least 3 days before it starts.',
    address: '0x6d6da471703647Fd8b84FFB1A29e037686dBd8b2',
  },
]

const customStrategy = (address: string): Strategy => ({
  address,
  name: 'Custom strategy',
  description: 'Unrecognized strategy contract. Make sure this is correct!',
  unknown: true,
})

export const getBallotStrategyByAddress = (address: string) =>
  ballotStrategies.find(
    s => s.address.toLowerCase() === address.toLowerCase(),
  ) ?? customStrategy(address)
