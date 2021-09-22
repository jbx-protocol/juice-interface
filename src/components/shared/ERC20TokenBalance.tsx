import { BigNumber } from '@ethersproject/bignumber'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'
import FormattedAddress from './FormattedAddress'

export default function ERC20TokenBalance({
  tokenAddress,
  wallet,
  style,
  decimals,
}: {
  tokenAddress: string | undefined
  wallet: string | undefined
  style?: CSSProperties
  decimals?: number
}) {
  const contract = useErc20Contract(tokenAddress)

  const balance = useContractReader<BigNumber>({
    contract,
    functionName: 'balanceOf',
    args: wallet ? [wallet] : null,
  })

  const symbol = useContractReader<string>({
    contract,
    functionName: 'symbol',
  })

  if (balance === undefined) return null

  return (
    <div style={style}>
      {formatWad(balance, { decimals: decimals ?? 0 })}{' '}
      <FormattedAddress label={symbol} address={tokenAddress} />
    </div>
  )
}
