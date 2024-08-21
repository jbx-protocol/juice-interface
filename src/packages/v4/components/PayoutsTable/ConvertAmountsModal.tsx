import { t, Trans } from '@lingui/macro'
import { Divider, Modal } from 'antd'
import CurrencySwitch from 'components/currency/CurrencySwitch'
import EthereumAddress from 'components/EthereumAddress'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { Parenthesis } from 'components/Parenthesis'
import { JBSplit as Split } from 'juice-sdk-core'

import { V4CurrencyOption } from 'packages/v4/models/v4CurrencyOption'
import { V4_CURRENCY_ETH, V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import {
  deriveAmountAfterFee,
  derivePayoutAmount,
} from 'packages/v4/utils/distributions'
import { formatCurrencyAmount } from 'packages/v4/utils/formatCurrencyAmount'
import { allocationToSplit, splitToAllocation } from 'packages/v4/utils/splitToAllocation'
import { isJuiceboxProjectSplit } from 'packages/v4/utils/v4Splits'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import {
  ReduxDistributionLimit,
  useEditingDistributionLimit,
} from 'redux/hooks/useEditingDistributionLimit'
import { parseWad } from 'utils/format/formatNumber'
import { formatPercent } from 'utils/format/formatPercent'
import { helpPagePath } from 'utils/helpPagePath'
import V4ProjectHandleLink from '../V4ProjectHandleLink'

export const ConvertAmountsModal = ({
  open,
  onOk,
  onCancel,
  splits,
}: {
  open: boolean
  onOk: (d: ReduxDistributionLimit) => void
  onCancel: VoidFunction
  splits: Split[]
}) => {
  const [distributionLimit] = useEditingDistributionLimit()
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>('')
  const [currency, setCurrency] = useState<V4CurrencyOption>(
    distributionLimit?.currency ?? V4_CURRENCY_ETH,
  )

  const totalPayoutsPercent = useMemo(
    () =>
      splits
        .map(s => s.percent.toFloat() * 100)
        .reduce((acc, curr) => acc + curr, 0),
    [splits],
  )

  const ownerPercent = useMemo(
    () => Math.max(0, 100 - totalPayoutsPercent),
    [totalPayoutsPercent],
  )

  const onModalOk = useCallback(() => {
    onOk({
      amount: parseWad(parseFloat(newDistributionLimit)),
      currency,
    })
  }, [currency, newDistributionLimit, onOk])

  const hasOwnerPayout = ownerPercent > 0

  const okButtonDisabled = !newDistributionLimit.length

  return (
    <Modal
      title={
        <h3 className="text-xl font-medium text-black dark:text-slate-100">
          Switch to limited payouts
        </h3>
      }
      open={open}
      okButtonProps={{ disabled: okButtonDisabled }}
      onOk={onModalOk}
      onCancel={onCancel}
      okText={t`Convert to amounts`}
    >
      <section className="mb-8 text-sm text-grey-700 dark:text-slate-200">
        <Trans>
          To switch to 'Limited' payouts, enter a total amount to pay out of the
          treasury to split between your recipients.
        </Trans>{' '}
        <ExternalLinkWithIcon href={helpPagePath(`/user/project/#payouts`)}>
          <Trans>Learn more about payout limits</Trans>
        </ExternalLinkWithIcon>
      </section>

      <label className="text-base font-medium text-black dark:text-slate-100">
        <Trans>Payout total (max.)</Trans>
      </label>
      <div className="mt-2 mb-10">
        <FormattedNumberInput
          value={newDistributionLimit}
          onChange={val => setNewDistributionLimit(val ? val : '')}
          accessory={
            <CurrencySwitch
              currency={currency === V4_CURRENCY_ETH ? 'ETH' : 'USD'}
              onCurrencyChange={c =>
                setCurrency(c === 'ETH' ? V4_CURRENCY_ETH : V4_CURRENCY_USD)
              }
            />
          }
        />
      </div>

      <section>
        <span className="mb-4 text-base font-medium text-black dark:text-slate-100">
          <Trans>Current payouts</Trans>
        </span>
        {hasOwnerPayout ? (
          <PayoutChangeSplitInfo
            descriptionLabel={t`Project owner`}
            amountLabel={
              <>
                {newDistributionLimit &&
                  formatCurrencyAmount({
                    amount: deriveAmountAfterFee(
                      (ownerPercent / 100) * parseFloat(newDistributionLimit),
                    ),
                    currency,
                  })}{' '}
                <Parenthesis>{formatPercent(ownerPercent)}</Parenthesis>
              </>
            }
          />
        ) : null}
        {splits.map(split => {
          const allocation = splitToAllocation(split)
          return (
            <PayoutChangeSplitInfo
              key={allocation.id}
              descriptionLabel={
                <>
                  {isJuiceboxProjectSplit(split) && allocation.projectId ? (
                    <V4ProjectHandleLink
                      projectId={Number(allocation.projectId)}
                    />
                  ) : (
                    <EthereumAddress address={allocation.beneficiary} />
                  )}
                </>
              }
              amountLabel={
                <>
                  {newDistributionLimit &&
                    formatCurrencyAmount({
                      amount: derivePayoutAmount({
                        payoutSplit: allocationToSplit(allocation),
                        distributionLimit: parseFloat(newDistributionLimit),
                      }),
                      currency,
                    })}{' '}
                  <Parenthesis>{allocation.percent.formatPercentage()}%</Parenthesis>
                </>
              }
            />
          )
        })}
      </section>
    </Modal>
  )
}

const PayoutChangeSplitInfo = ({
  descriptionLabel,
  amountLabel,
}: {
  descriptionLabel: ReactNode
  amountLabel: ReactNode
}) => {
  return (
    <>
      <Divider />
      <div className="flex justify-between">
        <span className="font-medium">{descriptionLabel}</span>
        <span>{amountLabel}</span>
      </div>
    </>
  )
}
