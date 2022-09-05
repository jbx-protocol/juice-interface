import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import RichButton from 'components/RichButton'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import Link from 'next/link'
import { PropsWithChildren, useContext, useState } from 'react'
import { veNftPagePath } from 'utils/routes'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'

const BURN_DEFINITION_LINK =
  'https://www.investopedia.com/tech/cryptocurrency-burning-can-it-manage-inflation/'

type RedeemDisabledReason = 'redemptionRateZero' | 'overflowZero'

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
  redeemDisabledReason,
  children,
}: PropsWithChildren<{
  redeemDisabledReason?: RedeemDisabledReason
  buttonDisabled: boolean
}>) => {
  return (
    <Tooltip
      title={
        buttonDisabled ? (
          <>
            {redeemDisabledReason === 'overflowZero' ? (
              <Trans>
                Cannot redeem tokens for ETH because this project has no
                overflow.
              </Trans>
            ) : (
              <Trans>
                Cannot redeem tokens for ETH because this project's redemption
                rate is zero.
              </Trans>
            )}
          </>
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

type ModalProps = {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}

export default function ManageTokensModal({
  onCancel,
  visible,
  projectAllowsMint,
  userHasMintPermission,
  veNftEnabled,
  hasOverflow,
  tokenSymbol,
  tokenAddress,
  RedeemModal,
  ClaimTokensModal,
  MintModal,
}: {
  userHasMintPermission: boolean
  projectAllowsMint: boolean
  veNftEnabled: boolean
  onCancel?: VoidFunction
  visible?: boolean
  hasOverflow: boolean | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined

  RedeemModal: (props: ModalProps) => JSX.Element | null
  ClaimTokensModal: (props: ModalProps) => JSX.Element | null
  MintModal: (props: ModalProps) => JSX.Element | null
}) {
  const { fundingCycleMetadata, projectId, handle } =
    useContext(V2ProjectContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>()
  const [mintModalVisible, setMintModalVisible] = useState<boolean>()

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const redeemDisabled = Boolean(
    !hasOverflow || fundingCycleMetadata?.redemptionRate.eq(0),
  )
  const redeemDisabledReason = !hasOverflow
    ? 'overflowZero'
    : 'redemptionRateZero'
  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <>
      <Modal
        title={t`Manage your ${tokenSymbolText({
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
          <RedeemButtonTooltip
            buttonDisabled={redeemDisabled}
            redeemDisabledReason={redeemDisabledReason}
          >
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
                  <>
                    {redeemDisabledReason === 'overflowZero' ? (
                      <Trans>
                        Burn your {tokensLabel}. You won't receive ETH in return
                        because this project has no overflow.
                      </Trans>
                    ) : (
                      <Trans>
                        Burn your {tokensLabel}. You won't receive ETH in return
                        because this project's redemption rate is zero.
                      </Trans>
                    )}
                  </>
                }
                onClick={() => setRedeemModalVisible(true)}
              />
            </Tooltip>
          )}

          {hasIssuedTokens && (
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
          )}

          {userHasMintPermission && projectAllowsMint && (
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
                disabled={!projectAllowsMint}
              />
            </Tooltip>
          )}
          {veNftEnabled && (
            <Link href={veNftPagePath('mint', { projectId, handle })}>
              <RichButton
                heading={<Trans>Lock {tokensLabel} for Governance NFTs</Trans>}
                description={
                  <Trans>
                    Lock your {tokensLabel} to increase your voting weight and
                    claim Governance NFTs.
                  </Trans>
                }
              />
            </Link>
          )}
        </Space>
      </Modal>

      <RedeemModal
        visible={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <ClaimTokensModal
        visible={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <MintModal
        visible={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </>
  )
}
