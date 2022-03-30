import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import SpendingStats from 'components/v1/FundingCycle/Spending/SpendingStats'
import SplitList from 'components/v2/shared/SplitList'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext, useState } from 'react'

import { V2CurrencyName } from 'utils/v2/currency'

import WithdrawModal from './modals/WithdrawModal'

export default function PayoutSplitsCard() {
  const {
    payoutSplits,
    distributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
  } = useContext(V2ProjectContext)
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()

  return (
    <CardSection>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SpendingStats
            hasFundingTarget={distributionLimit?.gt(0)}
            currency={V2CurrencyName(
              distributionLimitCurrency?.toNumber() as V2CurrencyOption,
            )}
            projectBalanceInCurrency={balanceInDistributionLimitCurrency}
            targetAmount={distributionLimit}
            withdrawnAmount={usedDistributionLimit}
            feePercentage={'2.5'}
            ownerAddress={projectOwnerAddress}
          />
          <Button
            type="ghost"
            size="small"
            onClick={() => setWithdrawModalVisible(true)}
          >
            <Trans>Distribute funds</Trans>
          </Button>
        </div>

        <div>
          <TooltipLabel
            label={
              <h4 style={{ display: 'inline-block' }}>
                <Trans>Funding Distribution</Trans>
              </h4>
            }
            tip={
              <Trans>
                Available funds are distributed according to the payouts below.
              </Trans>
            }
          />
          {payoutSplits ? (
            <SplitList
              splits={payoutSplits}
              distributionLimitCurrency={distributionLimitCurrency}
              distributionLimit={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showSplitValues
            />
          ) : null}
        </div>
      </Space>

      <WithdrawModal
        visible={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
      />
    </CardSection>
  )
}
