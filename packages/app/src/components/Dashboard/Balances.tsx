import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Modal, Space } from 'antd'
import ERC20TokenBalance from 'components/shared/ERC20TokenBalance'
import { FormItems } from 'components/shared/formItems'
import ProjectTokenBalance from 'components/shared/ProjectTokenBalance'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { OperatorPermission, useHasPermission } from 'hooks/HasPermission'
import { TokenRef } from 'models/token-ref'
import { useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

import SectionHeader from './SectionHeader'

export default function Balances() {
  const [editModalVisible, setEditModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [editingTokenRefs, setEditingTokenRefs] = useState<TokenRef[]>([])
  const { owner, projectId, metadata } = useContext(ProjectContext)
  const { transactor, contracts } = useContext(UserContext)

  useEffect(() => {
    setEditingTokenRefs(metadata?.tokens ?? [{ type: 'erc20', value: '' }])
  }, [metadata])

  const hasEditPermission = useHasPermission([OperatorPermission.SetUri])

  async function updateTokenRefs() {
    if (!transactor || !contracts || !projectId) return

    setLoading(true)

    const uploadedMetadata = await uploadProjectMetadata({
      ...metadata,
      tokens: editingTokenRefs.filter(t => t.type),
    })

    if (!uploadedMetadata?.success) {
      setLoading(false)
      return
    }

    transactor(
      contracts.Projects,
      'setUri',
      [projectId.toHexString(), uploadedMetadata.cid],
      {
        onDone: () => {
          setLoading(false)
          setEditModalVisible(false)
        },
      },
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader
          text="Assets"
          tip="Other assets in this project's owner's wallet."
        />
        {hasEditPermission && (
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setEditModalVisible(true)}
          />
        )}
      </div>
      <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
        <ProjectTokenBalance
          wallet={owner}
          projectId={BigNumber.from('0x01')}
        />
        {metadata?.tokens?.map(t =>
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
        title="Edit tracked assets"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        cancelText=""
        width={600}
        confirmLoading={loading}
        onOk={updateTokenRefs}
        okText="Save"
      >
        <p style={{ marginBottom: 40 }}>
          Display balances for ERC20 and JB project tokens that are in this
          project's owner's wallet.
        </p>
        <FormItems.TokenRefs
          refs={editingTokenRefs}
          onRefsChange={setEditingTokenRefs}
        />
      </Modal>
    </div>
  )
}
