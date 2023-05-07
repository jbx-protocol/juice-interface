import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Modal, Space } from 'antd'
import ERC20TokenBalance from 'components/ERC20TokenBalance'
import { FormItems } from 'components/formItems'
import V1ProjectTokenBalance from 'components/v1/shared/V1ProjectTokenBalance'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import { useV1ConnectedWalletHasPermission } from 'hooks/v1/contractReader/useV1ConnectedWalletHasPermission'
import { useSetProjectUriTx } from 'hooks/v1/transactor/useSetProjectUriTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { PV1 } from 'models/pv'
import { TokenRef } from 'models/tokenRef'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext, useEffect, useState } from 'react'

export function V1BalancesModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: () => void
}) {
  const { owner, handle } = useContext(V1ProjectContext)
  const { projectMetadata, pv } = useContext(ProjectMetadataContext)

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

    const uploadedMetadata = await uploadProjectMetadata({
      ...projectMetadata,
      tokens: editingTokenRefs.filter(t => t.type),
    })

    if (!uploadedMetadata.Hash) {
      setLoading(false)
      return
    }

    setProjectUriTx(
      { cid: uploadedMetadata.Hash },
      {
        onDone: async () => {
          if (pv) {
            await revalidateProject({ pv: pv as PV1, handle })
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
        <div className="mt-5 flex justify-between">
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

        <Space className="mt-5 w-full" direction="vertical">
          <V1ProjectTokenBalance
            wallet={owner}
            projectId={V1_PROJECT_IDS.JUICEBOX_DAO}
          />
          {projectMetadata?.tokens?.map(t =>
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
          <p className="mb-10">
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
