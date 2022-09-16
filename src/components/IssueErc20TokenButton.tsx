import { SettingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'

import { TransactorInstance } from 'hooks/Transactor'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { IssueErc20TokenModal } from './modals/IssueErc20TokenModal'

export type IssueErc20TokenTxArgs = {
  name: string
  symbol: string
}

export function IssueErc20TokenButton({
  useIssueErc20TokenTx,
  onCompleted,
}: {
  useIssueErc20TokenTx: () => TransactorInstance<IssueErc20TokenTxArgs>
  onCompleted?: VoidFunction
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const router = useRouter()

  const onClose = () => {
    setModalVisible(false)

    // remove newDeploy=true query parameter
    router.replace(router.pathname, {
      search: '',
    })
  }

  return (
    <>
      <Tooltip
        title={
          <Trans>
            Issue an ERC-20 to be used as this project's token. Once issued,
            anyone can claim their existing token balance in the new token.
          </Trans>
        }
      >
        <Button
          size="small"
          icon={<SettingOutlined />}
          onClick={() => setModalVisible(true)}
          type="default"
        >
          <span>
            <Trans>Issue ERC-20</Trans>
          </span>
        </Button>
      </Tooltip>
      <IssueErc20TokenModal
        visible={modalVisible}
        useIssueErc20TokenTx={useIssueErc20TokenTx}
        onClose={onClose}
        onConfirmed={onCompleted}
      />
    </>
  )
}
