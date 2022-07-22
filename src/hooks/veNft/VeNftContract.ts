import { Contract } from '@ethersproject/contracts'

import { useMemo } from 'react'

import { veNftAbi } from 'constants/veNft/veNftAbi'

import { readProvider } from 'constants/readProvider'
import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

export function useVeNftContract() {
  const contract = useMemo(
    () => new Contract(VENFT_CONTRACT_ADDRESS, veNftAbi, readProvider),
    [],
  )

  return contract
}
