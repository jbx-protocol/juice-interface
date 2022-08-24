import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2/shared/SplitList'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectReservedTokens from 'hooks/v2/contractReader/ProjectReservedTokens'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import { Split } from 'models/v2/splits'
import { CSSProperties, useContext, useState } from 'react'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { formatReservedRate } from 'utils/v2/math'
import { reloadWindow } from 'utils/windowUtils'

import DistributeReservedTokensModal from './modals/DistributeReservedTokensModal'
import { EditTokenAllocationModal } from './modals/EditTokenAllocationModal'

export default function ReservedTokensSplitsCard({
  hideDistributeButton,
  reservedTokensSplits,
  reservedRate,
}: {
  hideDistributeButton?: boolean
  reservedTokensSplits: Split[] | undefined
  reservedRate: BigNumber | undefined
}) {
  const { tokenSymbol, projectOwnerAddress, projectId, isPreviewMode } =
    useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const effectiveReservedRate = reservedRate ?? BigNumber.from(0)

  const [
    distributeReservedTokensModalVisible,
    setDistributeReservedTokensModalVisible,
  ] = useState<boolean>()
  const [editTokenAllocationModalVisible, setEditTokenAllocationModalVisible] =
    useState<boolean>(false)
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
                  <Trans>Reserved {tokensText}</Trans> (
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
              <Button
                size="small"
                onClick={() => setEditTokenAllocationModalVisible(true)}
                icon={<SettingOutlined />}
                style={{ marginBottom: '1rem' }}
              >
                <span>
                  <Trans>Edit allocation</Trans>
                </span>
              </Button>
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
        visible={distributeReservedTokensModalVisible}
        onCancel={() => setDistributeReservedTokensModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <EditTokenAllocationModal
        visible={editTokenAllocationModalVisible}
        onOk={() => setEditTokenAllocationModalVisible(false)}
        onCancel={() => setEditTokenAllocationModalVisible(false)}
      />
    </CardSection>
  )
}
