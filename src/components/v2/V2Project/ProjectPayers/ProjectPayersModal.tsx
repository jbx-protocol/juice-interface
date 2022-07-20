import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { useContext } from 'react'

import { MinimalCollapse } from 'components/MinimalCollapse'

export default function ProjectPayersModal({
  visible,
  onCancel,
  projectPayers,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction | undefined
  projectPayers:
    | Pick<
        ETHERC20ProjectPayer,
        | 'address'
        | 'beneficiary'
        | 'memo'
        | 'preferAddToBalance'
        | 'preferClaimedTokens'
      >[]
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
      title="ETH-ERC20 Payment addresses"
      okButtonProps={{ hidden: true }}
    >
      <MinimalCollapse header="What are thoooose?">
        <p>
          ETH-ERC20 Payment addresses are{' '}
          <a
            href="https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/JBETHERC20ProjectPayer.sol"
            target="_blank"
            rel="noopener noreferrer"
          >
            smart contracts
          </a>{' '}
          that allow this project to be paid in <strong>ETH</strong> by sending
          ETH directly to the contract, or in <strong>ERC20 tokens</strong> via
          the contract's <strong>pay()</strong> function.
        </p>
        <p>
          When a payment address is paid, its <strong>beneficiary</strong>{' '}
          address will receive any minted project tokens.
        </p>
        <p>
          <strong>Add to balance:</strong> payments to this contract will fund
          the project without minting project tokens.
        </p>
        <p>
          <strong>Auto claim:</strong> any minted tokens will automatically be
          claimed as ERC20 (if this project has issued an ERC20 token).
        </p>
      </MinimalCollapse>

      {projectPayers?.length && (
        <Space direction="vertical" style={{ width: '100%', marginTop: gap }}>
          {projectPayers.map(p => (
            <div
              style={{
                padding: 10,
                border: `1px solid ${colors.stroke.tertiary}`,
                fontWeight: 500,
                color: colors.text.secondary,
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Payment address contract:{' '}
                  <FormattedAddress address={p.address} />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  Beneficiary: <FormattedAddress address={p.beneficiary} />
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  <Space size="large">
                    <span>
                      Add to balance{' '}
                      {p.preferAddToBalance ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )}
                    </span>
                    <span>
                      Auto claim{' '}
                      {p.preferClaimedTokens ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )}
                    </span>
                  </Space>
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
    </Modal>
  )
}
