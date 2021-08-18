import { constants } from 'ethers'

export type Strategy = {
  address: string
  name: string
  description?: string
  unknown?: boolean
}

export const ballotStrategies: Strategy[] = [
  {
    name: '7-day delay',
    description:
      'A reconfiguration to an upcoming funding cycle must be submitted at least 7 days before it starts.',
    address: '0xEf7480b6E7CEd228fFB0854fe49A428F562a8982',
  },
  {
    name: 'No strategy',
    description:
      'Any reconfiguration to an upcoming funding cycle will take effect once the current cycle ends. A project with no strategy may vulnerable to being rug-pulled by its owner.',
    address: constants.AddressZero,
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
