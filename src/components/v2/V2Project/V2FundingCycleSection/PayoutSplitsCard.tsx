import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import TooltipLabel from 'components/TooltipLabel'
import SpendingStats from 'components/Project/SpendingStats'
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
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/UserHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'

import { reloadWindow } from 'utils/windowUtils'

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
  const canEditPayouts = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.SET_SPLITS,
  )

  const effectiveDistributionLimit = distributionLimit ?? BigNumber.from(0)
  const distributedAmount = usedDistributionLimit ?? BigNumber.from(0)

  const distributable = effectiveDistributionLimit.sub(distributedAmount)

  const distributableAmount = balanceInDistributionLimitCurrency?.gt(
    distributable,
  )
    ? distributable
    : balanceInDistributionLimitCurrency

  const distributeButtonDisabled = isPreviewMode || distributableAmount?.eq(0)

  function DistributeButton(): JSX.Element {
    return (
      <Button
        type="ghost"
        size="small"
        onClick={() => setDistributePayoutsModalVisible(true)}
        disabled={distributeButtonDisabled}
      >
        <Trans>Distribute funds</Trans>
      </Button>
    )
  }

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
                distributableAmount={distributableAmount}
                targetAmount={distributionLimit ?? BigNumber.from(0)}
                distributedAmount={distributedAmount}
                feePercentage={
                  ETHPaymentTerminalFee
                    ? formatFee(ETHPaymentTerminalFee)
                    : undefined
                }
                ownerAddress={projectOwnerAddress}
              />
            </Skeleton>
            {distributableAmount?.eq(0) ? (
              <Tooltip title={<Trans>No funds available to distribute.</Trans>}>
                <div>
                  <DistributeButton />
                </div>
              </Tooltip>
            ) : (
              <DistributeButton />
            )}
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
            {canEditPayouts && (
              <Button
                size="small"
                onClick={() => setEditPayoutModalVisible(true)}
                icon={<SettingOutlined />}
                style={{ marginBottom: '1rem' }}
              >
                <span>
                  <Trans>Edit payouts</Trans>
                </span>
              </Button>
            )}
          </div>
          {payoutSplits ? (
            <SplitList
              splits={payoutSplits}
              currency={distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showSplitValues={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
              valueFormatProps={{ precision: 4 }}
            />
          ) : null}
        </div>
      </Space>

      <DistributePayoutsModal
        visible={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <EditPayoutsModal
        visible={editPayoutModalVisible}
        onCancel={() => setEditPayoutModalVisible(false)}
        onOk={() => setEditPayoutModalVisible(false)}
      />
    </CardSection>
  )
}
