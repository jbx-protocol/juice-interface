import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { useContext } from 'react'

import LaunchProjectPayerButton from '../LaunchProjectPayer/LaunchProjectPayerButton'

export default function ProjectPayersModal({
  visible,
  onCancel,
  projectPayers,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
  projectPayers:
    | Pick<ETHERC20ProjectPayer, 'address' | 'beneficiary' | 'memo'>[]
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectOwnerAddress } = useContext(V2ProjectContext)

  const isOwner = useIsUserAddress(projectOwnerAddress)

  const gap = 30

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Done"
      title="Payment addresses"
      okButtonProps={{ hidden: true }}
    >
      <p>
        Payment addresses allow a project to be funded via direct ETH payments,
        while minting tokens to a predefined beneficiary address.
      </p>

      {projectPayers?.length && (
        <Space direction="vertical" style={{ width: '100%', marginTop: gap }}>
          {projectPayers.map(p => (
            <div
              style={{
                padding: 10,
                border: `1px solid ${colors.stroke.tertiary}`,
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Payment address:{' '}
                  <FormattedAddress address={p.address} truncateTo={40} />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Beneficiary: <FormattedAddress address={p.beneficiary} />
                </div>
                {p.memo && (
                  <div>
                    <RichNote note={p.memo} />
                  </div>
                )}
              </Space>
            </div>
          ))}
        </Space>
      )}

      {projectPayers ? (
        <div
          style={{
            color: colors.text.tertiary,
            padding: gap,
            textAlign: 'center',
          }}
        >
          {projectPayers.length
            ? `${projectPayers.length} payment address${
                projectPayers.length === 1 ? '' : 'es'
              }`
            : 'No payment addresses'}
        </div>
      ) : null}

      {isOwner && (
        <div>
          <LaunchProjectPayerButton
            size="middle"
            type="default"
            useDeployProjectPayerTx={useDeployProjectPayerTx}
          />
        </div>
      )}
    </Modal>
  )
}
