import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useProjectReservedTokens from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { CSSProperties, useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { tokenSymbol, projectOwnerAddress, isPreviewMode, handle } =
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
    V2OperatorPermission.SET_SPLITS,
  )

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    cursor: 'default',
    color: colors.text.secondary,
  }

  const tokensText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const distributeButtonDisabled = isPreviewMode || reservedTokens?.eq(0)

  function DistributeButton(): JSX.Element {
    return (
      <Button
        type="ghost"
        size="small"
        onClick={() => setDistributeReservedTokensModalVisible(true)}
        disabled={distributeButtonDisabled}
      >
        <Trans>Distribute {tokensText}</Trans>
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
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ marginRight: '3rem' }}>
              <Skeleton
                active
                loading={!isPreviewMode && loadingReservedTokens}
                paragraph={{ rows: 1, width: 20 }}
                title={false}
                style={{ display: 'inline' }}
              >
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {formatWad(reservedTokens, { precision: 0 })}
                </span>
              </Skeleton>{' '}
              <TooltipLabel
                style={{
                  ...smallHeaderStyle,
                  whiteSpace: 'nowrap',
                }}
                label={
                  <span style={{ textTransform: 'uppercase' }}>
                    <Trans>{tokensText} reserved</Trans>
                  </span>
                }
                tip={
                  <Trans>
                    The amount of tokens this project has reserved. These tokens
                    can be distributed to reserved token beneficiaries.
                  </Trans>
                }
              />
            </div>
            {reservedTokens?.eq(0) ? (
              <Tooltip title={t`No reserved tokens available to distribute.`}>
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
                  <Trans>Reserved {tokensText} splits</Trans> (
                  {formatReservedRate(reservedRate)}%)
                </h4>
              }
              tip={
                <Trans>
                  A project can reserve a percentage of tokens minted from every
                  payment it receives. Reserved tokens can be distributed
                  according to the allocation below at any time.
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
                  size="small"
                  icon={<SettingOutlined />}
                  style={{ marginBottom: '1rem' }}
                >
                  <span>
                    <Trans>Edit allocation</Trans>
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
            <span style={{ color: colors.text.tertiary }}>
              <Trans>This project has no reserved tokens.</Trans>
            </span>
          )}
        </div>
      </Space>

      <DistributeReservedTokensModal
        open={distributeReservedTokensModalVisible}
        onCancel={() => setDistributeReservedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
