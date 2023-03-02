import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import SpendingStats from 'components/Project/SpendingStats'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { formatFee, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { reloadWindow } from 'utils/windowUtils'
import DistributePayoutsModal from './modals/DistributePayoutsModal'

export default function PayoutSplitsCard({
  hideDistributeButton,
  payoutSplits,
  distributionLimitCurrency,
  distributionLimit,
}: {
  hideDistributeButton?: boolean
  payoutSplits: Split[] | undefined
  distributionLimitCurrency: BigNumber | undefined
  distributionLimit: BigNumber | undefined
}) {
  const {
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
    loading,
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const [distributePayoutsModalVisible, setDistributePayoutsModalVisible] =
    useState<boolean>()
  const isLoadingStats =
    loading.ETHBalanceLoading ||
    loading.distributionLimitLoading ||
    loading.balanceInDistributionLimitCurrencyLoading ||
    loading.usedDistributionLimitLoading

  const canEditPayouts = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.SET_SPLITS,
  )

  const effectiveDistributionLimit = distributionLimit ?? BigNumber.from(0)
  const distributedAmount = usedDistributionLimit ?? BigNumber.from(0)

  const distributable = effectiveDistributionLimit.sub(distributedAmount)

  const distributableAmount = balanceInDistributionLimitCurrency?.gt(
    distributable,
  )
    ? distributable
    : balanceInDistributionLimitCurrency

  const distributeButtonDisabled = distributableAmount?.eq(0)

  function DistributeButton(): JSX.Element {
    return (
      <Tooltip
        title={<Trans>No payouts remaining for this cycle.</Trans>}
        open={distributeButtonDisabled ? undefined : false}
      >
        <Button
          type="ghost"
          size="small"
          onClick={() => setDistributePayoutsModalVisible(true)}
          disabled={distributeButtonDisabled}
        >
          <Trans>Send payouts</Trans>
        </Button>
      </Tooltip>
    )
  }

  return (
    <CardSection>
      <Space direction="vertical" size="large" className="w-full">
        {hideDistributeButton ? null : (
          <div className="flex flex-wrap justify-between gap-2">
            <Skeleton
              loading={isLoadingStats}
              active
              title={false}
              paragraph={{ rows: 2, width: ['60%', '60%'] }}
            >
              <SpendingStats
                hasFundingTarget={distributionLimit?.gt(0)}
                currency={V2V3CurrencyName(
                  distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
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
          <div className="flex flex-wrap justify-between gap-2">
            <TooltipLabel
              label={
                <h3 className="inline-block text-sm uppercase text-black dark:text-slate-100">
                  <Trans>Payouts</Trans>
                </h3>
              }
              tip={
                <Trans>This cycle's payouts. Payouts reset each cycle.</Trans>
              }
            />
            {canEditPayouts && (
              <Link href={settingsPagePath('payouts', { projectId, handle })}>
                <Button
                  className="mb-4"
                  size="small"
                  icon={<SettingOutlined />}
                >
                  <span>
                    <Trans>Edit payouts</Trans>
                  </span>
                </Button>
              </Link>
            )}
          </div>
          {payoutSplits ? (
            <SplitList
              splits={payoutSplits}
              currency={distributionLimitCurrency}
              totalValue={distributionLimit}
              projectOwnerAddress={projectOwnerAddress}
              showAmounts={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
              valueFormatProps={{ precision: 4 }}
            />
          ) : (
            <span className="text-grey-500 dark:text-slate-100">
              <Trans>No payouts scheduled for this cycle.</Trans>
            </span>
          )}
        </div>
      </Space>

      <DistributePayoutsModal
        open={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
