import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getTerminalName } from 'utils/v1/terminals'

import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import { classNames } from 'utils/classNames'

export default function V1ProjectTokenBalance({
  className,
  projectId,
  wallet,
  precision,
  hideHandle,
}: {
  className?: string
  projectId: number
  wallet: string | undefined
  precision?: number
  hideHandle?: boolean
}) {
  const tokenAddress = useTokenAddressOfProject(projectId)
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const terminalAddress = useTerminalOfProject(projectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const balance = useTotalBalanceOf(wallet, projectId, terminalName)

  return (
    <div className={classNames('flex justify-between', className)}>
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
          // text.tertiary
          className="text-grey-400 dark:text-slate-200"
          projectId={projectId}
        />
      )}
    </div>
  )
}
