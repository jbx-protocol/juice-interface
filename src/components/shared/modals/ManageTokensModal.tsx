import { t, Trans } from '@lingui/macro'
import { Modal, Space, Tooltip } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'

import { PropsWithChildren } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const BURN_DEFINITION_LINK =
  'https://www.investopedia.com/tech/cryptocurrency-burning-can-it-manage-inflation/'

export const BurnTokensHelp = () => {
  return (
    <Trans>
      <ExternalLink href={BURN_DEFINITION_LINK}>Learn more</ExternalLink> about
      burning tokens.
    </Trans>
  )
}

export const RedeemButtonTooltip = ({
  buttonDisabled,
  children,
}: PropsWithChildren<{
  buttonDisabled: boolean | undefined
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
  onCancel,
  visible,
  tokenSymbol,
  redeemTokensModalTrigger,
  claimUnclaimedTokensModalTrigger,
  mintTokensModalTrigger,
}: {
  onCancel?: VoidFunction
  visible?: boolean
  tokenSymbol: string | undefined
  redeemTokensModalTrigger: JSX.Element | undefined
  claimUnclaimedTokensModalTrigger: JSX.Element | undefined
  mintTokensModalTrigger?: JSX.Element
}) {
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
          {redeemTokensModalTrigger}

          {claimUnclaimedTokensModalTrigger}

          {mintTokensModalTrigger}
        </Space>
      </Modal>
    </>
  )
}
