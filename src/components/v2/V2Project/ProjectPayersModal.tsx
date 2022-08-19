import { plural, t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { useContext } from 'react'

import * as constants from '@ethersproject/constants'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import useMobile from 'hooks/Mobile'

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

  const isMobile = useMobile()

  const { projectMetadata } = useContext(V2ProjectContext)

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Done"
      title={t`${projectMetadata?.name} - Project payer contracts`}
      okButtonProps={{ hidden: true }}
    >
      {projectPayers?.length && (
        <Space direction="vertical" style={{ width: '100%' }}>
          {projectPayers.map(p => (
            <div
              style={{
                padding: 10,
                border: `1px solid ${colors.stroke.tertiary}`,
                marginBottom: '10px',
                fontWeight: 500,
                color: colors.text.secondary,
              }}
              key={p.address}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: '1rem',
                    marginBottom: '10px',
                    marginTop: '10px',
                    color: colors.text.primary,
                  }}
                >
                  <span style={{ textDecoration: 'underline' }}>
                    <EtherscanLink
                      value={p.address}
                      type={'address'}
                      truncated={isMobile ? true : false}
                      truncateTo={isMobile ? 8 : undefined}
                    />
                  </span>
                  <CopyTextButton value={p.address} />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    <Trans>Mints tokens:</Trans>
                  </span>
                  <TooltipLabel
                    tip={t`Tokens will be minted as a result of paying this project.`}
                    label={
                      <span style={{ textTransform: 'capitalize' }}>
                        {(!p.preferAddToBalance).toString()}
                      </span>
                    }
                  />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Trans>Token beneficiary:</Trans>
                  {p.beneficiary !== constants.AddressZero ? (
                    <TooltipLabel
                      tip={
                        <Trans>
                          When someone pays this payer contract, project tokens
                          will always be minted to this address,{' '}
                          <strong>not to the person who paid.</strong>
                        </Trans>
                      }
                      label={
                        <FormattedAddress
                          address={p.beneficiary}
                          truncateTo={3}
                        />
                      }
                    />
                  ) : (
                    <TooltipLabel
                      tip={t`Project tokens will be minted to whoever pays this payer contract.`}
                      label={t`Default`}
                    />
                  )}
                </div>
                {p.preferClaimedTokens ? (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>
                      <Trans>Mints tokens as ERC-20:</Trans>
                    </span>
                    <TooltipLabel
                      tip={t`New project tokens are automatically minted as ERC-20's. The gas to pay this contract will be higher than normal.`}
                      label={
                        <span style={{ textTransform: 'capitalize' }}>
                          {p.preferClaimedTokens.toString()}
                        </span>
                      }
                    />
                  </div>
                ) : null}
                {p?.memo?.length ? (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>
                      <TooltipLabel
                        tip={t`The memo that appears on the project's Juicebox page activity feed when this payer contract is paid.`}
                        label={t`Memo`}
                      />
                      :
                    </span>
                    <div
                      style={{
                        maxWidth: isMobile ? '75%' : '385px',
                        textAlign: 'right',
                      }}
                    >
                      "{p.memo}"
                    </div>
                  </div>
                ) : null}
              </Space>
            </div>
          ))}
        </Space>
      )}

      {projectPayers ? (
        <div
          style={{
            color: colors.text.tertiary,
            marginTop: '20px',
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
