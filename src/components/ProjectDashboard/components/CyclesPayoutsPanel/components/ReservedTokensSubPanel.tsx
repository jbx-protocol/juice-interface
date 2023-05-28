import {
  ArrowUpCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'
import { DisplayCard } from '../../ui'

const payouts = [
  {
    name: 'aeolian.eth',
    amount: '210 ETH',
    percent: '33%',
  },
  {
    name: 'wraeth.eth',
    amount: '210 ETH',
    percent: '33%',
  },
  {
    name: 'chris.eth',
    amount: '210 ETH',
    percent: '33%',
  },
]

export const ReservedTokensSubPanel = ({
  className,
}: {
  className?: string
}) => {
  return (
    <div className={twMerge(className)}>
      <h2 className="mb-0 font-heading text-2xl font-medium">
        <Trans>Reserved tokens</Trans>
      </h2>
      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-4">
          <DisplayCard className="flex w-full flex-col gap-2">
            <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium">
              <Trans>Reserved tokens</Trans>
            </h3>
            <span className="font-heading text-xl font-medium">800,000</span>
          </DisplayCard>
          <DisplayCard className="flex w-full flex-col gap-2">
            <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium">
              <Trans>Reserved rate</Trans>
            </h3>
            <span className="font-heading text-xl font-medium">15%</span>
          </DisplayCard>
        </div>
        <DisplayCard className="flex w-full flex-col pb-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium">
              <Trans>Reserved tokens list</Trans>
            </h3>
            <EllipsisVerticalIcon role="button" className="h-6 w-6" />
          </div>

          <table className="mt-4 w-full">
            <tbody>
              {payouts.map(payout => (
                <tr
                  key={payout.name}
                  className="flex items-center justify-between gap-3 border-b border-grey-200 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-juice-400" />
                    <span className="font-medium">{payout.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{payout.amount}</span>
                    <span>{payout.percent}</span>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            type="primary"
            className="mt-6 flex w-fit items-center gap-3 self-end"
          >
            <Trans>Send reserved tokens</Trans>
            <ArrowUpCircleIcon className="h-5 w-5" />
          </Button>
        </DisplayCard>
      </div>
    </div>
  )
}
