import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { ReservedTokensSubPanel } from '../CyclesPayoutsPanel/components/ReservedTokensSubPanel'
import { DisplayCard } from '../ui'

export const TokensPanel = () => {
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-medium">Tokens</h2>
      </div>
      <div>
        <DisplayCard>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              <Trans>Your balance</Trans>
              <div className="font-heading text-2xl font-medium dark:text-slate-50">
                500,000 tokens
              </div>
            </div>
            <Button type="primary">Redeem tokens</Button>
          </div>
        </DisplayCard>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex gap-4">
            <DisplayCard className="w-full">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-grey-600 dark:text-slate-200">
                  <Trans>Project token</Trans>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-heading text-xl font-medium dark:text-slate-50">
                    PYRO
                  </span>
                  <span className="rounded-2xl bg-grey-100 py-1 px-2 text-grey-700 dark:bg-slate-500 dark:text-slate-100">
                    ERC-20
                  </span>
                  <span className="text-grey-500 dark:text-slate-200">
                    (0x3abF...6f66)
                  </span>
                </div>
              </div>
            </DisplayCard>
            <DisplayCard className="w-full">
              <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
                Total supply
                <div className="font-heading text-2xl font-medium dark:text-slate-50">
                  800,000,000 PYRO
                </div>
              </div>
            </DisplayCard>
          </div>
          <a role="button" href="#" className="self-end">
            <Trans>View token holders</Trans>
          </a>
        </div>
        <ReservedTokensSubPanel className="mt-12" />
      </div>
    </div>
  )
}
