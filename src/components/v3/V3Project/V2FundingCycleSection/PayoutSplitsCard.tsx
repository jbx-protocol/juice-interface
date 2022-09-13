import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import SpendingStats from 'components/Project/SpendingStats'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v3/shared/SplitList'
import { ThemeContext } from 'contexts/themeContext'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useETHPaymentTerminalFee } from 'hooks/v3/contractReader/ETHPaymentTerminalFee'
import { useV3ConnectedWalletHasPermission } from 'hooks/v3/contractReader/V3ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V3CurrencyOption } from 'models/v3/currencyOption'
import { V3OperatorPermission } from 'models/v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { detailedTimeString } from 'utils/formatTime'
import { settingsPagePath } from 'utils/routes'
import { formatFee, MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'
import { V3CurrencyName } from 'utils/v3/currency'
import { reloadWindow } from 'utils/windowUtils'
import DistributePayoutsModal from './modals/DistributePayoutsModal'

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
    theme: { colors },
  } = useContext(ThemeContext)
  const {
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
    isPreviewMode,
    loading,
    projectId,
    handle,
  } = useContext(V3ProjectContext)
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const [distributePayoutsModalVisible, setDistributePayoutsModalVisible] =
    useState<boolean>()
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
  const canEditPayouts = useV3ConnectedWalletHasPermission(
    V3OperatorPermission.SET_SPLITS,
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
      <Tooltip
        title={<Trans>No funds available to distribute.</Trans>}
        visible={distributeButtonDisabled ? undefined : false}
      >
        <Button
          type="ghost"
          size="small"
          onClick={() => setDistributePayoutsModalVisible(true)}
          disabled={distributeButtonDisabled}
        >
          <Trans>Distribute funds</Trans>
        </Button>
      </Tooltip>
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
                currency={V3CurrencyName(
                  distributionLimitCurrency?.toNumber() as V3CurrencyOption,
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

            <div>
              <DistributeButton />
            </div>
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
            {canEditPayouts && effectiveDistributionLimit.gt(0) && (
              <Link href={settingsPagePath('payouts', { projectId, handle })}>
                <Button
                  size="small"
                  icon={<SettingOutlined />}
                  style={{ marginBottom: '1rem' }}
                >
                  <span>
                    <Trans>Edit payouts</Trans>
                  </span>
                </Button>
              </Link>
            )}
          </div>
          {effectiveDistributionLimit.gt(0) ? (
            payoutSplits ? (
              <SplitList
                splits={payoutSplits}
                currency={distributionLimitCurrency}
                totalValue={distributionLimit}
                projectOwnerAddress={projectOwnerAddress}
                showSplitValues={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
                valueFormatProps={{ precision: 4 }}
              />
            ) : null
          ) : (
            <span style={{ color: colors.text.tertiary }}>
              <Trans>This project has no distributions.</Trans>
            </span>
          )}
        </div>
      </Space>

      <DistributePayoutsModal
        visible={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
