import { BigNumber } from '@ethersproject/bignumber'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { useCallback, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

import useContractReaderV1 from './ContractReaderV1'

export function useEtherPrice() {
  const [price, setPrice] = useState<number>()

  useContractReaderV1({
    contract: JuiceboxV1ContractName.Prices,
    functionName: 'getETHPriceFor',
    args: ['1'], // USD
    callback: useCallback(
      (val?: BigNumber) => setPrice(parseFloat(fromWad(val))),
      [setPrice],
    ),
  })

  return price
}
