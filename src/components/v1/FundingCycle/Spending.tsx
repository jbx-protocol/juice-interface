import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import WithdrawModal from 'components/v1/FundingCycle/modals/WithdrawModal'
import TooltipLabel from 'components/shared/TooltipLabel'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayoutMod } from 'models/mods'
import { useContext, useState } from 'react'
import PayoutModsList from 'components/v1/PayoutModsList'

import { hasFundingTarget } from 'utils/v1/fundingCycle'
import { V1CurrencyName } from 'utils/v1/currency'

import { V1CurrencyOption } from 'models/v1/currencyOption'
import { perbicentToPercent } from 'utils/formatNumber'
import SpendingStats from 'components/shared/Project/SpendingStats'

export default function Spending({
  payoutMods,
}: {
  payoutMods: PayoutMod[] | undefined
}) {
  const { projectId, currentFC, isPreviewMode, balanceInCurrency, owner } =
    useContext(V1ProjectContext)

  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()

  if (!currentFC) return null

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <SpendingStats
            hasFundingTarget={hasFundingTarget(currentFC)}
            currency={V1CurrencyName(
              currentFC.currency.toNumber() as V1CurrencyOption,
            )}
            projectBalanceInCurrency={balanceInCurrency}
            targetAmount={currentFC.target}
            distributedAmount={currentFC.tapped}
            feePercentage={perbicentToPercent(currentFC.fee)}
            ownerAddress={owner}
          />

          <Button
            type="ghost"
            size="small"
            onClick={() => setWithdrawModalVisible(true)}
            disabled={isPreviewMode}
          >
            <Trans>Distribute funds</Trans>
          </Button>
        </div>

        {currentFC.target.gt(0) && (
          <div>
            <TooltipLabel
              label={
                <h4 style={{ display: 'inline-block' }}>
                  <Trans>Funding distribution</Trans>
                </h4>
              }
              tip={
                <Trans>
                  Available funds are distributed according to the payouts
                  below.
                </Trans>
              }
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
        visible={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        onConfirmed={() => setWithdrawModalVisible(false)}
      />
    </div>
  )
}
