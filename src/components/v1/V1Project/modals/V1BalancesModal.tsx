import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Modal, Space } from 'antd'
import ERC20TokenBalance from 'components/ERC20TokenBalance'
import { FormItems } from 'components/formItems'
import V1ProjectTokenBalance from 'components/v1/shared/V1ProjectTokenBalance'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/V1ConnectedWalletHasPermission'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { TokenRef } from 'models/token-ref'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useEffect, useState } from 'react'

import { t, Trans } from '@lingui/macro'

import { revalidateProject } from 'lib/api/nextjs'
import { V1TerminalVersion } from 'models/v1/terminals'

import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'

export function V1BalancesModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: () => void
}) {
  const { owner, handle } = useContext(V1ProjectContext)
  const { projectMetadata, cv } = useContext(ProjectMetadataContext)

  const [editModalVisible, setEditModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [editingTokenRefs, setEditingTokenRefs] = useState<TokenRef[]>([])

  const setProjectUriTx = useSetProjectUriTx()

  useEffect(() => {
    const initialTokens = projectMetadata?.tokens ?? [
      { type: 'erc20', value: '' },
    ]
    setEditingTokenRefs(initialTokens)
  }, [projectMetadata])

  const hasEditPermission = useV1ConnectedWalletHasPermission([
    V1OperatorPermission.SetUri,
  ])

  async function updateTokenRefs() {
    if (!handle) return

    setLoading(true)

    const uploadedMetadata = await uploadProjectMetadata(
      {
        ...projectMetadata,
        tokens: editingTokenRefs.filter(t => t.type),
      },
      handle,
    )

    if (!uploadedMetadata.IpfsHash) {
      setLoading(false)
      return
    }

    setProjectUriTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: async () => {
          if (cv) {
            await revalidateProject({ cv: cv as V1TerminalVersion, handle })
          }
          setLoading(false)
          setEditModalVisible(false)
        },
      },
    )
  }

  return (
    <Modal
      open={open}
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
          <V1ProjectTokenBalance
            wallet={owner}
            projectId={V1_PROJECT_IDS.JUICEBOX_DAO}
          />
          {(projectMetadata as ProjectMetadataV5)?.tokens?.map(t =>
            t.type === 'erc20' ? (
              <ERC20TokenBalance
                key={t.value}
                wallet={owner}
                tokenAddress={t.value}
              />
            ) : (
              <V1ProjectTokenBalance
                key={t.value}
                wallet={owner}
                projectId={BigNumber.from(t.value).toNumber()}
              />
            ),
          )}
        </Space>

        <Modal
          title={t`Edit tracked assets`}
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          cancelText={t`Cancel`}
          width={600}
          confirmLoading={loading}
          onOk={updateTokenRefs}
          okText={t`Save tracked assets`}
        >
          <p style={{ marginBottom: 40 }}>
            <Trans>
              Display ERC-20 tokens and other Juicebox project tokens that are
              in this project's owner's wallet.
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
