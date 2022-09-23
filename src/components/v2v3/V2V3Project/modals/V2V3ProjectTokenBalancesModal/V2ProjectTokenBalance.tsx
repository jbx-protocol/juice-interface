import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import { CSSProperties, useContext } from 'react'
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
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: balance } = useTotalBalanceOf(projectOwnerAddress, projectId)

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
