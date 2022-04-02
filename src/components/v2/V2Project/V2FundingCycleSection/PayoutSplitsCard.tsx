import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import SpendingStats from 'components/shared/Project/SpendingStats'
import SplitList from 'components/v2/shared/SplitList'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext, useState } from 'react'

import { V2CurrencyName } from 'utils/v2/currency'

import { formatFee } from 'utils/v2/math'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'

import DistributePayoutsModal from './modals/DistributePayoutsModal'

export default function PayoutSplitsCard() {
  const {
    payoutSplits,
    distributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
  } = useContext(V2ProjectContext)
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const [distributePayoutsModalVisible, setDistributePayoutsModalVisible] =
    useState<boolean>()

  return (
    <CardSection>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {ETHPaymentTerminalFee &&
          distributionLimit &&
          usedDistributionLimit ? (
            <SpendingStats
              hasFundingTarget={distributionLimit?.gt(0)}
              currency={V2CurrencyName(
                distributionLimitCurrency?.toNumber() as V2CurrencyOption,
              )}
              projectBalanceInCurrency={balanceInDistributionLimitCurrency}
              targetAmount={distributionLimit}
              distributedAmount={usedDistributionLimit}
              feePercentage={formatFee(ETHPaymentTerminalFee)} // TODO
              ownerAddress={projectOwnerAddress}
            />
          ) : (
            <Skeleton
              active
              title={false}
              paragraph={{ rows: 2, width: ['60%', '60%'] }}
            />
          )}

          <Button
            type="ghost"
            size="small"
            onClick={() => setDistributePayoutsModalVisible(true)}
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

      <DistributePayoutsModal
        visible={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
      />
    </CardSection>
  )
}
