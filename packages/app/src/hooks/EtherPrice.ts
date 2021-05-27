import { BigNumber } from '@ethersproject/bignumber'
import { ContractName } from 'models/contract-name'
import { useCallback, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

import useContractReader from './ContractReader'

export function useEtherPrice() {
  const [price, setPrice] = useState<number>()

  useContractReader({
    contract: ContractName.Prices,
    functionName: 'getETHPrice',
    args: ['1'], // USD
    callback: useCallback(
      (val?: BigNumber) => setPrice(parseFloat(fromWad(val))),
      [setPrice],
    ),
  })

  return price
}
