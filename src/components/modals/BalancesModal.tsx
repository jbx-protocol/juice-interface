import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Modal, Space } from 'antd'
import ERC20TokenBalance from 'components/shared/ERC20TokenBalance'
import { FormItems } from 'components/shared/formItems'
import ProjectTokenBalance from 'components/shared/ProjectTokenBalance'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { TokenRef } from 'models/token-ref'
import { useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

import { t, Trans } from '@lingui/macro'

export default function BalancesModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: () => void
}) {
  const [editModalVisible, setEditModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [editingTokenRefs, setEditingTokenRefs] = useState<TokenRef[]>([])
  const { owner, metadata } = useContext(V1ProjectContext)
  const setProjectUriTx = useSetProjectUriTx()

  useEffect(() => {
    setEditingTokenRefs(
      (metadata as ProjectMetadataV3)?.tokens ?? [{ type: 'erc20', value: '' }],
    )
  }, [metadata])

  const hasEditPermission = useHasPermission([OperatorPermission.SetUri])

  async function updateTokenRefs() {
    setLoading(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...metadata,
      tokens: editingTokenRefs.filter(t => t.type),
    })

    if (!uploadedMetadata?.success) {
      setLoading(false)
      return
    }

    setProjectUriTx(
      { cid: uploadedMetadata.cid },
      {
        onDone: () => {
          setLoading(false)
          setEditModalVisible(false)
        },
      },
    )
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          {hasEditPermission ? (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => setEditModalVisible(true)}
            >
              <Trans>Edit tracked assets</Trans>
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={onCancel}>
            <Trans>Done</Trans>
          </Button>
        </div>
      }
    >
      <div>
        <h2>
          <Trans>Assets</Trans>
        </h2>
        <p>
          <Trans>Other assets in this project's owner's wallet.</Trans>
        </p>

        <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
          <ProjectTokenBalance
            wallet={owner}
            projectId={BigNumber.from('0x01')}
          />
          {(metadata as ProjectMetadataV3)?.tokens?.map(t =>
            t.type === 'erc20' ? (
              <ERC20TokenBalance
                key={t.value}
                wallet={owner}
                tokenAddress={t.value}
              />
            ) : (
              <ProjectTokenBalance
                key={t.value}
                wallet={owner}
                projectId={BigNumber.from(t.value)}
              />
            ),
          )}
        </Space>

        <Modal
          title={t`Edit tracked assets`}
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          cancelText={t`Cancel`}
          width={600}
          confirmLoading={loading}
          onOk={updateTokenRefs}
          okText={t`Save tracked assets`}
        >
          <p style={{ marginBottom: 40 }}>
            <Trans>
              Display ERC20 tokens and other Juicebox project tokens that are in
              this project's owner's wallet.
            </Trans>
          </p>
          <FormItems.TokenRefs
            refs={editingTokenRefs}
            onRefsChange={setEditingTokenRefs}
          />
        </Modal>
      </div>
    </Modal>
  )
}
