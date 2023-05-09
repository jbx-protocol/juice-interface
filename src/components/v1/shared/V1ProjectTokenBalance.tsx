import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import useTokenAddressOfProject from 'hooks/v1/contractReader/useTokenAddressOfProject'
import useTotalBalanceOf from 'hooks/v1/contractReader/useTotalBalanceOf'

import { TokenAmount } from 'components/TokenAmount'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'

export default function V1ProjectTokenBalance({
  className,
  projectId,
  wallet,
  hideHandle,
}: {
  className?: string
  projectId: number
  wallet: string | undefined
  hideHandle?: boolean
}) {
  const { terminal } = useContext(V1ProjectContext)

  const terminalName = terminal?.name
  const tokenAddress = useTokenAddressOfProject(projectId)
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)

  const balance = useTotalBalanceOf(wallet, projectId, terminalName)

  return (
    <div className={twMerge('flex justify-between', className)}>
      <span>
        {tokenSymbol !== undefined && balance ? (
          <>
            <TokenAmount amountWad={balance} tokenSymbol={tokenSymbol} />
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
