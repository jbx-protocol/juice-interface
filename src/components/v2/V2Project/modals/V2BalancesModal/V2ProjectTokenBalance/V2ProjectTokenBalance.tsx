import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { useWallet } from 'hooks/Wallet'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/format/formatNumber'
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
  const { userAddress } = useWallet()
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
