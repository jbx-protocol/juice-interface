import * as constants from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import RichButton from 'components/RichButton'
import { PropsWithChildren, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'
import { TransactorInstance } from 'hooks/Transactor'

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
            You cannot redeem your tokens for ETH because this project has no
            overflow.
          </Trans>
        ) : (
          <Trans>
            You cannot redeem your tokens for ETH because this project's
            redemption rate is zero.
          </Trans>
        )
      }
      placement="right"
    >
      {children}
    </Tooltip>
  )
}

type ModalProps = {
  visible: boolean
  onCancel: VoidFunction
  onConfirmed: VoidFunction
}

type TransferUnclaimedModalProps = {
  tokenSymbol: string | undefined
  unclaimedBalance: BigNumber | undefined
  useTransferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>
} & ModalProps

export default function ManageTokensModal({
  onCancel,
  visible,
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
  TransferUnclaimedTokensModal,
}: PropsWithChildren<{
  userHasMintPermission: boolean
  projectAllowsMint: boolean
  onCancel?: VoidFunction
  visible?: boolean
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
  TransferUnclaimedTokensModal: (
    props: TransferUnclaimedModalProps,
  ) => JSX.Element | null
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
  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <>
      <Modal
        title={t`Manage your ${tokenSymbolText({
          tokenSymbol,
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
            <div>
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
              <div>
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
              </div>
            </Tooltip>
          )}
          {tokenUnclaimedBalance?.gt(0) ? (
            <RichButton
              heading={<Trans>Transfer unclaimed {tokensLabel}</Trans>}
              description={
                <Trans>
                  {' '}
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
      <TransferUnclaimedTokensModal
        visible={transferTokensModalVisible}
        onCancel={() => setTransferTokensModalVisible(false)}
        onConfirmed={reloadWindow}
        tokenSymbol={tokenSymbol}
        unclaimedBalance={tokenUnclaimedBalance}
        useTransferUnclaimedTokensTx={transferUnclaimedTokensTx}
      />
    </>
  )
}
