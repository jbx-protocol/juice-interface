import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import SplitList from 'components/v2/shared/SplitList'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { CSSProperties, useContext, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'

import { formatReservedRate } from 'utils/v2/math'

import { tokenSymbolText } from 'utils/tokenSymbolText'

import useProjectReservedTokens from 'hooks/v2/contractReader/ProjectReservedTokens'

import { formatWad } from 'utils/formatNumber'

import FormattedAddress from 'components/shared/FormattedAddress'

import * as constants from '@ethersproject/constants'
import { Split } from 'models/v2/splits'
import { BigNumber } from '@ethersproject/bignumber'

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
    tokenSymbol,
    tokenAddress,
    projectOwnerAddress,
    projectId,
    isPreviewMode,
  } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [
    distributeReservedTokensModalVisible,
    setDistributeReservedTokensModalVisible,
  ] = useState<boolean>()
  const { data: reservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: reservedRate,
  })

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

  const tokensTextSingular = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <CardSection>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {hideDistributeButton ? null : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginRight: '3rem' }}>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {formatWad(reservedTokens, { precision: 0 })}
              </span>{' '}
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
                    The amount of tokens reserved for this project. These tokens
                    can be distributed to reserved token beneficiaries.
                  </Trans>
                }
              />
              {tokenAddress && tokenAddress !== constants.AddressZero ? (
                <div style={smallHeaderStyle}>
                  {tokensTextSingular} contract address:{' '}
                  <FormattedAddress address={tokenAddress} />
                </div>
              ) : null}
            </div>
            <Button
              type="ghost"
              size="small"
              onClick={() => setDistributeReservedTokensModalVisible(true)}
              disabled={isPreviewMode}
            >
              <Trans>Distribute {tokensText}</Trans>
            </Button>
          </div>
        )}

        <div>
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
          {reservedTokensSplits ? (
            <SplitList
              splits={reservedTokensSplits}
              projectOwnerAddress={projectOwnerAddress}
              totalValue={undefined}
            />
          ) : null}
        </div>
      </Space>

      <DistributeReservedTokensModal
        visible={distributeReservedTokensModalVisible}
        onCancel={() => setDistributeReservedTokensModalVisible(false)}
        onConfirmed={() => setDistributeReservedTokensModalVisible(false)}
      />
    </CardSection>
  )
}
