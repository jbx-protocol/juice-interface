import { ThemeContext } from 'contexts/themeContext'
import useSymbolOfERC20 from 'hooks/v1/contractReader/SymbolOfERC20'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { CSSProperties, useContext } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getTerminalName } from 'utils/v1/terminals'

import V1ProjectHandle from './shared/V1ProjectHandle'

export default function ProjectTokenBalance({
  projectId,
  wallet,
  style,
  precision,
  hideHandle,
}: {
  projectId: number
  wallet: string | undefined
  style?: CSSProperties
  precision?: number
  hideHandle?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const tokenAddress = useTokenAddressOfProject(projectId)
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const balance = useTotalBalanceOf(wallet, projectId, terminalName)

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

      {!hideHandle && (
        <V1ProjectHandle
          style={{ color: colors.text.tertiary }}
          projectId={projectId}
        />
      )}
    </div>
  )
}
