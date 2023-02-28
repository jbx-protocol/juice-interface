import { t, Trans } from '@lingui/macro'
import { Divider, Modal } from 'antd'
import CurrencySwitch from 'components/CurrencySwitch'
import FormattedAddress from 'components/FormattedAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { Parenthesis } from 'components/Parenthesis'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReduxDistributionLimit,
  useEditingDistributionLimit,
} from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatPercent } from 'utils/format/formatPercent'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { isProjectSplit } from 'utils/splits'
import { splitToAllocation } from 'utils/splitToAllocation'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'

export const ConvertAmountsModal = ({
  open,
  onOk,
  onCancel,
}: {
  open: boolean
  onOk: (d: ReduxDistributionLimit) => void
  onCancel: VoidFunction
}) => {
  const [distributionLimit] = useEditingDistributionLimit()
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>('')
  const [currency, setCurrency] = useState<V2V3CurrencyOption>(
    distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
  )
  const [splits] = useEditingPayoutSplits()

  const totalPayoutsPercent = useMemo(
    () =>
      splits
        .map(s => (s.percent / SPLITS_TOTAL_PERCENT) * 100)
        .reduce((acc, curr) => acc + curr, 0),
    [splits],
  )

  const ownerPercent = useMemo(
    () => Math.max(0, 100 - totalPayoutsPercent),
    [totalPayoutsPercent],
  )

  // While closed, keep the distribution limit 'updated' to last non zero, non infinite value
  useEffect(() => {
    if (
      open ||
      !distributionLimit ||
      distributionLimit?.amount.eq(0) ||
      distributionLimit?.amount.eq(MAX_DISTRIBUTION_LIMIT)
    ) {
      return
    }
    setNewDistributionLimit(fromWad(distributionLimit.amount))
  }, [distributionLimit, open])

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
          Convert payouts to amounts
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
          Changing your distribution limit to 'Amount' will require you to
          manually set a distribution limit amount to split between your current
          payouts.
        </Trans>
      </section>

      <label className="text-base font-medium text-black dark:text-slate-100">
        <Trans>Set distribution limit</Trans>
      </label>
      <FormattedNumberInput
        className="mt-2 mb-10"
        value={newDistributionLimit}
        onChange={val => setNewDistributionLimit(val ? val : '')}
        accessory={
          <CurrencySwitch
            currency={currency === V2V3_CURRENCY_ETH ? 'ETH' : 'USD'}
            onCurrencyChange={c =>
              setCurrency(c === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD)
            }
          />
        }
      />

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
                    amount:
                      (ownerPercent / 100) * parseFloat(newDistributionLimit),
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
                  {isProjectSplit(allocation) && allocation.projectId ? (
                    <V2V3ProjectHandleLink
                      projectId={parseInt(allocation.projectId)}
                    />
                  ) : (
                    <FormattedAddress address={allocation.beneficiary} />
                  )}
                </>
              }
              amountLabel={
                <>
                  {newDistributionLimit &&
                    formatCurrencyAmount({
                      amount:
                        (allocation.percent / 100) *
                        parseFloat(newDistributionLimit),
                      currency,
                    })}{' '}
                  <Parenthesis>{formatPercent(allocation.percent)}</Parenthesis>
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
