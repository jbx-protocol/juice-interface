import { TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import useMobile from 'hooks/useMobile'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { SmallNftSquare } from '../../NftRewardsCard/SmallNftSquare'
import { CurrencyIcon } from '../../ui/CurrencyIcon'
import StackedComponents from '../../ui/StackedComponents'
import { useCartSummary } from '../hooks/useCartSummary'
import { SummaryPayButton } from './SummaryPayButton'

export const SummaryCollapsedView = () => {
  const { amountText, currency, nftRewards, removePay } = useCartSummary()
  const isMobile = useMobile()

  return (
    <div className="flex w-full items-center justify-between px-8 py-6">
      <div
        data-testid="cart-summary-closed-view-summary"
        className="flex items-center gap-4"
      >
        <span className="font-heading text-xl font-medium md:text-2xl">
          <Trans>Summary</Trans>
        </span>
        <StackedComponents
          components={[
            ...nftRewards.map(nft => ({
              Component: SmallNftSquare,
              props: {
                border: true,
                nftReward: nft,
                className: 'h-full w-full',
              },
            })),
            {
              Component: CurrencyIcon,
              props: {
                className:
                  'h-full w-full border-4 border-white dark:border-slate-950',
                currency: currency ?? V2V3_CURRENCY_ETH,
              },
            },
          ]}
          size="48px"
        />
      </div>
      {isMobile ? (
        <span className="text-xl font-medium">{amountText}</span>
      ) : (
        <div
          data-testid="cart-summary-closed-view-total"
          className="flex cursor-auto items-center gap-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-grey-500 dark:text-slate-200">
              <Trans>Total to pay</Trans>
            </span>
            <span className="text-2xl font-medium">{amountText}</span>
            <TrashIcon
              data-testid="cart-summary-closed-view-trash-icon"
              role="button"
              className="h-5 w-5 text-grey-400 dark:text-slate-300"
              onClick={removePay}
            />
          </div>
          <SummaryPayButton />
        </div>
      )}
    </div>
  )
}
