import { BigNumber } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'
import { useCallback, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

import useContractReader from './v1/contractReader/ContractReader'

export function useEtherPrice() {
  const [price, setPrice] = useState<number>()

  useContractReader({
    contract: V1ContractName.Prices,
    functionName: 'getETHPriceFor',
    args: ['1'], // $1 USD
    callback: useCallback(
      (val?: BigNumber) => setPrice(parseFloat(fromWad(val))),
      [setPrice],
    ),
  })

  return price
}
