import { ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const Cart = ({ className }: { className?: string }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const toggleExpanded = () => setExpanded(prev => !prev)

  return (
    <div
      data-testid="cart"
      className={twMerge(
        'fixed inset-x-0 bottom-0 z-20 flex h-full cursor-pointer items-center justify-center border-t border-grey-200 bg-white drop-shadow transition-all dark:border-slate-500 dark:bg-slate-900',
        expanded ? 'max-h-[435px]' : 'max-h-20',
        className,
      )}
      onClick={toggleExpanded}
    >
      <div className="flex h-full w-full max-w-6xl items-center">
        {expanded ? <SummaryOpenView /> : <SummaryClosedView />}
        <ChevronUpIcon
          role="button"
          className={twMerge(
            'h-8 w-8',
            expanded && 'mt-12 rotate-180 self-start',
          )}
        />
      </div>
    </div>
  )
}

const SummaryOpenView = () => {
  return (
    <div
      data-testid="cart-summary-open-view"
      className="flex h-full w-full justify-between px-8 pt-12 pb-14"
    >
      <div
        data-testid="cart-summary-open-view-summary"
        className="flex w-full max-w-xl cursor-auto flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <span className="font-heading text-2xl font-medium">
          <Trans>Summary</Trans>
        </span>
        <div>
          <SummaryNftRewardItem />
          <SummaryNftRewardItem />
        </div>
      </div>
      <div
        data-testid="cart-summary-open-view-total"
        className="flex cursor-auto items-center gap-8 self-end rounded-lg border border-grey-200 p-8 dark:border-slate-500 dark:bg-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-grey-500 dark:text-slate-200">
            <Trans>Total to pay</Trans>
          </span>
          <span className="text-2xl font-medium">1.2 ETH</span>
        </div>
        <Button type="primary">
          <Trans>Pay project</Trans>
        </Button>
      </div>
    </div>
  )
}

const SummaryNftRewardItem = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between border-b border-grey-200 py-5 dark:border-slate-500',
        className,
      )}
    >
      <div className="flex items-center">
        <PlaceholderSquare className="h-14 w-14" />
        <span className="ml-3 dark:text-slate-50">Coffee Man</span>
        <span className="ml-2 rounded-2xl bg-grey-100 py-0.5 px-2 dark:bg-slate-500 dark:text-slate-100">
          NFT
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-8 text-sm">1</span>
        <span className="mr-4 text-sm font-medium">1.2 ETH</span>
        <TrashIcon className="inline h-4 w-4 text-grey-400 dark:text-slate-300" />
      </div>
    </div>
  )
}

const SummaryClosedView = () => {
  return (
    <div className="flex w-full items-center justify-between px-8 py-6">
      <div
        data-testid="cart-summary-closed-view-summary"
        className="flex cursor-auto items-center gap-4"
        onClick={e => e.stopPropagation()}
      >
        <span className="font-heading text-2xl font-medium">
          <Trans>Summary</Trans>
        </span>
        <div className="relative flex">
          <PlaceholderSquare className="z-20 bg-bluebs-400" />
          <PlaceholderSquare className="z-10 -ml-[18px] bg-juice-400" />
          <PlaceholderSquare className="-ml-[18px] bg-melon-600" />
        </div>
      </div>
      <div
        data-testid="cart-summary-closed-view-total"
        className="flex cursor-auto items-center gap-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-grey-500 dark:text-slate-200">
            <Trans>Total to pay</Trans>
          </span>
          <span className="text-2xl font-medium">1.2 ETH</span>
          <TrashIcon className="h-5 w-5 text-grey-400 dark:text-slate-300" />
        </div>
        <Button type="primary">
          <Trans>Pay project</Trans>
        </Button>
      </div>
    </div>
  )
}

const PlaceholderSquare = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'h-12 w-12 rounded-lg border-4 border-white bg-grey-400 dark:border-slate-950',
        className,
      )}
    ></div>
  )
}
