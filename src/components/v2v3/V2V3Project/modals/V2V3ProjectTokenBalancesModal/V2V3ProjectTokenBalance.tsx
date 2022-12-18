import { Trans } from '@lingui/macro'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useProjectHandle from 'hooks/v2v3/contractReader/ProjectHandle'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/TotalBalanceOf'
import { useContext } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const V2V3ProjectTokenBalance = ({
  projectId,
  precision,
}: {
  projectId: number
  precision?: number
}) => {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { data: handle } = useProjectHandle({ projectId })
  const { data: tokenAddress } = useProjectToken({ projectId })
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)
  const { data: balance } = useTotalBalanceOf(projectOwnerAddress, projectId)
  const formattedBalance = formatWad(balance, { precision: precision ?? 0 })

  return (
    <>
      {tokenSymbol ? (
        <span>
          {formattedBalance} {tokenSymbolText({ tokenSymbol, plural: true })}
        </span>
      ) : (
        <span>
          <Trans>
            {formattedBalance} tokens for{' '}
            <V2V3ProjectHandleLink projectId={projectId} handle={handle} />
          </Trans>
        </span>
      )}
    </>
  )
}
