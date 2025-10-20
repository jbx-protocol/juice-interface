import { Trans } from '@lingui/macro'
import { useParticipantsQuery, useProjectQuery } from 'generated/v4v5/graphql'
import {
  useJBChainId,
  useJBContractContext,
  useJBTokenContext,
} from 'juice-sdk-react'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import TokenDistributionChart from 'packages/v4v5/components/modals/V4V5TokenHoldersModal/TokenDistributionChart'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useV4V5TotalTokenSupply } from 'packages/v4v5/hooks/useV4V5TotalTokenSupply'
import { forwardRef } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export const V4V5TokenHoldersChart = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { projectId } = useJBContractContext()
    const chainId = useJBChainId()
    const { version } = useV4V5Version()

    const { token } = useJBTokenContext()
    const tokenSymbol = token?.data?.symbol

    const { data: totalTokenSupply } = useV4V5TotalTokenSupply()

    const { data: project } = useProjectQuery({
      client: getBendystrawClient(chainId),
      variables: {
        projectId: Number(projectId),
        chainId: chainId || 0,
        version: version,
      },
      skip: !projectId || !chainId,
    })

    const { data, loading } = useParticipantsQuery({
      client: getBendystrawClient(chainId),
      variables: {
        orderDirection: 'desc',
        orderBy: 'balance',
        where: {
          suckerGroupId: project?.project?.suckerGroupId,
        },
      },
      skip: !project?.project?.suckerGroupId,
    })

    const allParticipants = data?.participants

    // Filter to only include participants with non-zero token balances
    const tokenHolders = allParticipants?.items.filter((p) => {
      const balance = BigInt(p.balance || 0)
      const creditBalance = BigInt(p.creditBalance || 0)
      const erc20Balance = BigInt(p.erc20Balance || 0)
      const totalBalance = balance + creditBalance + erc20Balance
      return totalBalance > 0n
    })

    // Don't render if no token supply or no actual token holders
    if (
      !totalTokenSupply ||
      totalTokenSupply === 0n ||
      !tokenHolders?.length
    ) {
      return null
    }

    return (
      <div ref={ref} className="w-full">
        <div className="mb-6">
          <h3 className="font-heading text-xl font-medium">
            <Trans>
              {tokenSymbolText({ tokenSymbol, capitalize: true })} holders
            </Trans>
          </h3>
          <div className="text-sm text-grey-500 dark:text-slate-400">
            {tokenHolders.length} wallets
          </div>
        </div>

        <div className="flex items-center justify-center">
          <TokenDistributionChart
            participants={tokenHolders}
            isLoading={loading}
            tokenSupply={totalTokenSupply}
          />
        </div>
      </div>
    )
  },
)

V4V5TokenHoldersChart.displayName = 'V4V5TokenHoldersChart'
