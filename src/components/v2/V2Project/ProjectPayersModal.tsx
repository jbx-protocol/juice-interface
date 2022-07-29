import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { plural, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { useContext } from 'react'

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

  const gap = 30

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Done"
      title="ETH-ERC20 Payment addresses"
      okButtonProps={{ hidden: true }}
    >
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
              key={p.address}
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
                  <Trans>Payment address contract:</Trans>
                  <FormattedAddress address={p.address} />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Trans>Beneficiary:</Trans>
                  <FormattedAddress address={p.beneficiary} />
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  <Space size="large">
                    <span>
                      <Trans>Add to balance</Trans>{' '}
                      {p.preferAddToBalance ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )}
                    </span>
                    <span>
                      <Trans>Auto claim</Trans>{' '}
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
          {plural(projectPayers.length, {
            one: '# payment address',
            other: '# payment addresses',
          })}
        </div>
      ) : null}
    </Modal>
  )
}
