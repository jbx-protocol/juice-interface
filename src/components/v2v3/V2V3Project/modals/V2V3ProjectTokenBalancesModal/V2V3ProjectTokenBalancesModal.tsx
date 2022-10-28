import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Form, Modal, ModalProps, Space } from 'antd'
import ERC20TokenBalance from 'components/ERC20TokenBalance'
import { V2V3_PROJECT_IDS } from 'constants/v2v3/projectIds'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { CV2V3 } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { TokenRef } from 'models/token-ref'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import { AssetInputType, TokenRefs } from './TokenRefs'
import { V2V3ProjectTokenBalance } from './V2V3ProjectTokenBalance'

export interface EditTrackedAssetsForm {
  tokenRefs: { assetInput: { input: string; type: AssetInputType } }[]
}

function EditTrackedAssetsModal({
  close,
  ...props
}: ModalProps & { close: VoidFunction }) {
  const [loading, setLoading] = useState<boolean>()
  const { projectId, projectMetadata, cv } = useContext(ProjectMetadataContext)

  const [form] = Form.useForm<EditTrackedAssetsForm>()

  const editV2ProjectDetailsTx = useEditProjectDetailsTx()

  async function updateTokenRefs() {
    const projectName = projectMetadata?.name

    if (!projectName || !cv) return

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
              cv: cv as CV2V3,
              projectId: String(projectId),
            })
          }
          setLoading(false)
          close?.()
          form.resetFields()
        },
      },
    )
  }

  return (
    <Modal
      title={t`Edit tracked assets`}
      cancelText={t`Cancel`}
      width={600}
      confirmLoading={loading}
      onOk={updateTokenRefs}
      okText={t`Save tracked assets`}
      onCancel={close}
      {...props}
    >
      <p style={{ marginBottom: 40 }}>
        <Trans>
          Display ERC-20 and other Juicebox project tokens that this project
          owner holds.
        </Trans>
      </p>

      <TokenRefs form={form} />
    </Modal>
  )
}

export function V2V3ProjectTokenBalancesModal(props: ModalProps) {
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const [editModalVisible, setEditModalVisible] = useState<boolean>()

  const hasEditPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  // Filter out JBDAO tokens, because we always display that balance.
  const trackedTokens = (projectMetadata as ProjectMetadataV5)?.tokens?.filter(
    t =>
      !(
        t.type === 'project' &&
        parseInt(t.value) === V2V3_PROJECT_IDS.JUICEBOX_DAO
      ),
  )

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
          {trackedTokens?.map(t =>
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

        {hasEditPermission ? (
          <EditTrackedAssetsModal
            open={editModalVisible}
            close={() => setEditModalVisible(false)}
          />
        ) : null}
      </div>
    </Modal>
  )
}
