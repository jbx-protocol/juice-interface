import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import SpendingStats from 'components/Project/SpendingStats'
import TooltipLabel from 'components/TooltipLabel'
import WithdrawModal from 'components/v1/shared/FundingCycle/modals/WithdrawModal'
import PayoutModsList from 'components/v1/shared/PayoutModsList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod } from 'models/v1/mods'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { perbicentToPercent } from 'utils/format/formatNumber'
import { V1CurrencyName } from 'utils/v1/currency'
import { hasFundingTarget } from 'utils/v1/fundingCycle'

export default function Spending({
  payoutMods,
}: {
  payoutMods: PayoutMod[] | undefined
}) {
  const { currentFC, balanceInCurrency, owner } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()

  const router = useRouter()

  if (!currentFC) return null

  const target = currentFC.target
  const distributedAmount = currentFC.tapped

  const distributable = target.sub(distributedAmount)

  const distributableAmount = balanceInCurrency?.gt(distributable)
    ? distributable
    : balanceInCurrency

  return (
    <div>
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex items-baseline justify-between">
          <SpendingStats
            hasFundingTarget={hasFundingTarget(currentFC)}
            currency={V1CurrencyName(
              currentFC.currency.toNumber() as V1CurrencyOption,
            )}
            distributableAmount={distributableAmount}
            targetAmount={target}
            distributedAmount={distributedAmount}
            feePercentage={perbicentToPercent(currentFC.fee)}
            ownerAddress={owner}
          />

          <Button
            type="default"
            size="small"
            onClick={() => setWithdrawModalVisible(true)}
          >
            <Trans>Send payouts</Trans>
          </Button>
        </div>

        {currentFC.target.gt(0) && (
          <div>
            <TooltipLabel
              label={
                <h4 className="inline-block">
                  <Trans>Payouts</Trans>
                </h4>
              }
              tip={<Trans>Payouts are sent to the recipients below.</Trans>}
            />
            <PayoutModsList
              mods={payoutMods}
              fundingCycle={currentFC}
              projectId={projectId}
              feePerbicent={currentFC.fee}
            />
          </div>
        )}
      </Space>

      <WithdrawModal
        open={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        onConfirmed={() => router.reload()}
      />
    </div>
  )
}
