import { BigNumber } from 'ethers'

import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import RichButton from 'components/buttons/RichButton'
import { TransactorInstance } from 'hooks/useTransactor'
import { PropsWithChildren, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'
import { TransferUnclaimedTokensModal } from './TransferUnclaimedTokensModal'

type RedeemDisabledReason = 'redemptionRateZero' | 'overflowZero'

const RedeemButtonTooltip = ({
  buttonDisabled,
  redeemDisabledReason,
  children,
}: PropsWithChildren<{
  redeemDisabledReason?: RedeemDisabledReason
  buttonDisabled?: boolean
}>) => {
  if (!buttonDisabled) return <>{children}</>

  return (
    <Tooltip
      title={
        redeemDisabledReason === 'overflowZero' ? (
          <Trans>
            This project has no ETH, or is using all of its ETH for payouts.
          </Trans>
        ) : (
          <Trans>This project has redemptions turned off.</Trans>
        )
      }
      placement="right"
    >
      {children}
    </Tooltip>
  )
}

type ModalProps = {
  open: boolean
  onCancel: VoidFunction
  onConfirmed: VoidFunction
}

export default function ManageTokensModal({
  onCancel,
  open,
  projectAllowsMint,
  userHasMintPermission,
  hasOverflow,
  redeemDisabled,
  tokenSymbol,
  tokenAddress,
  tokenUnclaimedBalance,

  transferUnclaimedTokensTx,

  children,
  RedeemModal,
  ClaimTokensModal,
  MintModal,
}: PropsWithChildren<{
  userHasMintPermission: boolean
  projectAllowsMint: boolean
  onCancel?: VoidFunction
  open?: boolean
  hasOverflow: boolean | undefined
  redeemDisabled: boolean | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  tokenUnclaimedBalance: BigNumber | undefined

  transferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>

  RedeemModal: (props: ModalProps) => JSX.Element | null
  ClaimTokensModal: (props: ModalProps) => JSX.Element | null
  MintModal: (props: ModalProps) => JSX.Element | null
}>) {
  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)
  const [unstakeModalVisible, setUnstakeModalVisible] = useState<boolean>(false)
  const [mintModalVisible, setMintModalVisible] = useState<boolean>(false)
  const [transferTokensModalVisible, setTransferTokensModalVisible] =
    useState<boolean>(false)

  const tokensLabel = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const redeemDisabledReason = !hasOverflow
    ? 'overflowZero'
    : 'redemptionRateZero'
  const hasIssuedTokens = tokenAddress && !isZeroAddress(tokenAddress)

  return (
    <>
      <Modal
        title={t`Manage your ${tokenSymbolText({
          tokenSymbol,
          capitalize: false,
          plural: true,
          includeTokenWord: true,
        })}`}
        open={open}
        onCancel={onCancel}
        okButtonProps={{ hidden: true }}
        centered
      >
        <Space direction="vertical" className="w-full">
          <RedeemButtonTooltip
            buttonDisabled={redeemDisabled}
            redeemDisabledReason={redeemDisabledReason}
          >
            <div>
              <RichButton
                heading={<Trans>Redeem {tokensLabel} for ETH</Trans>}
                description={
                  <Trans>
                    Redeem your {tokensLabel} to reclaim a portion of the ETH
                    not needed for payouts. Any {tokensLabel} you redeem will be
                    burned.
                  </Trans>
                }
                onClick={() => setRedeemModalVisible(true)}
                disabled={redeemDisabled}
              />
            </div>
          </RedeemButtonTooltip>

          {redeemDisabled && (
            <RichButton
              heading={<Trans>Burn {tokensLabel}</Trans>}
              description={
                <>
                  {redeemDisabledReason === 'overflowZero' ? (
                    <Trans>
                      Burn your {tokensLabel}. You won't receive ETH in return
                      because this project has no ETH, or is using all of its
                      ETH for payouts.
                    </Trans>
                  ) : (
                    <Trans>
                      Burn your {tokensLabel}. You won't receive ETH in return
                      because this project has redemptions turned off.
                    </Trans>
                  )}
                </>
              }
              onClick={() => setRedeemModalVisible(true)}
            />
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
                  Owner token minting is not available for V1.0 projects. Owner
                  token minting can be enabled by editing the project's cycle.
                </Trans>
              }
              placement="right"
            >
              <div>
                <RichButton
                  heading={<Trans>Mint {tokensLabel}</Trans>}
                  description={
                    <Trans>
                      Mint new {tokensLabel} into a wallet. Only a project's
                      owner, a designated operator, or one of the terminal's
                      delegates can mint project tokens.
                    </Trans>
                  }
                  onClick={() => setMintModalVisible(true)}
                  disabled={!projectAllowsMint}
                />
              </div>
            </Tooltip>
          )}
          {tokenUnclaimedBalance?.gt(0) ? (
            <RichButton
              heading={<Trans>Transfer unclaimed {tokensLabel}</Trans>}
              description={
                <Trans>
                  Move your unclaimed {tokensLabel} from your wallet to another
                  wallet.
                </Trans>
              }
              onClick={() => setTransferTokensModalVisible(true)}
            />
          ) : null}

          {children}
        </Space>
      </Modal>

      <RedeemModal
        open={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <ClaimTokensModal
        open={unstakeModalVisible}
        onCancel={() => setUnstakeModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <MintModal
        open={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
        onConfirmed={reloadWindow}
      />
      <TransferUnclaimedTokensModal
        open={transferTokensModalVisible}
        onCancel={() => setTransferTokensModalVisible(false)}
        onConfirmed={reloadWindow}
        tokenSymbol={tokenSymbol}
        unclaimedBalance={tokenUnclaimedBalance}
        useTransferUnclaimedTokensTx={transferUnclaimedTokensTx}
      />
    </>
  )
}
