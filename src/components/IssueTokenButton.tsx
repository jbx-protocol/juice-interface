import { SettingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space, Tooltip } from 'antd'
import { ButtonType } from 'antd/lib/button'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useRouter } from 'next/router'
import { useState } from 'react'

import IssueTokenModal from './modals/IssueTokenModal'

export type IssueTokenTxArgs = {
  name: string
  symbol: string
}

export default function IssueTokenButton({
  useIssueTokensTx,
  type,
  text,
  size,
  hideIcon,
  onCompleted,
  disabled,
  tooltipText,
}: {
  useIssueTokensTx: () => TransactorInstance<IssueTokenTxArgs>
  type?: ButtonType
  text?: JSX.Element
  size?: SizeType
  hideIcon?: boolean
  onCompleted?: VoidFunction
  disabled?: boolean
  tooltipText?: JSX.Element
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const router = useRouter()

  function IssueTokensButton() {
    return (
      <Tooltip
        title={
          !disabled &&
          (tooltipText ?? (
            <Trans>
              Issue an ERC-20 to be used as this project's token. Once issued,
              anyone can claim their existing token balance in the new token.
            </Trans>
          ))
        }
      >
        <Button
          size={size ?? 'small'}
          icon={!hideIcon && <SettingOutlined />}
          onClick={() => setModalVisible(true)}
          type={type ?? 'default'}
          disabled={disabled}
        >
          <span>{text ?? <Trans>Issue ERC-20</Trans>}</span>
        </Button>
      </Tooltip>
    )
  }

  const onClose = () => {
    setModalVisible(false)

    // remove newDeploy=true query parameter
    router.replace(router.pathname, {
      search: '',
    })
  }

  return (
    <div>
      <Space>
        <IssueTokensButton />
      </Space>
      <IssueTokenModal
        visible={modalVisible}
        useIssueTokensTx={useIssueTokensTx}
        onClose={onClose}
        onConfirmed={onCompleted}
      />
    </div>
  )
}
