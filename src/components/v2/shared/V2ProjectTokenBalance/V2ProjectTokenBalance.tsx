import V2ProjectHandle from 'components/v2/shared/V2ProjectHandle'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const V2ProjectTokenBalance = ({
  projectId,
  handle,
  style,
  precision,
}: {
  projectId: number
  handle?: string
  style?: CSSProperties
  precision?: number
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { data: tokenAddress } = useProjectToken({ projectId })
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const { userAddress } = useContext(NetworkContext)
  const { data: balance } = useTotalBalanceOf(userAddress, projectId)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', ...style }}>
      <span>
        {tokenSymbol !== undefined ? (
          <>
            {formatWad(balance, { precision: precision ?? 0 })}{' '}
            {tokenSymbolText({ tokenSymbol, plural: true })}
          </>
        ) : (
          '--'
        )}
      </span>

      {handle && (
        <V2ProjectHandle
          style={{ color: colors.text.tertiary }}
          projectId={projectId}
          handle={handle}
        />
      )}
    </div>
  )
}
