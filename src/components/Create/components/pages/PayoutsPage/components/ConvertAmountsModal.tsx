import { t, Trans } from '@lingui/macro'
import { Divider, Modal } from 'antd'
import CurrencySwitch from 'components/currency/CurrencySwitch'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { Parenthesis } from 'components/Parenthesis'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import {
  ReduxDistributionLimit,
  useEditingDistributionLimit,
} from 'redux/hooks/useEditingDistributionLimit'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { parseWad } from 'utils/format/formatNumber'
import { formatPercent } from 'utils/format/formatPercent'
import { helpPagePath } from 'utils/routes'
import { isProjectSplit } from 'utils/splits'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import {
  deriveAmountAfterFee,
  derivePayoutAmount,
} from 'utils/v2v3/distributions'
import { SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'

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
  const [currency, setCurrency] = useState<V2V3CurrencyOption>(
    distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
  )

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
              currency={currency === V2V3_CURRENCY_ETH ? 'ETH' : 'USD'}
              onCurrencyChange={c =>
                setCurrency(c === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD)
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
                  {isProjectSplit(allocation) && allocation.projectId ? (
                    <V2V3ProjectHandleLink
                      projectId={parseInt(allocation.projectId)}
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
