import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import RichButton from 'components/shared/RichButton'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { V1FundingCycleMetadata } from 'models/v1/fundingCycle'
import { PropsWithChildren, useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ConfirmUnstakeTokensModal from '../modals/ConfirmUnstakeTokensModal'
import PrintPreminedModal from '../modals/PrintPreminedModal'
import RedeemModal from '../modals/RedeemModal'

const BURN_DEFINITION_LINK =
  'https://www.investopedia.com/tech/cryptocurrency-burning-can-it-manage-inflation/'

const BurnTokensHelp = () => {
  return (
    <Trans>
      <ExternalLink href={BURN_DEFINITION_LINK}>Learn more</ExternalLink> about
      burning tokens.
    </Trans>
  )
}

const RedeemButtonTooltip = ({
  buttonDisabled,
  children,
}: PropsWithChildren<{
  buttonDisabled: boolean
}>) => {
  return (
    <Tooltip
      title={
        buttonDisabled ? (
          <Trans>
            Cannot redeem tokens for ETH because this project has no overflow.
          </Trans>
        ) : (
          <BurnTokensHelp />
        )
      }
      placement="right"
    >
      {children}
    </Tooltip>
  )
}

export default function ManageTokensModal({
  metadata,
  onCancel,
  visible,
}: {
  metadata: V1FundingCycleMetadata | undefined
  onCancel?: VoidFunction
  visible?: boolean
}) {
  const { projectId, tokenSymbol, overflow } = useContext(V1ProjectContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [mintModalVisible, setMintModalVisible] = useState<boolean>()

  const canPrintPreminedV1Tickets = useCanPrintPreminedTokens()
  const hasPrintPreminePermission = useHasPermission(
    OperatorPermission.PrintTickets,
  )

  const mintingTokensIsAllowed =
    metadata &&
    (metadata.version === 0
      ? canPrintPreminedV1Tickets
      : metadata.ticketPrintingIsAllowed)

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const redeemDisabled = !Boolean(overflow?.gt(0))

  return (
    <>
      <Modal
        title={t`Manage ${tokenSymbolText({
          tokenSymbol: tokenSymbol,
          capitalize: false,
          plural: true,
          includeTokenWord: true,
        })}`}
        visible={visible}
        onCancel={onCancel}
        okButtonProps={{ hidden: true }}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <RedeemButtonTooltip buttonDisabled={redeemDisabled}>
            <RichButton
              heading={<Trans>Redeem {tokensLabel} for ETH</Trans>}
              description={
                <Trans>
                  Redeem your {tokensLabel} for a portion of the project's
                  overflow. Any {tokensLabel} you redeem will be burned.
                </Trans>
              }
              onClick={() => setRedeemModalVisible(true)}
              disabled={redeemDisabled}
            />
          </RedeemButtonTooltip>

          {redeemDisabled && (
            <Tooltip title={<BurnTokensHelp />} placement="right">
              <RichButton
                heading={<Trans>Burn {tokensLabel}</Trans>}
                description={
                  <Trans>
                    Burn your {tokensLabel}. You won't receive ETH in return
                    because this project has no overflow.
                  </Trans>
                }
                onClick={() => setRedeemModalVisible(true)}
              />
            </Tooltip>
          )}

          <RichButton
            heading={<Trans>Claim {tokensLabel} as ERC-20</Trans>}
            description={
              <Trans>
                Move your {tokensLabel} from the Juicebox contract to your
                wallet.
              </Trans>
            }
            onClick={() => setUnstakeModalVisible(true)}
          />

          {hasPrintPreminePermission && projectId?.gt(0) && (
            <Tooltip
              title={
                <Trans>
                  Token minting is only available for V1.1 projects. Token
                  minting can be enabled or disabled by reconfiguring the
                  project's funding cycle.
                </Trans>
              }
              placement="right"
            >
              <RichButton
                heading={<Trans>Mint {tokensLabel}</Trans>}
                description={
                  <Trans>
                    Mint new {tokensLabel} into an account. Only a project's
                    owner, a designated operator, or one of its terminal's
                    delegates can mint its tokens.
                  </Trans>
                }
                onClick={() => setMintModalVisible(true)}
                disabled={!mintingTokensIsAllowed}
              />
            </Tooltip>
          )}
        </Space>
      </Modal>

      <RedeemModal
        visible={redeemModalVisible}
        onOk={() => {
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          setRedeemModalVisible(false)
        }}
      />
      <ConfirmUnstakeTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
      />
      <PrintPreminedModal
        visible={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
      />
    </>
  )
}
