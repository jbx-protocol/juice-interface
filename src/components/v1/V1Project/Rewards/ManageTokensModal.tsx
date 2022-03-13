import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space, Tooltip } from 'antd'
import RichButton from 'components/shared/RichButton'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { V1FundingCycleMetadata } from 'models/v1/fundingCycle'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ConfirmUnstakeTokensModal from '../modals/ConfirmUnstakeTokensModal'
import PrintPreminedModal from '../modals/PrintPreminedModal'
import RedeemModal from '../modals/RedeemModal'

export default function ManageTokensModal({
  metadata,
  onCancel,
  visible,
}: {
  metadata?: V1FundingCycleMetadata
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

  const tokensLabelLowercase = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: true,
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
          <RichButton
            heading={<Trans>Redeem {tokensLabelLowercase} for ETH</Trans>}
            description={
              <Trans>
                Burn your {tokensLabelLowercase} in exchange for ETH.
              </Trans>
            }
            onClick={() => setRedeemModalVisible(true)}
            disabled={redeemDisabled}
          />

          {redeemDisabled && (
            <RichButton
              heading={<Trans>Burn {tokensLabelLowercase}</Trans>}
              description={
                <Trans>
                  Burn your {tokensLabelLowercase}. You won't receive ETH
                  because this project has no overflow.
                </Trans>
              }
              onClick={() => setRedeemModalVisible(true)}
            />
          )}

          <RichButton
            heading={<Trans>Claim {tokensLabelLowercase} as ERC20</Trans>}
            description={
              <Trans>
                Move your {tokensLabelLowercase} from the Juicebox contract to
                your wallet.
              </Trans>
            }
            onClick={() => setUnstakeModalVisible(true)}
          />

          {!hasPrintPreminePermission && projectId?.gt(0) && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Privileged actions</h3>
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
                  heading={<Trans>Mint {tokensLabelLowercase}</Trans>}
                  description={
                    <Trans>
                      Mint new {tokensLabelLowercase} into an account. Only a
                      project's owner, a designated operator, or one of its
                      terminal's delegates can mint its tokens.
                    </Trans>
                  }
                  onClick={() => setMintModalVisible(true)}
                  disabled={!mintingTokensIsAllowed}
                />
              </Tooltip>
            </div>
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
