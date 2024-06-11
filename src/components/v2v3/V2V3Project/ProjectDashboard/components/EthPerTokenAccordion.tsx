import { Disclosure, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { Fragment, useCallback, useState } from 'react'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { formatRedemptionRate } from 'utils/v2v3/math'
import { useProjectContext } from '../hooks/useProjectContext'
import { useProjectPageQueries } from '../hooks/useProjectPageQueries'
import { useTokensPanel } from '../hooks/useTokensPanel'
import { useTokensPerEth } from '../hooks/useTokensPerEth'

const DisclosureToggleButton = ({ open }: { open: boolean }) => {
  return (
    <div className="relative h-4 w-4">
      <Transition
        show={!open}
        as={Fragment}
        enter="transition-opacity ease-in-out duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ChevronDownIcon className="absolute h-4 w-4" aria-hidden="true" />
      </Transition>
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity ease-in-out duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ChevronUpIcon className="absolute h-6 w-6" aria-hidden="true" />
      </Transition>
    </div>
  )
}

export const EthPerTokenAccordion = () => {
  const { fundingCycleMetadata } = useProjectContext()
  const { receivedTickets, receivedTokenSymbolText } = useTokensPerEth({
    amount: 1,
    currency: V2V3_CURRENCY_ETH,
  })
  const { totalSupply } = useTokensPanel()
  const { setProjectPageTab } = useProjectPageQueries()

  const [open, setOpen] = useState<boolean>(false)

  const handleViewTokenInfoClicked = useCallback(
    () => setProjectPageTab('tokens'),
    [setProjectPageTab],
  )

  if (!receivedTickets || receivedTickets === '0') return null

  return (
    <Disclosure as="div">
      {() => {
        return (
          <div>
            <Disclosure.Button
              className="w-full py-5 outline-none"
              onClick={() => setOpen(!open)}
            >
              <>
                <div className="text-primary mb-0 flex w-full items-center justify-between gap-6 text-start text-sm font-medium">
                  1 ETH = {receivedTickets} {receivedTokenSymbolText}
                  <DisclosureToggleButton open={open} />
                </div>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition-all ease-in-out duration-150"
                  enterFrom="max-h-0 overflow-hidden opacity-0"
                  enterTo="max-h-[1000px] overflow-hidden opacity-100"
                  leave="transition-all ease-in-out duration-150"
                  leaveFrom="max-h-[1000px] overflow-hidden opacity-100"
                  leaveTo="max-h-0 overflow-hidden opacity-0"
                >
                  <Disclosure.Panel className="mt-4 cursor-default pr-12 text-start text-grey-600 dark:text-slate-200">
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
                            {formatRedemptionRate(
                              fundingCycleMetadata?.redemptionRate,
                            )}
                            %
                          </Trans>
                        </div>
                      </Tooltip>
                    )}

                    <div className="mt-4 flex items-center gap-1">
                      <InformationCircleIcon className="h-4 w-4 text-grey-400 dark:text-slate-300" />
                      <span className="text-xs text-grey-500 dark:text-slate-200">
                        <Trans>
                          New tokens are minted each time a payment is made
                        </Trans>
                      </span>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            </Disclosure.Button>
          </div>
        )
      }}
    </Disclosure>
  )
}
