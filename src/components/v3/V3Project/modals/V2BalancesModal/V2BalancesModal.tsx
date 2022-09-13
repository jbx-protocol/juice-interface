import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ERC20TokenBalance from 'components/v1/shared/ERC20TokenBalance'
import { V2ProjectTokenBalance } from 'components/v3/V3Project/modals/V2BalancesModal/V2ProjectTokenBalance'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { TokenRef } from 'models/token-ref'
import { useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { revalidateProject } from 'utils/revalidateProject'

import V2TokenRefs, { AssetInputType } from './V2TokenRefs'

import { V3_PROJECT_IDS } from 'constants/v3/projectIds'

export interface EditTrackedAssetsForm {
  tokenRefs: { assetInput: { input: string; type: AssetInputType } }[]
}

export function V2BalancesModal({
  owner,
  projectMetadata,
  projectName,
  hasEditPermissions,
  visible,
  onCancel,
  storeCidTx,
}: {
  owner: string | undefined
  projectMetadata: ProjectMetadataV4 | undefined
  projectName: string | undefined
  hasEditPermissions?: boolean
  visible: boolean | undefined
  onCancel: () => void
  storeCidTx: TransactorInstance<{ cid: string }>
}) {
  const { projectId } = useContext(V3ProjectContext)
  const [editModalVisible, setEditModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<EditTrackedAssetsForm>()

  useEffect(() => {
    const initialTokens = (
      projectMetadata?.tokens ?? [{ type: 'erc20', value: '' }]
    ).map(r => ({ ...r }))
    form.setFieldsValue({
      tokenRefs: initialTokens.map(t => ({
        assetInput: { input: t.value, type: t.type },
      })),
    })
  }, [form, projectMetadata, editModalVisible])

  async function updateTokenRefs() {
    if (!projectName) return

    await form.validateFields()

    setLoading(true)

    const editingTokenRefs: TokenRef[] = form
      .getFieldsValue()
      .tokenRefs.map(t => t.assetInput)
      .map(a => ({ value: a.input, type: a.type }))

    const uploadedMetadata = await uploadProjectMetadata(
      {
        ...projectMetadata,
        tokens: editingTokenRefs.filter(t => t.type),
      },
      projectName,
    )

    if (!uploadedMetadata.IpfsHash) {
      setLoading(false)
      return
    }

    storeCidTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: async () => {
          if (projectId) {
            await revalidateProject({
              cv: '2',
              projectId: String(projectId),
            })
          }
          setLoading(false)
          setEditModalVisible(false)
          form.resetFields()
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
          {hasEditPermissions ? (
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => setEditModalVisible(true)}
            >
              <span>
                <Trans>Edit tracked assets</Trans>
              </span>
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
          <V2ProjectTokenBalance projectId={V3_PROJECT_IDS.JUICEBOX_DAO} />

          {(projectMetadata as ProjectMetadataV4)?.tokens?.map(t =>
            t.type === 'erc20' ? (
              <ERC20TokenBalance
                key={t.value}
                wallet={owner}
                tokenAddress={t.value}
              />
            ) : (
              <V2ProjectTokenBalance
                projectId={BigNumber.from(t.value).toNumber()}
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
              Display ERC-20 and other Juicebox project tokens that this project
              owner holds.
            </Trans>
          </p>
          <V2TokenRefs form={form} />
        </Modal>
      </div>
    </Modal>
  )
}
