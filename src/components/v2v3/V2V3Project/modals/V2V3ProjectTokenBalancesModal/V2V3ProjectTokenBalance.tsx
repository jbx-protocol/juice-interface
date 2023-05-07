import { Trans } from '@lingui/macro'
import { TokenAmount } from 'components/TokenAmount'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import useProjectHandle from 'hooks/v2v3/contractReader/useProjectHandle'
import useProjectToken from 'hooks/v2v3/contractReader/useProjectToken'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useContext } from 'react'

export const V2V3ProjectTokenBalance = ({
  projectId,
}: {
  projectId: number
}) => {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: handle } = useProjectHandle({ projectId })
  const { data: tokenAddress } = useProjectToken({ projectId })
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)
  const { data: balance } = useTotalBalanceOf(projectOwnerAddress, projectId)

  if (!balance) return null

  return (
    <>
      {tokenSymbol ? (
        <span>
          <TokenAmount amountWad={balance} tokenSymbol={tokenSymbol} />
        </span>
      ) : (
        <span>
          <Trans>
            <TokenAmount amountWad={balance} /> for{' '}
            <V2V3ProjectHandleLink projectId={projectId} handle={handle} />
          </Trans>
        </span>
      )}
    </>
  )
}
