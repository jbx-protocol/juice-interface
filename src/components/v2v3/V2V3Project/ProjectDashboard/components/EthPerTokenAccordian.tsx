import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useCallback } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { formatRedemptionRate } from 'utils/v2v3/math'
import { useProjectContext } from '../hooks/useProjectContext'
import { useProjectPageQueries } from '../hooks/useProjectPageQueries'
import { useTokensPanel } from '../hooks/useTokensPanel'
import { useTokensPerEth } from '../hooks/useTokensPerEth'

export type EthPerTokenAccordianProps = {
  className?: string
}

export const EthPerTokenAccordian: React.FC<EthPerTokenAccordianProps> = ({
  className,
}) => {
  const { fundingCycleMetadata } = useProjectContext()
  const { receivedTickets, receivedTokenSymbolText } = useTokensPerEth({
    amount: 1,
    currency: V2V3_CURRENCY_ETH,
  })
  const { totalSupply } = useTokensPanel()
  const { setProjectPageTab } = useProjectPageQueries()

  const handleViewTokenInfoClicked = useCallback(
    () => setProjectPageTab('tokens'),
    [setProjectPageTab],
  )

  return (
    <Accordion className={cn('mt-4 px-4', className)} type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="mb-0 pt-2.5 text-sm">
          1 ETH = {receivedTickets} {receivedTokenSymbolText}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex justify-between">
            <span>
              <Trans>Total token supply: {totalSupply}</Trans>
            </span>
            <Button
              className="h-auto p-0 font-semibold"
              type="link"
              onClick={handleViewTokenInfoClicked}
            >
              <Trans>View token info</Trans>
            </Button>
          </div>

          {fundingCycleMetadata && (
            <Tooltip
              title={t`Redemption rate determines what proportion of this project's treasury can be reclaimed by a token holder by redeeming their tokens.`}
            >
              <div className="mt-5">
                <Trans>
                  Current redemption rate:{' '}
                  {formatRedemptionRate(fundingCycleMetadata?.redemptionRate)}%
                </Trans>
              </div>
            </Tooltip>
          )}

          <div className="mt-4 flex items-center gap-1">
            <InformationCircleIcon className="h-4 w-4 text-grey-400 dark:text-slate-300" />
            <span className="text-xs text-grey-500 dark:text-slate-200">
              <Trans>New tokens are minted each time a payment is made</Trans>
            </span>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
