import { Trans, t } from '@lingui/macro'

import { Tooltip } from 'antd'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-react'
import { DEFAULT_NFT_MAX_SUPPLY } from 'packages/v2v3/constants/nftRewards'
import { ChainLogo } from 'packages/v4/components/ChainLogo'

interface RemainingSupplyWithTooltipProps {
  remainingSupply: number | undefined
  maxSupply: number | undefined
  perChainSupply?: { chainId: number; remainingSupply: number }[]
  showMaxSupply?: boolean
}

export const RemainingSupplyWithTooltip: React.FC<RemainingSupplyWithTooltipProps> = ({
  remainingSupply,
  maxSupply,
  perChainSupply,
  showMaxSupply
}) => {
  const hasRemainingSupply = remainingSupply && remainingSupply > 0
  const isUnlimited = maxSupply === DEFAULT_NFT_MAX_SUPPLY
  
  const perChainMaxSupplyText = !isUnlimited && maxSupply ? ` / ${maxSupply}` : ''

  const aggregatedMaxSupply = !isUnlimited && maxSupply ? (perChainSupply?.length ?? 1) * maxSupply : undefined
  const aggregatedMaxSupplyText = showMaxSupply && aggregatedMaxSupply ? ` / ${aggregatedMaxSupply}` : ''
  
  const remainingSupplyText = !hasRemainingSupply
    ? t`SOLD OUT`
    : isUnlimited
    ? t`Unlimited`
    : t`${remainingSupply}${aggregatedMaxSupplyText}`
  // If there's no per-chain data or only one chain, show simple text
  if (!perChainSupply || perChainSupply.length <= 1 || !hasRemainingSupply) {
    return <span>{remainingSupplyText}</span>
  }

  return (
    <Tooltip
      title={
        perChainSupply.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-medium text-grey-300 dark:text-grey-600 mb-1">
              <Trans>Remaining supply by chain:</Trans>
            </div>
            {perChainSupply.map((chainSupply) => (
              <div
                className="flex items-center justify-between gap-4"
                key={chainSupply.chainId}
              >
                <div className="flex items-center gap-2">
                  <ChainLogo chainId={chainSupply.chainId as JBChainId} />
                  <span>{NETWORKS[chainSupply.chainId]?.label || `Chain ${chainSupply.chainId}`}</span>
                </div>
                <span className="whitespace-nowrap font-medium">
                  {isUnlimited ? (
                    <Trans>Unlimited</Trans>
                  ) : chainSupply.remainingSupply <= 0 ? (
                    <Trans>Sold out</Trans>
                  ) : (
                    `${chainSupply.remainingSupply}${perChainMaxSupplyText}`
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : undefined
      }
    >
      <span className="cursor-help">
        {remainingSupplyText}
        {!showMaxSupply ? ` remaining`: null}
      </span>
    </Tooltip>
  )
}
