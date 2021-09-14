import { BigNumber } from '@ethersproject/bignumber'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'

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

  const symbol = useContractReader<BigNumber>({
    contract,
    functionName: 'symbol',
  })

  if (balance === undefined) return null

  return (
    <div style={style}>
      {formatWad(balance, { decimals: decimals ?? 0 })} {symbol}
    </div>
  )
}
