import { Trans, t } from '@lingui/macro'
import { Divider, Modal } from 'antd'
import { V4V5_CURRENCY_ETH, getV4V5CurrencyUSD, convertV2V3CurrencyOptionToV4V5 } from 'packages/v4v5/utils/currency'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import {
  deriveAmountAfterFee,
  derivePayoutAmount,
} from 'packages/v4v5/utils/distributions'
import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v4v5/utils/splitToAllocation'
import { ReactNode, useCallback, useMemo, useState } from 'react'

import CurrencySwitch from 'components/currency/CurrencySwitch'
import EthereumAddress from 'components/EthereumAddress'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { Parenthesis } from 'components/Parenthesis'
import { JBSplit as Split } from 'juice-sdk-core'
import { ReduxPayoutLimit } from 'packages/v4v5/models/fundAccessLimits'
import { V4V5CurrencyOption } from 'packages/v4v5/models/v4CurrencyOption'
import { formatCurrencyAmount } from 'packages/v4v5/utils/formatCurrencyAmount'
import { isJuiceboxProjectSplit } from 'packages/v4v5/utils/v4Splits'
import { useCreatingDistributionLimit } from 'redux/hooks/v2v3/create'
import { parseWad } from 'utils/format/formatNumber'
import { formatPercent } from 'utils/format/formatPercent'
import { helpPagePath } from 'utils/helpPagePath'
import { useChainId } from 'wagmi'
import V4V5ProjectHandleLink from '../V4V5ProjectHandleLink'

export const ConvertAmountsModal = ({
  open,
  onOk,
  onCancel,
  splits,
}: {
  open: boolean
  onOk: (d: ReduxPayoutLimit) => void
  onCancel: VoidFunction
  splits: Split[]
}) => {
  const { version } = useV4V5Version()
  const chainId = useChainId()
  const [distributionLimit] = useCreatingDistributionLimit()
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>('')

  const initialCurrency = distributionLimit?.currency ? convertV2V3CurrencyOptionToV4V5(distributionLimit.currency, version) : V4V5_CURRENCY_ETH
  const [currency, setCurrency] = useState<V4V5CurrencyOption>(initialCurrency)

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
      amount: parseWad(parseFloat(newDistributionLimit)).toBigInt(),
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
              currency={currency === V4V5_CURRENCY_ETH ? 'ETH' : 'USD'}
              onCurrencyChange={c =>
                setCurrency(c === 'ETH' ? V4V5_CURRENCY_ETH : getV4V5CurrencyUSD(version))
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
                    <V4V5ProjectHandleLink
                      projectId={Number(allocation.projectId)}
                      chainId={chainId}
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
                  <Parenthesis>
                    {allocation.percent.formatPercentage()}%
                  </Parenthesis>
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
