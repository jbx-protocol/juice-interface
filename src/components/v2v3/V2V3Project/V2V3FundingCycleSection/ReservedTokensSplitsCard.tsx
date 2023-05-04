import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Skeleton, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import { TokenAmount } from 'components/TokenAmount'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatReservedRate } from 'utils/v2v3/math'
import { reloadWindow } from 'utils/windowUtils'
import DistributeReservedTokensModal from './modals/DistributeReservedTokensModal'

export default function ReservedTokensSplitsCard({
  hideDistributeButton,
  reservedTokensSplits,
  reservedRate,
}: {
  hideDistributeButton?: boolean
  reservedTokensSplits: Split[] | undefined
  reservedRate: BigNumber | undefined
}) {
  const { tokenSymbol, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const effectiveReservedRate = reservedRate ?? BigNumber.from(0)

  const [
    distributeReservedTokensModalVisible,
    setDistributeReservedTokensModalVisible,
  ] = useState<boolean>()
  const { data: reservedTokens, loading: loadingReservedTokens } =
    useProjectReservedTokens({
      projectId,
      reservedRate: reservedRate,
    })
  const canEditTokens = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.SET_SPLITS,
  )

  const tokensText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const distributeButtonDisabled = reservedTokens?.eq(0)

  const DistributeButton = (
    <Button
      type="ghost"
      size="small"
      onClick={() => setDistributeReservedTokensModalVisible(true)}
      disabled={distributeButtonDisabled}
    >
      <Trans>Send {tokensText}</Trans>
    </Button>
  )

  return (
    <CardSection>
      <div className="flex flex-col gap-6">
        {hideDistributeButton ? null : (
          <div className="flex flex-wrap justify-between gap-2">
            <div className="mr-12">
              <Skeleton
                className="inline"
                active
                loading={loadingReservedTokens}
                paragraph={{ rows: 1, width: 20 }}
                title={false}
              >
                {reservedTokens ? (
                  <span>
                    <Trans>
                      <TokenAmount
                        className="text-primary text-base font-medium"
                        amountWad={reservedTokens}
                        tokenSymbol={tokenSymbol}
                        precision={2}
                      />{' '}
                      <span className="text-xs font-medium uppercase text-grey-500 dark:text-slate-100">
                        reserved
                      </span>
                    </Trans>{' '}
                    <TooltipIcon
                      iconClassName="text-grey-500 dark:text-slate-100"
                      tip={
                        <Trans>
                          Project tokens currently reserved for the recipients
                          below. These tokens can be sent out at any time.
                        </Trans>
                      }
                    />
                  </span>
                ) : null}{' '}
              </Skeleton>
            </div>
            {reservedTokens?.eq(0) ? (
              <Tooltip title={t`No reserved tokens to send.`}>
                <div>{DistributeButton}</div>
              </Tooltip>
            ) : (
              DistributeButton
            )}
          </div>
        )}

        <div>
          <div className="flex flex-wrap justify-between gap-2 leading-10">
            <TooltipLabel
              label={
                <h3 className="inline-block text-sm uppercase text-black dark:text-slate-100">
                  <Trans>Reserved tokens</Trans> (
                  {formatReservedRate(reservedRate)}%)
                </h3>
              }
              tip={
                <Trans>
                  Projects can reserve a percentage of token issuance for the
                  recipients set by the project owner.
                </Trans>
              }
            />
            {canEditTokens && reservedRate?.gt(0) ? (
              <Link
                href={settingsPagePath('reservedtokens', {
                  projectId,
                  handle,
                })}
              >
                <Button
                  className="mb-4"
                  size="small"
                  icon={<SettingOutlined />}
                >
                  <span>
                    <Trans>Edit recipients</Trans>
                  </span>
                </Button>
              </Link>
            ) : null}
          </div>
          {effectiveReservedRate.gt(0) ? (
            reservedTokensSplits ? (
              <SplitList
                splits={reservedTokensSplits}
                projectOwnerAddress={projectOwnerAddress}
                totalValue={undefined}
                reservedRate={parseFloat(formatReservedRate(reservedRate))}
              />
            ) : null
          ) : (
            <span className="text-grey-500 dark:text-slate-100">
              <Trans>This project doesn't reserve any tokens.</Trans>
            </span>
          )}
        </div>
      </div>

      <DistributeReservedTokensModal
        open={distributeReservedTokensModalVisible}
        onCancel={() => setDistributeReservedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
