import { SettingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'

import { useRouter } from 'next/router'
import { useState } from 'react'

import { IssueErc20TokenModal } from '../modals/IssueErc20TokenModal'

export type IssueErc20TokenTxArgs = {
  name: string
  symbol: string
}

export function IssueErc20TokenButton({
  onCompleted,
}: {
  onCompleted?: VoidFunction
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const router = useRouter()

  const onClose = () => {
    setModalVisible(false)

    // remove query parameters
    router.replace(router.asPath, undefined, { shallow: true })
  }

  return (
    <>
      <Tooltip title={ISSUE_ERC20_EXPLANATION}>
        <Button
          size="small"
          icon={<SettingOutlined />}
          onClick={() => setModalVisible(true)}
          type="default"
        >
          <span>
            <Trans>Create ERC-20</Trans>
          </span>
        </Button>
      </Tooltip>
      <IssueErc20TokenModal
        open={modalVisible}
        onClose={onClose}
        onConfirmed={onCompleted}
      />
    </>
  )
}
