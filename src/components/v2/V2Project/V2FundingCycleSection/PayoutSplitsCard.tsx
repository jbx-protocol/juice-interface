import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import SpendingStats from 'components/shared/Project/SpendingStats'
import SplitList from 'components/v2/shared/SplitList'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext, useState } from 'react'
import { SettingOutlined } from '@ant-design/icons'

import { V2CurrencyName } from 'utils/v2/currency'

import { formatFee, MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { Split } from 'models/v2/splits'
import { BigNumber } from '@ethersproject/bignumber'
import { detailedTimeString } from 'utils/formatTime'

import DistributePayoutsModal from './modals/DistributePayoutsModal'
import { EditPayoutsModal } from './modals/EditPayoutsModal'

export default function PayoutSplitsCard({
  hideDistributeButton,
  payoutSplits,
  distributionLimitCurrency,
  distributionLimit,
  fundingCycleDuration,
}: {
  hideDistributeButton?: boolean
  payoutSplits: Split[] | undefined
  distributionLimitCurrency: BigNumber | undefined
  distributionLimit: BigNumber | undefined
  fundingCycleDuration: BigNumber | undefined
}) {
  const {
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
    isPreviewMode,
    loading,
  } = useContext(V2ProjectContext)
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const [distributePayoutsModalVisible, setDistributePayoutsModalVisible] =
    useState<boolean>()
  const [editPayoutModalVisible, setEditPayoutModalVisible] =
    useState<boolean>(false)
  const isLoadingStats =
    loading.ETHBalanceLoading ||
    loading.distributionLimitLoading ||
    loading.balanceInDistributionLimitCurrencyLoading ||
    loading.usedDistributionLimitLoading

  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycleDuration?.toNumber(),
    fullWords: true,
  })
  const hasDuration = fundingCycleDuration?.gt(0)

  return (
    <CardSection>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {hideDistributeButton ? null : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <Skeleton
              loading={isLoadingStats}
              active
              title={false}
              paragraph={{ rows: 2, width: ['60%', '60%'] }}
            >
              <SpendingStats
                hasFundingTarget={distributionLimit?.gt(0)}
                currency={V2CurrencyName(
                  distributionLimitCurrency?.toNumber() as V2CurrencyOption,
                )}
                projectBalanceInCurrency={balanceInDistributionLimitCurrency}
                targetAmount={distributionLimit ?? BigNumber.from(0)}
                distributedAmount={usedDistributionLimit ?? BigNumber.from(0)}
                feePercentage={
                  ETHPaymentTerminalFee
                    ? formatFee(ETHPaymentTerminalFee)
                    : undefined
                }
                ownerAddress={projectOwnerAddress}
              />
            </Skeleton>

            <Button
              type="ghost"
              size="small"
              onClick={() => setDistributePayoutsModalVisible(true)}
              disabled={isPreviewMode}
            >
              <Trans>Distribute funds</Trans>
            </Button>
          </div>
        )}

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <TooltipLabel
              label={
                <h4 style={{ display: 'inline-block' }}>
                  <Trans>Funding distribution</Trans>
                </h4>
              }
              tip={
                <Trans>
                  Available funds can be distributed according to the payouts
                  below
                  {hasDuration ? ` every ${formattedDuration}` : null}.
                </Trans>
              }
            />
            <Button
              size="small"
              onClick={() => setEditPayoutModalVisible(true)}
              icon={<SettingOutlined />}
            >
              <span>
                <Trans>Edit Percentages</Trans>
              </span>
            </Button>
          </div>
          {payoutSplits ? (
            <SplitList
              splits={payoutSplits}
              currency={distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showSplitValues={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
            />
          ) : null}
        </div>
      </Space>

      <DistributePayoutsModal
        visible={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
        onConfirmed={() => window.location.reload()}
      />
      <EditPayoutsModal
        visible={editPayoutModalVisible}
        onCancel={() => setEditPayoutModalVisible(false)}
        onOk={() => setEditPayoutModalVisible(false)}
      />
    </CardSection>
  )
}
