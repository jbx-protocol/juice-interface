import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, ModalProps, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ERC20TokenBalance from 'components/ERC20TokenBalance'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { TokenRef } from 'models/token-ref'
import { useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { revalidateProject } from 'utils/revalidateProject'
import { V2V3ProjectTokenBalance } from './V2V3ProjectTokenBalance'

import { AssetInputType, TokenRefs } from './TokenRefs'

import { CV_V2 } from 'constants/cv'
import { V2V3_PROJECT_IDS } from 'constants/v2v3/projectIds'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import { V2OperatorPermission } from 'models/v2v3/permissions'

export interface EditTrackedAssetsForm {
  tokenRefs: { assetInput: { input: string; type: AssetInputType } }[]
}

export function V2V3DownloadActivityModal(props: ModalProps) {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const [editModalVisible, setEditModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<EditTrackedAssetsForm>()

  const hasEditPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const editV2ProjectDetailsTx = useEditProjectDetailsTx()

  const projectName = projectMetadata?.name

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

    editV2ProjectDetailsTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: async () => {
          if (projectId) {
            await revalidateProject({
              cv: CV_V2,
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
              <span>
                <Trans>Edit tracked assets</Trans>
              </span>
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={props.onCancel}>
            <Trans>Done</Trans>
          </Button>
        </div>
      }
      {...props}
    >
      <div>
        <h2>
          <Trans>Assets</Trans>
        </h2>
        <p>
          <Trans>Other assets in this project's owner's wallet.</Trans>
        </p>

        <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
          <V2V3ProjectTokenBalance projectId={V2V3_PROJECT_IDS.JUICEBOX_DAO} />

          {(projectMetadata as ProjectMetadataV5)?.tokens?.map(t =>
            t.type === 'erc20' ? (
              <ERC20TokenBalance
                key={t.value}
                wallet={projectOwnerAddress}
                tokenAddress={t.value}
              />
            ) : (
              <V2V3ProjectTokenBalance
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
          <TokenRefs form={form} />
        </Modal>
      </div>
    </Modal>
  )
}
