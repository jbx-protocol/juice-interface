import { BigNumber } from '@ethersproject/bignumber'
import useContractReaderV1 from 'hooks/v1/ContractReaderV1'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'

import FormattedAddress from './FormattedAddress'

export default function ERC20TokenBalance({
  tokenAddress,
  wallet,
  style,
  precision,
}: {
  tokenAddress: string | undefined
  wallet: string | undefined
  style?: CSSProperties
  precision?: number
}) {
  const contract = useErc20Contract(tokenAddress)

  const balance = useContractReaderV1<BigNumber>({
    contract,
    functionName: 'balanceOf',
    args: wallet ? [wallet] : null,
  })

  const symbol = useContractReaderV1<string>({
    contract,
    functionName: 'symbol',
  })

  const decimals = useContractReaderV1<number>({
    contract,
    functionName: 'decimals',
  })

  if (balance === undefined) return null

  return (
    <div style={style}>
      {formatWad(balance, {
        precision: precision ?? 0,
        decimals,
      })}{' '}
      <FormattedAddress label={symbol} address={tokenAddress} />
    </div>
  )
}
