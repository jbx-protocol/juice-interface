import { plural, t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { ETHERC20ProjectPayer } from 'models/subgraph-entities/v2/eth-erc20-project-payer'
import { useContext } from 'react'

import * as constants from '@ethersproject/constants'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import useMobile from 'hooks/Mobile'

export function PaymentAddressesModal({
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

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      cancelText="Done"
      title={t`Payment Addresses`}
      okButtonProps={{ hidden: true }}
    >
      {projectPayers?.length ? (
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
                  </span>{' '}
                  <CopyTextButton value={p.address} />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    <Trans>Mints tokens:</Trans>
                  </span>
                  <TooltipLabel
                    tip={
                      p.preferAddToBalance
                        ? t`Payments to this project won't mint new project tokens.`
                        : t`Payments to this project will mint new project tokens.`
                    }
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
                          When the Payment Address receives a payment, project
                          tokens will be minted to this token beneficiary
                          address. The address that made the payment{' '}
                          <strong>won't receive any project tokens.</strong>
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
                      tip={t`New project tokens will be minted to the address that made the payment.`}
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
                      tip={t`New project tokens are minted as ERC-20 tokens by default. Payments to this Payment Address will incur a higher gas fee than regular Juicebox payments.`}
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
                        tip={t`Memos appear on the project's activity feed when the Payment Address receives a payment.`}
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
      ) : null}

      {projectPayers ? (
        <div
          style={{
            color: colors.text.tertiary,
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          {plural(projectPayers.length, {
            one: '# Payment Address',
            other: '# Payment Addresses',
          })}
        </div>
      ) : null}
    </Modal>
  )
}
