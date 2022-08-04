import { useAccount } from 'wagmi'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const V2ProjectTokenBalance = ({
  projectId,
  style,
  precision,
}: {
  projectId: number
  style?: CSSProperties
  precision?: number
}) => {
  const { data: tokenAddress } = useProjectToken({ projectId })
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const { address: userAddress } = useAccount()
  const { data: balance } = useTotalBalanceOf(userAddress, projectId)

  return (
    <div style={{ ...style }}>
      {tokenSymbol !== undefined ? (
        <>
          {formatWad(balance, { precision: precision ?? 0 })}{' '}
          {tokenSymbolText({ tokenSymbol, plural: true })}
        </>
      ) : (
        '--'
      )}
    </div>
  )
}
