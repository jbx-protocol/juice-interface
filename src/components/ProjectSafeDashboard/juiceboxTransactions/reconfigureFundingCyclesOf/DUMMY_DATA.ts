import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { Split } from 'models/splits'

export const DUMMY_OLD_SPLITS: Split[] = [
  {
    beneficiary: '0x0028C35095D34C9C8a3bc84cB8542cB182fcfa8e',
    lockedUntil: undefined,
    percent: 30000000,
    preferClaimed: false,
    projectId: '1',
    allocator: NULL_ALLOCATOR_ADDRESS,
  },
  {
    beneficiary: '0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd',
    percent: 30000000,
    preferClaimed: false,
    projectId: undefined,
    allocator: NULL_ALLOCATOR_ADDRESS,
    lockedUntil: 10000000,
  },
  {
    beneficiary: '0x123a3c28eB9e701C173D3A73412489f3554F3005',
    percent: 50000000,
    preferClaimed: false,
    projectId: undefined,
    allocator: NULL_ALLOCATOR_ADDRESS,
    lockedUntil: 0,
  },
]

export const DUMMY_NEW_SPLITS: Split[] = [
  {
    beneficiary: '0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd',
    lockedUntil: undefined,
    percent: 40000000,
    preferClaimed: false,
    projectId: '1',
    allocator: NULL_ALLOCATOR_ADDRESS,
  },
  {
    beneficiary: '0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd',
    percent: 30000000,
    preferClaimed: false,
    projectId: undefined,
    allocator: NULL_ALLOCATOR_ADDRESS,
    lockedUntil: undefined,
  },
  {
    beneficiary: '0x03B0230AE22c4b9117328145382E9d6470B89868',
    percent: 50000000,
    preferClaimed: false,
    projectId: '2',
    allocator: NULL_ALLOCATOR_ADDRESS,
    lockedUntil: 0,
  },
]
